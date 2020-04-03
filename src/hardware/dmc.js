import api from '../ffi/dmc1380'
import base from './base.class'
class DMC extends base {
  errMsg = {
    error: false,
    originalCode: 0,
    msg: 'none'
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
    if (re === 0) {
      // 没有卡....
      this.setError(0, '没卡')
      return
    }
    return re
  }
  close() {
    const re = api.d1000_board_close()
    return re
  }
}

export default DMC
