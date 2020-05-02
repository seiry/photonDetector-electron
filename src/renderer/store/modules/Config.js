const state = {
  savePath: '',
  fromPath: '',
  mode: 0,
  num: 6,
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
  SET_MODE(state, payload) {
    state.mode = payload
  },
  SET_NUM(state, payload) {
    state.num = payload
  },
}

const actions = {
  setMode({ commit }, data) {
    commit('SET_MODE', data)
  },
  setNum({ commit }, data) {
    commit('SET_NUM', data)
  },
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
