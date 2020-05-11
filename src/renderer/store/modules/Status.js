import moment from 'moment'

// const _canRate = 0.01 // °/圈
const _maxCanNum = 16383 // 一圈为16383刻度
const _canRate = 360.0 / _maxCanNum // °/圈

const _maxQueueLength = 20
const _debounce = 3

const state = {
  direction: true, // true:顺民顺时针
  moveStatus: true,
  speed: 1.0,
  degree: 1.0,
  canNum: 0,
  startNum: 0,
  numRecord: [], // 是个队列
  realNums: [], // 真实读数队列 可据此派生真实读数和速度
  turns: 0, // 圈数多少
  stopFlag: false,
  runningFlag: false,
  order: { type: '', value: 0 },
  targetAngle: 1,
  moveLog: [],
}

const getters = {
  lastNum(state) {
    if (state.numRecord.length === 0) {
      return 0
    }
    return state.numRecord[0].num
  },
  last2ndNum(state) {
    if (state.numRecord.length < 2) {
      return 0
    }
    return state.numRecord[1].num
  },
  last3ndNum(state) {
    if (state.numRecord.length < 3) {
      return 0
    }
    return state.numRecord[2].num
  },
  trueNum(state, getters) {
    if (state.realNums.length === 0) {
      return 0
    }
    return state.realNums[0].num
  },
  deltaNum(state) {
    // refact to real
    if (state.realNums.length < 2) {
      return 0
    }
    return state.realNums[0].num - state.realNums[1].num
  },
  deltaT(state) {
    if (state.realNums.length < 2) {
      return 0
    }
    return state.realNums[0].time - state.realNums[1].time
  },
  vNum(state, getters) {
    if (state.realNums.length < 2) {
      return 0
    }
    const deltaN = state.realNums[0].num - state.realNums[1].num
    const deltaT = state.realNums[0].time - state.realNums[1].time || 1e3
    const deltaAngle = +((7560.0 * deltaN) / (_maxCanNum * 92))
    const speed = deltaAngle / deltaT
    return +speed.toFixed(8) // °/ms
  },
  vNumCan(state, getters) {
    const rate = getters.deltaNum / getters.deltaT || 0
    const speed = rate * _canRate
    return +speed.toFixed(8)
  },
  avgV(state) {
    // 这里会有超圈错误，因为圈数没有历史状态记录
    if (state.realNums.length < 10) {
      return 0
    }
    const deltaN = state.realNums[0].num - state.realNums[9].num
    const deltaT = state.realNums[0].time - state.realNums[9].time || 1e3
    const deltaAngle = +((7560.0 * deltaN) / (_maxCanNum * 92))
    const speed = deltaAngle / deltaT
    return +speed.toFixed(8) // °/ms
  },
  avgCanV(state) {
    // 这里会有超圈错误，因为圈数没有历史状态记录
    if (state.realNums.length < 10) {
      return 0
    }
    const rate =
      (state.realNums[0].num - state.realNums[9].num) /
        (state.realNums[0].time - state.realNums[9].time) || 0
    const speed = rate * _canRate // 小轮的转速
    return +speed.toFixed(8) // °/ms
  },
  angle(state, getters) {
    // if (state.numRecord.length < 2) {
    //   return 0
    // }
    // const delta =
    //   state.numRecord[0].num - state.numRecord[state.numRecord.length - 1].num
    // debugger
    return +((7560.0 * getters.trueNum) / (_maxCanNum * 92)).toFixed(8)
    // TODO: 这俩幻数啥意思得问下师兄
  },
  angleOfCan(state, getters) {
    // 小轮
    return +(getters.trueNum * _canRate).toFixed(8)
  },
}
const mutations = {
  SHOW_LOADING(state) {
    state.loading = true
  },
  HIDE_LOADING(state) {
    state.loading = false
  },
  SET_CAN_NUM(state, num) {
    state.canNum = num
  },
  ADD_CAN_NUM(state, { data, getters }) {
    // TODO:可以全局配置化
    const toAdd = data.num

    if (state.canNum.length === 0) {
      state.startNum = toAdd
    }
    // 突然变大或变小意味着超圈
    const lastNum = getters.lastNum
    const last2ndNum = getters.last2ndNum
    const last3ndNum = getters.last3ndNum
    const lastDirection = last2ndNum - last3ndNum > 0 // 再向前一组的方向
    const direction = lastNum - last2ndNum > 0 // 当前的方向
    const addDirection = toAdd - lastNum > 0 // 新添加的数据的方向
    if (
      Math.abs(last2ndNum - lastNum) < _debounce || // 0值/不变值不跳转
      Math.abs(lastNum - toAdd) < _debounce || // 0值/不变值不跳转
      lastDirection === addDirection // 祖状态相同不跳转
    ) {
    } else {
      if (addDirection !== direction) {
        // 发生变化 比如 90 100 1  =>  10 vs -99
        // TODO: 超圈的数字需要进行持久化配置
        if (addDirection === false) {
          // 小于0 就是正超圈
          state.turns += 1
        } else {
          // 负超圈
          state.turns -= 1
        }
      }
    }

    state.numRecord.unshift(data)
    const realNum = data.num + state.turns * _maxCanNum // 当前读数+圈数
    state.realNums.unshift({
      ...data,
      num: realNum,
    })
    if (state.numRecord.length > _maxQueueLength) {
      state.numRecord.splice(_maxQueueLength, 2)
    }
    if (state.realNums.length > _maxQueueLength) {
      state.realNums.splice(_maxQueueLength, 2)
    }
  },
  STOPFLAG_ON(state) {
    state.stopFlag = true
  },
  STOPFLAG_OFF(state) {
    state.stopFlag = false
  },
  CLEAR_NUM_RECORD(state) {
    state.numRecord = []
  },
  START_RUNNING(state) {
    state.runningFlag = true
  },
  STOP_RUNNING(state) {
    state.runningFlag = false
  },
  CLEAR_CAN_NUM(state) {
    state.numRecord = []
    // state.turns = 0
  },
  SET_TASK_ORDER(state, data) {
    state.order = data
  },
  SET_TARGET_ANGLE(state, data) {
    state.targetAngle = data
  },
  CLEAR_TURN(state) {
    state.turns = 0
  },
  ADD_MOVE_LOG(state, data) {
    state.moveLog.push(data)
  },
  CLEAR_MOVE_LOG(state) {
    state.moveLog = []
  },
}

