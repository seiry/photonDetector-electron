/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { dllPath } from './utils'
const ffi = require('ffi-napi')
const ArrayType = require('ref-array-napi')
const ShortArray = ArrayType('short')
const dmc1380 = new ffi.Library(dllPath('Dmc1380.dll'), {
  d1000_board_init: ['ulong', []],
  d1000_board_close: ['ulong', []],
  // d1000_set_pls_outmode(short axis, short pls_outmode)
  d1000_set_pls_outmode: ['ulong', ['short', 'short']],
  // DWORD d1000_start_tv_move (short axis, long StrVel, Long MaxVel, double Tacc)
  d1000_start_tv_move: ['ulong', ['short', 'long', 'long', 'double']],
  // DWORD d1000_start_tv_move (short axis, long StrVel, Long MaxVel, doubleTacc)
  d1000_get_speed: ['ulong', ['short']],
  d1000_change_speed: ['ulong', ['short', 'long']],
  d1000_decel_stop: ['ulong', ['short']],
  d1000_immediate_stop: ['ulong', ['short']],
  d1000_start_t_move: ['ulong', ['short', 'long', 'long', 'double']],
  d1000_start_ta_move: ['ulong', ['short', 'long', 'long', 'double']],
  d1000_start_t_line: [
    'ulong',
    ['short', ShortArray, ShortArray, 'long', 'long', 'double']
  ]
})

/**
 * 初始化
 */
const d1000_board_init = () => {
  return dmc1380.d1000_board_init()
}

/**
 * 关闭控制卡
 */
const d1000_board_close = () => {
  return dmc1380.d1000_board_close()
}

/**
 * 脉冲输出设置函数
 * @param {*} axis
 * @param {*} pls_outmode
 */
const d1000_set_pls_outmode = (axis, pls_outmode) => {
  return dmc1380.d1000_set_pls_outmode(axis, pls_outmode)
}

/**
 * 直线插补函数
 * TotalAxis： 插补轴数，范围 2～3 轴；
 * AxisArray，AxisArray：轴号列表；
 * DistArray，DistArray：对应轴号列表各轴的相对坐标的距离列表；
 * StrVel： 初始速度，单位：pps；
 * MaxVel：运行速度，单位：pps；
 * Tacc： 加速时间，单位：s。
 * @param {*} TotalAxis  插补轴数，范围 2～3 轴；
 * @param {*} AxisArray 轴号列表；
 * @param {*} DistArray 对应轴号列表各轴的相对坐标的距离列表；
 * @param {*} StrVel 初始速度，单位：pps；
 * @param {*} MaxVel 运行速度，单位：pps；
 * @param {*} Tacc  加速时间，单位：s。
 */
const d1000_start_t_line = (
  TotalAxis,
  AxisArray,
  DistArray,
  StrVel,
  MaxVel,
  Tacc
) => {
  return dmc1380.d1000_start_t_line(
    TotalAxis,
    new ShortArray(AxisArray),
    new ShortArray(DistArray),
    StrVel,
    MaxVel,
    Tacc
  )
}
export default {
  d1000_board_init,
  d1000_board_close,
  d1000_set_pls_outmode,
  d1000_start_t_line
}
