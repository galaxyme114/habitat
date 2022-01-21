import Axios from 'axios'

export default {
  /**
   * Get user
   * @param userId user id
   * @returns Promise
   */
  getUser: (userId: string) => {
    return Axios({
      method: 'GET',
      url: `/public/user/${userId}`
    })
  },
  /**
   * Get project
   * @param projectId project id
   * @returns Promise
   */
  getProject: (projectId: string) => {
    return Axios({
      method: 'GET',
      url: `/public/project/${projectId}`
    })
  },
  /**
   * Get article
   * @param articleId article id
   * @returns Promise
   */
  getArticle: (articleId: string) => {
    return Axios({
      method: 'GET',
      url: `/public/article/${articleId}`
    })
  },
  /**
   * Get habitat
   * @param habitatId habitat id
   * @returns Promise
   */
  getHabitat: (habitatId: string) => {
    return Axios({
      method: 'GET',
      url: `/public/habitat/${habitatId}`
    })
  }
}
