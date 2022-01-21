import {
  LOGIN,
  SETTOKENS,
  SETUSER,
  LOGOUT,
  AUTHUSERUPDATE
} from '@/store/mutation-types'
import Cookies from 'js-cookie'
import Axios from 'axios'
import store from '@/store'

import { Auth, DataField, LoginResponse, Tokens, User } from '@/store/types'

export default {
  [LOGIN] (state: Auth, data: LoginResponse) {
    store.commit(SETUSER, data.user)
    store.commit(SETTOKENS, data.tokens)
  },
  [SETTOKENS] (state: Auth, tokens: Tokens) {
    state.tokens = tokens
    Cookies.set('tokens', tokens)
    Axios.defaults.headers.common.Authorization = 'Bearer ' + state.tokens.access.token
    state.authenticated = true
  },
  [SETUSER] (state: Auth, user: User) {
    state.user = user
  },
  [LOGOUT] (state: Auth) {
    state.authenticated = false
    Axios.defaults.headers.common.Authorization = null
    Cookies.remove('tokens')
    state.tokens = null
    state.user = null
  },
  [AUTHUSERUPDATE] (state: Auth, data: DataField) {
    if (!state.user || !state.user[data.id]) {
      return
    }
    state.user[data.id] = data.value
  }
}
