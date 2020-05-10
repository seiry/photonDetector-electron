<template>
  <div id="wrapper">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue" /> -->
    <main>
      <StatusCard class="statusCard"></StatusCard>
      <div class="operateCard">
        <ConfigCard class="config"></ConfigCard>
        <ActionCard class="action"></ActionCard>
      </div>
    </main>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */

import { mapState } from 'vuex'
import SystemInformation from './LandingPage/SystemInformation'
import StatusCard from './StatusCard'
import ConfigCard from './ConfigCard'
import ActionCard from './ActionCard'
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
  name: 'main-page',
  components: { StatusCard, ConfigCard, ActionCard },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link)
    },
  },
  computed: {
    ...mapState({
      loading: (state) => state.Misc.loading,
    }),
  },
}
</script>

<style scoped lang="scss">
#wrapper {
  // background: radial-gradient(
  //   ellipse at top left,
  //   rgba(255, 255, 255, 1) 40%,
  //   rgba(229, 229, 229, 0.9) 100%
  // );
  background-color: rgba(229, 229, 229, 0.267);
  height: 100vh;
  padding: 20px 20px;
  // width: 100vw;
  display: flex;
  flex-direction: column;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
}

/* main > div {
  flex-basis: 50%;
} */

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
.statusCard {
  flex-basis: 25%;
}

.fullBodyCard {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.operateCard {
  @extend .fullBodyCard;
  margin-left: 18px;

  .config {
    flex-grow: 1;
  }
  .action {
    margin-top: 14px;
    height: 180px;
  }
}
</style>
