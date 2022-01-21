/**
 * Repository pattern:
 * - create an axios instance with given domain and url
 * - set default base url
 * - set default headers for the instance, i.e. for dealing with the server specified in baseURL
 * - export request methods
 *
 * This pattern allows modular and flexibile modelling of the API calls
 *
 * Example:
 *
 *    user: {
 *      resetPassword: email => {
 *        return axois({
 *          method: 'POST',
 *            url: '/reset_password',
 *            data: {
 *            email: email
 *          }
 *        })
 *      }
 *    }
 *
 * A POST request to /reset_password will be created in the 'user' attribute,
 * which, in turn, will have a 'resetPassword' attribute
 * which will return an axios promise provided by api({config})
 *
 * This pattern allows to make API calls in Components as such:
 *
 *      axios.user.resetPassword(email)
 */
import Axios from 'axios'

import store from './../store'
import { ACHECKAUTH } from '@/store/action-types'
import { LOGOUT } from '@/store/mutation-types'
import router from '@/router'

import auth from './modules/auth'
import constants from './modules/constants'
import habitats from './modules/habitats'
import validation from './modules/validation'
import google from './modules/google'
import media from './modules/media'
import moodBoard from './modules/mood-board'
import user from './modules/user'
import projects from './modules/projects'
import articles from './modules/articles'
import notes from './modules/notes'
import links from './modules/links'
import tags from './modules/tags'
import roomPlans from './modules/room-plans'
import publicApi from './modules/public'
import notifications from './modules/notifications'

// default headers
Axios.defaults.headers.common['Content-Type'] = 'application/json'
Axios.defaults.headers.common.Accept = 'application/json'
Axios.defaults.baseURL = process.env.VUE_APP_API_URL + '/v1'

// empty global interceptor for requests
// api.interceptors.request.use(
//   function (config) {
//     return config
//   },
//   function (err) {
//     return Promise.reject(err)
//   }
// )

Axios.interceptors.response.use(
  async response => {
    return response
  },
  async error => {
    switch (error.response.status) {
      // case 400:
      //   router.push('/not-found')
      //   break
      case 401:
      case 403:
        if (store.state.auth.authenticated) {
          try {
            store.commit(LOGOUT)
            await store.dispatch(ACHECKAUTH)
            const originalRequest = error.config
            originalRequest._retry = true
            Axios.request(originalRequest)
          } catch (e) {
            router.push('/login')
          }
        } else {
          store.commit(LOGOUT)
          router.push('/login')
        }
        break
      case 404:
        console.log('404')
        break
      // case 500:
      // case 501:
      //   const $dom = $('<div/>')
      //   $dom.html('<p>There was an error completing the request.  Please report this issue, noting the steps taken to reproduce it if possible.</p>')
      //   if(error.response.data instanceof Blob && error.response.data.type === 'application/json') {
      //     let reader = new FileReader()
      //     reader.addEventListener('loadend', () => {
      //       let response = JSON.parse(reader.result)
      //       $dom.html('<p>There was an error completing the request.  Please report this issue, including the message below and noting the steps taken to reproduce it if possible.</p><p class="small alert-danger">' + response.data.message + '</p>')
      //     })
      //     reader.readAsText(error.response.data)
      //   }
      //   swal({
      //     title: 'Response Error - ' + error.response.status,
      //     content: $dom[0],
      //     icon: 'error',
      //     buttons: {
      //       confirm: {
      //         text: 'Reload page',
      //         value: true,
      //         className: 'btn-success'
      //       },
      //       cancel: {
      //         text: 'Try again',
      //         value: false,
      //         className: 'btn-danger',
      //         visible: true
      //       }
      //     }
      //   }).then((isConfirm) => {
      //     if(isConfirm) {
      //       document.location.reload()
      //     }
      //   })
      //   break
    }
    return Promise.reject(error)
  }
)

export default {
  auth,
  constants,
  habitats,
  validation,
  google,
  media,
  moodBoard,
  user,
  projects,
  articles,
  notes,
  links,
  tags,
  roomPlans,
  publicApi,
  notifications
}
