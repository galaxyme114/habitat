import Axios from 'axios'

export default {
  /**
   * Post image file to server
   *
   * @param url image web url
   * @param userId current user id
   * @param {enum} orientation landscape or portrait
   *
   * @returns Promise
   */
  uploadImage: (url: string, orientation: string, userId: string) => {
    return Axios({
      method: 'POST',
      url: '/media/upload',
      data: { photo: url, userId: userId, orientation }
    })
  },
  /**
   * Post image file to server
   *
   * @param {string} assetId media asset to add tag to
   * @param {[enum]} tags arary of tags to add to media asset
   *
   * @returns Promise
   */
  addTagToImage: (assetId: string, tags: [string]) => {
    return Axios({
      method: 'POST',
      url: '/media/:assetId',
      data: { assetId, tags }
    })
  }
}
