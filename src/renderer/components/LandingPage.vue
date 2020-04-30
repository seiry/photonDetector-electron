<template>
  <div id="wrapper">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue" /> -->
    <StatusCard></StatusCard>
    <main>
      <div class="left-side">
        <span class="title">
          Welcome to your new project!
        </span>
        <system-information></system-information>
      </div>

      <div class="right-side">
        <div class="doc">
          <div class="title">Getting Started</div>
          <p>
            electron-vue comes packed with detailed documentation that covers
            everything from internal configurations, using the project
            structure, building your application, and so much more.
          </p>
          <button
            @click="
              open('https://simulatedgreg.gitbooks.io/electron-vue/content/')
            "
          >
            Read the Docs</button
          ><br /><br />
        </div>
        <div class="doc">
          <div class="title alt">Other Documentation</div>
          <button class="alt" @click="open('https://electron.atom.io/docs/')">
            Electron
          </button>
          <button class="alt" @click="open('https://vuejs.org/v2/guide/')">
            Vue.js
          </button>
          <!-- <button @click="dll">dll {{ ret }}</button> -->
          <el-button type="primary" @click="dll" icon="el-icon-search"
            >dll {{ ret }}</el-button
          >
          <el-button type="primary" @click="dmc" icon="el-icon-search">
            {{ ret2 }}</el-button
          >
        </div>
      </div>
    </main>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */

import SystemInformation from './LandingPage/SystemInformation'
import StatusCard from './StatusCard'
import dmc from '../../ffi/dmc1380.js'
import myTest from '../../ffi/test.js'
import can from '../../ffi/can'
export default {
  data() {
    return {
      ret: '',
      ret2: '',
    }
  },
  name: 'landing-page',
  components: { SystemInformation, StatusCard },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link)
    },
    dll() {
      // this.ret = myTest.add(1, 2)
      this.ret = [
        myTest.add(1, 17),
        myTest.arrayAdd([-1, 9]),
        myTest.arrayAddDouble([1.2, 1.3]),
        myTest.doubleAdd(0.1, 0.2),
      ]
    },
    dmc() {
      // console.log(dmc.d1000_start_t_line)
      // this.ret2 = dmc.d1000_get_speed()
      // console.log(myTest.getObj())
      console.log(can.VCI_Transmit(0, 0, 0, { Data: [1] }, 1))
    },
  },
}
</script>

<style scoped>
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
