/* eslint-disable no-unused-vars */
import Vue from 'vue'
import Vuex from 'vuex'

// import { createPersistedState, createSharedMutations } from 'vuex-electron'
import createPersistedState from 'vuex-persistedstate'
import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState({
      key: 'pet-vuex',
      paths: ['Config', 'Status.turns'], // 可以部分持久化
    }),
    // createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production',
})
