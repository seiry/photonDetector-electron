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
    <el-form ref="form" class="ops" :model="config">
      <el-form-item label="采集模式">
        <el-select v-model="config.mode" placeholder="请选择" class="formText">
          <el-option label="默认模式" :value="0"></el-option>
          <el-option label="模式2" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="传感器数量n">
        <el-select
          v-model="config.num"
          placeholder="请选择"
          class=""
          style="width:80px"
        >
          <el-option :label="n" :value="n" v-for="n in 8" :key="n"></el-option>
        </el-select>
        对
      </el-form-item>

      <el-form-item label="单点时间">
        <el-input-number
          v-model="config.singleTime"
          :step="0.1"
          style="width:130px"
        ></el-input-number>
        秒
      </el-form-item>

      <el-form-item label="探测孔径">
        <el-input-number
          v-model="config.width"
          :step="1"
          style="width:130px"
        ></el-input-number>
        cm
      </el-form-item>

      <el-form-item label="采集步进β">
        <el-select
          v-model="config.beta"
          placeholder="请选择"
          class=""
          style="width:80px"
        >
          <el-option :label="n" :value="n" v-for="n in 8" :key="n"></el-option>
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
        NAll: {{ NAll }}<br />
        σ: {{ sigma }}<br />
        Δθ: {{ deltaTheta }}<br />
        L1: {{ L1 }}
      </div>
    </el-form>
  </el-card>
</template>

<script>
/* eslint-disable no-unused-vars */
import { mapActions, mapState } from 'vuex'
// import SystemInformation from './LandingPage/SystemInformation'
import dmc from '../../ffi/dmc1380.js'
import myTest from '../../ffi/test.js'
import can from '../../ffi/can'
export default {
  data() {
    return {
      config: {
        mode: 0,
        num: 3,
        singleTime: 0.5,
        width: 20,
        beta: 8
      }
    }
  },
  name: 'config-card',
  // components: { SystemInformation },
  methods: {
    ...mapActions(['setLoading']),
    test() {
      this.setLoading(true)
    }
  },
  computed: {
    // ...mapState({ status: (state) => state.Status })
    sigma() {
      /**
       * σ =
       */
      // 180 / NAll 每个传感器的度数
      // a = 12 单个传感器的晶体纤维数量
      const a = 12
      return 180 / this.NAll / a
    },
    NAll() {
      /**
       * 给定直径，组成满环 需要多少个传感器
       * NAll = pi * D / 2b
       * b = 2.6
       */
      const b = 2.6
      return Math.round((Math.PI * this.config.width) / (b * 2))
    },
    deltaTheta() {
      console.log(this.beta)
      return this.sigma * this.config.beta
    },
    L1() {
      /**
       * 采集的位置数量
       * NAll / num  需要旋转弥补的比例
       * NAll / num - 1 需要旋转的次数 (完全不重叠的情况(不考虑β))
       * (NAll / num - 1) * (180 / NAll) 需要补足的角度
       * ((NAll / num - 1) * (180 / NAll)) / deltaTheta 需要补足的次数
       * + 1 本身初始位置的一次
       */
      const addNum = this.NAll / this.config.num - 1
      const sigleDegree = 180 / this.NAll
      return Math.round((addNum * sigleDegree) / this.deltaTheta + 1)
    }
  },
  filters: {
    fix2(e) {
      return e.toFixed(2)
    }
  },
  created() {}
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
</style>
