import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
//导入字体图标
import './assets/fonts/iconfont.css'
//导入全局样式
import './assets/css/global.css'
//导入树状表
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//导入进度条的js和css文件
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

//将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

//将axios挂载到vue实例上
Vue.prototype.$http = axios

//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    //添加axios请求拦截器，必须有token令牌才能请求api
axios.interceptors.request.use(config => {
    //在request请求中展示进度条
    Nprogress.start()
    config.headers.Authorization = window.sessionStorage.getItem("token")
    return config
})
axios.interceptors.response.use(config => {
    Nprogress.done()
    return config
})


Vue.component('tree-table', TreeTable)

//创建过滤器将秒数过滤为年月日，时分秒
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})



Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')