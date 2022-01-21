import {
  // NOTIFICATIONADD,
  NOTIFICATIONSADD,
  NEW_NOTIFICATIONS_COUNT_ADD
} from '@/store/mutation-types'

import { Notification, Notifications, NewNotificationCount } from '@/store/types'

export default {
  [NOTIFICATIONSADD] (state: Notifications, data: Notification[]) {
    state.notifications = data
  },
  [NEW_NOTIFICATIONS_COUNT_ADD] (state: NewNotificationCount, counter: number) {
    state.counter = counter
  }
}
