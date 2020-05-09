/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { dllPath } from './utils'
const ffi = require('ffi-napi')
const ref = require('ref-napi')
const StructType = require('ref-struct-napi')
const ArrayType = require('ref-array-napi')
// const dword = ref.types.ulong

/**
 * AccCode 验收码。SJA1000的帧过滤验收码。对经过屏蔽码过滤为“有关位”进行匹配，全部匹配成功后，此帧可以被接收。否则不接收。详见VCI_InitCAN。
 * AccMask 屏蔽码。SJA1000的帧过滤屏蔽码。对接收的CAN帧ID进行过滤，对应位为0的是“有关位”，对应位为1的是“无关位”。屏蔽码推荐设置为0xFFFFFFFF，即全部接收。
 * Reserved 保留。
 * Filter 滤波方式，允许设置为0-3，详细请参照2.2.3节的滤波模式对照表。
 * Timing0 波特率定时器 0（BTR0）。设置值见下表。
 * Timing1 波特率定时器 1（BTR1）。设置值见下表。
 */
const VCI_INIT_CONFIG = StructType({
  AccCode: 'ulong',
  AccMask: 'ulong',
  Reserved: 'ulong',
  Filter: 'uchar',
  Timing0: 'uchar',
  Timing1: 'uchar',
  Mode: 'uchar',
})
const VCI_BOARD_INFO = StructType({
  hw_Version: 'ushort',
  fw_Version: 'ushort',
  dr_Version: 'ushort',
  in_Version: 'ushort',
  irq_Num: 'ushort',
  can_Num: 'byte',
  str_Serial_Num: 'string',
  str_hw_Type: 'string',
  Reserved: 'ushort',
})
const VCI_CAN_OBJ = StructType({
  ID: 'uint',
  TimeStamp: 'uint',
  TimeFlag: 'byte',
  SendType: 'byte',
  RemoteFlag: 'byte',
  ExternFlag: 'byte',
  DataLen: 'byte',
  Data: ArrayType('byte', 8),
  Reserved: ArrayType('byte', 3),
})
const VCI_CAN_OBJArrayType = ArrayType(VCI_CAN_OBJ)

// console.log(new PVCI_CAN_OBJ({ Data: [7, 0, 0, 1] }))
// console.log(
//   new PVCI_BOARD_INFO({
//     str_Serial_Num: '111222'
//   })
// )
// console.log(new PVCI_INIT_CONFIG({ Mode: '123' }))
const can = new ffi.Library(dllPath('ControlCAN.dll'), {
  // 文档里的dword是有问题的，明显返回值是有符号的...
  VCI_OpenDevice: ['int', ['int', 'int', 'int']],
  VCI_CloseDevice: ['int', ['int', 'int']],
  VCI_InitCAN: ['int', ['int', 'int', 'int', ref.refType(VCI_INIT_CONFIG)]],
  VCI_ReadBoardInfo: ['ulong', ['ulong', 'ulong', ref.refType(VCI_BOARD_INFO)]],
  VCI_GetReceiveNum: ['ulong', ['ulong', 'ulong', 'ulong']],
  VCI_ClearBuffer: ['ulong', ['ulong', 'ulong', 'ulong']],
  VCI_StartCAN: ['int', ['ulong', 'ulong', 'ulong']],
  // VCI_Transmit: ['int', ['int', 'int', 'int', VCI_CAN_OBJArrayType, 'int']],
  VCI_Transmit: ['int', ['int', 'int', 'int', ref.refType(VCI_CAN_OBJ), 'int']],
  VCI_Receive: [
    'int',
    ['int', 'int', 'int', ref.refType(VCI_CAN_OBJ), 'int', 'int'],
  ],
})

/**
 * 此函数用以打开设备。注意一个设备只能打开一次
 * @param {*} DevType 设备类型。对应不同的产品型号详见：适配器设备类型定义。
 * @param {*} DevIndex 设备索引，比如当只有一个USB-CAN适配器时，索引号为0，这时再插入一个USB-CAN适
配器那么后面插入的这个设备索引号就是1，以此类推。
 * @param {*} Reserved 保留参数，通常为 0。
 * 返回值=1，表示操作成功；=0表示操作失败；=-1表示USB-CAN设备不存在或USB掉线
 */
const VCI_OpenDevice = (DevType = 4, DevIndex, Reserved = 0) => {
  const re = can.VCI_OpenDevice(DevType, DevIndex, Reserved)
  return re
}

/**
 * 此函数用以关闭设备。
 * @param {*} DevType 设备类型。对应不同的产品型号详见：适配器设备类型定义。
 * @param {*} DevIndex 设备索引，比如当只有一个USB-CAN适配器时，索引号为0，这时再插入一个USB-CAN适
配器那么后面插入的这个设备索引号就是1，以此类推。
 * 返回值=1，表示操作成功；=0表示操作失败；=-1表示USB-CAN设备不存在或USB掉线
 */
