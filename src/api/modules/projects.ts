import Axios from 'axios'
// import { Project } from '@/store/types'

export default {
  /**
   * Get a project
   * @returns Promise
   */
  get: async (id: string) => {
    const response = await Axios({
      method: 'GET',
      url: '/projects/' + id
    })
    return response.data
  },
  /**
   * Update a project
   * @returns Promise
   */
  // TODO create project type update: (project: Project) => {
  update: (project: any) => {
    return Axios({
      method: 'PATCH',
      url: '/projects/' + project.id,
      data: project
    })
  },

  create: async (body: any) => {
    const response = await Axios({
      method: 'POST',
      url: '/projects',
      data: body
    })

    return response.data
  },

  /**
   * Search projects by search term
   * @param searchTerm term to search by
   * @returns Promise
   */
  search: async (searchTerm: string) => {
    const response = await Axios({
      method: 'POST',
      url: '/projects/search',
      data: {
        searchTerm
      }
    })
    return response.data
  },

  /**
   * Search projects by search term
   * @param habitatId term to search by
   * @returns Promise
   */
  getArchived: async (habitatId: string) => {
    const response = await Axios({
      method: 'GET',
      url: `/projects/${habitatId}/archived`
    })
    return response.data
  }
}
