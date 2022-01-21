import Axios from 'axios'
import { User } from '@/store/types'

export default {
  /**
   * Send an email with password reset link to given email address
   *
   * @param credentials Object, must include email and password
   *
   * @returns Promise
   */
  login: (credentials: object) => {
    return Axios({
      method: 'POST',
      url: '/auth/login',
      data: credentials
    })
  },
  /**
   * Register new user
   *
   * @param {Object} user
   *
   * @returns Promise
   */
  register: (user: object) => {
    return Axios({
      method: 'POST',
      url: '/auth/register',
      data: user
    })
  },
  /**
   * Get the authenticated user, should this be here??
   *
   * @returns Promise
   */
  me: () => {
    return Axios({
      method: 'GET',
      url: '/auth/me'
    })
  },
  /**
   * Send an email with password reset link to given email address
   *
   * @param email String, the email tied to the account
   *
   * @returns Promise
   */
  forgotPassword: async (email: string) => {
    const response = await Axios({
      method: 'POST',
      url: '/auth/forgot-password',
      data: {
        email: email
      }
    })
    return response
  },
  /**
   * Send an email with password reset link to given email address
   *
   * @param token String, the password reset token
   * @param password String, the new password
   *
   * @returns Promise
   */
  resetPassword: (token: string, password: string) => {
    return Axios({
      method: 'POST',
      url: '/auth/reset-password',
      data: {
        token: token,
        password: password
      }
    })
  },
  /**
   * Load global config and constants
   *
   * @param email String, the email tied to the account
   *
   * @returns Promise
   */
  refresh: (refreshToken: string) => {
    return Axios({
      method: 'POST',
      url: '/auth/refresh-tokens',
      data: {
        refreshToken
      }
    })
  },
  /**
   * Update Auth User
   *
   * @param email String, the email tied to the account
   *
   * @returns Promise
   */
  update: (user: User) => {
    return Axios({
      method: 'POST',
      url: '/auth/update',
      data: user
    })
  }
}
