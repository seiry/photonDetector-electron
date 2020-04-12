import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-page',
      component: require('@/components/MainPage').default
    },
    {
      path: '/config',
      name: 'config-page',
      component: require('@/components/ConfigPage.vue').default
    },
    {
      path: '/data',
      name: 'data-page',
      component: require('@/components/DataPage.vue').default
    },
    {
      path: '/debug',
      name: 'debug-page',
      component: require('@/components/DebugPage.vue').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
