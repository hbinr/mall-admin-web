import axios from 'axios'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://timemeetyou.com:8889/api/private/v1', // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // 发起请求前，给页面添加进度条效果
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(response => {
  // 服务端相应后，进度条效果消失
  NProgress.done()

  /**
    * code为非200是抛错 可结合自己业务进行修改
    */
  const res = response.data
  if (res.meta.status !== 200) {
    Message({
      message: res.meta.msg,
      type: 'error',
      duration: 3 * 1000
    })
  } else {
    return res
  }
}, error => {
  console.log('err' + error)// for debug
  Message({
    message: error.message,
    type: 'error',
    duration: 3 * 1000
  })
  return Promise.reject(error)
})

export default service
