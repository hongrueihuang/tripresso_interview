// 元件
import Vue from 'vue'
import 'jquery'
import axios from 'axios'
import Vueaxios from 'vue-axios'
import 'bootstrap'
// 自訂
import App from './App.vue'
import currency from './filters/currencyFilter'
import formatTime from './filters/formatDate'

Vue.config.productionTip = false
Vue.use(Vueaxios, axios)
Vue.filter('currency', currency)
Vue.filter('formatTime', formatTime)
new Vue({
  render: h => h(App),
}).$mount('#app')
