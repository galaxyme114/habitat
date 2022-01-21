import Axios from 'axios'

export default {
  /**
   * Post note to server
   *
   * @param colour hex color of note
   * @param text note text
   * @param project Id of associated project
   * @param owner Id of article creator
   * @returns Promise
   */
  create: (colour: string, text: string, project: string, owner: string) => {
    return Axios({
      method: 'POST',
      url: '/notes',
      data: {
        colour,
        text,
        project,
        owner
      }
    })
  },
  /**
   * Update Note
   *
   * @param noteId Note Id to update
   * @param noteBody  JSON data returned from scrape
   */
  updateNote: (noteId: string, noteBody: any) => {
    return Axios({
      method: 'PATCH',
      url: `/notes/${noteId}`,
      data: {
        ...noteBody
      }
    })
  },
  /**
   * Delete Note
   * @param noteId Note Id to delete
   * @returns Promise
   */
  deleteNote: (noteId: string) => {
    console.log(noteId)
    return Axios({
      method: 'DELETE',
      url: `/notes/${noteId}`
    })
  }
}
