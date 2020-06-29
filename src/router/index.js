import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../components/Login.vue')
const Home = () => import('../components/Home.vue')
const Welcome = () => import('../components/Welcome.vue')
const User = () => import('../components/user/User.vue')
const Right = () => import('../components/power/Right.vue')
const Role = () => import('../components/power/Role.vue')
const Category = () => import('../components/goods/Category.vue')
const Params = () => import('../components/goods/Params.vue')
const GoodsList = () => import('../components/goods/list/Index.vue')
const AddGgoods = () => import('../components/goods/list/Add.vue')
const UpdateGgoods = () => import('../components/goods/list/Update.vue')
const Order = () => import('../components/order/Order.vue')
const Report = () => import('../components/report/Report.vue')

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
      { path: '/roles', component: Role },
      { path: '/categories', component: Category },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      // 从商品列表页面开始，所有开发采用更高级的模式，封装好模块，组件，请求api
      // 之前的代码需要重构，待项目开发完，功能都能正常使用后再重构项目
      { path: '/goods/add', name: 'addGoods', component: AddGgoods },
      { path: '/goods/update', name: 'updateGoods', component: UpdateGgoods },
      { path: '/orders', name: 'order', component: Order },
      { path: '/reports', name: 'report', component: Report }
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
