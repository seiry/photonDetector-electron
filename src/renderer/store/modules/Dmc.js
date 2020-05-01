import moment from 'moment'
const _maxQueueLength = 20

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
const getters = {
  lastPosition(state) {
    if (state.position.length === 0) {
      return {
        x: 0,
        y: 0,
        z: 0,
      }
    }
    return state.position[0]
  },
}
const mutations = {
  ADD_DMC_POSITION(state, data) {
    state.position.unshift(data)
    if (state.position.length > _maxQueueLength) {
      state.position.splice(_maxQueueLength, 2)
    }
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
