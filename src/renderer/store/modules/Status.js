const state = {
  direction: true, // true:顺民顺时针
  moveStatus: true,
  speed: 1.0,
  degree: 1.0,
  canNum: 0,
  stopFlag: false
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
  STOP(state) {
    state.stopFlag = true
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
  setStopFlag({ state }, data) {
    if (data) {
      state.stopFlag = true
    } else {
      state.stopFlag = false
    }
  }
}

export default {
  state,
  mutations,
  actions
}
