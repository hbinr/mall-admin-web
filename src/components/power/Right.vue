<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域 -->
    <el-card>
      <!-- 添加按钮区域 -->
      <el-row>
        <el-button type="primary"
                   @click="addRight">
          添加权限
        </el-button>
      </el-row>
      <!-- 列表展示区域 -->
      <el-table :data="rightList"
                border
                stripe>
        <el-table-column type="index"
                         label="#"
                         align="center"></el-table-column>
        <el-table-column label="权限名称"
                         align="center"
                         prop="authName"></el-table-column>
        <el-table-column label="权限路径"
                         align="center"
                         prop="path"></el-table-column>
        <el-table-column label="权限等级"
                         align="center"
                         prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级 </el-tag>
            <el-tag type="success"
                    v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning"
                    v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  created () {
    this.getRightList()
  },
  methods: {
    // 获取权限列表
    async getRightList () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightList = res.data
    },
    // 添加权限
    addRight () {

    }
  }

}
</script>

<style lang="less" scoped>
</style>
