import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    includedComponents: 'bjBox,transaction',
  },
  mutations: {
    setIncludedComponents(state, val) {
      state.includedComponents = val
    },
    setPayPasswordExist(state, val) {
      state.payPasswordExist = val
    }
  },
  actions: {
    
  }
})

export default store
