<template>
  <div class="wrap">
    <div class="btns">
      <el-button type="primary" icon="el-icon-refresh" circle></el-button>
    </div>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      :default-sort="{ prop: 'date', order: 'descending' }"
    >
      <el-table-column label="日期" width="180" sortable prop="date">
        <template slot-scope="scope">
          {{ scope.row.date | moment('YYYY-MM-DD hh:mm:ss') }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="文件名" width="180">
      </el-table-column>

      <el-table-column label="大小">
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
const fs = require('fs')
const path = require('path')

export default {
  name: 'data-page',
  data() {
    return {
      tableData: []
    }
  },
  mounted() {
    this.getFiles()
  },
  methods: {
    getFiles() {
      const files = fs.readdirSync('./')
      let re = []
      for (const e of files) {
        const file = path.join('.', e)
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
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  margin: 30px;
}
</style>
