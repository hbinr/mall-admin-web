import axios from 'axios'
import qs from 'qs'

// 封装http相关服务,方便直接使用Vue.use()
const MyHttpServer = {}
MyHttpServer.install = (Vue) => {
  // 配置axios
  axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
  Vue.prototype.$http = axios

  // 配置qs
  Vue.prototype.$qs = qs
}

export default MyHttpServer
