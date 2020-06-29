<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格展示区域 -->
      <el-table :data="cateList"
                row-key="cat_id"
                :load="load"
                :tree-props="{children: 'children'}"
                border
                lazy>
        <el-table-column label="分类名称"
                         prop="cat_name"
                         align="left">
        </el-table-column>
        <el-table-column label="是否有效"
                         prop="cat_deleted"
                         align="center">
          <template slot-scope="scope">
            <!-- 是否有效列 -->
            <i class="el-icon-success"
               v-if="scope.row.cat_deleted === false"
               style="color:lightgreen"></i>
            <i class="el-icon-error"
               v-else
               style="color:red"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序"
                         prop="cat_level"
                         align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="success"
                    v-else-if="scope.row.cat_level === 1 ">二级</el-tag>
            <el-tag type="warning"
                    v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="deleteCate(scope.row.cat_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[5, 10, 15, 25]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类"
               :visible.sync="addCateDialogVisible"
               width="40%"
               @close="addCateClosedDialog">
      <!-- 添加表单 -->
      <el-form :model="addCateForm"
               :rules="addCateRules"
               ref="addCateFormRef"
               label-width="100px">
        <el-form-item label="分类名称："
                      prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options：数据源 -->
          <!-- props：指定配置对象 -->
          <el-cascader v-model="selectedKeys"
                       :options="parentCateList"
                       :props="cateProps"
                       @change="parentCateChanged"
                       clearable
                       filterable
                       style="width:100%"></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="addCate">确 定</el-button>
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类对话框 -->
    <el-dialog title="修改分类"
               :visible.sync="editCateDialogVisible"
               width="40%"
               @close="editCateClosedDialog">
      <!-- 修改表单 -->
      <el-form :model="editCateForm"
               :rules="addCateRules"
               ref="editCateFormRef"
               label-width="100px">
        <el-form-item label="父级分类："
                      prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>

        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="editCate">确 定</el-button>
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data () {
    return {
      // 获取分类列表的参数对象
      queryInfo: {
        // 为3时，表示将1-3级所有数据都获取，参数可选项：1,2,3
        type: 3,
        // 当前页数
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 5
        // 所有商品分类列表
      },
      // 商品分类的数据列表
      cateList: [],
      // 数据总数
      total: 0,
      // 控制添加分类对话框的显示和隐藏
      addCateDialogVisible: false,
      // 添加分类表单对象
      addCateForm: {
        // 分类名称
        cat_name: '',
        // 父级分类id
        cat_pid: 0,
        // 分类的等级，默认一级(0：一级，1：二级，2：三级)
        cat_level: 0

      },
      // 添加分类的校验规则
      addCateRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cateProps: {
        // 配置触发选项 hover/click
        expandTrigger: 'hover',
        // 具体选中的值
        value: 'cat_id',
        // 选中后所显示的内容
        label: 'cat_name',
        // 父子嵌套的属性
        children: 'children',
        // 支持选择任意一级选项
        checkStrictly: true
      },
      // 当前选中分类key值
      selectedKeys: [],
      // 控制添加分类对话框的显示和隐藏
      editCateDialogVisible: false,
      // 添加分类表单对象
      editCateForm: {}

    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 监听 pagesize 每页显示个数改变事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },

    // 监听 pagenum 当前页数改变事件
    handleCurrentChange (newSize) {
      this.queryInfo.pagenum = newSize
      this.getCateList()
    },
    // 获取商品分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 展示添加分类对话框
    showAddCateDialog () {
      // 先获取父级分类数据
      this.getParentCateList()
      // 再展示dialog
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败！')
      }
      this.parentCateList = res.data
    },
    // 添加分类 选择项发生变化触发
    parentCateChanged () {
      var selectedKeysTmp = this.selectedKeys
      var addCateFormTmp = this.addCateForm
      // 如果selectedKeys大于0,证明选中了父级分类
      if (selectedKeysTmp.length > 0) {
        // 父分类ID为 selectedKeys 数组中的最后一项
        addCateFormTmp.cat_pid = selectedKeysTmp[selectedKeysTmp.length - 1]
        // 父分类等级为 selectedKeys 数组中的长度(和后台约定好的)
        addCateFormTmp.cat_level = selectedKeysTmp.length
      } else {
        addCateFormTmp.cat_pid = 0
        addCateFormTmp.cat_level = 0
      }
    },
    // 点击按钮，添加分类
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听关闭添加分类对话框，关闭后，重置表单中的内容
    addCateClosedDialog () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 展示修改分类对话框
    async showEditDialog (ID) {
      const { data: res } = await this.$http.get(`categories/${ID}`)

      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      this.editCateForm = res.data
      this.editCateDialogVisible = true
    },
    // 监听关闭修改分类对话框，关闭后，重置表单中的内容
    editCateClosedDialog () {
      this.$refs.editCateFormRef.resetFields()
    },
    // 点击按钮，编辑分类
    editCate (ID) {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('categories/' + this.editCateForm.cat_id, {
          cat_name: this.editCateForm.cat_name
        })
        if (res.meta.status !== 200) {
          return this.$message.error('编辑分类失败')
        }
        this.$message.success('编辑分类成功')
        this.getCateList()
        this.editCateDialogVisible = false
      })
    },
    // 删除分类
    deleteCate (ID) {
      this.$confirm('此操作将永久删除该分类，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('categories/' + ID)
        if (res.meta.status !== 200) {
          return this.$message.error('删除商品分类失败')
        }
        this.$message.success('删除商品分类成功')
        this.getCateList()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 树形表数据采用懒加载
    load (tree, treeNode, resolve) {
      setTimeout(() => {
        resolve(this.cateList.children)
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
