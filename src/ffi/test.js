/* eslint-disable no-unused-vars */
import { dllPath } from './utils'

const ArrayType = require('ref-array-napi')
const IntArray = ArrayType('int')

const ffi = require('ffi-napi')
// let fileContents = fs.readFileSync(
//   path.join(__static, dllPrefix, 'Dll1.dll'),
//   'utf8'
// )
// console.log(fileContents)

// dialog.showMessageBox({
//   title:
// })

const myTest = new ffi.Library(dllPath('Dll1.dll'), {
  add: ['ulong', ['int', 'int']],
  arrayAdd: ['int', [IntArray]]
})
const add = (a, b) => {
  return myTest.add(a, b)
}
const arrayAdd = (arr = []) => {
  const refArr = new IntArray(arr)
  return myTest.arrayAdd(refArr)
}
export default {
  add,
  arrayAdd
}
