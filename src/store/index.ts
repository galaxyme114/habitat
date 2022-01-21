import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import constants from './constants'
import habitats from './habitats'
import roomPlans from './room-plans'
import notifications from './notifications'

Vue.use(Vuex)

export default new Vuex.Store({
  // state: {},
  // mutations: {},
  // actions: {},
  modules: {
    auth,
    constants,
    habitats,
    roomPlans,
    notifications
  }
})
