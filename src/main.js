import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'


//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    //添加axios请求拦截器，必须有token令牌才能请求api
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem("token")
    return config
})
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)


Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')