import Axios from 'axios'
import { Habitat } from '@/store/types'
import { CURRENTHABITATADD, HABITATSADD, HABITATSDELETE } from '@/store/mutation-types'
import store from '../../store'

export default {
  /**
   * Get a habitats
   *
   *
   * @returns Promise
   */
  get: async (id?: string) => {
    if (id) {
      const response = await Axios({
        method: 'GET',
        url: '/habitats/' + id
      })
      store.commit(CURRENTHABITATADD, response.data)
      return response.data
    }
    const response = await Axios({
      method: 'GET',
      url: '/habitats'
    })
    store.commit(HABITATSADD, response.data)
    return response.data
  },

  getArchived: async () => {
    const response = await Axios({
      method: 'GET',
      url: '/habitats/archived'
    })
    return response.data
  },

  add: async (body: any) => {
    const response = await Axios({
      method: 'POST',
      url: '/habitats',
      data: body
    })
    console.log('habitats add', response)
    store.commit(CURRENTHABITATADD, response.data)
    return response.data
  },

  update: (habitat: Habitat) => {
    return Axios({
      method: 'PATCH',
      url: '/habitats/' + habitat.id,
      data: habitat
    })
  },

  delete: async (habitat: Habitat) => {
    const response = await Axios({
      method: 'DELETE',
      url: '/habitats/' + habitat.id,
      data: habitat
    })
    store.commit(HABITATSDELETE, habitat.id)
    return response.data
  },

  acceptHabitatInvite: async (userId: string, token: string) => {
    const response = await Axios({
      method: 'POST',
      url: '/habitats/accept-invite',
      data: { userId, token }
    })
    return response.data
  },
  /**
   * Add user to habitat
   * @param email email of user to add
   * @param id habitat id
   * @param name current user's full name
   * @returns Promise
   */
  addUser: (email: string, id: string, name: string) => {
    return Axios({
      method: 'POST',
      url: `/habitats/${id}/users`,
      data: { email, name }
    })
  },
  /**
   * Remove user from habitat
   * @param userId id of user to remove
   * @param id habitat id
   * @returns Promise
   */
  removeUser: (userId: string, id: string) => {
    return Axios({
      method: 'DELETE',
      url: `/habitats/${id}/users`,
      data: { userId }
    })
  },
  /**
   * Get habitat inpsiration board items
   * @param id habitat id
   * @returns Promise
   */
  getInspiration: async (id: string) => {
    const response = await Axios({
      method: 'GET',
      url: `/habitats/inspiration/${id}`
    })

    return response.data
  }
}
