/* eslint-disable no-unreachable */
import api from '../ffi/can'

class Can {
  errMsg = {
    error: false,
    originalCode: 0,
    msg: 'none'
  }
  mock = false
  constructor(mock = true) {
    this.mock = mock
    const re = api.VCI_OpenDevice(4, 0, 0)
    if (this.mock) {
      this.setError(false)
      return
    }

    if (re === 1) {
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
     */
    const config = {
      AccCode: 'ulong',
      AccMask: 'ulong',
      Reserved: 'ulong',
      Filter: 'uchar',
      Timing0: 'uchar',
      Timing1: 'uchar',
      Mode: 'uchar'
    }
    // TODO: canindex?
    api.VCI_InitCAN(4, 0, 0, config)
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
