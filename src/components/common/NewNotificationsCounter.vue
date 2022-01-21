<template>
  <div>
    <span v-if="newNotificationsCounter > 0" class="pill-badge">{{ newNotificationsCounter }}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { GET_NEW_NOTIFICATIONS_COUNT } from '@/store/action-types'

export default {
  name: 'NewNotificationsCounter',
  components: {},
  data () {
    return {}
  },
  computed: {
    ...mapState({
      newNotificationsCounter: state => state.notifications.counter
    })
  },

  async mounted () {
    await this.$store.dispatch(GET_NEW_NOTIFICATIONS_COUNT)
  }
}
</script>
