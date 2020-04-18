<template>
  <div class="wrap">
    <div class="btns">
      <el-button type="primary" icon="el-icon-refresh" round @click="getFiles"
        >刷新</el-button
      >
      <el-button type="primary" round @click="save" icon="el-icon-upload2"
        >打包导出</el-button
      >
      <div class="space"></div>
      <div>
        <el-select
          v-model="tagSelected"
          multiple
          clearable
          placeholder="请选择"
        >
          <el-option v-for="tag in tags" :key="tag" :label="tag" :value="tag">
          </el-option>
        </el-select>
      </div>
      <div class="search">
        <el-input placeholder="搜索..." v-model="search" clearable>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
    <el-table
      :data="filterFiles"
      stripe
      height="100%"
      style="width: 100%"
      :default-sort="{ prop: 'date', order: 'descending' }"
      class="table"
    >
      <el-table-column label="日期" width="180" sortable prop="date">
        <template slot-scope="scope">
          {{ scope.row.date | moment('YYYY-MM-DD hh:mm:ss') }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="文件名" width="180 " sortable>
      </el-table-column>

      <el-table-column label="大小" sortable>
        <template slot-scope="scope">
          {{ scope.row.size | prettyBytes }}
        </template>
      </el-table-column>

      <el-table-column label="标签">
        <template slot-scope="scope">
          <el-tag
            closable
            @close="handleRemoveTag(scope.row.id)"
            v-if="scope.row.tag"
          >
            {{ scope.row.tag }}
          </el-tag>
          <div v-else>
            <el-input
              class="input-new-tag"
              v-if="inputVisible === scope.$index"
              v-model="inputTag"
              :ref="`saveTagInput${scope.$index}`"
              size="small"
              @keyup.enter.native="handleInputTag(scope.row.id)"
              @blur="handleInputTag(scope.row.id)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(scope.$index, scope.row)"
              >+ New Tag</el-button
            >
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import isDirectory from 'is-directory'
import { mapState } from 'vuex'
const fs = require('fs')
const path = require('path')

export default {
  name: 'data-page',
  data() {
    return {
      tableData: [],
      search: '',

      tagSelected: [],
      inputTag: '',
      inputVisible: false
    }
  },
  mounted() {
    this.getFiles()
  },
  methods: {
    showInput(index, row) {
      this.inputVisible = index
      this.$nextTick((_) => {
        this.$refs[`saveTagInput${index}`].$refs.input.focus()
      })
    },
    handleInputTag(i) {
      // this.tableData[i].tag = this.inputTag
      this.tableData.map((e) => {
        if (e.id === i) {
          e.tag = this.inputTag
        }
      })
      this.$nextTick((_) => {
        this.inputTag = ''
        this.inputVisible = false
      })
    },
    getFiles() {
      const files = fs.readdirSync(this.Config.savePath || './')
      let re = []
      let id = 0
      for (const e of files) {
        const file = path.join(this.Config.savePath, e)
        if (isDirectory.sync(file)) {
          continue
        }
        const info = fs.statSync(file)
        re.push({
          id,
          size: info.size,
          name: e,
          date: info.ctime,
          tag: null
        })
        id++
      }
      this.tableData = re
    },
    async save() {
      if (this.filterFiles.length === 0) {
        this.$message.warning('没有可以导出的内容')
        return
      }
      const savePath = this.$electron.remote.dialog.showSaveDialog({
        title: '请选择保存位置',
        defaultPath: 'export.zip',
        filters: [
          {
            name: '打包文件',
            extensions: ['zip']
          }
        ]
      })
      if (savePath) {
        const JSZip = require('jszip')
        const zip = new JSZip()
        for (const e of this.filterFiles) {
          let file = path.join(this.Config.savePath, e.name)
          zip.file(e.name, fs.readFileSync(file))
        }

        const data = await zip.generateAsync({
          type: 'nodebuffer',
          compression: 'DEFLATE',
          compressionOptions: {
            level: 6
          }
        })
        fs.writeFileSync(savePath, data)
        this.$message.success('导出成功')
      } else {
        this.$message.warning('导出取消')
      }
    }
  },
  computed: {
    ...mapState(['Config']),
    filterFiles() {
      if (!this.search && this.tagSelected.length === 0) {
        return this.tableData
      }
      return this.tableData.filter((e) => {
        let flagSearch = true
        let flagTag = true
        if (this.search) {
          flagSearch = false
          if (e.name.toLowerCase().includes(this.search.toLowerCase())) {
            // 文件名含有指定文字
            flagSearch = true
          }
          if ((e.tag || '').toLowerCase().includes(this.search.toLowerCase())) {
            // 标签含有指定文字
            flagSearch = true
          }
        }
        if (this.tagSelected.length > 0) {
          flagTag = false

          if (this.tagSelected.includes(e.tag)) {
            flagTag = true
          }
        }

        return flagSearch && flagTag
      })
    },
    tags() {
      let tags = this.tableData
        .map((e) => e.tag)
        .filter((e) => e !== null && e !== '')
      return [...new Set(tags)]
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  margin: 30px;
}
.table {
  flex: 1;
  // overflow-y: scroll;
}
.btns {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.space {
  flex: 1;
}
</style>
