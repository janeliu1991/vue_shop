import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Container, Header, Footer, Main, Aside, Menu, MenuItem, Submenu, MenuItemGroup, Card, BreadcrumbItem, Col, Row, Breadcrumb, Table, TableColumn, Tooltip, Switch, Pagination, Dialog } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Footer)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Col)
Vue.use(Row)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Dialog)

//需要将message挂载到Vue原型对象中，这样，所有的vue实例都能通过this.$message访问到
Vue.prototype.$message = Message