const actions = {
  setLoading({ commit }, data) {
    // TODO: add lock may
    if (data) {
      let _timeout = 1e3
      if (typeof data === 'number') {
        _timeout = data
      }
      setTimeout(() => {
        commit('HIDE_LOADING')
      }, _timeout)
      commit('SHOW_LOADING')
    } else {
      commit('HIDE_LOADING')
    }
  },
  clearCanNum({ commit }) {
    commit('CLEAR_CAN_NUM')
  },
  setCanNum({ commit }, data) {
    commit('SET_CAN_NUM', data)
  },
  addCanNum({ commit, getters }, data) {
    commit('ADD_CAN_NUM', {
      data: {
        num: data || 0,
        time: +moment().format('x'),
      },
      getters,
    })
  },
  setStopFlag({ commit }, data) {
    if (data) {
      commit('STOPFLAG_ON')
    } else {
      commit('STOPFLAG_OFF')
    }
  },
  startRunningFlag({ commit }) {
    commit('START_RUNNING')
  },
  stopRunningFlag({ commit }) {
    commit('STOP_RUNNING')
  },
  setCurrentTask({ commit }, data) {
    commit('SET_TASK_ORDER', data)
  },
  setTargetAngle({ commit }, data) {
    commit('SET_TARGET_ANGLE', data)
  },
  clearTurn({ commit }) {
    commit('CLEAR_TURN')
  },
  addMoveLog({ commit }, data) {
    commit('ADD_MOVE_LOG', data)
  },
  clearMoveLog({ commit }) {
    commit('CLEAR_MOVE_LOG')
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
