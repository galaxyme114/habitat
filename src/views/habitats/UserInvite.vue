<template>
  <div :style="{display: 'flex', justifyContent: 'center'}">
    <button type="button" class="btn btn-rounded btn-outline-primary" @click="onAccept()">Accept Invite</button>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import api from '@/api'
import { INVITETOKENCLEAR } from '@/store/mutation-types'
import store from '@/store'

export default {
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      inviteToken: (state) => state.habitats.inviteToken
    })
  },
  methods: {
    async onAccept () {
      try {
        await api.habitats.acceptHabitatInvite(this.user.id, this.inviteToken)
        await store.commit(INVITETOKENCLEAR)
        this.$router.push('/habitats')
      } catch (error) {
        this.$toasted.error(error.response.data.message)
      }
    }
  },
  mounted () {
    console.log(this.inviteToken)
  }
}
</script>
