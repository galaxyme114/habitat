import Axios from 'axios'

export default {
  /**
   * Fetch all tags
   * @returns Promise
   */
  fetchAll: () => {
    return Axios({
      method: 'GET',
      url: '/tags'
    })
  },

  /**
   * Fetch popular tags
   * @returns Promise
   */
  fetchPopular: () => {
    return Axios({
      method: 'GET',
      url: '/tags/popular'
    })
  },

  /**
   * Fetch followed tags
   * @param tags array of tags
   * @returns Promise
   */
  fetchFollowed: (tags: Array<string>) => {
    return Axios({
      method: 'POST',
      url: '/tags/followed',
      data: {
        tags
      }
    })
  },

  /**
   * Fetch followed user projects
   *
   * @param users array of users
   * @returns Promise
   */
  fetchFollowedUserProjects: (users: Array<string>) => {
    return Axios({
      method: 'POST',
      url: '/tags/followed-users',
      data: {
        users
      }
    })
  }
}
