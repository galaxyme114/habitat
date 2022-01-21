<template>
  <div id="feeds-search" :style="{minHeight: dynamicHeight}">
    <div id="feed-search-container" class="d-flex flex-column align-items-center">
      <div class="d-md-flex mb-3 input-wrap justify-content-between w-50 d-none">
        <div :style="{ width: '70%', display: 'flex' }">
          <span class="mr-2">
            <stream-line-icon :icon="Search.SearchBar" :stroke="iconColour" />
          </span>
          <input
            class="pl-2 input"
            placeholder="Keywords"
            v-on:keyup.enter="search(searchSelect, searchTerm)"
            v-model="searchTerm"
          />
        </div>
        <b-form-select v-model="searchSelect">
          <b-form-select-option :value="'all'">All</b-form-select-option>
          <b-form-select-option :value="'articles'">Articles</b-form-select-option>
          <b-form-select-option :value="'users'">Users</b-form-select-option>
          <b-form-select-option :value="'projects'">Projects</b-form-select-option>
        </b-form-select>
      </div>
      <div class="d-flex mb-3 input-wrap justify-content-between w-100 d-md-none">
        <div :style="{ width: '70%', display: 'flex' }">
          <span class="mr-2">
            <stream-line-icon :icon="Search.SearchBar" :stroke="iconColour" />
          </span>
          <input
            class="pl-2 input"
            placeholder="Keywords"
            v-on:keyup.enter="search(searchSelect, searchTerm)"
            v-model="searchTerm"
          />
        </div>
        <b-form-select v-model="searchSelect">
          <b-form-select-option :value="'all'">All</b-form-select-option>
          <b-form-select-option :value="'articles'">Articles</b-form-select-option>
          <b-form-select-option :value="'users'">Users</b-form-select-option>
          <b-form-select-option :value="'projects'">Projects</b-form-select-option>
        </b-form-select>
      </div>
    </div>
    <div class="feed-projects search" v-if="loaded">
      <stack :monitor-images-loaded="true" :column-min-width="320" :gutter-width="8" :gutter-height="8" ref="stackRef">
        <stack-item v-for="(project, i) in projects" :key="i" class="fade-in">
          <tagged-project-preview :key="`project-${i}`" :project="project" />
        </stack-item>
        <stack-item v-for="(article, i) in articles" :key="i" class="fade-in">
          <article-preview :article="article" @onClick="handleArticleNavigation(article.id)" class="cursor" />
        </stack-item>
      </stack>
    </div>
  </div>
</template>
<script>
import api from '@/api'
import { mapState } from 'vuex'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import Search from '@streamlinehq/streamline-regular/lib/interface-essential/Search'
import { BFormSelect, BFormSelectOption } from 'bootstrap-vue'
import { Stack, StackItem } from 'vue-stack-grid'
import ArticlePreview from '@/components/views/ArticlePreview'
import TaggedProjectPreview from '@/components/views/TaggedProjectPreview'

export default {
  components: {
    StreamLineIcon,
    BFormSelect,
    TaggedProjectPreview,
    BFormSelectOption,
    ArticlePreview,
    Stack,
    StackItem
  },
  data () {
    return {
      Search,
      projects: [],
      articles: [],
      searchSelect: 'projects',
      searchTerm: '',
      loaded: false,
      dynamicHeight: '80vh'
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
    async search (type, term) {
      this.loaded = false
      this.projects = this.articles = []
      let response
      switch (type) {
        case 'projects':
          response = await api.projects.search(term)
          this.projects = response
          console.log(this.projects)
          this.loaded = true
          break
        case 'articles':
          response = await api.articles.search(term)
          this.articles = response
          this.loaded = true
          break
      }
    },
    handleArticleNavigation (articleId) {
      this.$router.push({
        name: 'public-article',
        params: { articleId }
      })
    }
  },
  async mounted () {
    if (this.$route.params && this.$route.params.type && this.$route.params.term) {
      this.searchTerm = this.$route.params.term
      this.searchSelect = this.$route.params.type
      await this.search(this.$route.params.type, this.$route.params.term)
      this.dynamicHeight = document.body.scrollHeight - 128 + 'px'
    }
  }
}
</script>
