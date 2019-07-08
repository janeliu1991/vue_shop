import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
    //需要将message挂载到Vue原型对象中，这样，所有的vue实例都能通过this.$message访问到
Vue.prototype.$message = Message