const VCI_CloseDevice = (DevType, DevIndex) => {
  return can.VCI_CloseDevice(DevType, DevIndex)
}

/**
 * 此函数用以初始化指定的CAN通道。有多个CAN通道时，需要多次调用。
 * @param {*} DevType 设备类型。对应不同的产品型号详见：适配器设备类型定义。
 * @param {*} DevIndex 设备索引，比如当只有一个USB-CAN适配器时，索引号为0，这时再插入一个USB-CAN适配器那么后面插入的这个设备索引号就是1，以此类推。
 * @param {*} CANIndex CAN通道索引。第几路 CAN。即对应卡的CAN通道号，CAN1为0，CAN2为
 * @param {*} pInitConfig 初始化参数结构。
 * 返回值=1，表示操作成功；=0表示操作失败；=-1表示USB-CAN设备不存在或USB掉线。
 */
const VCI_InitCAN = (DevType, DevIndex, CANIndex, initConfig) => {
  initConfig = new VCI_INIT_CONFIG(initConfig)
  return can.VCI_InitCAN(DevType, DevIndex, CANIndex, initConfig.ref())
}

/**
 * 此函数用以获取设备信息。
 * @param {*} DevType 设备类型。对应不同的产品型号详见：适配器设备类型定义。
 * @param {*} DevIndex 设备索引，比如当只有一个USB-CAN适配器时，索引号为0，这时再插入一个USB-CAN适配器那么后面插入的这个设备索引号就是1，以此类推。
 * @param {*} pInfo 用来存储设备信息的VCI_BOARD_INFO结构指针。
 * 返回值=1，表示操作成功；=0表示操作失败；=-1表示USB-CAN设备不存在或USB掉线。
 */
const VCI_ReadBoardInfo = (DevType, DevIndex) => {
  let info = new VCI_BOARD_INFO()
  can.VCI_ReadBoardInfo(DevType, DevIndex, info.ref())
  // TODO: judge
  return info
}

/**
 * 此函数用以获取指定CAN通道的接收缓冲区中，接收到但尚未被读取的帧数量。主要用途是配合VCI_Receive使用，即缓冲区有数据，再接收。
 * 实际应用中，用户可以忽略该函数，直接循环调用VCI_Receive，可以节约PC系统资源，提高程序效率。
 * @param {*} DevType 设备类型。对应不同的产品型号详见：适配器设备类型定义。
 * @param {*} DevIndex 设备索引，比如当只有一个USB-CAN适配器时，索引号为0，这时再插入一个USB-CAN适配器那么后面插入的这个设备索引号就是1，以此类推。
 * @param {*} CANIndex CAN通道索引。第几路 CAN。即对应卡的CAN通道号，CAN1为0，CAN2为1
 */
const VCI_GetReceiveNum = (DevType, DevIndex, CANIndex) => {
  return can.VCI_GetReceiveNum(DevType, DevIndex, CANIndex)
}

/**
 * 此函数用以清空指定CAN通道的缓冲区。主要用于需要清除接收缓冲区数据的情况,同时发送缓冲区数据也会一并清除。
 * @param {*} DevType 设备类型。对应不同的产品型号详见：适配器设备类型定义。
 * @param {*} DevIndex 设备索引，比如当只有一个USB-CAN适配器时，索引号为0，这时再插入一个USB-CAN适配器那么后面插入的这个设备索引号就是1，以此类推。
 * @param {*} CANIndex CAN通道索引。第几路 CAN。即对应卡的CAN通道号，CAN1为0，CAN2为1
 */

const VCI_ClearBuffer = (DevType, DevIndex, CANIndex) => {
  return can.VCI_ClearBuffer(DevType, DevIndex, CANIndex)
}

/**
 * 此函数用以启动CAN卡的某一个CAN通道。有多个CAN通道时，需要多次调用。
 * @param {*} DevType 设备类型。对应不同的产品型号详见：适配器设备类型定义。
 * @param {*} DevIndex 设备索引，比如当只有一个USB-CAN适配器时，索引号为0，这时再插入一个USB-CAN适配器那么后面插入的这个设备索引号就是1，以此类推。
 * @param {*} CANIndex CAN通道索引。第几路 CAN。即对应卡的CAN通道号，CAN1为0，CAN2为1
 */

const VCI_StartCAN = (DevType, DevIndex, CANIndex) => {
  return can.VCI_StartCAN(DevType, DevIndex, CANIndex)
}

/**
 * 此函数用以复位 CAN。主要用与 VCI_StartCAN配合使用，无需再初始化，即可恢复CAN卡的正常状态。比如当CAN卡进入总线关闭状态时，可以调用这个函数。
 * @param {*} DevType 设备类型。对应不同的产品型号详见：适配器设备类型定义。
 * @param {*} DevIndex 设备索引，比如当只有一个USB-CAN适配器时，索引号为0，这时再插入一个USB-CAN适配器那么后面插入的这个设备索引号就是1，以此类推。
 * @param {*} CANIndex CAN通道索引。第几路 CAN。即对应卡的CAN通道号，CAN1为0，CAN2为1
 */
