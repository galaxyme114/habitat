import Axios from 'axios'

export default {
  /**
   * Update user
   * @param userId user to update
   * @param body info to update
   * @param habitatId info to update
   * @returns Promise
   */
  update: (userId: string, body: any, habitatId: string) => {
    return Axios({
      method: 'PATCH',
      url: `/users/${userId}`,
      data: {
        updatedUser: body,
        habitatId
      }
    })
  },

  /**
   * Add tag to follow
   * @param userId user to update
   * @param tag tag to follow
   * @returns Promise
   */
  followTag: (userId: string, tag: string) => {
    return Axios({
      method: 'POST',
      url: `/users/${userId}/tags`,
      data: {
        tag: tag
      }
    })
  },

  /**
   * Add user to follow
   * @param userId user to update
   * @param followedUser user to follow
   * @returns Promise
   */
  followUser: (userId: string, followedUser: string) => {
    return Axios({
      method: 'POST',
      url: `/users/${userId}/follow`,
      data: {
        followedUser
      }
    })
  },

  /**
   * Unfollow user
   * @param userId user to update
   * @param followedUser user to unfollow
   * @returns Promise
   */
  unfollowUser: (userId: string, followedUser: string) => {
    return Axios({
      method: 'DELETE',
      url: `/users/${userId}/follow`,
      data: {
        followedUser
      }
    })
  },

  /**
   * Get user
   * @param userId user to update
   * @returns Promise
   */
  get: (userId: string) => {
    return Axios({
      method: 'GET',
      url: `/users/${userId}`
    })
  },

  /**
   * Get users
   * @param meId
   * @param searchText
   * @returns Promise
   */
  fetchFollowingUsers: (meId: string, searchText: string) => {
    return Axios({
      method: 'GET',
      url: '/users/following/list',
      params: {
        meId,
        searchText
      }
    })
  },

  /**
   * Fetch followed users
   *
   * @param userId
   * @returns Promise
   */
  fetchFollowedUsers: (userId: string) => {
    return Axios({
      method: 'GET',
      url: `users/${userId}/followed`
    })
  },

  /**
   * Get all public users
   * @param meId
   * @returns Promise
   */
  fetchAllUsers: (meId: string) => {
    return Axios({
      method: 'GET',
      url: '/users/chat/get-users',
      params: {
        meId
      }
    })
  }
}
