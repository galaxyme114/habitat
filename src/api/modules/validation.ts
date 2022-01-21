// NOTE Not in use yet, not implemented on the server side

import Axios from 'axios'

export default {
  /**
   * Check if email exists
   *
   * @param email String | Null
   * @param id String
   *
   * @returns Promise
   */
  email: (email: string, id: string|null = null) => {
    return Axios({
      method: 'POST',
      url: '/auth/validate-email',
      data: {
        email,
        id
      }
    })
  }
}
