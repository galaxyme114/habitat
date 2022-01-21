<template>
  <div class="container">
    <div v-if="loaded">
      <h1 :style="{ paddingLeft: '16px' }" v-html="titles[0].data.text" />
      <div class="article-owner d-flex align-item-center">
        <div
          v-if="article.owner.image"
          class="profile-image"
          :style="{ backgroundImage: `url(${article.owner.image.url})`, height: '32px', width: '32px' }"
        />
        <img v-else :src="placeholder" :alt="article.owner.fullName" />
        <div :style="{ margin: '5px 10px 0px 10px', marginLeft: '10px', fontSize: '12pt' }" class="article-text">
          {{ article.owner ? article.owner.fullName.toUpperCase() : '' }}
        </div>
        <div :style="{ fontSize: '24px' }">&#183;</div>
        <div :style="{ margin: '5px 10px 0px 10px', marginLeft: '10px', fontSize: '12pt' }" class="article-text">
          {{ article.createdAt ? moment(article.createdAt).format('dddd, MMMM D, YYYY ') : '' }}
        </div>
      </div>
      <div class="container d-flex justify-content-center flex-column w-75 pt-3">
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
  </div>
</template>
<script>
import api from '@/api'
import placeholder from '@/assets/icons/placeholder@2x.png'
import moment from 'moment'

export default {
  name: 'PublicArticle',
  data () {
    return {
      article: {},
      placeholder,
      moment,
      titles: {},
      loaded: false
    }
  },
  methods: {
    async fetchArticle () {
      const response = await api.publicApi.getArticle(this.$route.params.articleId)
      this.article = response.data
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
