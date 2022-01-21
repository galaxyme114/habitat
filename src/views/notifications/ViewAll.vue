<template>
  <div id="notifications" class="pt-3">
    <div class="container">
      <div id="header" class="mb-5 d-flex justify-content-between align-items-center">
        <h3>Notifications</h3>
        <span v-if="notifications.length > 0" class="clear-all" @click="showClearNotificationConfirm = true">Clear All</span>
      </div>
      <div v-for="(notification, index) in notifications" :key="`notification-${index}`" class="notification mb-3 pb-3">
        <div class="d-flex">
          <span :style="{ backgroundColor: '#e9f4f3', padding: '17px', borderRadius: '8px', marginRight: '15px' }">
            <b-icon-bookmark-star style="width: 30px; height: 30px;"></b-icon-bookmark-star>
          </span>
          <div>
            <h5>{{ notification.title }} <small class="text-muted ml-2">{{ notification.timeDiff }}</small></h5>
            <p class="text-muted">{{ notification.text }}</p>
          </div>
        </div>
      </div>
      <div v-if="notifications.length === 0">
        <h3 class="text-muted">No Data</h3>
      </div>
    </div>
    <ClearNotificationsConfirm
      :show="showClearNotificationConfirm"
      @close="showClearNotificationConfirm = false"
      @ok="handleClearAll"
    />
  </div>
</template>
<script>
import api from '@/api'
import { mapState } from 'vuex'
import { BIconBookmarkStar } from 'bootstrap-vue'
import ClearNotificationsConfirm from '@/components/views/modals/ClearNotificationsConfirm'
import { FETCH_NOTIFICATIONS } from '@/store/action-types'
export default {
  name: 'NotificationsViewAll',
  components: {
    BIconBookmarkStar,
    ClearNotificationsConfirm
  },
  data () {
    return {
      showClearNotificationConfirm: false
    }
  },
  computed: {
    ...mapState({
      userId: state => state.auth.user.id,
      notifications: state => state.notifications.notifications
    })
  },
  methods: {
    async handleClearAll () {
      try {
        await api.notifications.deleteAllNotifications(this.userId)
        this.$toasted.success('Notifications have been deleted!')
      } catch (e) {
        this.$toasted.error(e.response.data.message)
      }
      this.$store.dispatch(FETCH_NOTIFICATIONS)
    }
  }
}
</script>
