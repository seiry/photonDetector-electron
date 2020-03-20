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
  ],
  d1000_start_ta_line: [
    'ulong',
    ['short', ShortArray, ShortArray, 'long', 'long', 'double']
  ],
  d1000_home_move: ['ulong', ['short', 'long', 'long', 'double']],
  d1000_check_done: ['ulong', ['short']],
  d1000_get_command_pos: ['ulong', ['short']],
  d1000_set_command_pos: ['ulong', ['short', 'double']],
  d1000_out_bit: ['ulong', ['short', 'short']],
  d1000_in_bit: ['ulong', ['short']],
  d1000_get_outbit: ['ulong', ['short']],
  d1000_in_enable: ['void', ['ulong', 'ulong']],
  d1000_set_sd: ['ulong', ['short', 'short']],
  d1000_get_axis_status: ['byte', ['short']]
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
 * 设置控制卡脉冲输出模式，用户可以根据驱动器具体接收脉冲的模式来选择控制卡不同脉冲输出模式。
 * @param {*} axis 轴号。范围 0～(n×3-1)，n 为卡数。多卡运行时，轴号参考表 2-1 多卡运行时轴号对照表 ，以下其他函数中相同。
 * @param {*} pls_outmode pls_outmode：脉冲输出模式：0：pulse/dir 模式，脉冲上升沿有效；1：pulse/dir 模式，脉冲下降沿有效；2：CW/CCW 模式，脉冲上升沿有效；3：CW/CCW 模式，脉冲下降沿有效。
 */
const d1000_set_pls_outmode = (axis, pls_outmode) => {
  return dmc1380.d1000_set_pls_outmode(axis, pls_outmode)
}

/**
 * 连续运动函数
 * 以梯形速度曲线控制指定轴至运行速度，并以运行速度连续运行。
 * @param {*} axis
 * @param {*} StrVel
 * @param {*} MaxVel
 * @param {*} Tacc
 */
const d1000_start_tv_move = (axis, StrVel, MaxVel, Tacc) => {
  return dmc1380.d1000_start_tv_move(axis, StrVel, MaxVel, Tacc)
}

/**
 * 读取指定轴当前脉冲输出速度。
 * @param {*} axis 轴号，范围 0～(n×3-1) ，n 为卡数。
 * @return 指定轴当前的运动速度，单位：pps。
 */
const d1000_get_speed = (axis) => {
  return dmc1380.d1000_get_speed(axis)
}

/**
 * 改变指定轴当前脉冲输出速度。
 * @param {*} axis 轴号，范围 0～(n×3-1) ，n 为卡数；
 * @param {*} NewVel 新设置的速度，单位：pps，取值范围：1~409550。
 */
const d1000_change_speed = (axis, NewVel) => {
  return dmc1380.d1000_change_speed(axis, NewVel)
}

/**
 * 减速停止指定轴脉冲输出。
 * @param {*} axis 轴号，范围 0～(n×3-1) ，n 为卡数。
 */
const d1000_decel_stop = (axis) => {
  return dmc1380.d1000_decel_stop(axis)
}

/**
 * 急停指定轴脉冲输出。
 * @param {*} axis 轴号，范围 0～(n×3-1) ，n 为卡数。
 */
const d1000_immediate_stop = (axis) => {
  return dmc1380.d1000_immediate_stop(axis)
}

/**
 * 以梯形速度曲线控制指定轴至运行速度，并以相对坐标运行一段指定距离。
 * @param {*} axis 范围 0～(n×3-1) ，n 为卡数。多卡运行时，轴号参考表 2-1 多卡运行时轴号对照表 ，以下其他函数中相同；
 * @param {*} Dist 相对运动距离，单位：pulse，其值的正负表示运动方向；
 * @param {*} StrVel 初始速度，单位：pps；
 * @param {*} MaxVel 运行速度，单位：pps；
 * @param {*} Tacc 加速时间，单位：s；
 */
const d1000_start_t_move = (axis, Dist, StrVel, MaxVel, Tacc) => {
  return dmc1380.d1000_start_t_move(axis, Dist, StrVel, MaxVel, Tacc)
}

/**
 * 以梯形速度曲线控制指定轴至运行速度，并以绝对坐标运行一段指定距离。
 * @param {*} axis 轴号，范围 0～(n×3-1) ，n 为卡数；
 * @param {*} Pos 绝对运动位置，单位：pulse；
 * @param {*} StrVel 初始速度，单位：pps；
 * @param {*} MaxVel 运行速度，单位：pps；
 * @param {*} Tacc 加速时间，单位：s。
 */
const d1000_start_ta_move = (axis, Pos, StrVel, MaxVel, Tacc) => {
  return dmc1380.d1000_start_t_move(axis, Pos, StrVel, MaxVel, Tacc)
}

/**
 * 直线插补函数
 * 启动多轴相对坐标的直线插补。
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

/**
 * 直线插补函数
 * 启动多轴相对坐标的直线插补。
 * @param {*} TotalAxis  插补轴数，范围 2～3 轴；
 * @param {*} PosArray 轴号列表；
 * @param {*} DistArray 对应轴号列表各轴的相对坐标的距离列表；
 * @param {*} StrVel 初始速度，单位：pps；
 * @param {*} MaxVel 运行速度，单位：pps；
 * @param {*} Tacc  加速时间，单位：s。
 */
const d1000_start_ta_line = (
  TotalAxis,
  AxisArray,
  PosArray,
  StrVel,
  MaxVel,
  Tacc
) => {
  return dmc1380.d1000_start_t_line(
    TotalAxis,
    new ShortArray(AxisArray),
    new ShortArray(PosArray),
    StrVel,
    MaxVel,
    Tacc
  )
}

/**
 * 回原点函数
 * 启动指定轴进行回原点运动。
 * @param {*} axis 轴号，范围 0～(n×3-1)，n 为卡数；
 * @param {*} StrVel 回原点运动初始速度，单位：pps；
 * @param {*} MaxVel 回原点运动速度，单位：pps，负值表示往负方向找原点，正值表示往正方向找原点；
 * @param {*} Tacc 加速时间，单位：s。
 */
const d1000_home_move = (axis, StrVel, MaxVel, Tacc) => {
  return dmc1380.d1000_home_move(axis, StrVel, MaxVel, Tacc)
}

/**
 * 检测指定轴的运动状态。
 * 0：正在运行；
 * 1：脉冲输出完毕停止；
 * 2：指令停止（如调用了 d1000_decel_stop 函数）；
 * 3：遇限位停止；
 * 4：遇原点停止。
 * @param {*} axis 轴号，范围 0～(n×3-1)，n 为卡数。
 */
const d1000_check_done = (axis) => {
  return dmc1380.d1000_check_done(axis)
}

export default {
  d1000_board_init,
  d1000_board_close,
  d1000_set_pls_outmode,
  d1000_start_tv_move,
  d1000_get_speed,
  d1000_change_speed,
  d1000_decel_stop,
  d1000_immediate_stop,
  d1000_start_t_move,
  d1000_start_ta_move,
  d1000_start_t_line,
  d1000_start_ta_line,
  d1000_home_move,
  d1000_check_done
}
