<template>
  <div class="login-container">
    <el-card shadow="always"
             class="login-card">
      <!-- 登录表单区域 -->
      <el-form class="login-form"
               ref="loginFormRef"
               :model="user"
               :rules="userRules">
        <h3 class="login-font"> 登 录 </h3>
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input v-model="user.username"
                    suffix-icon="el-icon-user-solid"
                    placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="user.password"
                    suffix-icon="el-icon-lock"
                    placeholder="请输入密码"
                    type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item>
          <el-checkbox class="login-checkbox"
                       v-model="user.autoLogin"
                       label="1">7天内自动登录</el-checkbox>

          <el-button class="login-btn"
                     type="success"
                     size="medium"
                     round
                     @click="login"> Log in </el-button>
        </el-form-item>

      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        username: 'admin',
        password: '123456',
        autoLogin: true
      },
      // 登录表单验证，鼠标离开输入框即验证
      userRules: {
        username: [
          { required: true, message: '请输入正确的邮箱或手机号', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 16, message: '请输入6-20位密码，区分大小写，不能使用空格！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        // await 操作符用于等待一个Promise 对象。它只能在异步函数 async function 中使用。
        const { data: res } = await this.$http.post('login', this.user)
        if (res.meta.status === 200) {
          // 将token存储到sessionStorge中(会话式storge)
          window.sessionStorage.setItem('token', res.data.token)
          this.$message.success('登录成功！')
          this.$router.push('/home')
        } else if (res.meta.status === 203) {
          // TODO 待开发接口
          this.$message.error('账号未注册！')
        } else {
          this.$message.error('登录失败！请检查用户名和密码是否正确')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  /* 居中布局 */
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-card {
  border-radius: 30px;
  height: 370px;
  width: 380px;
}
.login-form {
  width: 100%;
  padding: 0 30px;
  // 左右两边都对齐
  box-sizing: border-box;
}
.login-font {
  font-size: 20px;
  font-family: "Times New Roman", Times, serif;
  color: #116979;
  text-align: center;
}

.login-btn {
  margin-top: 30px;
  background-color: #00bdaa;
  border-color: #00bdaa;
  font-size: 20px;
  font-family: "Times New Roman", Times, serif;
  color: #116979;
  width: 100%;
}

.login-checkbox {
  width: 30%;
  color: #00bdaa;
  font-family: "Times New Roman", Times, serif;
}
</style>
