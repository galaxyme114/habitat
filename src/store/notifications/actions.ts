import {
  // FETCH_NOTIFICATION,
  FETCH_NOTIFICATIONS,
  GET_NEW_NOTIFICATIONS_COUNT
} from '@/store/action-types'
import {
  NOTIFICATIONSADD,
  NEW_NOTIFICATIONS_COUNT_ADD
  // NOTIFICATIONADD
} from '@/store/mutation-types'
import api from '@/api'
import { ActionContext } from 'vuex'
import { Notification, NewNotificationCount, RootState } from '@/store/types'

export default {
  async [FETCH_NOTIFICATIONS] ({ rootState, commit }: ActionContext<Notification, RootState>) {
    if (!rootState.auth.user) {
      return
    }
    const notifications = await api.notifications.getAll(rootState.auth.user.id)
    commit(NOTIFICATIONSADD, notifications)
  },

  async [GET_NEW_NOTIFICATIONS_COUNT] ({ rootState, commit }: ActionContext<NewNotificationCount, RootState>) {
    if (!rootState.auth.user) {
      return
    }
    const result = await api.notifications.getTopNotificationsCounter(rootState.auth.user.id)
    commit(NEW_NOTIFICATIONS_COUNT_ADD, result.counter)
  }
}
