<template>
  <div id="wrapper">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue" /> -->
    <main>
      <el-card class="drag-save" shadow="hover" ref="dragSave">
        <div slot="header" class="clearfix">
          <span>持久化配置</span>
        </div>
        <prism language="json" :plugins="[]" :code="vuexConfig"></prism>
      </el-card>

      <div class="operateCard"></div>
      <div class="btns">
        <el-button type="danger" round @click="clear">清空配置</el-button>
      </div>
    </main>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
import { mapActions, mapState, mapGetters } from 'vuex'
import Prism from 'vue-prismjs'
import 'prismjs/themes/prism.css'
const jsonFormater = require('json-format')
export default {
  name: 'debug-page',
  components: {
    Prism
  },
  data() {
    return {
      code: 'npm install vue-prismjs --save',

      configs: {
        savePath: null,
        fromPath: null
      }
    }
  },
  computed: {
    ...mapState(['Config']),
    vuexConfig() {
      return jsonFormater(JSON.parse(localStorage['pet-vuex']))
    }
  },
  mounted() {},
  methods: {
    ...mapActions(['saveConfig', 'setLoading']),
    async clear() {
      this.$confirm('此操作将永久删除现有配置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          localStorage['pet-vuex'] = '""'
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {})
      // this.setLoading(200)
      // await this.saveConfig(this.configs)
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
