/* eslint-disable no-unused-vars */
import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App'
import router from './router'
import store from './store'
// import path from 'path'
import VueTour from 'vue-tour'

import pkg from '../../package.json'
document.title = `${pkg.titleName} v${pkg.version} build ${pkg.intVersion}`
require('vue-tour/dist/vue-tour.css')

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(VueTour)
Vue.use(ElementUI)
Vue.use(require('vue-moment'))

Vue.filter('prettyBytes', function(num) {
  // jacked from: https://github.com/sindresorhus/pretty-bytes
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError('Expected a number')
  }

  var exponent
  var unit
  var neg = num < 0
  var units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  if (neg) {
    num = -num
  }

  if (num < 1) {
    return (neg ? '-' : '') + num + ' B'
  }

  exponent = Math.min(
    Math.floor(Math.log(num) / Math.log(1000)),
    units.length - 1
  )
  num = (num / Math.pow(1000, exponent)).toFixed(2) * 1
  unit = units[exponent]

  return (neg ? '-' : '') + num + ' ' + unit
})

document.querySelector('html').ondragover = (e) => {
  e.preventDefault()
}
document.querySelector('html').ondrop = (e) => {
  e.preventDefault()
}
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app')
