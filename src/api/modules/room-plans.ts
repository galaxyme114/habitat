import Axios from 'axios'
import { Habitat, RoomPlanStore } from '@/store/types'
import {
  ROOMPLANADD,
  ROOMPLANDELETE
  // ,
  // ROOMPLANSADD
} from '@/store/mutation-types'
import store from '../../store'

export default {
  /**
   * Get a room-plan
   * @returns Promise
   */
  get: async (id?: string) => {
    if (id) {
      const response = await Axios({
        method: 'GET',
        url: '/room-plans/' + id
      })
      store.commit(ROOMPLANADD, response.data)
      return response.data
    }
    const response = await Axios({
      method: 'GET',
      url: '/room-plans'
    })
    // TODO Implement this if needed
    // store.commit(ROOMPLANSADD, response.data)
    return response.data
  },

  /**
   * Create Room Plan
   *
   * @param roomPlan Name and Description of the roomplan
   * @param project Id of associated project
   * @returns Promise
   */
  create: async (roomPlan: object, project: string) => {
    const response = await Axios({
      method: 'POST',
      url: '/room-plans',
      data: {
        ...roomPlan,
        project
      }
    })
    store.commit(ROOMPLANADD, response.data)
    return response.data
  },

  update: (roomPlanStore: RoomPlanStore) => {
    return Axios({
      method: 'PATCH',
      url: '/room-plans/' + roomPlanStore?.roomPlan?.id,
      data: roomPlanStore
    })
  },

  delete: async (habitat: Habitat) => {
    const response = await Axios({
      method: 'DELETE',
      url: '/room-plans/' + habitat.id,
      data: habitat
    })
    store.commit(ROOMPLANDELETE, habitat.id)
    return response.data
  },

  /**
   * Delete room plan
   * @param roomPlanID RoomPlan Id to delete
   * @returns Promise
   */
  deleteRoomPlan: (roomPlanID: string) => {
    return Axios({
      method: 'DELETE',
      url: `/room-plans/${roomPlanID}`
    })
  }
}
