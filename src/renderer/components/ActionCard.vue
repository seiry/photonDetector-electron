<template>
  <el-card class="box-card" shadow="hover" body-style="padding:0">
    <div slot="header" class="clearfix">
      <span>操作</span>
    </div>
    <div style="" class="btns">
      <el-button
        type="primary"
        round
        @click="clear"
        :disabled="status.runningFlag"
        >清零</el-button
      >
      <el-button
        type="primary"
        round
        @click="init"
        :disabled="status.runningFlag"
        >开始</el-button
      >
      <el-button
        type="primary"
        round
        @click="stop"
        :disabled="!status.runningFlag"
        >停止</el-button
      >
      <el-button type="primary" round @click="debugCan">debug can</el-button>
      <el-button type="primary" round @click="closeCan">close can</el-button>

      <el-button type="danger" round @click="forceStop">强行停止</el-button>
      <!-- <el-button type="primary" round @click="loading">配置</el-button> -->
    </div>
  </el-card>
</template>

<script>
/* eslint-disable no-unused-vars */
import { mapActions, mapState, mapGetters } from 'vuex'
// import SystemInformation from './LandingPage/SystemInformation'
import Can from '../../hardware/can'
import Dmc from '../../hardware/dmc'
import ffi from '../../ffi/can'
export default {
  data() {
    this.can = null
    this.dmc = null
    return {
      taskQueue: [],
      taskQueueLength: 0,
      // [先,....,后]
      intervalFlag: {
        can: null,
        dmcPosition: null,
      },
    }
  },
  name: 'action-card',
  // components: { SystemInformation },
  methods: {
    ...mapActions([
      'startRunningFlag',
      'stopRunningFlag',
      'setLoading',
      'addCanNum',
      'setStopFlag',
      'addDmcNum',
      'clearCanNum',
      'setCurrentTask',
    ]),
    async init() {
      // 初始化运动控制卡，之后才是圈数监视器
      try {
        await this.initDmc()
        await this.initNumWatcher()
      } catch (e) {
        this.$message.error(e)
        console.error(e)
      }
      this.startRunningFlag()
      // this.initDmc()
      //   .then((e) => {
      //     this.initNumWatcher()
      //   })
      //   .catch((e) => {
      //     this.$message.error(e)
      //     console.error(e)
      //   })
    },
    async initDmc() {
      if (this.intervalFlag.dmcPosition) {
        return
      }
      if (!this.dmc) {
        this.dmc = new Dmc()
        // this.dmc = new Dmc(true)
      }
      // const e = this.dmc.close()
      if (this.dmc.error) {
        this.$message.error(this.dmc.humenErrorMsg)
        throw new Error('dmc init error')
      }
      this.intervalFlag.dmcPosition = setInterval(() => {
        const [x, y, z] = this.dmc.getPosition() // TODO: 这里返回数组，可以根据情况再解构取值
        this.addDmcNum({
          x,
          y,
          z,
        })
        if (this.status.stopFlag) {
          clearInterval(this.intervalFlag.dmcPosition)
          this.intervalFlag.dmcPosition = null
        }
      }, 1e2)
      /**
       * 任务队列应该被设计成一个队列
       * Δθ决定单次运动的角度
       * 单点时间决定运动停止时间是多少
       * 队列执行方法被设计成一个消费者函数 通过子函数进行执行 消费者函数应该是一个同步函数
       */
      this.taskQueue = this.makeTask()
      // this.mover()
    },
    initNumWatcher() {
      if (this.intervalFlag.can) {
        return
      }
      if (!this.can) {
        // this.can = new Can(true)
        this.can = new Can()
      }
      if (this.can.error) {
        this.$message.error(this.can.humenErrorMsg)
        return
      }
      // this.$message.success('初始化成功' + this.can.humenErrorMsg)
      this.setStopFlag(false)
      this.intervalFlag.can = setInterval(() => {
        this.addCanNum(this.can.readNum())
        if (this.status.stopFlag) {
          clearInterval(this.intervalFlag.can)
          this.intervalFlag.can = null
        }
      }, 1e2)
    },
    makeTask() {
      const move = {
        type: 'move',
        value: 3, // 这里应该是绝对还是相对好？ 貌似绝对的好一些
      }
      const stop = {
        type: 'stop',
        value: 3, // s
      }
      let temp = []
      const singleTime = this.$store.state.Config.singleTime
      const deltaTheta = this.$store.getters.deltaTheta
      const loops = this.$store.getters.L1
      for (let i = 0; i < loops; i++) {
        temp.push({
          type: 'stop',
          value: singleTime,
        })
        temp.push({
          type: 'move',
          value: deltaTheta * (i + 1),
        })
      }
      // TODO: 完成音乐？
      return temp
    },
    async mover() {
      const move = async (e) => {
        console.log('start moving to', e, 'from', this.$store.getters.angle)
        // 区分速度
        const epsilon1 = 1
        const direction = 1
        // const epsilon1 = 1
        while (
          Math.abs(this.$store.getters.angle - e) > epsilon1 ||
          (this.$store.getters.angle - e) * direction < 0 // 没有达到目标
        ) {
          if (this.status.stopFlag) {
            this.dmc.stopX()
            return
          }
          // TODO: 分段控制
          // TODO: 根据模式调速
          const isRunning = this.dmc.isRunning()
          if (isRunning) {
            await sleep(100)
          } else {
            this.dmc.move()
          }
        }
        this.dmc.stopX()
        console.log('i have moved to', e)
      }
      const stop = async (e) => {
        console.log('start stop')
        // TODO: scaning action
        // TODO: 扫描动画
        await sleep(e * 1e3)
        console.log('stoped', e)
      }
      const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
      }
      console.log(this.taskQueue)
      while (this.taskQueue.length > 0) {
        // 通过队列长度显示进度
        const task = this.taskQueue.shift()
        this.setCurrentTask(task)
        if (task.type === 'move') {
          await move(task.value)
        } else if (task.type === 'stop') {
          await stop(task.value)
        }
      }
    },
    stop() {
      this.setStopFlag(true)
      this.stopRunningFlag()
    },
    forceStop() {
      this.setStopFlag(true)
      this.stopRunningFlag()
      this.loading()
    },
    clear() {
      this.clearCanNum()
    },
    loading() {
      this.setLoading(true)
    },
    async debugCan() {
      const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
      }
      let re = ffi.VCI_OpenDevice(4, 0, 0)
      // 返回值=1，表示操作成功；=0表示操作失败；=-1表示USB-CAN设备不存在或USB掉线。
      console.log('open', re)
      const config = {
        // 这个掩码设置方式 应该是我全都要吧
        AccCode: 0x00000000,
        AccMask: 0xffffffff,
        Reserved: 0,
        Filter: 2, // 标准帧
        // Filter: 1, // 所有帧 老代码上是这也的
        Timing0: 0x00,
        Timing1: 0x1c,
        Mode: 0,
      }
      re = ffi.VCI_InitCAN(4, 0, 0, config)
      /**
       * 返回值=1，表示操作成功；=0表示操作失败；=-1表示USB-CAN设备不存在或USB掉线。
       */
      console.log('init', re)
      re = ffi.VCI_ClearBuffer(4, 0, 0)
      console.log('clear buff', re)

      re = ffi.VCI_StartCAN(4, 0, 0)
      console.log('can start', re)

      const data = {
        // ID: 0,
        ID: 0x00000002, // 这个是老代码里的
        TimeStamp: 0, // 这个东西 是不是发出是没有的
        TimeFlag: 0x1,
        SendType: 1,
        RemoteFlag: 0,
        ExternFlag: 0,
        DataLen: 4,
        // DataLen: 5,//老代码里是5？？
        Data: [0x4, 0x2, 0x1, 0x0],
        // Reserved: [0, 0, 0]
      }
      re = ffi.VCI_Transmit(4, 0, 0, data)
      console.log('transmit', re)
      await sleep(100)
      re = ffi.VCI_Receive(4, 0, 0, 2)
    },
    closeCan() {
      // 返回值=1，表示操作成功；=0表示操作失败；=-1表示USB-CAN设备不存在或USB掉线。
      let re = ffi.VCI_CloseDevice(4, 0)
      console.log('close can', re)
    },
  },
  computed: {
    ...mapState({ status: (state) => state.Status }),
  },
  filters: {
    fix2(e) {
      return e.toFixed(2)
    },
  },
  created() {},
}
</script>

<style lang="scss" scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
.box-card {
  // height: 100%;
  display: flex;
  flex-direction: column;
}
.btns {
  // padding-bottom: 20px;
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
</style>
