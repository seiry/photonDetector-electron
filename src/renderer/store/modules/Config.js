const state = {
  savePath: '',
  fromPath: ''
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
  }
}

const actions = {
  saveConfig({ commit }, data) {
    commit('UPDATE_CONFIG', data)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
