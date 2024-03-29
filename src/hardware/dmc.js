import api from '../ffi/dmc1380'
import base from './base.class'

const Axis = {
  x: 0,
  y: 1,
  z: 2,
  u: 3, // 暂时还不知道 这个u是干啥
}
class DMC extends base {
  errMsg = {
    error: false,
    originalCode: 0,
    msg: 'none',
  }
  speedX = 2
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
  // dmc类里，只关心dmc的状态和负责输出，公共状态推到队列里，进行判断，可以和can公用一个vuex队列
  getStatus() {
    api.d1000_get_axis_status(Axis.x)
    api.d1000_get_axis_status(Axis.y)
    api.d1000_get_axis_status(Axis.z)
  }
  getPosition() {
    if (this.mock) {
      this.mockNum += parseInt(Math.random() * 20 + 20)
      return [this.mockNum, this.mockNum, this.mockNum, this.mockNum]
    }
    let re = []
    for (const e of Object.values(Axis)) {
      const read = api.d1000_get_command_pos(e)
      if (read) {
        // TODO: 数据有效性判断？
      }
      re.push(read)
    }
    return re
  }
  stopAll() {
    for (const e of Object.values(Axis)) {
      this.stopAxis(e)
    }
  }
  stopAxis(axis, immediate = false) {
    if (immediate) {
      api.d1000_immediate_stop(axis)
    } else {
      api.d1000_decel_stop(axis)
    }
  }
  stopX(immediate = false) {
    if (immediate) {
      api.d1000_immediate_stop(Axis.x)
    } else {
      api.d1000_decel_stop(Axis.x)
    }
  }
  /**
   * 设定速度倍数，1为标准
   * @param {*} x
   */
  setSpeedX(x) {
    this.speedX = +x
  }
  /**
   *
   * @param {*} direction 1为逆时针，即扫描时的操作，-1为顺时针
   */
  move(direction = 1) {
    const startV = 500
    const maxV = -1000 * direction * this.speedX
    const accTime = 0.1
    api.d1000_start_tv_move(Axis.x, startV, maxV, accTime)
    // Dmc1380.d1000_start_tv_move(nAxis, 200, 1000, 0.05); 这个是顺时针
  }
  isRunning() {
    if (this.mock) {
      if (Math.random() > 0.5) {
        return true
      } else {
        return false
      }
    }
    const re = api.d1000_check_done(Axis.x)
    if (re === 0) {
      return true
    } else {
      return false
    }
  }
  close() {
    const re = api.d1000_board_close()
    return re
  }
}

export default DMC
