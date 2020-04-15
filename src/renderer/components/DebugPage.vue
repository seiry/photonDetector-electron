<template>
  <div id="wrapper">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue" /> -->
    <main>
      <el-card class="card" shadow="hover" ref="dragSave">
        <div slot="header" class="clearfix">
          <span>持久化配置</span>
        </div>
        <prism
          language="json"
          :plugins="[]"
          :code="vuexConfig"
          class="code"
        ></prism>
      </el-card>

      <el-card class="card" shadow="hover" ref="dragSave">
        <div slot="header" class="clearfix">
          <span>文件数据</span>
        </div>
        <prism language="json" :plugins="[]" :code="files" class="code"></prism>
      </el-card>

      <el-card class="card" shadow="hover" ref="dragSave">
        <div slot="header" class="clearfix">
          <span>can编码器状态</span>
        </div>
        <prism language="json" :plugins="[]" :code="can" class="code"></prism>
      </el-card>
    </main>
    <div class="btns">
      <el-button type="danger" round @click="clear">清空配置</el-button>
    </div>
    <v-tour name="myTour" :steps="steps"></v-tour>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
import { mapActions, mapState, mapGetters } from 'vuex'
import Prism from 'vue-prismjs'
import 'prismjs/themes/prism.css'
import isDirectory from 'is-directory'
const fs = require('fs')
const path = require('path')
const jsonFormater = require('json-format')

export default {
  name: 'debug-page',
  components: {
    Prism
  },
  data() {
    return {
      steps: [
        {
          target: '.card', // We're using document.querySelector() under the hood
          header: {
            title: 'Get Started'
          },
          content: `Discover <strong>Vue Tour</strong>!`
        },
        {
          target: '.v-step-1',
          content: 'An awesome plugin made with Vue.js!'
        },
        {
          target: '[data-v-step="2"]',
          content:
            "Try it, you'll love it!<br>You can put HTML in the steps and completely customize the DOM to suit your needs.",
          params: {
            placement: 'top' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
          }
        }
      ],
      files: '',
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
    },
    can() {
      return jsonFormater(this.$store.state.Status)
    }
  },
  mounted() {
    this.$tours['myTour'].start()
    const files = fs.readdirSync(this.Config.savePath || './') || []
    let re = []
    for (const e of files) {
      const file = path.join(this.Config.savePath, e)
      if (isDirectory.sync(file)) {
        continue
      }
      const info = fs.statSync(file)
      re.push({
        size: info.size,
        name: e,
        date: info.ctime
      })
    }
    this.files = jsonFormater(re)
  },
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
  padding: 10px 20px;
  // width: 100vw;
  display: flex;
  flex-direction: column;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  overflow-y: auto;
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
.card {
  min-height: fit-content;
  margin-bottom: 10px;
}
.code {
  min-height: fit-content;
}
</style>
