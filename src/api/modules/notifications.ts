import Axios from 'axios'

export default {
  /**
   * Send a notification to user tagged
   *
   * @param recipient ObjectId
   * @param sender ObjectId
   * @param text String
   * @param title String
   * @return Promise
   */
  send: (recipient: string, sender: string, title: string, text: string) => {
    return Axios({
      method: 'POST',
      url: '/notifications',
      data: {
        recipient,
        sender,
        title,
        text
      }
    })
  },
  /**
   * Get notifications
   * @param userID ObjectId
   * @returns Promise
   */
  getAll: async (userId: string) => {
    const response = await Axios({
      method: 'GET',
      url: `/notifications/${userId}/all`
    })
    return response.data
  },
  /**
   * Get new notificatoins counter
   * @param userId ObjectId
   * @returns Promise
   */
  getTopNotificationsCounter: async (userId: string) => {
    const response = await Axios({
      method: 'GET',
      url: `/notifications/${userId}/new-notifications-counter`
    })
    return response.data
  },
  /**
   * Iniut new notificatoins counter
   * @param userId ObjectId
   * @returns Promise
   */
  initializeNewNotificationsCount: async (userId: string) => {
    const response = await Axios({
      method: 'PATCH',
      url: `/notifications/${userId}/initialize-new-notifications-counter`
    })
    return response.data
  },
  /**
   * Delete All Notifications
   * @param userId User Id to delete
   * @returns Promise
   */
  deleteAllNotifications: (userId: string) => {
    return Axios({
      method: 'DELETE',
      url: `/notifications/${userId}/all`
    })
  }
}
