module.exports = {
    //chainWebpack是通过链式编程配置发布和开发模式下的打包入口
    chainWebpack: config => {
        // 发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
            config
                .entry('app')
                .clear()
                .add('./src/main-prod.js')

            // 通过externals加载外部CND资源，就是一些体积较大的包不被打包进去，需要的时候在全局查找这些文件
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            })

            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })

        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config
                .entry('app')
                .clear()
                .add('./src/main-dev.js')

            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }
}