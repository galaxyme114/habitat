<template>
  <div id="app" :class="themeClass" :style="{ backgroundColor: '#f8f9fa' }">
    <topbar v-if="authenticated" />
    <main id="main" class="bg-light">
      <transition name="fade" mode="out-in">
        <router-view :key="$route.path" />
      </transition>
    </main>
    <!-- TODO Don't show on explore/project creation pages -->
    <Footer v-if="show" />
  </div>
</template>
<script>
import Topbar from '@/components/Topbar'
import Footer from '@/components/Footer.vue'

import { mapState } from 'vuex'

export default {
  components: {
    Topbar,
    Footer
  },
  data () {
    return {
      pages: ['explore', 'project-new', 'room-plans-edit', 'login', 'register', 'forgot-password']
    }
  },
  computed: {
    ...mapState({
      themeClass: state => {
        if (state.auth.user === null || state.auth.user.theme === 'light') {
          return 'theme-light'
        }

        return 'theme-' + state.auth.user.theme
      },
      authenticated: state => state.auth.authenticated
    }),
    show: function () {
      return !this.pages.includes(this.$route.name)
    }
  },
  mounted () {
    console.log(this.$route)
  }
}
</script>
