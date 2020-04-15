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

      <el-card class="drag-from" shadow="hover" ref="dragSave">
        <div slot="header" class="clearfix">
          <span>数据来源(拖放文件夹到此即可)</span>
        </div>
        <div class="drag">
          {{ configs.fromPath || Config.fromPath }}
        </div>
      </el-card>

      <el-card class="drag-from" shadow="hover" ref="dragSave">
        <div slot="header" class="clearfix">
          <span>导出/导入(拖放配置文件到此即可)</span>
        </div>
        <div class="">
          <el-button type="primary" round @click="output">导出</el-button>
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
  name: 'config-page',
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
  mounted() {
    document.querySelector('.drag-save').ondrop = (e) => {
      if (!e.dataTransfer || e.dataTransfer.files.length === 0) {
        return
      }
      let p = e.dataTransfer.files[0].path || ''
      if (!isDirectory.sync(p)) {
        p = p.replace(/\\[^\\]+$/g, '')
      }
      this.configs.savePath = p
      e.preventDefault()
    }

    document.querySelector('.drag-from').ondrop = (e) => {
      if (!e.dataTransfer || e.dataTransfer.files.length === 0) {
        return
      }
      let p = e.dataTransfer.files[0].path || ''
      if (isDirectory.sync(p)) {
        this.$message.warning('需要一个文件，而不是文件夹')
        return
      }
      this.configs.fromPath = p
      e.preventDefault()
    }
    // document.querySelector('.el-card').ondragover = (e) => {
    //   e.preventDefault()
    // }
  },
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
    },
    output() {
      const path = this.$electron.remote.dialog.showSaveDialog({
        title: '请选择保存位置',
        defaultPath: 'pet-config.json',
        filters: [
          {
            name: 'json文件',
            extensions: ['json']
          }
        ]
      })
      if (path) {
        // TODO:写文件
      } else {
        this.$message.warning('保存取消')
      }
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
  // width: 100vw;
  display: flex;
  flex-direction: column;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  user-select: none;
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
