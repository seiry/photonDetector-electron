import moment from 'moment'
const _canRate = 0.01 // °/圈
const state = {
  direction: true, // true:顺民顺时针
  moveStatus: true,
  speed: 1.0,
  degree: 1.0,
  canNum: 0,
  numRecord: [], // 是个队列 TODO: 队列长度是不是要维护?
  stopFlag: false
}

const getters = {
  lastNum(state) {
    if (state.numRecord.length === 0) {
      return 0
    }
    return state.numRecord[0].num
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
    if (state.numRecord.length < 10) {
      return 0
    }
    const rate =
      (state.numRecord[0].num - state.numRecord[9].num) /
        (state.numRecord[0].time - state.numRecord[9].time) || 0
    const speed = rate * _canRate
    return +speed.toFixed(8)
  },
  angle(state) {
    if (state.numRecord.length < 2) {
      return 0
    }
    const delta =
      state.numRecord[0].num - state.numRecord[state.numRecord.length - 1].num
    return +(delta * _canRate).toFixed(8)
  }
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
  ADD_CAN_NUM(state, data) {
    state.numRecord.unshift(data)
  },
  STOPFLAG_ON(state) {
    state.stopFlag = true
  },
  STOPFLAG_OFF(state) {
    state.stopFlag = false
  },
  CLEAR_NUM_RECORD(state) {
    state.numRecord = []
  }
}

const actions = {
  setLoading({ commit }, data) {
    // TODO: add lock may
    if (data) {
      setTimeout(() => {
        commit('HIDE_LOADING')
      }, 1e3)
      commit('SHOW_LOADING')
    } else {
      commit('HIDE_LOADING')
    }
  },
  setCanNum({ commit }, data) {
    commit('SET_CAN_NUM', data)
  },
  addCanNum({ commit }, data) {
    commit('ADD_CAN_NUM', {
      num: data || 0,
      time: +moment().format('x')
    })
  },
  setStopFlag({ commit }, data) {
    if (data) {
      commit('STOPFLAG_ON')
    } else {
      commit('STOPFLAG_OFF')
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
