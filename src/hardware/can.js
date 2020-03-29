/* eslint-disable no-unreachable */
import api from '../ffi/can'

class Can {
  errMsg = {
    error: false,
    originalCode: 0,
    msg: 'none'
  }
  devType = 4
  devIndex = 0
  canIndex = 0
  mock = false
  constructor(mock = true) {
    this.mock = mock
    let re = api.VCI_OpenDevice(this.devType, this.devIndex)

    if (re === 1 || this.mock) {
    } else {
      if (re === -1) {
        this.setError(re, 'usb设备不存在')
      } else if (re === 0) {
        this.setError(re, '初始化操作失败')
      } else {
        this.setError(re, '初始化未知错误')
      }
      return
    }

    /**
     * AccCode 验收码。SJA1000的帧过滤验收码。对经过屏蔽码过滤为“有关位”进行匹配，全部匹配成功后，此帧可以被接收。否则不接收。详见VCI_InitCAN。
     * AccMask 屏蔽码。SJA1000的帧过滤屏蔽码。对接收的CAN帧ID进行过滤，对应位为0的是“有关位”，对应位为1的是“无关位”。屏蔽码推荐设置为0xFFFFFFFF，即全部接收。
     * Reserved 保留。
     * Filter 滤波方式，允许设置为0-3，详细请参照2.2.3节的滤波模式对照表。
     * Timing0 波特率定时器 0（BTR0）。设置值见下表。
     * Timing1 波特率定时器 1（BTR1）。设置值见下表。
     * Timing 实际上是通过时钟倍率来调整波特率
     */
    const config = {
      // TODO: 这个掩码设置方式 应该是我全都要吧
      AccCode: 0x00000000,
      AccMask: 0xffffffff,
      Reserved: 0,
      Filter: 2,
      Timing0: 0x00,
      Timing1: 0x1c,
      Mode: 0
    }
    // TODO: canindex?
    re = api.VCI_InitCAN(this.devType, this.devIndex, this.canIndex, config)

    if (re === 1 || this.mock) {
    } else {
      if (re === -1) {
        this.setError(re, 'usb设备不存在')
      } else if (re === 0) {
        this.setError(re, '初始化操作失败')
      } else {
        this.setError(re, '初始化未知错误')
      }
    }

    re = api.VCI_ClearBuffer(this.devType, this.devIndex, this.canIndex)

    if (re === 1 || this.mock) {
    } else {
      if (re === -1) {
        this.setError(re, 'usb设备不存在')
      } else if (re === 0) {
        this.setError(re, '缓冲区清理失败')
      } else {
        this.setError(re, '缓冲区未知错误')
      }
    }

    re = api.VCI_StartCAN(this.devType, this.devIndex, this.canIndex)

    if (re === 1 || this.mock) {
    } else {
      if (re === -1) {
        this.setError(re, 'usb设备不存在')
      } else if (re === 0) {
        this.setError(re, '连接编码器失败')
      } else {
        this.setError(re, '连接编码器出现未知错误')
      }
    }
  }
  /**
   * 读取函数要考虑是不是要异步 这样可以超时
   * 而且可以考虑用回报模式？
   */
  ReadNum() {
    const data = {
      id: 0,
      TimeStamp: 0, // 这个东西 是不是发出是没有的
      TimeFlag: 0x1,
      SendType: 1,
      RemoteFlag: 0,
      ExternFlag: 0,
      DataLen: 4,
      Data: [0x4, 0x2, 0x1, 0x0]
      // Reserved: [0, 0, 0]
    }
    let re = api.VCI_Transmit(this.devType, this.devIndex, this.canIndex, [
      data
    ])

    if (re >= 1 || this.mock) {
      if (re === 1) {
      } else {
        // emmmm 会不会发多了？
      }
    } else {
      if (re === -1) {
        this.setError(re, 'usb设备不存在')
      } else if (re === 0) {
        this.setError(re, '连接编码器失败')
      } else {
        this.setError(re, '连接编码器出现未知错误')
      }
    }
  }

  setError(errorCode, msg) {
    if (errorCode === false) {
      this.errMsg = {
        error: false,
        originalCode: 0,
        msg: 'none'
      }
      return
    }
    this.errMsg = {
      error: true,
      originalCode: errorCode,
      msg: msg
    }
  }

  get error() {
    if (this.errMsg.error === true) {
      return true
    } else {
      return false
    }
    if (this.mock) {
      return false
    }
  }
  get humenErrorMsg() {
    if (this.errMsg.error === false) {
      return ' 嘻嘻，一切正常'
    }
    return ` ${this.errMsg.msg}, code: ${this.errMsg.originalCode}`
  }
}
export default Can
