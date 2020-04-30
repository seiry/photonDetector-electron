import api from '../ffi/dmc1380'
import base from './base.class'
class DMC extends base {
  errMsg = {
    error: false,
    originalCode: 0,
    msg: 'none',
  }

  mock = false
  mockNum = 0
  constructor(mock = false) {
    super()
    this.mock = mock
    let re = api.d1000_board_init()

    if (this.mock) {
      return
    }
    // 0表示没有卡

    if (re === 0) {
      // 没有卡....
      // TODO: 没卡

      this.setError(0, '没卡')
      return
    }
    return re
  }
  // d1000_get_axis_status获取的时轴的状态，可以设计一个定时器，来将状态压入整体队列
  timer() {
    const axis = {
      x: 0,
      y: 1,
      z: 2,
      u: 3, // 暂时还不知道 这个u是干啥
    }
    api.d1000_get_axis_status(axis.y)
  }
  close() {
    const re = api.d1000_board_close()
    return re
  }
}

export default DMC
