import {
  CONSTANTSADD
} from '@/store/mutation-types'
import { Constants, ConstantsResponse } from '@/store/types'

export default {
  [CONSTANTSADD] (state: Constants, data: ConstantsResponse) {
    for (const [key, value] of Object.entries(data)) {
      state[key] = value
    }
    state.loaded = true
  }
}
