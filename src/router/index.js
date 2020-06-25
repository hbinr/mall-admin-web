import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../components/Login.vue')
const Home = () => import('../components/Home.vue')
const Welcome = () => import('../components/Welcome.vue')
const User = () => import('../components/user/User.vue')
const Right = () => import('../components/power/Right.vue')
const Role = () => import('../components/power/Role.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Right },
      { path: '/roles', component: Role }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 路由重复处理
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  // to 将要访问的路径
  // from 从哪里而来
  // next 是一个函数，next()放行  next("/login") 强制跳转到登录界面

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
