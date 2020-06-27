<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域 -->
    <el-card>
      <!-- 警示内容 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！"
                type="warning"
                show-icon>
      </el-alert>
      <!-- 级联选择器 -->
      <el-row class="cate-opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader v-model="selectedCateKeys"
                       :options="parentCateList"
                       :props="cateProps"
                       @change="parentCateChanged"
                       clearable
                       filterable></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs标签块 -->
      <el-tabs v-model="activeName"
               @tab-click="handleCateClick">
        <!-- 动态参数按钮 -->
        <el-tab-pane label="动态参数"
                     name="many">
          <el-button type="primary"
                     size="mini"
                     :disabled="isBtnDisabled"
                     @click="addDialogVisible = true">添加参数
          </el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData"
                    border
                    stripe>
            <!-- 扩展行区域 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- tags区域 -->
                <el-tag v-for="(item,i) in scope.row.attr_vals"
                        :key="i"
                        closable
                        @close="handleClose(i,scope.row)">
                  {{item}}
                </el-tag>
                <!-- New Tag 区域-->
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInputRef"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"
                             label="#"></el-table-column>
            <el-table-column label="动态参数"
                             prop="attr_name"
                             align="center"></el-table-column>
            <el-table-column label=操作
                             align="center">
              <template slot-scope="scope">
                <el-button type="primary"
                           size="mini"
                           icon="el-icon-edit"
                           @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger"
                           size="mini"
                           icon="el-icon-delete"
                           @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态属性区域 -->
        <el-tab-pane label="静态属性"
                     name="only">
          <!--  静态属性按钮 -->

          <el-button type="primary"
                     size="mini"
                     :disabled="isBtnDisabled"
                     @click="addDialogVisible = true">添加属性
          </el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData"
                    border
                    stripe>
            <!-- 扩展行区域 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- tags区域 -->
                <el-tag v-for="(item,i) in scope.row.attr_vals"
                        :key="i"
                        closable
                        @close="handleClose(i,scope.row)">
                  {{item}}
                </el-tag>
                <!-- New Tag 区域-->
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInputRef"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"
                             label="#"></el-table-column>
            <el-table-column label="静态属性"
                             prop="attr_name"></el-table-column>
            <el-table-column label=操作>
              <template slot-scope="scope">
                <el-button type="primary"
                           size="mini"
                           icon="el-icon-edit"
                           @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger"
                           size="mini"
                           icon="el-icon-delete"
                           @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态参数/静态属性的对话框 -->
    <el-dialog :title="'添加'+titleText"
               :visible.sync="addDialogVisible"
               width="40%"
               @close="addClosedDialog">
      <!-- 添加参数 -->
      <el-form :model="addForm"
               :rules="addRules"
               ref="addFormRef"
               label-width="100px"
               :status-icon='true'>
        <el-form-item :label="titleText"
                      prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="addParams">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 修改动态参数/静态属性的对话框 -->
    <el-dialog :title="'修改'+titleText"
               :visible.sync="editDialogVisible"
               width="40%"
               @close="editClosedDialog">
      <!-- 修改参数 -->
      <el-form :model="editForm"
               :rules="addRules"
               ref="editFormRef"
               label-width="100px"
               :status-icon='true'>
        <el-form-item :label="titleText"
                      prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="editParams">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 级联选择器选中的key值
      selectedCateKeys: [],
      // 所有商品分类列表数据
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
      // 当前tabs页激活name值，默认激活第一个
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 控制添加对话框的显示和隐藏
      addDialogVisible: false,
      // 添加参数对象
      addForm: {
        attr_name: ''
      },
      // 添加参数时的校验对着
      addRules: {
        attr_name: [{ required: true, message: '请输入参数', trigger: 'blur' }]

      },
      // 控修改对话框的显示和隐藏
      editDialogVisible: false,
      // 修改参数对象
      editForm: {}

    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    // 当选择不是三级选项时，禁用按钮，返回TRUE
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类Id
    cateID () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 添加对框的标题
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取所有商品分类数据失败')
      }
      this.parentCateList = res.data
    },
    // 级联选择器，选项改变触发事件
    async parentCateChanged () {
      this.getGoodsParams()
    },
    // 标签页改变事件
    handleCateClick () {
      this.getGoodsParams()
    },
    // 获取商品参数
    async getGoodsParams () {
      // 控制选择器的范围，只能选择第三级分类，通过数组的长度判断,其余情况均重置selectedCateKeys
      // 并直接返回，不发起请求
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes`, {
        params: { sel: this.activeName }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      var data = res.data

      // 扩展行展示数据处理
      data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 为每一行数据添加控制 New Tag/文本框 的显示/隐藏
        item.inputVisible = false
        // 每一行数据单独设置文本框输入的值，确保不和其他行共享数据
        item.inputValue = ''
      })

      // 不同的请求返回值绑定到不同tags表格数据上
      if (this.activeName === 'many') {
        this.manyTableData = data
      } else {
        this.onlyTableData = data
      }
    },
    // 监听添加对话框的关闭事件
    addClosedDialog () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加对话框提交的内容
    addParams () {
      // categories/:id/attributes
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/ ${this.cateID} /attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加数据失败')
        }

        this.$message.success('添加数据成功')
        this.getGoodsParams()
        this.addDialogVisible = false
      })
    },
    // 展示修改商品参数表格
    async showEditDialog (attrID) {
      // categories/:id/attributes/:attrId
      const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes/${attrID}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类参数失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听添加对话框的关闭事件
    editClosedDialog () {
      this.$refs.editFormRef.resetFields()
    },
    // 提交修改对话框提交的内容
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // categories/:id/attributes/:attrId
        const { data: res } = await this.$http.put(`categories/${this.cateID}/attributes/${this.editForm.attr_id}/`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          })
        if (res.meta.status !== 200) {
          return this.$message.error('修改数据失败')
        }
        this.$message.success('修改数据成功')
        this.getGoodsParams()
        this.editDialogVisible = false
      })
    },
    // 删除商品分类参数
    deleteParams (attrID) {
      // categories /: id / attributes /: attrid
      this.$confirm('此操作将永久删除该商品参数，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`categories/${this.cateID}/attributes/${attrID}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除商品参数失败')
        }
        this.$message.success('删除商品参数成功')
        this.getGoodsParams()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 文本框失去了焦点或按下enter键都会触发该事件
    async handleInputConfirm (row) {
      // 如果只输入空格，视为无效数据，则重置文本框的内容
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        // 置为false，切换为 tag 样式
        row.inputVisible = false
        return
      }

      // 输入保存到 attr_vals 属性中，并增加一个New Tag
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false

      // 保存修改
      this.saveAttrVals(row)
    },
    // 将对attr_vals（Tag） 的操作 保存到数据库
    async saveAttrVals (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateID}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ') // 拼接成字符串，并且以空格隔开
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败')
      }

      this.$message.success('修改参数项成功')
    },
    // New Tag切换为input
    showInput (row) {
      row.inputVisible = true
      // 文本框自动获得焦点
      // $nextTick函数作用：当页面被重新渲染之后，才会执行回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInputRef.$refs.input.focus()
      })
    },
    // 删除tag标签
    handleClose (i, row) {
      // web页面：从数组剔除当前tag，splice此方法会改变原数组
      row.attr_vals.splice(i, 1) // 剔除下标为i,且数量为1个
      // 服务端：保存修改
      this.saveAttrVals(row)
    }

  }

}
</script>

<style lang="less" scoped>
.cate-opt {
  margin: 15px 0;
}
.el-tag {
  margin: 8px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 120px;
}
</style>
