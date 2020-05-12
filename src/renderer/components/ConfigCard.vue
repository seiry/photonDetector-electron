<template>
  <el-card
    class="box-card"
    shadow="hover"
    body-style="flex:1; overflow: hidden;display:flex"
  >
    <div slot="header" class="clearfix">
      <span>参数设置</span>
    </div>

    <!-- <div style="background-color:red;"></div> -->
    <el-form ref="form" class="ops" :disabled="Status.runningFlag">
      <el-form-item label="采集模式">
        <el-select v-model="mode" placeholder="请选择" class="formText">
          <!-- 模式可以分速度和精度 -->
          <!-- 区分的其实就是两段的容忍值 -->
          <el-option label="标准模式" :value="1" class="non-select"></el-option>
          <el-option label="高速模式" :value="2" class="non-select"></el-option>
          <el-option
            label="高精度模式"
            :value="0.5"
            class="non-select"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="传感器数量n">
        <el-select
          v-model="num"
          placeholder="请选择"
          class=""
          style="width:80px"
        >
          <el-option
            :label="n"
            :value="n"
            v-for="n in 8"
            :key="n"
            class="non-select"
          ></el-option>
        </el-select>
        对
      </el-form-item>

      <el-form-item label="单点时间">
        <el-input-number
          v-model="singleTime"
          :step="0.1"
          style="width:130px"
        ></el-input-number>
        秒
      </el-form-item>

      <el-form-item label="探测孔径">
        <el-input-number
          v-model="width"
          :step="1"
          style="width:130px"
        ></el-input-number>
        cm
      </el-form-item>

      <el-form-item label="采集步进β">
        <el-select
          v-model="beta"
          placeholder="请选择"
          class=""
          style="width:80px"
        >
          <el-option
            :label="n"
            :value="n"
            v-for="n in 8"
            :key="n"
            class="non-select"
          ></el-option>
        </el-select>
        <el-tooltip
          class="item"
          effect="dark"
          content="晶体条数"
          placement="top"
        >
          <span>条</span>
        </el-tooltip>
      </el-form-item>
      <div>
        <el-tooltip
          class="item"
          effect="dark"
          content="给定直径，组成满环 需要多少个传感器"
          placement="top"
        >
          <span>NAll: {{ NAll }}</span>
        </el-tooltip>
        <br />
        <el-tooltip
          class="item"
          effect="dark"
          content="每个传感器的度数"
          placement="top"
        >
          <span>σ: {{ sigma | fix4 }}</span>
        </el-tooltip>
        <br />
        <el-tooltip class="item" effect="dark" content="" placement="top">
          <span>Δθ: {{ deltaTheta | fix4 }}</span>
        </el-tooltip>
        <br />
        <el-tooltip
          class="item"
          effect="dark"
          content="采集的位置数量"
          placement="top"
        >
          <span>L1: {{ L1 }}</span>
        </el-tooltip>
        <br />
        <el-tooltip
          class="item"
          effect="dark"
          content="最大旋转角"
          placement="top"
        >
          <span>φhigh: {{ phiHigh | fix4 }}</span>
        </el-tooltip>
      </div>
    </el-form>
  </el-card>
</template>

<script>
/* eslint-disable no-unused-vars */
import { mapActions, mapState, mapGetters } from 'vuex'
// import SystemInformation from './LandingPage/SystemInformation'
import dmc from '../../ffi/dmc1380.js'
import myTest from '../../ffi/test.js'
import can from '../../ffi/can'
export default {
  data() {
    return {}
  },
  name: 'config-card',
  // components: { SystemInformation },
  methods: {
    ...mapActions([
      'setLoading',
      'setMode',
      'setNum',
      'setSingleTime',
      'setWidth',
      'setBeta',
    ]),
    test() {
      this.setLoading(true)
    },
  },
  computed: {
    // ...mapState({ status: (state) => state.Status })
    ...mapState(['Config', 'Status']),
    ...mapGetters(['sigma', 'NAll', 'deltaTheta', 'L1', 'phiHigh']),
    mode: {
      get() {
        return this.Config.mode
      },
      set(val) {
        this.setMode(val)
      },
    },
    num: {
      get() {
        return this.Config.num
      },
      set(val) {
        this.setNum(val)
      },
    },
    singleTime: {
      get() {
        return this.Config.singleTime
      },
      set(val) {
        this.setSingleTime(val)
      },
    },
    width: {
      get() {
        return this.Config.width
      },
      set(val) {
        this.setWidth(val)
      },
    },
    beta: {
      get() {
        return this.Config.beta
      },
      set(val) {
        this.setBeta(val)
      },
    },
  },
  filters: {
    fix2(e) {
      return e.toFixed(2)
    },
    fix4(e) {
      return e.toFixed(4)
    },
  },
  created() {},
}
</script>

<style lang="scss" scoped>
.box-card {
  // height: 100%;
  display: flex;
  flex-direction: column;
}
.ops {
  flex: 1;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  & > .el-form-item {
    margin: 0;
    height: 60px;
  }
}
/deep/ .el-card__body {
  padding-bottom: 5px;
}

.formText {
  width: 120px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
.non-select {
  user-select: none;
}
</style>
