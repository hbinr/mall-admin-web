<template>
  <!-- 面包屑导航区域 -->
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style lang="less" scoped>
</style>
