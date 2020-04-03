/* eslint-disable no-unreachable */
class HardwareBase {
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
export default HardwareBase
