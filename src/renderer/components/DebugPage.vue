<template>
  <div id="wrapper">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue" /> -->
    <main>
      <el-card class="card config1" shadow="hover">
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

      <el-card class="card config2" shadow="hover">
        <div slot="header" class="clearfix">
          <span>文件数据</span>
        </div>
        <prism language="json" :plugins="[]" :code="files" class="code"></prism>
      </el-card>

      <el-card class="card config3" shadow="hover" ref="dragSave">
        <div slot="header" class="clearfix">
          <span>can编码器状态</span>
        </div>
        <prism language="json" :plugins="[]" :code="can" class="code"></prism>
      </el-card>
    </main>
    <div class="btns">
      <el-button type="danger" round @click="clear" class="btn1"
        >清空配置</el-button
      >
    </div>
    <v-tour
      name="myTour"
      :steps="steps"
      :options="options"
      :callbacks="myCallbacks"
    ></v-tour>
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
    this.myCallbacks = {
      onStop: (e) => {
        localStorage['tour-debug'] = 1
      }
    }
    return {
      options: {
        labels: {
          buttonSkip: '跳过引导',
          buttonPrevious: '上一个',
          buttonNext: '下一个',
          buttonStop: 'ok，起飞！'
        }
      },
      steps: [
        {
          target: '.config1',
          header: {
            title: 'Get Started'
          },
          content: `这里展示了存储位置的配置`
        },
        {
          target: '.config2',
          content: '这是已经存储的文件'
        },
        {
          target: '.config3',
          content: '这是光电编码器的状态数据',
          params: {
            placement: 'top'
          }
        },
        {
          target: '.btn1',
          content: '这个按钮会清空一切配置，出错的时候就可以试试啦'
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
    if (!+localStorage['tour-debug']) {
      this.$tours['myTour'].start()
    }
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
          localStorage['tour-debug'] = 0
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
