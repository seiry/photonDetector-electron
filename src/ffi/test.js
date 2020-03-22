/* eslint-disable no-unused-vars */
import { dllPath } from './utils'

const ArrayType = require('ref-array-napi')
const ref = require('ref-napi')
const IntArray = ArrayType('int')
const DoubleArray = ArrayType('double')
const byteArray = ArrayType('byte', 8)
const StructType = require('ref-struct-napi')

const ffi = require('ffi-napi')
// let fileContents = fs.readFileSync(
//   path.join(__static, dllPrefix, 'Dll1.dll'),
//   'utf8'
// )
// console.log(fileContents)

// dialog.showMessageBox({
//   title:
// })

const TestStruct = StructType({
  name: 'string'
})
const TestStruct2 = StructType({
  byte: 'byte',
  char: 'char',
  uchar: 'uchar'
})
// console.log(
//   new TestStruct({
//     name: '人'
//   })
// )
// console.log(
//   new TestStruct2({
//     byte: 0xff,
//     char: 0xff / 2 - 1,
//     uchar: 0xff + 1
//   })
// )
const Obj1 = new StructType({
  Data: byteArray
})
const myTest = new ffi.Library(dllPath('Dll1.dll'), {
  add: ['ulong', ['int', 'int']],
  doubleAdd: ['double', ['double', 'double']],
  arrayAdd: ['int', [IntArray]],
  arrayAddDouble: ['double', [DoubleArray]],
  getObj: [Obj1, []],
  changeObj: ['void', [ref.refType(Obj1)]]
})
const add = (a, b) => {
  return myTest.add(a, b)
}
const arrayAdd = (arr = []) => {
  const refArr = new IntArray(arr)
  return myTest.arrayAdd(refArr)
}
const arrayAddDouble = (arr = []) => {
  const refArr = new DoubleArray(arr)
  return myTest.arrayAddDouble(refArr)
}
const doubleAdd = (a, b) => myTest.doubleAdd(a, b)

const getObj = () => {
  return myTest.getObj()
}
const changeObj = () => {
  const obj = new Obj1({ Data: [7, 7, 7] })
  console.log(obj)
  debugger
  myTest.changeObj(obj.ref())
  console.log(obj)
}
changeObj()
export default {
  add,
  doubleAdd,
  arrayAdd,
  arrayAddDouble,
  getObj,
  changeObj
}
