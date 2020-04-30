/* eslint-disable no-unused-vars */
const { plot, Plot } = require('nodeplotlib')
const loadsh = require('lodash')
class EmulatorTurntable {
  constructor(r = 1, angle = 0) {
    this.r = r
    this.angle = angle // 弧度
  }
  get length() {
    return this.r * this.angle
  }
}

class EmulatorMotor {
  constructor(turntable, errorRate = 0.01) {
    this.target = turntable
    this.errorRate = errorRate
  }
  move(length) {
    const error = length * this.errorRate * loadsh.random(-1, 1, true)
    length += error
    // this.target.length += length
    // this.target.angle += length / Math.PI
    this.target.angle += length / this.target.r
  }
}
class EmulatorInspector {
  constructor(turntable) {
    this.target = turntable
    this.lastPoint = 0
    this.thisPoint = 0
  }
  get deltaLength() {
    this.lastPoint = this.thisPoint
    this.thisPoint = this.target.length
    return this.thisPoint - this.lastPoint
  }
}

class PID {
  constructor(from, to, kp = 1, ki = 0, kd = 0) {
    this.from = from
    this.to = to
    this.kp = kp
    this.ki = ki
    this.kd = kd
    this.points = []

    this.points.push(from)
  }
  update(now = loadsh.last(this.points)) {
    this.points.push(now)
    const add = this.calcu() // 如果这里超过了最大的步进 那么只能最大步进
    return add
    // if (add > 0.1) {
    //   return 0.1
    // } else {
    //   return add
    // }
  }
  calcu() {
    const length = this.points.length
    const now = this.points[length - 1]
    const last = this.points[length - 2]
    const error = this.to - now
    const delta = now - last
    const sum = this.points.map((e) => this.to - e).reduce((p, c) => p + c)
    return this.kp * (error + sum * this.ki + delta * this.kd)
  }
}

const turnable = new EmulatorTurntable()
const motor = new EmulatorMotor(turnable, 0.1)
const inspector = new EmulatorInspector(turnable)
const targetLength = 1
let realLength = 0
const pid = new PID(0, targetLength, 1.8, 0.2, 0.2) // 从0转到1
let data = { x: [], y: [], type: 'line' }

while (Math.abs((targetLength - realLength) / targetLength) > 0.005) {
  data.x.push(data.x.length + 1)
  data.y.push(realLength)
  const addLength = pid.update(realLength)
  motor.move(addLength)
  realLength += inspector.deltaLength
}
data.x.push(data.x.length + 1)
data.y.push(realLength)
const ps = [
  data,
  {
    x: data.x,
    y: [...data.y].fill(1),
  },
]
plot(ps)
// console.log(turnable)
// console.log(inspector.dLength)
