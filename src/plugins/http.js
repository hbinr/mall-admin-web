import axios from 'axios'
import qs from 'qs'

// 封装http相关服务,方便使用 Vue.use() 注入
const service = {}
service.install = (Vue) => {
  // axios 请求拦截器设置，在发起请求之前，为请求头header添加token
  axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  }, error => {
    return Promise.reject(error)
  })

  // 配置基准URL
  axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
  Vue.prototype.$http = axios

  // 配置qs
  Vue.prototype.$qs = qs
}

export default service
