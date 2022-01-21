<template>
  <b-popover v-if="notifications.length > 0" id="notification-dropdown" :target="target" :placement="'bottomright'" triggers="focus">
    <div class="header">
      <span>Notifications</span>
      <router-link to="/user/settings?tab=notification">View All</router-link>
    </div>
    <div class="top-divider" />

    <div class="notification-dropdown-items">
      <div v-for="notification in notifications" v-bind:key="notification.id">
        <div class="option-container">
          <span :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '15px' }">
            <b-icon-bookmark-star style="width: 20px; height: 20px;"></b-icon-bookmark-star>
          </span>
          <div class="option-text">
            <div class="option-title">{{ notification.title }}</div>
            <div class="option-description">
              <small>{{ notification. text }}</small>
              <div class="text-end">
                <small style="color: #f26b6b">{{ notification. timeDiff }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-popover>
</template>

<script>
import { mapState } from 'vuex'
import { FETCH_NOTIFICATIONS, GET_NEW_NOTIFICATIONS_COUNT } from '@/store/action-types'
import { BIconBookmarkStar, BPopover } from 'bootstrap-vue'

export default {
  name: 'HabitatNavDropDown',
  props: ['show', 'target'],
  components: {
    BIconBookmarkStar,
    BPopover
  },
  data () {
    return {}
  },
  computed: {
    ...mapState({
      notifications: state => state.notifications.notifications,
      newNotificationsCounter: state => state.notifications.counter
    })
  },

  async mounted () {
    await this.$store.dispatch(FETCH_NOTIFICATIONS)
    await this.$store.dispatch(GET_NEW_NOTIFICATIONS_COUNT)
  }
}
</script>
