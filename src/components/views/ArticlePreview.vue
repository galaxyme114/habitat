<template>
  <div class="card article-preview hover">
    <img v-if="images.length" :src="images[0].data.file.url" class="card-img-top"/>
    <div class="card-body">
      <div v-if="titles.length" class="title">{{ titles[0].data.text }}</div>
      <div class="creator">{{ `Article by ${article.owner.fullName}` }}</div>
    </div>
    <button class="action-menu" :id="`article-${article.id}-action-menu`">
      <stream-line-icon :icon="Menu.NavigationMenuHorizontal" :size="20" />
    </button>
    <ActionMenuPopover
      :target="`article-${article.id}-action-menu`"
      @editTrigger="gotoArticlePage"
      @deleteTrigger="showDeleteArticleConfirmModal = true"
    />
    <DeleteResourceConfirmModal
      :show="showDeleteArticleConfirmModal"
      resourceType="Article"
      @close="showDeleteArticleConfirmModal = false"
      @ok="handleDeleteArticle"
    />
  </div>
</template>
<script>
import api from '@/api'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import Menu from '@streamlinehq/streamline-regular/lib/interface-essential/Menu'
import ActionMenuPopover from './popovers/ActionMenuPopover'
import DeleteResourceConfirmModal from '@/components/views/modals/DeleteResourceConfirmModal'
export default {
  props: ['article'],
  components: {
    StreamLineIcon,
    ActionMenuPopover,
    DeleteResourceConfirmModal
  },
  data () {
    return {
      Menu,
      showDeleteArticleConfirmModal: false
    }
  },
  computed: {
    titles: function () {
      return this.article.body.filter(component => component.type === 'header')
    },
    images: function () {
      return this.article.body.filter(component => component.type === 'image')
    }
  },
  methods: {
    gotoArticlePage () {
      this.$emit('onClick')
    },
    refresh () {
      this.$emit('refresh')
    },
    async handleDeleteArticle () {
      try {
        await api.articles.deleteArticle(this.article.id)
        this.$toasted.success('Article has been removed')
        this.refresh()
      } catch (error) {
        this.$toasted.error('Article has not been removed')
      }
    }
  }
}
</script>
