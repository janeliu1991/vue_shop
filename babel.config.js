// 这是项目发布阶段需要用到的 babel 插件
const prodPlugins = []
    //如果是发布阶段，才去除console
if (process.env.NODE_ENV === 'production') {
    prodPlugins.push('transform-remove-console')
}

module.exports = {
    presets: ['@vue/app'],
    plugins: [
        [
            'component',
            {
                libraryName: 'element-ui',
                styleLibraryName: 'theme-chalk'
            }
        ],
        // 发布产品时候的插件数组
        ...prodPlugins,
        '@babel/plugin-syntax-dynamic-import'
    ]
}