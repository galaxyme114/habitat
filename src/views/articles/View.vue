<template>
  <div class="container px-0 px-lg-2">
    <b-breadcrumb>
      <b-breadcrumb-item href="/habitats"> Your Habitats </b-breadcrumb-item>
      <b-breadcrumb-item :to="{ name: 'habitat-view', params: { habitatId: $route.params.habitatId } }">{{
        article.project ? article.project.habitat.name : ''
      }}</b-breadcrumb-item>
      <b-breadcrumb-item active>{{ article.project ? article.project.name : '' }}</b-breadcrumb-item>
    </b-breadcrumb>
    <div v-if="loaded">
      <h1 class="d-none d-lg-block" :style="{ paddingLeft: '16px' }">{{ titles[0].data.text }}</h1>
      <h4 class="d-block d-lg-none">{{ titles[0].data.text }}</h4>
      <div class="article-owner d-block d-lg-flex  align-item-center">
        <div class="d-flex">
          <div
            v-if="article.owner.image"
            class="profile-image"
            :style="{ backgroundImage: `url(${article.owner.image.url})`, height: '32px', width: '32px' }"
          />
          <img v-else :src="placeholder" :alt="article.owner.fullName" />
          <div :style="{ margin: '5px 10px 0px 10px', marginLeft: '10px', fontSize: '12pt' }" class="article-text">
            {{ article.owner ? article.owner.fullName.toUpperCase() : '' }}
          </div>
        </div>
        <div class="d-none d-lg-block" :style="{ fontSize: '24px' }">&#183;</div>
        <div class="d-flex ml-3 ml-lg-0">
          <div :style="{ margin: '5px 10px 0px 10px', marginLeft: '10px', fontSize: '12pt' }" class="article-text">
            {{ article.createdAt ? moment(article.createdAt).format('dddd, MMMM D, YYYY ') : '' }}
          </div>
          <div :style="{ cursor: 'pointer' }" @click="handleArticleModal">
            <stream-line-icon :icon="Edit.Pencil" :stroke="iconColour" :size="20" />
          </div>
        </div>
      </div>
      <div class="container d-flex justify-content-center flex-column w-75 pt-3 article-content">
        <div
          v-for="(component, i) in article.body"
          :key="i"
          v-html="parseHtml(component)"
          :style="{
            marginBottom: component.type === 'image' ? '16px' : '',
            textAlign: 'justify',
            alignSelf: component.type === 'image' ? 'center' : 'left'
          }"
        ></div>
      </div>
    </div>
    <b-modal
      size="lg"
      v-model="showArticleModal"
      cancel-title="Save Draft"
      title="Create Article"
      ok-title="Save"
      @ok="(e) => handleSaveArticle(e, true)"
      @cancel="handleSaveArticle"
    >
      <div id="article-edit" />
    </b-modal>
  </div>
</template>
<script>
import api from '@/api'
import { mapState } from 'vuex'
import placeholder from '@/assets/icons/placeholder@2x.png'
import moment from 'moment'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import ImageTool from '@editorjs/image'
import Paragraph from '@editorjs/paragraph'
import { BBreadcrumb, BBreadcrumbItem, BModal } from 'bootstrap-vue'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import Edit from '@streamlinehq/streamline-regular/lib/interface-essential/Edit'

export default {
  components: {
    BBreadcrumb,
    BBreadcrumbItem,
    BModal,
    StreamLineIcon
  },
  data () {
    return {
      Edit,
      article: {
        body: []
      },
      placeholder,
      moment,
      titles: {},
      loaded: false,
      showArticleModal: false,
      editor: null
    }
  },
  computed: {
    ...mapState({
      iconColour: (state) => {
        if (state.auth.user === null || state.auth.user.theme === 'light') {
          return '#000000'
        }

        return '#ffffff'
      }
    })
  },
  methods: {
    async fetchArticle () {
      const response = await api.articles.get(this.$route.params.articleId)
      this.article = response
      this.titles = this.article.body.filter((component) => component.type === 'header')
      this.loaded = true
    },
    parseHtml (articleComponent) {
      switch (articleComponent.type) {
        case 'image':
          return `<img src="${articleComponent.data.file.url}" class="card-img-top height"/>`
        case 'header':
          return `<h${articleComponent.data.level}>${articleComponent.data.text}</h${articleComponent.data.level}>`
        case 'paragraph':
          return `<p>${articleComponent.data.text}</p>`
      }
    },
    handleSaveArticle (e, isPublished = false) {
      this.editor.save().then(async (res) => {
        this.updateArticle(res.blocks, isPublished)
      })
    },
    async updateArticle (body, isPublished) {
      const payload = {
        id: this.article.id,
        body,
        isPublished
      }
      try {
        const response = await api.articles.update(payload)
        this.article = response.data
        this.titles = this.article.body.filter((component) => component.type === 'header')
      } catch (error) {
        this.$toasted.error('Article not updated')
      }
      this.showArticleModal = false
    },
    handleArticleModal () {
      this.showArticleModal = true
      this.editor = new EditorJS({
        /**
         * Id of Element that should contain the Editor
         */
        holder: 'article-edit',
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
        },
        data: {
          blocks: this.article.body
        }
      })
    }
  },
  mounted () {
    this.fetchArticle()
  }
}
</script>
<style scoped>
.other {
  background-size: cover;
  background-position: center;
  height: 416px;
  border-radius: 20px;
  z-index: 99;
}
.height {
  height: 300px;
}
</style>
