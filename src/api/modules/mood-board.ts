import Axios from 'axios'

export default {
  /**
   * Get moodboards
   *
   * @param id moodboard id
   *
   * @returns Promise
   */
  get: async (id?: string) => {
    if (id) {
      const response = await Axios({
        method: 'GET',
        url: '/moodboard/' + id
      })
      return response.data
    }
    const response = await Axios({
      method: 'GET',
      url: '/moodboard'
    })
    return response.data
  },
  /**
   * Add uploaded image to moodboard
   * @param imageId Id of media asset
   * @param id moodboard id
   * @returns Promise
   */
  addImage: (imageId: string, id: string) => {
    return Axios({
      method: 'POST',
      url: '/moodboard/images',
      data: { imageId, id }
    })
  },
  /**
   * Add uploaded image to moodboard
   * @param imageId Id of media asset
   * @param id moodboard id
   * @returns Promise
   */
  deleteImage: (imageId: string, id: string) => {
    return Axios({
      method: 'DELETE',
      url: '/moodboard/images',
      data: { imageId, id }
    })
  },
  /**
   * Add user to moodboard
   * @param email email of user to add
   * @param id moodboard id
   * @param name current user's full name
   * @returns Promise
   */
  addUser: (email: string, id: string, name: string) => {
    return Axios({
      method: 'POST',
      url: '/moodboard/users',
      data: { email, id, name }
    })
  },
  /**
   * Remove user from moodboard
   * @param email email of user to remove
   * @param id moodboard id
   * @returns Promise
   */
  removeUser: (email: string, id: string) => {
    return Axios({
      method: 'DELETE',
      url: '/moodboard/users',
      data: { email, id }
    })
  }
}
