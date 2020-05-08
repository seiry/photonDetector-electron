/* eslint-disable no-unreachable */
import api from '../ffi/can'
import base from './base.class'
const _maxCanNum = 16383

class Can extends base {
  errMsg = {
    error: false,
    originalCode: 0,
    msg: 'none',
  }

  devType = 4 // usbcan2
  devIndex = 0
  canIndex = 0

  mock = false
  mockNum = 0
  constructor(mock = false) {
    super()
    this.mock = mock
    let re = api.VCI_OpenDevice(this.devType, this.devIndex)

    if (this.mock) {
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
     * Timing 实际上是通过时钟倍率来调整波特率
     */
    const config = {
      // 这个掩码设置方式 应该是我全都要吧
      AccCode: 0x00000000,
      AccMask: 0xffffffff,
      Reserved: 0,
      Filter: 2, // 标准帧
      // Filter: 1, // 所有帧 老代码上是这也的
      Timing0: 0x00,
      Timing1: 0x1c,
      Mode: 0,
    }
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
      return
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
      return
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
   * @returns -1为错误 0为超时（无数据，考虑增大retry） 正数为十进制数据
   */
  readNum() {
    if (this.mock) {
      this.mockNum += Math.round(Math.random() * 10)
      if (this.mockNum > _maxCanNum) {
        this.mockNum -= _maxCanNum
      }
      return this.mockNum
    }
    const data = {
      // ID: 0,
      ID: 0x00000002, // 这个是老代码里的
      TimeStamp: 0, // 这个东西 是不是发出是没有的
      TimeFlag: 0x1,
      SendType: 1,
      RemoteFlag: 0,
      ExternFlag: 0,
      DataLen: 4,
      // DataLen: 5,//老代码里是5？？
      Data: [0x4, 0x2, 0x1, 0x0],
      // Reserved: [0, 0, 0]
    }
    let re = api.VCI_Transmit(this.devType, this.devIndex, this.canIndex, [
      data,
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

      return -1
    }

    let retry = 0
    re = 0

    do {
      re = api.VCI_Receive(this.devType, this.devIndex, this.canIndex, 5)
      retry++
    } while (re === 0 && retry < 10)

    // api.VCI_ClearBuffer(this.devType, this.devIndex, this.canIndex) //TODO: 读完销毁？

    if (re === -1) {
      this.setError(re, 'usb设备不存在')
      return -1
    }

    if (!Array.isArray(re)) {
      this.setError(re, '读取数据出现位置错误，返回值非数组')
      return -1
    }

    if (re.length === 0) {
      this.setError(0, '未获取到数据')
      return 0
    }

    let num = 0
    for (let d of re) {
      d = d.Data
      if (d.length === 0) {
        this.setError(-2, '得到can数据包，但是返回data为空')
        continue
      }
      // expect d `[0x05][0x02][0x01][0x34][0x12]`
      //           [ength][from][code][data2][data1]  => 0x[data1][data2] 更多位数以此类推
      //                           [dataLow][dataHigh]   aka  result = (data1 << 8) + data2
      const length = d[0]
      const id = d[1]
      const command = d[2]
      const recieve = d.slice(3, length) // expect recieve.length === 2
      // TODO: data内的类型是byte，可能需要转换？
      if (id !== 0x2) {
        // id不匹配
      }
      if (command !== 0x1) {
        this.setError(-3, '命令不匹配')
        continue
      }
      for (let i = 0; i < recieve.length; i++) {
        num += recieve[i] << (i * 8)
      }
      // num = (recieve[1] << 8) + recieve[0]
      if (num === 0) {
        // 空值继续往后读？
      }
      this.setError(false)
      break
    }

    if (this.errMsg.error) {
      if (this.errMsg.originalCode === -2) {
        return 0
      }
      return -1
    }

    return num
  }
}
export default Can
