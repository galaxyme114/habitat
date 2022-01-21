import {
  ALOADCONSTANTS
} from '@/store/action-types'
import {
  CONSTANTSADD
} from '@/store/mutation-types'
import api from '@/api'
import { ActionContext } from 'vuex'
import { Auth, RootState } from '@/store/types'

export default {
  async [ALOADCONSTANTS] ({ commit }: ActionContext<Auth, RootState>) {
    const response = await api.constants.get()
    commit(CONSTANTSADD, response.data)
    return response
  }
}
