<template>
  <div id="wrapper">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue" /> -->
    <main>
      <el-card class="drag-save" shadow="hover" ref="dragSave">
        <div slot="header" class="clearfix">
          <span>数据存放路径(拖放文件夹到此即可)</span>
        </div>
        <div class="drag" @click="open">
          {{ configs.savePath || Config.savePath }}
        </div>
      </el-card>

      <div class="operateCard"></div>
      <div class="btns">
        <el-button type="primary" round @click="save">保存</el-button>
      </div>
    </main>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
import { mapActions, mapState, mapGetters } from 'vuex'
import isDirectory from 'is-directory'
export default {
  name: 'debug-page',
  data() {
    return {
      configs: {
        savePath: null,
        fromPath: null
      }
    }
  },
  computed: {
    ...mapState(['Config'])
  },
  mounted() {},
  methods: {
    ...mapActions(['saveConfig', 'setLoading']),
    async save() {
      this.setLoading(200)
      await this.saveConfig(this.configs)
      this.$message.success('保存成功')
    },
    open() {
      this.Config.savePath &&
        this.$electron.remote.shell.showItemInFolder(this.Config.savePath)
    }
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
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}
.drag {
  background-color: rgba(158, 255, 223, 0.472);
  width: 95%;
  padding: 5px;
  border-radius: 5px;
  margin: auto;
}
.btns {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
