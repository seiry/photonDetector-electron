/* eslint-disable no-unused-vars */
import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
// import path from 'path'

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

// var edge = require('electron-edge-js')
// var helloWorld = edge.func(`
//     async (input) => {
//         return ".NET Welcomes " + input.ToString();
//     }
// `)
// const hello = edge.func({
//   assemblyFile: path.join(__static, 'ClassLibrary1.dll'),
//   typeName: 'ClassLibrary1.Class1',
//   methodName: 'hello'
// })

// helloWorld('JavaScript', function (error, result) {
//   if (error) throw error
//   console.log(result)
//   // debugger
// })
// hello(123, (e, r) => {
//   console.log(e, r)
// })
const ffi = require('ffi-napi')
// const ref = require('ref')
const path = require('path')
// const dword = ref.types.ulong
const dmc = new ffi.Library(path.join(__static, 'Dmc1380.dll'), {
  'd1000_board_init': [
    'ulong', []
  ],
  'd1000_board_close': [
    'ulong', []
  ],
  // d1000_set_pls_outmode(short axis, short pls_outmode)
  'd1000_set_pls_outmode': [
    'void*', ['short', 'short']
  ]
})
const myTest = new ffi.Library(path.join(__static, 'Dll1.x64.dll'), {
  'add': [
    'ulong', ['int', 'int']
  ]
})

const a = myTest.add(1, 2)
// debugger
console.log(a)
// /**
//  * 先定义一个函数, 用来在窗口中显示字符
//  * @param {String} text
//  * @return {*} none
//  */
// function showText (text) {
//   return Buffer.from(text, 'ucs2').toString('binary')
// };
// // 通过ffi加载user32.dll
// const myUser32 = new ffi.Library('user32', {
//   'MessageBoxW': // 声明这个dll中的一个函数
//     [
//       'int32', ['int32', 'string', 'string', 'int32'] // 用json的格式罗列其返回类型和参数类型
//     ]
// })

// // 调用user32.dll中的MessageBoxW()函数, 弹出一个对话框
// const isOk = myUser32.MessageBoxW(
//   0, showText('I am Node.JS'), showText('Hello, World!~'), 2
// )
// console.log(isOk)
