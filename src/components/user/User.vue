<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入姓名查询"
                    v-model="queryInfo.query"
                    clearable
                    @clear="getUserList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格展示区域 -->
      <el-table :data="userList"
                border
                stripe>
        <el-table-column type="index"
                         label="#"
                         align="center"></el-table-column>
        <el-table-column label="姓名"
                         prop="username"
                         align="center"></el-table-column>
        <el-table-column label="邮箱"
                         prop="username"
                         align="center"></el-table-column>
        <el-table-column label="电话"
                         prop="email"
                         align="center"></el-table-column>
        <el-table-column label="角色"
                         prop="role_name"
                         align="center"></el-table-column>
        <el-table-column label="状态"
                         align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"
                       @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="200px"
                         align="center">
          <template slot-scope="scope">
            <el-button type="primary"
                       size="mini"
                       icon="el-icon-edit"
                       v-model="scope.row.id"
                       @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger"
                       size="mini"
                       icon="el-icon-delete"
                       v-model="scope.row.id"
                       @click="deleteUser(scope.row.id)"></el-button>
            <!-- 设置按钮,增加文字提示,鼠标离开自动隐藏(enterable)-->
            <el-tooltip content="分配角色"
                        placement="top"
                        :enterable="false">
              <el-button type="warning"
                         size="mini"
                         icon="el-icon-setting"
                         v-model="scope.row.id"></el-button>
            </el-tooltip>

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
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户"
               :visible.sync="addDialogVisible"
               width="40%"
               @close="addDialogClosed">
      <!-- 用户表单 -->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="70px"
               status-icon>
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="addUser">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户的对话框 -->
    <el-dialog title="编辑用户"
               :visible.sync="editDialogVisible"
               width="40%"
               @close="editDialogClosed">
      <!-- 用户表单 -->
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-width="70px"
               status-icon>
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="editForm.username"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="editUser">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 邮箱检验
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[\w][\w\d_]*@\w+\.[A-Za-z]+$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    // 手机号校验
    var checkMobile = (rule, value, callback) => {
      const regMebile = /^1[3-9]\d{9}$/
      if (regMebile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法手机号'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 5
      },
      userList: [],
      // 数据总数
      total: 0,
      // 控制添加用户对话框的显示和隐藏
      addDialogVisible: false,
      // 添加用户表单对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 增加表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3~10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在6~16个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }]
      },
      // 编辑用户表单对象
      editForm: {},
      // 控制编辑用户对话框的显示和隐藏
      editDialogVisible: false,
      // 编辑表单验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }]
      }

    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 监听 pagesize 每页显示个数改变事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },

    // 监听 pagenum 当前页数改变事件
    handleCurrentChange (newSize) {
      this.queryInfo.pagenum = newSize
      this.getUserList()
    },

    // 监听用户状态改变事件
    async userStateChanged (userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 获取用户列表
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 添加用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status === 400) {
          return this.$message.warning('用户名已存在')
        }

        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }

        // 隐藏 dialog 框
        this.addDialogVisible = false
        this.$message.success('添加用户成功')
        this.getUserList()
      })
    },
    // 展示编辑用户对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听编辑用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑用户信息并提交
    async editUser () {
      // 提交表单前先验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          return this.$message.error('编辑用户信息失败')
        }
        // 关闭对话框
        this.editDialogVisible = false
        this.$message.success('编辑用户信息成功')
        // 刷新数据列表
        this.getUserList()
      })
    },
    // 删除用户
    deleteUser (ID) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('users/' + ID)
        if (res.meta.status !== 200) {
          return this.$message.error('删除用户失败')
        }
        this.$message.success('删除用户成功')
        this.getUserList()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }

  }
}
</script>

<style lang="less" scoped>
</style>
