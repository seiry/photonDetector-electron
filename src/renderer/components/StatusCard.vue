<template>
  <el-card
    class="fullBodyCard"
    shadow="hover"
    body-style="flex:1;display:flex;"
  >
    <div slot="header" class="clearfix">
      <span>状态</span>
    </div>
    <div class="textStatus">
      <span>
        方向:
        <span v-if="status.runningFlag">{{ avgV | formatDirection }} </span>
        <span v-else> - </span>
      </span>
      <span> 状态: {{ status.runningFlag | formatStatus }} </span>
      <span> 平均转速: {{ (avgV * 1e3) | fix1 }} °/s </span>
      <span> 瞬时转速: {{ (vNum * 1e3) | fix1 }} °/s </span>
      <span> 旋转体角度: {{ angle | fix2 }} °</span>
      <span> 目标角度: {{ status.targetAngle | fix2 }} °</span>
      <el-progress
        type="dashboard"
        :percentage="percentage"
        :color="colors"
      ></el-progress>
      <el-divider></el-divider>
      <span> 编码器角度: {{ angleOfCan | fix2 }} °</span>
      <span>光电编码器读数: {{ lastNum }} </span>
      <span>光电编码器圈数: {{ status.turns }} </span>
      <span> 控制卡位置: {{ lastPositionArray }}</span>
      <!-- //仅使用x轴 -->
      <!-- <span>[{{  }}]</span> -->
      <el-divider></el-divider>
      <span>当前指令 {{ status.order.type }}: {{ status.order.value }}</span>
      <!-- <el-button type="primary" round @click="setCan">set can</el-button> -->

      <!-- <el-button type="primary" round @click="test">主要按钮</el-button> -->
    </div>
  </el-card>
</template>

<script>
/* eslint-disable no-unused-vars */
import { mapActions, mapState, mapGetters } from 'vuex'
import { throttle } from 'lodash'
// import SystemInformation from './LandingPage/SystemInformation'
import dmc from '../../ffi/dmc1380.js'
import myTest from '../../ffi/test.js'
import can from '../../ffi/can'
export default {
  data() {
    this.deltaVs = []
    return {
      ret: '',
      ret2: '',
      process: 0,
      colors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 },
      ],
    }
  },
  name: 'status-card',
  // components: { SystemInformation },
  methods: {
    ...mapActions(['setLoading', 'setCanNum']),
    test() {
      this.setLoading(true)
    },
    setCan() {
      this.setCanNum(9)
    },
  },
  computed: {
    ...mapState({
      status: (state) => state.Status,
      canNum: (state) => state.Status.canNum,
    }),
    ...mapGetters([
      'lastNum',
      'vNum',
      'deltaNum',
      'avgV',
      'angle',
      'angleOfCan',
      'lastPosition',
    ]),
    percentage() {
      // 进度有两种算法，1.task队列的长度占比，2.角度占比
      // 2会更平滑一些
      // debugger
      if (!this.status.runningFlag) {
        return 0
      }
      const percent = parseFloat(
        ((this.angle / this.status.targetAngle) * 100).toFixed(1)
      )
      if (isNaN(percent)) {
        return 0
      }
      if (percent > 100) {
        return 100
      } else if (percent < 0) {
        return 0
      } else {
        return percent
      }
    },

    lastPositionArray() {
      const { x, y, z, time } = this.lastPosition
      return x
    },
  },
  watch: {
    vNum(cur, pre) {
      this.deltaVs.unshift(cur - pre)
      const judgeThreshold = 5
      if (this.deltaVs.length > 5) {
        if (this.deltaVs.filter((e) => e > 0).length > judgeThreshold / 2) {
        }
      }
    },
  },
  filters: {
    formatDirection(e) {
      if (e === 0) {
        return ' - '
      }
      if (+e < 0) {
        return '顺时针'
      } else {
        return '逆时针'
      }
    },
    formatRunning(e) {
      if (e) {
        return e
      } else {
        return 0
      }
    },
    formatStatus(e) {
      if (e) {
        return '运行中'
      } else {
        return '停止'
      }
    },
    fix1(e) {
      return e.toFixed(1)
    },

    fix2(e) {
      return e.toFixed(2)
    },
    fix4(e) {
      return e.toFixed(4)
    },
  },
  created() {
    // setInterval(() => {
    //   this.process += Math.random() * 5
    // }, 1e3)
  },
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Source Sans Pro', sans-serif;
}

#wrapper {
  width: 100vw;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  justify-content: space-between;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: 0.8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}
.textStatus {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  // & > span {
  // flex-basis: 30px;
  // }
}
</style>
