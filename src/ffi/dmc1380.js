/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { dllPath } from './utils'
const ffi = require('ffi-napi')
const ArrayType = require('ref-array-napi')
const ShortArray = ArrayType('short')
const dmc1380 = new ffi.Library(dllPath('Dmc1380.dll'), {
  d1000_board_init: ['int', []],
  d1000_board_close: ['int', []],
  d1000_set_pls_outmode: ['int', ['short', 'short']],
  d1000_start_tv_move: ['int', ['short', 'long', 'long', 'double']],
  d1000_get_speed: ['int', ['short']],
  d1000_change_speed: ['int', ['short', 'long']],
  d1000_decel_stop: ['int', ['short']],
  d1000_immediate_stop: ['int', ['short']],
  d1000_start_t_move: ['int', ['short', 'long', 'long', 'double']],
  d1000_start_ta_move: ['int', ['short', 'long', 'long', 'double']],
  d1000_start_t_line: [
    'int',
    ['short', ShortArray, ShortArray, 'long', 'long', 'double']
  ],
  d1000_start_ta_line: [
    'int',
    ['short', ShortArray, ShortArray, 'long', 'long', 'double']
  ],
  d1000_home_move: ['int', ['short', 'long', 'long', 'double']],
  d1000_check_done: ['int', ['short']],
  d1000_get_command_pos: ['int', ['short']],
  d1000_set_command_pos: ['int', ['short', 'double']],
  d1000_out_bit: ['int', ['short', 'short']],
  d1000_in_bit: ['ulintong', ['short']],
  d1000_get_outbit: ['int', ['short']],
  d1000_in_enable: ['void', ['ulong', 'ulong']], // void?
  d1000_set_sd: ['int', ['short', 'short']],
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
 * "a" aka "absolute"
 * @param {*} axis 轴号，范围 0～(n×3-1) ，n 为卡数；
 * @param {*} Pos 绝对运动位置，单位：pulse；
 * @param {*} StrVel 初始速度，单位：pps；
 * @param {*} MaxVel 运行速度，单位：pps；
 * @param {*} Tacc 加速时间，单位：s。
 */
const d1000_start_ta_move = (axis, Pos, StrVel, MaxVel, Tacc) => {
  return dmc1380.d1000_start_ta_move(axis, Pos, StrVel, MaxVel, Tacc)
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
  return dmc1380.d1000_start_ta_line(
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

/**
 * 读取指令位置计数器计数值。
 * @param {*} axis 轴号，范围 0～(n×3-1)，n 为卡数。
 */
const d1000_get_command_pos = (axis) => {
  return dmc1380.d1000_get_command_pos(axis)
}

/**
 * 设置指令位置计数器计数值。
 * @param {*} axis 轴号，范围 0～(n×3-1)，n 为卡数。
 * @param {*} Pos 设置指令位置计数器值，单位：Pulse。
 */
const d1000_set_command_pos = (axis, Pos) => {
  return dmc1380.d1000_set_command_pos(axis, Pos)
}

/**
 * 输出通用输出信号。
 * @param {*} BitNo 表示要输出的通用输出口的位号，多卡运行时范围参考表 8-5；
 * @param {*} BitData 输出信号：0 - 表示低电平；1 - 表示高电平。
 */
const d1000_out_bit = (BitNo, BitData) => {
  return dmc1380.d1000_out_bit(BitNo, BitData)
}

/**
 * 读取通用输入信号状态。
 * @param {*} BitNo ：表示要读取的通用输入口的位号，多卡运行时范围参考表 8-5；
 */
const d1000_in_bit = (BitNo) => {
  return dmc1380.d1000_in_bit(BitNo)
}

/**
 * 读取通用输出信号状态。
 * @param {*} BitNo ：表示要读取的通用输入口的位号，多卡运行时范围参考表 8-5；
 */
const d1000_get_outbit = (BitNo) => {
  return dmc1380.d1000_get_outbit(BitNo)
}

/**
 * 专用输入口使能。
 * @param {*} CardNo 卡号。
 * @param {*} InputEn 专用信号输入口使能，需要将各信号按照二进制的位取值，然后转化为十进制, 具体使用方法参照 4.2.8 专用 IO 口函数所提供的简单例程。其位号与信号的关系如表 8-6 所示。
 */
const d1000_in_enable = (CardNo, InputEn) => {
  return dmc1380.d1000_in_enable(CardNo, InputEn)
}

/**
 * 设置减速信号是否使能。

 * @param {*} axis 轴号，范围 0～(n×3-1)， n 为卡数；
 * @param {*} SdMode  减速使能模式，0：SD 信号无效；1：SD 信号有效；
 */
const d1000_set_sd = (axis, SdMode) => {
  return dmc1380.d1000_set_sd(axis, SdMode)
}
/**
 * 读取指定轴的专用接口信号状态，包括 EL+、EL-、STP、STA、SD+、SD-等信号状态。
 * @param {*} axis 轴号，范围 0～(n×3-1)， n 为卡数。 返回值：指定轴专用信号
 */
const d1000_get_axis_status = (axis) => {
  return dmc1380.d1000_get_axis_status(axis)
}
export default {
  d1000_board_init,
  d1000_board_close,
  d1000_set_pls_outmode,
  d1000_start_tv_move,
  d1000_get_speed,
  d1000_change_speed,
  d1000_immediate_stop,
  d1000_decel_stop,
  d1000_start_t_move,
  d1000_start_ta_move,
  d1000_start_t_line,
  d1000_start_ta_line,
  d1000_home_move,
  d1000_check_done,
  d1000_get_command_pos,
  d1000_set_command_pos,
  d1000_out_bit,
  d1000_in_bit,
  d1000_get_outbit,
  d1000_in_enable,
  d1000_set_sd,
  d1000_get_axis_status
}
