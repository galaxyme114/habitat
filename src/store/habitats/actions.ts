import {
  ALOADCURRENTHABITAT, ALOADHABITATS
} from '@/store/action-types'
import {
  CURRENTHABITATADD,
  HABITATSADD
} from '@/store/mutation-types'
import api from '@/api'
import { ActionContext } from 'vuex'
import { Habitat, RootState } from '@/store/types'

export default {
  async [ALOADHABITATS] ({ commit }: ActionContext<Habitat, RootState>) {
    const habitats = await api.habitats.get()
    commit(HABITATSADD, habitats)
  },
  // eslint-disable-next-line
  async [ALOADCURRENTHABITAT] ({ rootState, dispatch, commit }: ActionContext<Habitat, RootState>) {
    if (!rootState.auth.user || !rootState.auth.user.habitats.current) {
      return
    }
    const habitat = await api.habitats.get(rootState.auth.user.habitats.current)
    commit(CURRENTHABITATADD, habitat)
  }
}
