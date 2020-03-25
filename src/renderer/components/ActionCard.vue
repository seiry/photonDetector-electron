<template>
  <el-card
    class="box-card"
    shadow="hover"
    body-style="flex:1; overflow: hidden;"
  >
    <div slot="header" class="clearfix">
      <span>操作</span>
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
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 100%;
  & > .el-form-item {
    margin: 0;
  }
}
.formText {
  width: 120px;
}
</style>
