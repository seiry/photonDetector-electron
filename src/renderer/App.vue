<template>
  <div id="app">
    <keep-alive>
      <router-view class="routerMain"></router-view>
    </keep-alive>
    <sideNav />
    <Loading v-show="loading"></Loading>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import sideNav from './components/Nav'
import Loading from './components/Loading'

export default {
  name: 'pet-test',
  components: { sideNav, Loading },
  methods: {},
  computed: {
    ...mapState({
      loading: (state) => state.Misc.loading
    })
  }
}
</script>

<style>
@import url('./main.scss');
/* CSS */
</style>
<style lang="scss" scoped>
#app {
  display: flex;
  height: 100vh;
  width: 100vw;
}
.routerMain {
  flex: 1;
  overflow: hidden;
}
</style>
