import Vue from 'vue'

import { BootstrapVue, IconsPlugin, NavbarPlugin, VBTogglePlugin, SidebarPlugin } from 'bootstrap-vue'

import VueKonva from 'vue-konva'

import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import './assets/scss/app.scss'

import './validation'

// register the plugin on vue
import Toasted from 'vue-toasted'

Vue.use(Toasted, {
  duration: 2000,
  keepOnHover: true,
  theme: 'outline',
  containerClass: 'notifications'
})

/**
 * Bootstrap Vue components and directives
 */
Vue.use(NavbarPlugin)
Vue.use(VBTogglePlugin)
Vue.use(SidebarPlugin)

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

/*
* Konva 2D Library
*/
Vue.use(VueKonva)

// console.log(process.env)
// New commit

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
