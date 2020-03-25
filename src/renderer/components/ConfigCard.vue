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
      <el-form-item label="传感器数量">
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
        对
      </el-form-item>
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
      config: { mode: 0, num: 1, singleTime: 0.5, width: 30, beta: 8 }
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
