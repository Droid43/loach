import Vue from 'vue'
import Loach from '../../src/components'
import App from './App.vue'

Vue.use(Loach)

function initApp () {
  new Vue({
    render: h => h(App)
  }).$mount('#app')
}

initApp()
