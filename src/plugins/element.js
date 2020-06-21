import Vue from 'vue'
import {
  Button,
  Input,
  Form,
  FormItem,
  Card,
  Radio,
  Checkbox,
  Message
} from 'element-ui'

// 按需引入UI组件
Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Card)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.prototype.$message = Message
