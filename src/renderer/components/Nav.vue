<template>
  <nav>
    <el-row class="nav">
      <el-menu default-active="2" class=" " :router="true">
        <el-menu-item index="1" route="/">
          <i class="el-icon-menu"></i>
          <span slot="title">控制面板</span>
        </el-menu-item>
        <el-menu-item index="3" route="data">
          <i class="el-icon-document"></i>
          <span slot="title">数据记录</span>
        </el-menu-item>
        <el-menu-item index="4" route="config">
          <i class="el-icon-setting"></i>
          <span slot="title">配置</span>
        </el-menu-item>
      </el-menu>
    </el-row>
  </nav>
</template>

<script>
export default {
  name: 'side-nav',
  methods: {}
}
</script>

<style lang="scss" scoped>
.nav {
  user-select: none;
}
</style>
