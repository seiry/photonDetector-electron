<template>
  <div id="wrapper">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue" /> -->
    <main>
      <el-card class="drag-save" shadow="hover" ref="dragSave">
        <div slot="header" class="clearfix">
          <span>数据存放路径</span>
        </div>
        <div class="textStatus">
          <div class="drag" ref="drag">{{ path1 }}</div>
        </div>
      </el-card>

      <div class="operateCard"></div>
    </main>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */

// import { ipcRenderer } from 'electron'
export default {
  name: 'config-page',
  data() {
    return {
      path1: ''
    }
  },
  mounted() {
    document.querySelector('.el-card').ondrop = (e) => {
      this.path1 = e.dataTransfer.files[0].path

      e.preventDefault()
    }
    // document.querySelector('.el-card').ondragover = (e) => {
    //   e.preventDefault()
    // }
  },
  methods: {
    d() {}
  }
}
</script>
<style lang="scss" scoped>
#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
  padding: 30px 40px;
  width: 100vw;
  display: flex;
  flex-direction: column;
}

main {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
}
.drag {
  background-color: aquamarine;
  height: 50px;
  width: 300px;
}
</style>
