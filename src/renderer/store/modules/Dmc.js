import moment from 'moment'

const state = {
  position: [],
}
/* 
[{
  x: 42,
  y: 42,
  z: 42,
  time: 999,
}] 
*/
const getters = {}
const mutations = {
  ADD_DMC_POSITION(state, data) {
    state.position.unshift(data)
  },
}

const actions = {
  addDmcNum({ commit }, data) {
    commit('ADD_DMC_POSITION', {
      ...data,
      time: +moment().format('x'),
    })
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
