import { dllPrefix } from './utils'
const path = require('path')
const ffi = require('ffi-napi')

export const myTest = new ffi.Library(
  path.join(__static, dllPrefix, 'Dll1.dll'),
  {
    add: ['ulong', ['int', 'int']]
  }
)
