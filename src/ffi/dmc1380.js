import { dllPath } from './utils'
const ffi = require('ffi-napi')
// const ref = require('ref')
// const dword = ref.types.ulong
export const dmc = new ffi.Library(
  dllPath('Dmc1380.dll'),
  {
    d1000_board_init: ['ulong', []],
    d1000_board_close: ['ulong', []],
    // d1000_set_pls_outmode(short axis, short pls_outmode)
    d1000_set_pls_outmode: ['void*', ['short', 'short']]
  }
)
