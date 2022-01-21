<template>
  <div class="container w-100 p-0 p-lg-2">
    <b-breadcrumb>
      <b-breadcrumb-item href="/habitats"> Your Habitats </b-breadcrumb-item>
      <b-breadcrumb-item :href="`/habitats/${$route.params.habitatId}`">{{
        habitat && habitat.name ? habitat.name : null
      }}</b-breadcrumb-item>
      <b-breadcrumb-item active> Inspiration </b-breadcrumb-item>
    </b-breadcrumb>
    <stack
      monitor-images-loaded
      :column-min-width="250"
      :gutter-width="8"
      :gutter-height="8"
      horizontal
      v-if="loaded && inspirationItems.length"
    >
      <stack-item v-for="(item, i) in inspirationItems" :key="i">
        <article-preview
          v-if="item.type === 'article'"
          :article="item.data"
          @onClick="handleArticleNavigation(habitat.id, item.data.project.id, item.data.id)"
        />
        <room-plan-preview
          v-else-if="item.type === 'room-plan'"
          :room-plan="item.data"
          @click="
            $router.push({
              name: 'room-plans-edit',
              params: { habitatId: item.data.project.habitat, projectId: item.data.project.id, roomPlanId: item.data.id }
            })
          "
          class="cursor"
        />
        <div v-else-if="item.type === 'image'" class="card radius">
          <tagged-image :image="item.data" :moodboard="item.moodboard" @refresh="fetchHabitat" />
        </div>
        <link-preview v-else-if="item.type === 'link'" :link="item.data" />
        <note-preview v-else-if="item.type === 'note'" :note="item.data" />
      </stack-item>
    </stack>
    <div v-else-if="loaded" id="no-inspiration" class="d-flex justify-content-center">
      <div class="d-flex flex-column align-items-center">
        <img :src="ContentPlaceholder" />
        <p>No inspiration content</p>
        <b-button variant="primary" @click="explore">Explore</b-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Stack, StackItem } from 'vue-stack-grid'
import { BBreadcrumb, BBreadcrumbItem, BButton } from 'bootstrap-vue'
import ContentPlaceholder from '@/assets/img/content-placeholder.png'
import api from '@/api'
import TagsBookmarks from '@streamlinehq/streamline-regular/lib/interface-essential/TagsBookmarks'
import TaggedImage from '@/components/views/TaggedImage.vue'
import ArticlePreview from '@/components/views/ArticlePreview'
import RoomPlanPreview from '@/components/views/RoomPlanPreview'
import LinkPreview from '@/components/views/LinkPreview'
import NotePreview from '@/components/views/NotePreview'

export default {
  components: {
    Stack,
    StackItem,
    BBreadcrumb,
    BBreadcrumbItem,
    TaggedImage,
    ArticlePreview,
    RoomPlanPreview,
    LinkPreview,
    NotePreview,
    BButton
  },
  data () {
    return {
      TagsBookmarks,
      ContentPlaceholder,
      images: [],
      habitat: {},
      loading: false,
      loaded: false,
      show: '',
      inspirationItems: []
    }
  },
  methods: {
    async fetchHabitat () {
      try {
        const response = await api.habitats.getInspiration(this.$route.params.habitatId)
        this.habitat = response.habitat
        if (this.$route.params.type === 'images') {
          this.inspirationItems = response.items.filter((item) => item.type === 'image')
        } else {
          this.inspirationItems = response.items.filter((item) => item.type !== 'image')
        }
        this.loaded = true
      } catch (e) {
        this.$toasted.error('Error loading Inspiration board')
      }
    },
    explore () {
      this.$router.push({ name: 'explore', params: { description: 'Find inspiration for your habitat' } })
    },
    handleArticleNavigation (habitatId, projectId, articleId) {
      this.$router.push({
        name: 'article-view',
        params: { habitatId, projectId, articleId }
      })
    }
  },
  mounted () {
    this.fetchHabitat()
  }
}
</script>
<style scoped>
.radius {
  border-radius: 16px !important;
}
.icon-add {
  position: absolute;
  right: 20px;
  top: 20px;
  padding: 5px;
  border-radius: 30px;
  z-index: 99;
  background-color: rgba(30, 33, 43, 0.5);
  width: 34px;
  transition: all 0.5s;
  align-self: center;
}
.icon-add:hover {
  background-color: #a7c7c5;
  cursor: pointer;
}
.bigger {
  width: 220px;
  background-color: white;
}
.alt-button {
  display: flex;
  justify-content: center;
  padding: 10px;
  border-radius: 12px;
  margin: 0px 10px 0px 10px;
  transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
  background-color: #f26b6b;
  cursor: pointer;
  color: white;
}
.alt-button:hover {
  background-color: #ef4848;
}
.checkbox-padding {
  padding-top: 8px;
  padding-bottom: 5px;
}
.checkbox-active {
  background-color: #e9f4f3;
}
.checkbox-active label {
  font-weight: 700;
}
.bgImage {
  background-size: cover;
  background-position: center;
  height: 155px;
  width: 245px;
  z-index: 99;
}
.tagCard {
  margin: 10px;
}
.tagText {
  margin-top: 5px;
  text-transform: capitalize;
}
.pill-badge {
  height: 16px;
  width: 24px;
  color: #fff;
  background-color: #70a288;
  border-radius: 16px;
  font-size: 12px;
  margin-left: 10px;
  display: inline-block;
}
</style>
