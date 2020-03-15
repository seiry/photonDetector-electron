import { dllPath } from './utils'
const ffi = require('ffi-napi')
const StructType = require('ref-struct-napi')
// const ref = require('ref')
// const dword = ref.types.ulong

export const PVCI_INIT_CONFIG = StructType({
  AccCode: 'ulong',
  AccMask: 'ulong',
  Reserved: 'ulong',
  Filter: 'uchar',
  Timing0: 'uchar',
  Timing1: 'uchar',
  Mode: 'uchar'
})
console.log(new PVCI_INIT_CONFIG({ Mode: '123' }))
export const can = new ffi.Library(dllPath('ControlCAN.dll'), {
  VCI_OpenDevice: ['ulong', ['ulong', 'ulong', 'ulong']]
})
export default can
