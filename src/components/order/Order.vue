<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入订单号查询"
                    v-model="listQuery.query"
                    clearable
                    @keyup.enter.native="getOrderList"
                    @clear="getOrderList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格展示区域 -->
      <el-table :data="orderList"
                style="width: 100%;"
                border
                stripe>
        <el-table-column type="index"
                         label="#"
                         align="center"></el-table-column>
        <el-table-column label="订单编号"
                         prop="order_number"
                         align="center"></el-table-column>
        <el-table-column label="订单价格(元)"
                         prop="order_price"
                         align="center"
                         width="110"></el-table-column>
        <el-table-column label="是否付款"
                         prop="order_pay"
                         align="center"
                         width="90">
          <template slot-scope="scope">
            <el-tag type="success"
                    v-if="scope.row.order_pay === '1'">已付款</el-tag>
            <el-tag type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货"
                         prop="is_send"
                         align="center"
                         width="90"></el-table-column>
        <el-table-column label="下单时间"
                         prop="create_time"
                         align="center"
                         width="155">
          <template slot-scope="scope">
            {{scope.row.create_time|formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         width="130">
          <template slot-scope="scope">
            <el-button type="primary"
                       size="mini"
                       icon="el-icon-edit"
                       @click="showOrderEditDialog(scope.row.order_id)"></el-button>
            <el-button type="success"
                       size="mini"
                       icon="el-icon-location"
                       @click="showLgstProgessDialog(scope.row.order_id)"></el-button>
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
    <!-- 修改订单对话框 -->
    <el-dialog title="修改订单信息"
               :visible.sync="editOrderDialogVisible"
               width="40%"
               @close="editDialogClosed">
      <!-- 表单区域 -->
      <el-form :model="addressForm"
               :rules="addressFormRules"
               ref="addressFormRef"
               label-width="100px">
        <el-form-item label="省市区/县"
                      prop="address1">
          <el-cascader v-model="addressForm.address1"
                       :options="cityData"
                       :props="{ expandTrigger: 'hover' }"
                       clearable
                       filterable
                       style="width:100%"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址"
                      prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editOrderDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--物流信息对话框 -->
    <el-dialog title="物流信息"
               :visible.sync="lgstProgressDialogVisible"
               width="50%">
      <!-- 时间线区域 -->
      <el-timeline>
        <el-timeline-item v-for="(item, i) in lgstProgress"
                          :key="i"
                          :timestamp="item.time">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from '@/api/order/order'
import { formatDate } from '@/utils/date'
// 导入省市县数据，因为无后端接口
import cityData from '@/assets/js/cityData'
// 导入物流进度信息
import lgstData from '@/assets/js/lgstData'
const defaultListQuery = {
  query: '',
  pagenum: 1,
  pagesize: 5
}
export default {
  data () {
    return {
      // 查询参数；复制defaultListQuery对象，返回一个新对象
      listQuery: Object.assign({}, defaultListQuery),
      // 订单总数
      total: null,
      // 订单列表
      orderList: [],
      // 控制修改订单信息对话框的显示和隐藏
      editOrderDialogVisible: false,
      // 修改表单，目前只支持修改地址
      addressForm: {
        address1: '',
        address2: ''
      },
      // 修改订单表单校验规则
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 省市县数据(直接js导入的)
      cityData,
      // 控制物流信息对话框的显示和隐藏
      lgstProgressDialogVisible: false,
      // 物流进度信息
      lgstProgress: []
    }
  },
  created () {
    this.getOrderList()
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
    // 获取订单列表
    getOrderList () {
      fetchList(this.listQuery).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取订单列表失败')
        }
        this.orderList = res.data.goods
        this.total = res.data.total
      })
    },
    // 监听 pagesize 每页显示个数改变事件
    handleSizeChange (newSize) {
      this.listQuery.pagesize = newSize
      this.getOrderList()
    },

    // 监听 pagenum 当前页数改变事件
    handleCurrentChange (newSize) {
      this.listQuery.pagenum = newSize
      this.getOrderList()
    },
    // 展示修改对话框
    showOrderEditDialog (orderID) {
      this.editOrderDialogVisible = true
    },
    // 监听关闭修改对话框时间，重置表单
    editDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    // 展示物流信息对话框
    showLgstProgessDialog () {
      // 获取物流信息，暂时使用固定物流单号去查询，但是后台该数据已经没有了
      // getLogisticsInfoByID('1106975712662').then(res => {
      //
      // })
      // 暂时使用固定数据

      this.lgstProgress = lgstData.data
      this.lgstProgressDialogVisible = true
    }

  }
}
</script>

<style lang="less" scoped>
</style>
