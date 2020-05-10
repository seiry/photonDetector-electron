<template>
  <el-card class="box-card" shadow="hover" body-style="padding:0">
    <div slot="header" class="clearfix">
      <span>操作</span>
    </div>
    <div style="" class="btns">
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
      <!-- <el-button type="primary" round @click="debugCan">debug can</el-button>
      <el-button type="primary" round @click="closeCan">close can</el-button> -->
      <el-button
        type="primary"
        round
        @click="clear"
        :disabled="status.runningFlag"
        >清零/复位</el-button
      >
      <el-button type="danger" round @click="forceStop">强行停止</el-button>
      <!-- <el-button type="primary" round @click="loading">配置</el-button> -->
    </div>
  </el-card>
</template>

<script>
/* eslint-disable no-unused-vars */
import { mapActions, mapState, mapGetters } from 'vuex'
import moment from 'moment'
import Can from '../../hardware/can'
import Dmc from '../../hardware/dmc'
import ffi from '../../ffi/can'

import fs from 'fs'
import path from 'path'
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
      'setTargetAngle',
      'addMoveLog',
      'clearMoveLog',
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
    },
    async initDmc() {
      if (this.intervalFlag.dmcPosition) {
        return
      }
      if (!this.dmc) {
        this.dmc = new Dmc(this.config.mockMode)
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
      this.setTaskQueue(this.makeTask())
      this.clearMoveLog()
      this.mover(true)
    },
    setTaskQueue(tasks = []) {
      this.taskQueue = tasks
      const finalTargetAngle =
        this.taskQueue[this.taskQueue.length - 1].value || 0
      this.setTargetAngle(finalTargetAngle)
    },
    initNumWatcher() {
      if (this.intervalFlag.can) {
        return
      }
      if (!this.can) {
        this.can = new Can(this.config.mockMode)
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
    async mover(log = false) {
      const move = async (target) => {
        console.log(
          'start moving to',
          target,
          'from',
          this.$store.getters.angle
        )
        // 区分速度
        let epsilon1 = 0.5
        let direction = 1

        let moveDirection = 1 // 1为逆时针，扫描方向,角度增大；-1为顺时针，归位方向，角度减小
        let directionChangeNum = 0
        const _maxDirectionChangeNum = 5
        while (
          Math.abs(this.$store.getters.angle - target) > epsilon1 // 没有满足条件的情况下
          // ||(this.$store.getters.angle - target) * direction < 0 // 没有达到目标
        ) {
          if (this.status.stopFlag) {
            this.dmc.stopX()
            return
          }

          if (this.$store.getters.angle > target) {
            // 当前角度大于目标角度，需要减小
            if (moveDirection !== -1) {
              directionChangeNum += 1
            }
            moveDirection = -1 // 运动方向其实可以实现一个类来getter
          } else {
            if (moveDirection !== 1) {
              directionChangeNum += 1
            }
            moveDirection = 1
          }

          if (directionChangeNum > _maxDirectionChangeNum) {
            this.dmc.stopX()
            return
          }

          // TODO: 分段控制
          // TODO: 根据模式调速

          const isRunning = this.dmc.isRunning()

          if (isRunning) {
            await sleep(100)
          } else {
            this.dmc.move(moveDirection)
          }
        }
        this.dmc.stopX()
        console.log('i have moved to', target)
      }
      const stop = async (e) => {
        console.log('start stop')
        if (log) {
          this.addMoveLog(`扫描任务::${e}秒::scanTask::${e}`)
          this.addMoveLog(
            `开始扫描::${moment().format(
              'YYYY-MM-DD HH:mm:ss.SSSS'
            )}::scanStart::${moment().format('x')}`
          )
        }
        // 扫描活动上实际上就是写个文件，记录时间就好了
        // TODO: 扫描动画
        await sleep(e * 1e3)
        if (log) {
          this.addMoveLog(
            `结束扫描::${moment().format(
              'YYYY-MM-DD HH:mm:ss.SSSS'
            )}::scanEnd::${moment().format('x')}`
          )
        }
        console.log('stoped', e)
      }
      const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
      }
      console.log(this.taskQueue, 'taskQueue')
      if (log) {
        this.addMoveLog(
          `任务配置::null::taskConfig::${JSON.stringify(
            this.$store.state.Config
          )}`
        )
        // debugger
        this.addMoveLog(
          `任务队列::null::taskConfig::${JSON.stringify(this.taskQueue)}`
        )

        this.addMoveLog(
          `开始扫描::${moment().format(
            'YYYY-MM-DD HH:mm:ss.SSSS'
          )}::taskStart::${moment().format('x')}`
        )
      }
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
      if (log) {
        this.writeLog()
      }
      return true
    },
    writeLog() {
      const fileName = path.join(
        this.$store.state.Config.savePath,
        `${moment().format('YYYYMMDD.HH-mm-ss')}.log`
      )
      fs.writeFileSync(fileName, this.$store.state.Status.moveLog.join('\n'), {
        flag: 'w',
      })
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
      // this.clearCanNum()
      if (this.status.runningFlag) {
        return
      }
      const _debounce = 1
      if (Math.abs(this.$store.getters.angle) > _debounce) {
        // 归0
        this.setTaskQueue([
          {
            type: 'move',
            value: 0,
          },
        ])
        this.mover()
      }
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
    ...mapState({
      status: (state) => state.Status,
      config: (state) => state.Config,
    }),
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
