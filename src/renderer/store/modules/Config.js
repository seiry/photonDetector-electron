const state = {
  savePath: '',
  fromPath: '',
  dmc: {
    slowDown: true, // SD,减速使能
  },
}

const getters = {}
const mutations = {
  UPDATE_CONFIG(state, payload) {
    const stateKeys = Object.keys(state) || []
    for (const key of Object.keys(payload)) {
      if (payload[key] === null || !stateKeys.includes(key)) {
        continue
      }
      state[key] = payload[key]
    }
  },
  UPDATE_SLOW_DOWN(state, payload) {
    state.dmc.slowDown = payload
  },
}

const actions = {
  saveConfig({ commit }, data) {
    commit('UPDATE_CONFIG', data)
  },
  updateSlowDown({ commit }, data) {
    commit('UPDATE_SLOW_DOWN', data)
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
