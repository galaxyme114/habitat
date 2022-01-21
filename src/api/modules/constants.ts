import Axios from 'axios'

export default {
  /**
   * Get app constants
   *
   * @param credentials Object, must include email and password
   *
   * @returns Promise
   */
  get: () => {
    return Axios({
      method: 'GET',
      url: '/constants'
    })
  }
}
