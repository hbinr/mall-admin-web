<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域 -->
    <el-card>
      <!-- 添加按钮区域 -->
      <el-row>
        <el-button type="primary"
                   @click="addDialogVisible = true">
          添加角色
        </el-button>
      </el-row>
      <!-- 列表展示区域 -->
      <el-table :data="roleList"
                border
                stripe>
        <!-- 下拉显示权限内容区域 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级菜单区域 -->
            <el-row :class="['bbottom',i1 === 0 ?'btop':'','vcenter']"
                    v-for="(item1, i1) in scope.row.children"
                    :key="item1.id">
              <el-col :span="5">
                <el-tag closable
                        @close="deleteRightByID(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级菜单区域 -->
              <el-col :span="19">
                <el-row :class="[i2 === 0 ?'':'btop','vcenter']"
                        v-for="(item2, i2) in item1.children"
                        :key="item2.id">
                  <el-col :span="6">
                    <el-tag closable
                            type="success"
                            @close="deleteRightByID(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="(item3) in item2.children"
                            :key="item3.id"
                            type="warning"
                            closable
                            @close="deleteRightByID(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>

              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 表格内容区域 -->
        <el-table-column type="index"
                         label="#"
                         align="center"></el-table-column>
        <el-table-column label="角色名称"
                         align="center"
                         prop="roleName"></el-table-column>
        <el-table-column label="角色描述"
                         align="center"
                         prop="roleDesc"></el-table-column>
        <el-table-column label="操作"
                         align="center"
                         width="300px">
          <template slot-scope="scope">
            <el-button type="primary"
                       size="mini"
                       icon="el-icon-edit"
                       v-model="scope.row.id"
                       @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger"
                       size="mini"
                       icon="el-icon-delete"
                       v-model="scope.row.id"
                       @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button type="warning"
                       size="mini"
                       icon="el-icon-setting"
                       v-model="scope.row.id"
                       @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框区域 -->
    <el-dialog title="添加角色"
               :visible.sync="addDialogVisible"
               width="40%"
               @close="addDialogClosed">
      <el-form :model="addForm"
               ref="addFormRef"
               label-width="80px"
               status-icon>
        <el-form-item label="角色名称"
                      prop="roleName"
                      :rules="[{ required: true, message: '请输入角色名称', trigger: 'blur' }]">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="addRole">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框区域 -->
    <el-dialog title="编辑角色"
               :visible.sync="editDialogVisible"
               width="40%"
               @close="editDialogClosed">
      <el-form :model="editForm"
               ref="editFormRef"
               label-width="80px"
               status-icon>
        <el-form-item label="角色名称"
                      prop="roleName"
                      :rules="[{ required: true, message: '请输入角色名称', trigger: 'blur' }]">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="editRole">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框区域 -->
    <el-dialog title="分配角色"
               :visible.sync="setRightDialogVisible"
               width="40%"
               @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree :data="rightList"
               :props="rightTreeProps"
               node-key="id"
               show-checkbox
               default-expand-all
               :default-checked-keys='rightKeyArr'
               highlight-current
               ref="treeRef">
      </el-tree>
      <!-- 按钮 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="setRights">确 定</el-button>
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 所有角色列表
      roleList: [],
      // 控制添加对话框的显示和隐藏
      addDialogVisible: false,
      // 添加form对象
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 控制编辑对话框的显示和隐藏
      editDialogVisible: false,
      // 添加form对象
      editForm: {},
      // 控制分配角色对话框的显示和隐藏
      setRightDialogVisible: false,
      // 权限树对象
      rightTreeProps: {
        label: 'authName',
        children: 'children'
      },
      // 所有权限列表
      rightList: [],
      // 所有权限默认勾选的节点的 key 的数组
      rightKeyArr: [],
      // 分配权限时使用的角色ID
      roleID: 0
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 监听添加角色对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 获取角色列表
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
    },
    // 添加角色
    addRole () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addForm)

        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.addDialogVisible = false
        this.$message.success('添加角色成功')
        this.getRoleList()
      })
    },
    // 展示编辑角色对话框
    async showEditDialog (ID) {
      const { data: res } = await this.$http.get('roles/' + ID)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听添加角色对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑角色
    async editRole () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        })
        if (res.meta.status !== 200) {
          return this.$message.error('编辑角色信息失败')
        }
        this.editDialogVisible = false
        this.$message.success('编辑角色信息成功')
        this.getRoleList()
      })
    },

    // 展示分配角色对话框
    async showSetRightDialog (role) {
      this.roleID = role.id // 先绑定角色ID，供后续分配角色使用
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightList = res.data
      // 在弹出对话框之前，通过调用递归函数 getRightKeyArr 将已分配的权限默认勾选上
      this.getRightKeyArr(role, this.rightKeyArr)
      this.setRightDialogVisible = true
    },

    // 通过递归 获取角色下三级权限的 id, 并保存到 rightKeyArr 数组
    getRightKeyArr (node, arr) {
      // 如果是三级节点，则直接将节点id存到 rightKeyArr 数组中
      // 三级节点判断依据：数据中不包含 children 属性
      if (!node.children) {
        return arr.push(node.id)
      }

      // 遍历所有节点，递归调用 getRightKeyArr
      node.children.forEach(item => this.getRightKeyArr(item, arr))
    },
    // 在关闭对话框时要重置 rightKeyArr 数据
    // 因为之前通过递归函数给rightKeyArr数组赋值，只要点击分配权限按钮就会赋值，这样数组就会不断增加数据
    setRightDialogClosed () {
      this.rightKeyArr = []
    },
    // 分配权限
    async setRights () {
      // getCheckedKeys 获取全选中的key
      // getHalfCheckedNodes  获取半选中的key
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const keysStr = keys.join(',')
      console.log('keysStr: ', keysStr)
      const { data: res } = await this.$http.post(`roles/${this.roleID}/rights`,
        { rids: keysStr })
      console.log('res: ', res)
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.setRightDialogVisible = false
      this.getRoleList()
    },
    // 删除权限
    deleteRightByID (roles, rightID) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${roles.id}/rights/${rightID}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除权限失败')
        }
        roles.children = res.data // 注意是给children赋值
        this.$message.success('删除权限成功')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 删除角色
    deleteRole (ID) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('roles/' + ID)
        if (res.meta.status !== 200) {
          return this.$message.error('删除角色失败')
        }
        this.$message.success('删除角色成功')
        this.getRoleList()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.btop {
  border-top: 1px solid #eee;
}

.bbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
