import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import path from 'path'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

var edge = require('electron-edge-js')
var helloWorld = edge.func(`
    async (input) => { 
        return ".NET Welcomes " + input.ToString(); 
    }
`)
const hello = edge.func({
  assemblyFile: path.join(__static, 'ClassLibrary1.dll'),
  typeName: 'ClassLibrary1.Class1',
  methodName: 'hello'
})

helloWorld('JavaScript', function (error, result) {
  if (error) throw error
  console.log(result)
  // debugger
})
hello(123, (e, r) => {
  console.log(e, r)
})
