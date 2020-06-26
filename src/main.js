import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
// 导入字体样式
import './assets/fonts/iconfont.css'

// 导入 ant-design-vue js
import './plugins/antDesignVue.js'
// 导入 ant-design-vue 的table样式
import 'ant-design-vue/lib/table/style/css'

import MyHttpServer from './plugins/http.js'

Vue.config.productionTip = false
Vue.use(MyHttpServer)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
