import { AROOMPLANS } from '@/store/action-types'
import { ActionContext } from 'vuex'
import { RoomPlanStore, RootState } from '@/store/types'
import api from '@/api'
export default {
  async [AROOMPLANS.SAVE] ({ state }: ActionContext<RoomPlanStore, RootState>, data: object) { // dispatch, commit,
    console.log('AROOMPLANS.SAVE', state, data)
    // TODO Need to handle a base64 conversion or upload and convert in the api
    try {
      await api.roomPlans.update(state)
    } catch (e) {
      console.log(e)
    }
  }
}
