import moment from 'moment'

// const _canRate = 0.01 // °/圈
const _maxCanNum = 16383 // 一圈为16383刻度
const _canRate = 360.0 / _maxCanNum // °/圈

const _maxQueueLength = 20

const state = {
  direction: true, // true:顺民顺时针
  moveStatus: true,
  speed: 1.0,
  degree: 1.0,
  canNum: 0,
  startNum: 0,
  numRecord: [], // 是个队列
  turns: 0, // 圈数多少
  stopFlag: false,
  runningFlag: false,
  order: { type: '', value: 0 },
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
    // debugger

    return getters.lastNum + state.turns * _maxCanNum // 当前读数+圈数
  },
  deltaNum(state) {
    if (state.numRecord.length < 2) {
      return 0
    }
    return state.numRecord[0].num - state.numRecord[1].num
  },
  deltaT(state) {
    if (state.numRecord.length < 2) {
      return 0
    }
    return state.numRecord[0].time - state.numRecord[1].time
  },
  vNum(state, getters) {
    const rate = getters.deltaNum / getters.deltaT || 0
    const speed = rate * _canRate
    return +speed.toFixed(8)
  },
  avgV(state) {
    // 这里会有超圈错误，因为圈数没有历史状态记录
    // TODO: 重构可以使用一个真实的圈数队列
    if (state.numRecord.length < 10) {
      return 0
    }
    const rate =
      (state.numRecord[0].num - state.numRecord[9].num) /
        (state.numRecord[0].time - state.numRecord[9].time) || 0
    const speed = rate * _canRate
    return +speed.toFixed(8)
  },
  angle(state, getters) {
    // if (state.numRecord.length < 2) {
    //   return 0
    // }
    // const delta =
    //   state.numRecord[0].num - state.numRecord[state.numRecord.length - 1].num
    // debugger
    return +((getters.trueNum - state.startNum) * _canRate).toFixed(8)
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
      last2ndNum === lastNum || // 0值/不变值不跳转
      lastNum === toAdd || // 0值/不变值不跳转
      lastDirection === addDirection // 祖状态相同不跳转
    ) {
    } else {
      if (addDirection !== direction) {
        // 发生变化 比如 90 100 1  =>  10 vs -99
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
    if (state.numRecord.length > _maxQueueLength) {
      state.numRecord.splice(_maxQueueLength, 2)
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
    state.turns = 0
  },
  SET_TASK_ORDER(state, data) {
    state.order = data
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
}

export default {
  state,
  getters,
  mutations,
  actions,
}
