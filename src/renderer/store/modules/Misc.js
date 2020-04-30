const state = {
  loading: false,
}

const mutations = {
  SHOW_LOADING(state) {
    state.loading = true
  },
  HIDE_LOADING(state) {
    state.loading = false
  },
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
}

export default {
  state,
  mutations,
  actions,
}
