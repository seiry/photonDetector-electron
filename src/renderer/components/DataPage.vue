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
      search: ''
    }
  },
  mounted() {
    this.getFiles()
  },
  methods: {
    getFiles() {
      const files = fs.readdirSync(this.Config.savePath || './')
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
      this.tableData = re
    },
    async save() {
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
      if (!this.search) {
        return this.tableData
      }
      return this.tableData.filter((e) =>
        e.name.toLowerCase().includes(this.search.toLowerCase())
      )
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
.search {
}
.space {
  flex: 1;
}
</style>
