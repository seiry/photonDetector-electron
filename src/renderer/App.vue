<template>
  <div id="app">
    <router-view class="routerMain"></router-view>
    <sideNav />
  </div>
</template>

<script>
import sideNav from './components/Nav'
export default {
  name: 'pet-test',
  components: { sideNav },
  methods: {}
}
</script>

<style>
@import url('./main.scss');
/* CSS */
</style>
<style lang="scss" scoped>
#app {
  display: flex;
}
.routerMain {
  flex: 1;
}
</style>
