<template>
  <el-card class="box-card" shadow="hover" body-style="padding:0">
    <div slot="header" class="clearfix">
      <span>操作</span>
    </div>
    <div style="" class="btns">
      <el-button type="primary" round @click="loading">清零</el-button>
      <el-button type="primary" round @click="init">开始</el-button>
      <el-button type="primary" round @click="stop">停止</el-button>
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
export default {
  data() {
    this.can = null
    this.dmc = null
    return {
      config: {
        mode: 0,
        num: 1,
        singleTime: 0.5,
        width: 30,
        beta: 8,
      },
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
        this.dmc = new Dmc(true)
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
    },
    initNumWatcher() {
      if (this.intervalFlag.can) {
        return
      }
      if (!this.can) {
        this.can = new Can(true)
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
    stop() {
      this.setStopFlag(true)
      this.stopRunningFlag()
    },
    forceStop() {
      this.setStopFlag(true)

      this.loading()
    },
    loading() {
      this.setLoading(true)
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
