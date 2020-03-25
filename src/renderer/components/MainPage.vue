<template>
  <div id="wrapper">
    <Loading v-show="loading"></Loading>
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue" /> -->
    <main>
      <StatusCard></StatusCard>
    </main>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */

import { mapState } from 'vuex'
import SystemInformation from './LandingPage/SystemInformation'
import Loading from './Loading'
import StatusCard from './StatusCard'
import dmc from '../../ffi/dmc1380.js'
import myTest from '../../ffi/test.js'
import can from '../../ffi/can'
export default {
  data() {
    return {
      ret: '',
      ret2: ''
    }
  },
  name: 'main-page',
  components: { StatusCard, Loading },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link)
    }
  },
  computed: {
    ...mapState({
      loading: (state) => state.Misc.loading
    })
  }
}
</script>

<style scoped>
#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
  padding: 60px 80px;
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

main > div {
  flex-basis: 50%;
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
</style>
