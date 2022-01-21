<template>
  <div class="home">
    <h1>Habitat</h1>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'home',
  components: {
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
      inviteToken: state => state.habitats.inviteToken
    })
  },
  created () {
    if (this.inviteToken) {
      this.$router.push('/habitats/invite')
    }
  }
}
</script>
