import Axios from 'axios'

export default {
  /**
   * Fetch images based on search parameters
   *
   * @param terms string of search terms
   * @param start integer reflecting start index of nextPage
   *
   * @returns Promise
   */
  getImages: (terms: string, start: number) => {
    return Axios({
      method: 'POST',
      url: '/google/images',
      data: { terms, start }
    })
  }
}