const VCI_ResetCAN = (DevType, DevIndex, CANIndex) => {
  return can.VCI_ResetCAN(DevType, DevIndex, CANIndex)
}

/**
 * 发送函数。返回值为实际发送成功的帧数。
 * @param {*} DeviceType 设备类型。对应不同的产品型号详见：适配器设备类型定义。
 * @param {*} DeviceInd 设备索引，比如当只有一个USB-CAN适配器时，索引号为0，这时再插入一个USB-CAN适配器那么后面插入的这个设备索引号就是1，以此类推。
 * @param {*} CANInd CAN通道索引。第几路 CAN。即对应卡的CAN通道号，CAN1为0，CAN2为1
 * @param {*} pSend 要发送的帧结构体 VCI_CAN_OBJ数组的首指针。
 * @param {*} Length 要发送的帧结构体数组的长度（发送的帧数量）。最大为1000,高速收发时推荐值为48。
 * 返回实际发送的帧数，=-1表示USB-CAN设备不存在或USB掉线。
 */
// TODO: 帧是数组，这里需要验证，需不需要引用传值；也需要验证长度可变是否影响传入
// 通过看c#的代码 应该是要引用传的，不过数组貌似就是自动引用？
// c#代码还可以 不用数组....
const VCI_TransmitOrigen = (DeviceType, DeviceInd, CANInd, pSend = []) => {
  // pSend = new PVCI_CAN_OBJ(pSend)
  pSend = pSend.map((e) => new VCI_CAN_OBJ(e))
  console.log('psend', pSend)
  // TODO: 这里老代码中传入的是对象指针而不是数组 可能需要调试
  const SendArray = new VCI_CAN_OBJArrayType(pSend)
  console.log('SendArray', SendArray)
  return can.VCI_Transmit(
    DeviceType,
    DeviceInd,
    CANInd,
    SendArray,
    pSend.Length
  )
}
const VCI_Transmit = (DeviceType, DeviceInd, CANInd, pSend) => {
  // pSend = new PVCI_CAN_OBJ(pSend)
  pSend = new VCI_CAN_OBJ(pSend)
  console.log('psend', pSend)
  // TODO: 这里老代码中传入的是对象指针而不是数组 可能需要调试
  return can.VCI_Transmit(DeviceType, DeviceInd, CANInd, pSend.ref(), 1)
}
/**
 * 接收函数。此函数从指定的设备CAN通道的接收缓冲区中读取数据。
 * @param {*} DevType
 * @param {*} DevIndex
 * @param {*} CANIndex
 * @param {*} pReceive 用来接收的帧结构体VCI_CAN_OBJ数组的首指针
 * @param {*} Len 用来接收的帧结构体数组的长度（本次接收的最大帧数，实际返回值小于等于这个值）。该值为所提供的存储空间大小，适配器中为每个通道设置了2000帧的接收缓存区，用户根据自身系统和工作环境需求，在1到2000之间选取适当的接收数组长度。一般pReceive数组大小与Len都设置大于2000，如：2500为宜，可有效防止数据溢出导致地址冲突。同时每隔30ms调用一次VCI_Receive为宜。（在满足应用的时效性情况下，尽量降低调用VCI_Receive的频率，只要保证内部缓存不溢出，每次读取并处理更多帧，可以提高运行效率。）
 * @param {*} WaitTime 保留
 */
const VCI_Receive = (DevType, DevIndex, CANIndex, Len = 2500, WaitTime = 0) => {
  const nullObj = new VCI_CAN_OBJ()
  const recieveArr = Array(Len).fill(nullObj)
  let pReceive = new VCI_CAN_OBJArrayType(recieveArr, Len)
  const re = can.VCI_Receive(
    DevType,
    DevIndex,
    CANIndex,
    pReceive[0].ref(),
    Len,
    WaitTime
  )
  debugger
  if (re === 0 || re === -1) {
    return 0
  }

  let arr = pReceive.toArray().slice(0, re)
  arr = arr.map((e) => {
    e = e.toObject()
    e.Data = e.Data.toArray().slice(0, e.DataLen)
    delete e.Reserved
    return e
  })

  return arr
}

// debugger
// let i = 1
// while (i++ < 100) {
//   VCI_Receive()
// }
// debugger
export default {
  VCI_OpenDevice,
  VCI_CloseDevice,
  VCI_InitCAN,
  VCI_ReadBoardInfo,
  VCI_GetReceiveNum,
  VCI_ClearBuffer,
  VCI_StartCAN,
  VCI_ResetCAN,
  VCI_Transmit,
  VCI_Receive,
}
