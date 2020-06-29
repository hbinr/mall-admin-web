import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入富文本编辑器组件及样式
import VueQuillEditor from 'vue-quill-editor'

// 导入字体样式
import './assets/fonts/iconfont.css'

// 导入自定义的全局样式及封装好的http请求
import './assets/css/global.css'
import sevice from './plugins/http.js'

Vue.config.productionTip = false
Vue.use(sevice)
Vue.use(VueQuillEditor)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
