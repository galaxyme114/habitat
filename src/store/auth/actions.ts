import {
  ACHECKAUTH,
  ALOGIN,
  AGETAUTHENTICATEDUSER,
  AREGISTER,
  ALOADCONSTANTS,
  AREFRESHTOKENS,
  // ALOADCURRENTHABITAT,
  ALOADHABITATS
} from './../action-types'
import {
  SETUSER,
  LOGIN,
  SETTOKENS
} from './../mutation-types'
import api from './../../api'
import Cookies from 'js-cookie'
import { ActionContext } from 'vuex'
import { Auth, Credentials, RootState, Tokens, User } from '@/store/types'

export default {
  async [ACHECKAUTH] ({ dispatch, commit }: ActionContext<Auth, RootState>) {
    const tokens = Cookies.getJSON('tokens')
    if (typeof tokens === 'undefined') {
      throw new Error('AUTH TOKENS NOT FOUND!')
    }

    commit(SETTOKENS, tokens)

    try {
      await Promise.all([
        dispatch(AGETAUTHENTICATEDUSER),
        dispatch(ALOADCONSTANTS),
        dispatch(ALOADHABITATS)
      ])

      // await dispatch(ALOADCURRENTHABITAT)
    } catch (e) {
      await dispatch(AREFRESHTOKENS)
    }
  },
  async [ALOGIN] ({ dispatch, commit }: ActionContext<Auth, RootState>, credentials: Credentials) {
    const response = await api.auth.login(credentials)
    commit(LOGIN, response.data)

    await Promise.all([
      dispatch(ALOADCONSTANTS),
      dispatch(ALOADHABITATS)
      // dispatch(ALOADCURRENTHABITAT)
    ])
    return response
  },
  async [AGETAUTHENTICATEDUSER] ({ commit }: ActionContext<Auth, RootState>) {
    const response = await api.auth.me()
    commit(SETUSER, response.data.user)
    return response
  },
  async [AREGISTER] ({ dispatch, commit }: ActionContext<Auth, RootState>, user: User) {
    const response = await api.auth.register(user)
    commit(LOGIN, response.data)
    await dispatch(ALOADCONSTANTS)
    return response
  },
  async [AREFRESHTOKENS] ({ dispatch, commit, state }: ActionContext<Auth, RootState>) {
    let tokens: Tokens|null = state.tokens
    if (!tokens) {
      tokens = Cookies.getJSON('tokens')
    }
    if (!tokens || typeof tokens === 'undefined') {
      throw new Error('AUTH TOKENS NOT FOUND!')
    }
    const response = await api.auth.refresh(tokens.refresh.token)
    commit(SETTOKENS, response.data)
    await dispatch(AGETAUTHENTICATEDUSER)
    await Promise.all([
      dispatch(ALOADCONSTANTS),
      dispatch(ALOADHABITATS)
      // dispatch(ALOADCURRENTHABITAT)
    ])
  }
}
