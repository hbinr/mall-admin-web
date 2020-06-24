<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="@/assets/img/my-logo.jpg"
             alt=""
             height="40px"
             width="40px"
             class="logo">
        <span>商城后台管理</span>
      </div>
      <el-button type="info"
                 @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button"
             @click="toggleCollapse"> | | |</div>
        <!-- 侧边栏菜单 -->
        <el-menu :default-active="activePath"
                 class="el-menu-vertical-demo"
                 background-color="#333744"
                 text-color="#fff"
                 active-text-color="#409EFF"
                 unique-opened
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 router>
          <!-- 一级菜单模板 -->
          <el-submenu :index="item.id + ''"
                      v-for="item in menuList"
                      :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单模板 -->
            <el-menu-item :index="'/'+ subItem.path"
                          v-for="subItem in item.children"
                          :key="subItem.id"
                          @click="saveNavState('/'+ subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      // 图标对象定义，key值取每个菜单的id(唯一)
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    // 在created 生命周期时，获取数据
    this.getMenuList()
    // 从sessionStorge中取出二级菜单状态值，刷新页面时能默认支持菜单打开
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 登出
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList () {
      const { data: res, status } = await this.$http.get('menus')
      if (status === 200) {
        this.menuList = res.data
      } else if (status >= 250) {
        this.$messagee.error(res.meta.msg)
        this.$router.push('/login')
      }
    },
    // 菜单折叠及展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存二级菜单激活状态值，值为其url
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.logo {
  border-radius: 50%;
  margin-left: 20px;
}
.el-header {
  background-color: #6983aa;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: white;
  font-size: 20px;
  // 嵌套样式
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #f4f4f4;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: white;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
