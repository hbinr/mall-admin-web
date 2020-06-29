<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="listQuery.query"
                    @clear="getGoodsList"
                    @keyup.enter.native="getGoodsList"
                    clearable>
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="handleAdd">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格展示区域 -->
      <el-table :data="list"
                style="width: 100%;"
                border
                stripe>
        <el-table-column type="index"
                         label="#"
                         align="center"></el-table-column>
        <el-table-column label="商品名称"
                         prop="goods_name"
                         align="center"></el-table-column>
        <el-table-column label="商品价格(元)"
                         prop="goods_price"
                         align="center"
                         width="110"></el-table-column>
        <el-table-column label="商品重量"
                         prop="goods_weight"
                         align="center"
                         width="90"></el-table-column>
        <el-table-column label="创建时间"
                         prop="add_time"
                         align="center"
                         width="155">
          <template slot-scope="scope">
            {{scope.row.add_time|formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         width="130">
          <template slot-scope="scope">
            <el-button type="primary"
                       size="mini"
                       icon="el-icon-edit"
                       v-model="scope.row.goods_id"
                       @click="handleUpdateGoods(scope.row.goods_id)"></el-button>
            <el-button type="danger"
                       size="mini"
                       icon="el-icon-delete"
                       @click="handleDeleteGoods(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.pagenum"
                     :page-sizes="[5, 10, 15, 25]"
                     :page-size="listQuery.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
                     background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { fetchList, deleteGoods } from '@/api/goods/list'
import { formatDate } from '@/utils/date'

const defaultListQuery = {
  query: '',
  pagenum: 1,
  pagesize: 5
}
export default {
  name: 'goodsList',
  data () {
    return {
      // 查询参数；复制defaultListQuery对象，返回一个新对象
      listQuery: Object.assign({}, defaultListQuery),
      // 商品列表
      list: [],
      // 商品总数
      total: null,
      // 控制 v-loading 加载效果
      listLoading: false

    }
  },
  created () {
    this.getGoodsList()
  },
  filters: {
    formatDate (time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  methods: {
    // 获取商品列表
    getGoodsList () {
      this.listLoading = true
      fetchList(this.listQuery).then(res => {
        this.listLoading = false
        this.list = res.data.goods

        this.total = res.data.total
      })
    },
    // 监听 pagesize 每页显示个数改变事件
    handleSizeChange (newSize) {
      this.listQuery.pagesize = newSize
      this.getGoodsList()
    },

    // 监听 pagenum 当前页数改变事件
    handleCurrentChange (newSize) {
      this.listQuery.pagenum = newSize
      this.getGoodsList()
    },
    handleAdd () {
      this.$router.push('/goods/add')
    },
    // 编辑商品
    handleUpdateGoods (goodsID) {
      this.$router.push({ path: '/goods/update', query: { id: goodsID } })
    },
    // 删除商品
    handleDeleteGoods (goodsID) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGoods(goodsID).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('删除商品失败')
          }
          this.$message.success('删除商品成功')
          this.getGoodsList()
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }

  }

}
</script>

<style lang="less" scoped>
</style>
