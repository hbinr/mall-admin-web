import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
import MyHttpServer from './plugins/http.js'

Vue.config.productionTip = false
Vue.use(MyHttpServer)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
