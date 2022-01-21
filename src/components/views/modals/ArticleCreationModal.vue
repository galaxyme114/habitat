<template>
  <b-modal
    size="lg"
    v-model="showModal"
    title="Create Article"
    ok-title="Publish"
    cancel-title="Save Draft"
    @close="close"
    id="article-creation-modal"
  >
    <div id="editorjs" />
    <template #modal-footer>
      <div class="article-footer">
        <div class="left">
          <v-select v-if="!selectedProject" :options="projectOptions" v-model="selected"></v-select>
        </div>
        <div class="right">
          <button @click="e => handleSaveArticle(e, true)" class="button draft">Save Draft</button>
          <button @click="handleSaveArticle" class="button publish">Publish</button>
        </div>
      </div>
    </template>
  </b-modal>
</template>
<script>
import api from '@/api'
import { BModal } from 'bootstrap-vue'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import ImageTool from '@editorjs/image'
import Paragraph from '@editorjs/paragraph'
import vSelect from 'vue-select'
import { mapState } from 'vuex'

export default {
  name: 'ArticleCreationModal',
  props: ['show', 'selectedProject', 'userId'],
  components: {
    BModal,
    vSelect
  },
  data () {
    return {
      editor: null,
      selected: {
        value: null,
        label: 'Select a project'
      },
      projectOptions: [
        {
          value: null,
          label: 'Select a project'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      habitats: state => state.habitats.habitats
    }),
    showModal: {
      get () {
        return this.show
      },
      set (newVal) {
        return newVal
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    handleSaveArticle (e, isPublished = false) {
      this.editor.save().then(async res => {
        this.createArticle(res.blocks, isPublished)
      })
    },
    async createArticle (body, isPublished) {
      console.log(this.selectedProject, this.selected)
      const projectId = this.selectedProject ? this.selectedProject : this.selected.value
      if (!projectId) {
        this.$toasted.error('Please select a project', { position: 'top-center' })
        return
      }
      try {
        await api.articles.create(body, projectId, this.userId, isPublished)
      } catch (error) {
        this.$toasted.error('Article not created')
      }
      this.editor.clear()
      this.$emit('close')
      this.selected = [
        {
          value: null,
          label: 'Select a project'
        }
      ]
    }
  },
  watch: {
    showModal (newVal) {
      if (newVal) {
        this.editor = new EditorJS({
          /**
           * Id of Element that should contain the Editor
           */
          holder: 'editorjs',
          data: {
            blocks: [
              {
                type: 'header'
              },
              {
                type: 'paragraph',
                data: {
                  text: 'Write something here or click below to add content'
                }
              }
            ]
          },

          /**
           * Available Tools list.
           * Pass Tool's class or Settings object for each Tool you want to use
           */
          tools: {
            header: {
              class: Header,
              config: {
                placeholder: 'Article Title',
                levels: [2, 3, 4],
                defaultLevel: 3
              }
            },
            paragraph: {
              class: Paragraph,
              config: {
                placeholder: 'Write something'
              }
            },
            list: List,
            image: {
              class: ImageTool,
              config: {
                additionalRequestHeaders: this.headers,
                uploader: {
                  async uploadByFile (file) {
                    const me = await api.auth.me()
                    const id = me.data.user.id
                    const formData = new FormData()
                    formData.append('userId', id)
                    formData.append('file', file)
                    const response = await api.articles.uploadImageByFile(formData)
                    return {
                      success: 1,
                      file: {
                        url: response.data.url
                      }
                    }
                  }
                },
                field: 'file'
              }
            }
          }
        })
      }
    },
    habitats (newVal) {
      this.projectOptions = [
        {
          value: null,
          label: 'Select a project'
        }
      ]
      newVal.forEach(habitat => {
        habitat.projects.forEach(project => {
          this.projectOptions.push({
            value: project.id,
            label: project.name
          })
        })
      })
    },
    selectedProject (newVal) {
      if (newVal) {
        this.selected = newVal
      }
    }
  },
  mounted () {
    // console.log('mounted')
  }
}
</script>
