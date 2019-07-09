import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/users/Users.vue'
import Rights from './components/rights/Rights.vue'
import Roles from './components/rights/Roles.vue'


Vue.use(Router)

const router = new Router({
        routes: [
            { path: '/', redirect: '/login' },
            { path: '/login', component: Login },
            {
                path: '/home',
                component: Home,
                redirect: '/welcome',
                children: [{
                    path: '/welcome',
                    component: Welcome
                }, { path: '/users', component: Users }, { path: '/rights', component: Rights }, { path: '/roles', component: Roles }]
            },

        ]
    })
    //路由导航守卫
router.beforeEach((to, from, next) => {
    // to代表要访问的路径
    // from代表从哪个路径跳转而来
    // next是一个函数，代表接下来要做什么操作，放行还是去往其他的页面
    if (to.path == '/login') return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router