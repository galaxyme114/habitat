import Axios from 'axios'

export default {
  /**
   * Post url to scrape to server
   * @param url url to scrape
   * @returns Promise
   */
  getPreview: (url: string) => {
    return Axios({
      method: 'POST',
      url: '/links/preview',
      data: {
        url
      }
    })
  },
  /**
   * Post link preview to server
   *
   * @param linkBody JSON data returned from scrape
   * @param project Id of associated project
   * @returns Promise
   */
  create: (linkBody: any, project: string) => {
    return Axios({
      method: 'POST',
      url: '/links',
      data: {
        ...linkBody,
        project
      }
    })
  },
  /**
   * Update a link preview
   *
   * @param linkId Link Id to update
   * @param linkBody  JSON data returned from scrape
   */
  update: (linkId: string, linkBody: any) => {
    return Axios({
      method: 'PATCH',
      url: `/links/${linkId}`,
      data: {
        ...linkBody
      }
    })
  },
  /**
   * Delete a link preview
   * @param linkId Link Id to delete
   * @returns Promise
   */
  deleteLink: (linkId: string) => {
    return Axios({
      method: 'DELETE',
      url: `/links/${linkId}`
    })
  }
}
