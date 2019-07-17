import Vue from 'vue'
import Router from 'vue-router'
const Login = () =>
    import ( /*webpackChunkName: "login_home_welecome" */ './components/Login.vue')
const Home = () =>
    import ( /*webpackChunkName: "login_home_welecome" */ './components/Home.vue')
const Welcome = () =>
    import ( /*webpackChunkName: "login_home_welecome" */ './components/Welcome.vue')

const Users = () =>
    import ( /*webpackChunkName: "users_rights_roles" */ './components/users/Users.vue')
const Rights = () =>
    import ( /*webpackChunkName: "users_rights_roles" */ './components/rights/Rights.vue')
const Roles = () =>
    import ( /*webpackChunkName: "users_rights_roles" */ './components/rights/Roles.vue')

const Cate = () =>
    import ( /*webpackChunkName: "cate_params" */ './components/goods/Cate.vue')
const Params = () =>
    import ( /*webpackChunkName: "cate_params" */ './components/goods/Params.vue')

const List = () =>
    import ( /*webpackChunkName: "list_add" */ './components/goods/List.vue')
const Add = () =>
    import ( /*webpackChunkName: "list_add" */ './components/goods/Add.vue')

const Orders = () =>
    import ( /*webpackChunkName: "orders_report" */ './components/orders/Orders.vue')
const Report = () =>
    import ( /*webpackChunkName: "orders_report" */ './components/report/Reports.vue')







// import Login from './components/Login.vue'
// import Home from './components/Home.vue'
// import Welcome from './components/Welcome.vue'

// import Users from './components/users/Users.vue'
// import Rights from './components/rights/Rights.vue'
// import Roles from './components/rights/Roles.vue'

// import Cate from './components/goods/Cate.vue'
// import Params from './components/goods/Params.vue'

// import List from './components/goods/List.vue'
// import Add from './components/goods/Add.vue'

// import Orders from './components/orders/Orders.vue'
// import Report from './components/report/Reports.vue'


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
                    }, { path: '/users', component: Users },
                    { path: '/rights', component: Rights },
                    { path: '/roles', component: Roles },
                    { path: '/categories', component: Cate },
                    { path: '/params', component: Params },
                    { path: '/goods', component: List },
                    { path: '/goods/add', component: Add },
                    { path: '/orders', component: Orders },
                    { path: '/reports', component: Report },
                ]
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