/* eslint-disable no-unused-vars */
import { dllPath } from './utils'
import { dialog } from 'electron'

const ffi = require('ffi-napi')
// let fileContents = fs.readFileSync(
//   path.join(__static, dllPrefix, 'Dll1.dll'),
//   'utf8'
// )
// console.log(fileContents)

// dialog.showMessageBox({
//   title:
// })

export const myTest = new ffi.Library(dllPath('Dll1.dll'), {
  add: ['ulong', ['int', 'int']]
})

export default myTest
