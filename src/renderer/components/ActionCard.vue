<template>
  <el-card class="box-card" shadow="hover" body-style="padding:0">
    <div slot="header" class="clearfix">
      <span>操作</span>
    </div>
    <div style="" class="btns">
      <el-button type="primary" round @click="loading">清零</el-button>
      <el-button type="primary" round @click="loading">开始</el-button>
      <el-button type="primary" round @click="loading">停止</el-button>
      <el-button type="primary" round @click="loading">强行停止</el-button>
    </div>
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
    loading() {
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
