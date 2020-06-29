module.exports = {
  // 配置打包入口
  chainWebpack: config => {
    // 生产环境配置
    config.when(process.env.NODE_ENV === 'production', config => {
      // 链式编程  先获取名为'app'的默认打包入口，然后清除掉，接着再添加自定义的入口文件
      config.entry('app').clear().add('./src/main-prod.js')

      // 通过externals节点加载外部CDN资源
      config.set('externals', {
        vue: 'Vue',
        vuex: 'Vuex',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
    })
    // 开发环境配置
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }
}
