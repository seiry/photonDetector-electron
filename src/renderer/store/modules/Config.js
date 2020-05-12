const state = {
  savePath: '',
  fromPath: '',
  mode: 1,
  num: 6,
  singleTime: 0.5,
  width: 20,
  beta: 4,
  mockMode: true,
  dmc: {
    slowDown: true, // SD,减速使能
  },
}

const getters = {
  sigma(state, getters) {
    /**
     * σ =
     */
    // 180 / NAll 每个传感器的度数
    // a = 12 单个传感器的晶体纤维数量
    const a = 12
    return 180 / getters.NAll / a
  },
  NAll(state) {
    /**
     * 给定直径，组成满环 需要多少个传感器
     * NAll = pi * D / 2b
     * b = 2.6
     */
    const b = 2.6
    return Math.round((Math.PI * state.width) / (b * 2))
  },
  deltaTheta(state, getters) {
    return getters.sigma * state.beta
  },
  L1(state, getters) {
    /**
     * 采集的位置数量
     * NAll / num  需要旋转弥补的比例
     * NAll / num - 1 需要旋转的次数 (完全不重叠的情况(不考虑β))
     * (NAll / num - 1) * (180 / NAll) 需要补足的角度
     * ((NAll / num - 1) * (180 / NAll)) / deltaTheta 需要补足的次数
     * + 1 本身初始位置的一次
     */
    const addNum = getters.NAll / state.num - 1
    const sigleDegree = 180 / getters.NAll
    return Math.round((addNum * sigleDegree) / getters.deltaTheta + 1)
  },
  phiHigh(state, getters) {
    /**
     * φhigh 最大旋转角
     */
    const addNum = getters.NAll / state.num - 1
    const sigleDegree = 180 / getters.NAll
    return addNum * sigleDegree
  },
}
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
  SET_MOCK(state, payload) {
    state.mockMode = payload
  },
  SET_NUM(state, payload) {
    state.num = payload
  },
  SET_SINGLETIME(state, payload) {
    state.singleTime = payload
  },
  SET_WIDTH(state, payload) {
    state.width = payload
  },
  SET_BETA(state, payload) {
    state.beta = payload
  },
}

const actions = {
  setMode({ commit }, data) {
    commit('SET_MODE', data)
  },
  setMock({ commit }, data) {
    commit('SET_MOCK', data)
  },
  setNum({ commit }, data) {
    commit('SET_NUM', data)
  },
  setSingleTime({ commit }, data) {
    commit('SET_SINGLETIME', data)
  },
  setWidth({ commit }, data) {
    commit('SET_WIDTH', data)
  },
  setBeta({ commit }, data) {
    commit('SET_BETA', data)
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
