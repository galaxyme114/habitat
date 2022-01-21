<template>
  <div class="container w-100">
    <b-breadcrumb>
      <b-breadcrumb-item href="/habitats"> Your Habitats </b-breadcrumb-item>
      <b-breadcrumb-item :to="{ name: 'habitat-view', params: { habitatId: $route.params.habitatId } }">{{
        project.habitat.name
      }}</b-breadcrumb-item>
      <b-breadcrumb-item>{{ project.name }}</b-breadcrumb-item>
      <b-breadcrumb-item active> Mood Images </b-breadcrumb-item>
    </b-breadcrumb>
    <div class="row">
      <div v-for="(tag, key) in sortedImages" :key="`tag-${key}`" class="tagCard">
        <div
          class="bgImage radius"
          :style="{
            backgroundImage: `url(${tag[0].url})`
          }"
        />
        <div class="tagText d-flex">
          {{ key }}
          <div class="pill-badge d-flex align-items-center justify-content-center">{{ tag.length }}</div>
        </div>
      </div>
    </div>
    <div class="row d-flex flex-row my-5" v-for="(value, key) in sortedImages" :key="`filter-${key}`">
      <div :style="{ width: '10%', textTransform: 'capitalize', paddingTop: '20px' }">{{ key }}</div>
      <stack
        monitor-images-loaded
        :column-min-width="250"
        :gutter-width="8"
        :gutter-height="8"
        horizontal
        :style="{ width: '90%' }"
      >
        <stack-item v-for="(image, i) in value" :key="i">
          <div class="card radius">
            <div v-on:click="handleSelect(image, `mood-image-${key}-${i}`)">
              <stream-line-icon
                :id="`mood-image-${key}-${i}`"
                :icon="TagsBookmarks.TagsAdd"
                :stroke="show === `mood-image-${key}-${i}` ? 'black' : 'white'"
                class="icon-add"
                :class="{ bigger: show === `mood-image-${key}-${i}` }"
                :size="20"
              />
            </div>
            <tagged-image :image="image" />
          </div>
        </stack-item>
      </stack>
    </div>
    <b-popover id="explore-popover" :key="targetId" :target="targetId" :placement="'bottom'" :show="popoverShow">
      <b-form-checkbox
        v-model="selected"
        :value="option.value"
        v-for="(option, i) in tagOptions"
        :key="`checkbox-${i}`"
        class="checkbox-padding"
        :class="{ 'checkbox-active': selected.includes(option.value) }"
        >{{ option.text }}</b-form-checkbox
      >
      <div :style="{ height: '1px', background: '#D5D8E2', margin: '10px' }" />
      <div class="alt-button mb-1" @click="handleAddTag()">Add</div>
    </b-popover>
  </div>
</template>
<script>
import { Stack, StackItem } from 'vue-stack-grid'
import { BBreadcrumb, BBreadcrumbItem, BPopover, BFormCheckbox } from 'bootstrap-vue'
import api from '@/api'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import TagsBookmarks from '@streamlinehq/streamline-regular/lib/interface-essential/TagsBookmarks'
import TaggedImage from '@/components/views/TaggedImage.vue'

export default {
  components: {
    Stack,
    StackItem,
    BBreadcrumb,
    BBreadcrumbItem,
    BPopover,
    BFormCheckbox,
    TaggedImage,
    StreamLineIcon
  },
  data () {
    return {
      TagsBookmarks,
      project: {
        name: '',
        habitat: {
          name: ''
        }
      },
      images: [],
      tags: {},
      sortedImages: {},
      targetId: '',
      popoverShow: false,
      selected: [],
      selectedImage: null,
      tagOptions: [
        { value: 'lighting', text: 'Lighting' },
        { value: 'flooring', text: 'Flooring' },
        { value: 'appliances', text: 'Appliances' },
        { value: 'wall-coverings', text: 'Wall Coverings' },
        { value: 'misc', text: 'Misc' },
        { value: 'other', text: 'Other' },
        { value: 'furniture', text: 'Furniture' },
        { value: 'colours', text: 'Colours' }
      ],
      loading: false,
      show: ''
    }
  },
  methods: {
    async fetchProject () {
      this.sortedImages = {}
      const response = await api.projects.get(this.$route.params.projectId)
      this.project = response
      this.sortedImages.noTag = []
      this.project.moodboard.images.forEach((image) => {
        if (!image.tags.length) {
          this.sortedImages.noTag.push(image)
        } else {
          image.tags.forEach((tag) => {
            if (!this.sortedImages[tag]) {
              this.sortedImages[tag] = []
            }
            this.sortedImages[tag].push(image)
          })
        }
      })
    },
    handleSelect (image, id) {
      // applying class for expanding bullet
      if (this.show === id) {
        this.show = ''
      } else {
        this.show = id
      }
      this.selected = image.tags

      this.selectedImage = image

      if (this.popoverShow && this.targetId === id) {
        this.popoverShow = false
        this.targetId = ''
      } else {
        this.popoverShow = false
        this.timeout = setTimeout(() => {
          this.targetId = id
          this.popoverShow = true
        }, 500)
      }
    },
    async handleAddTag () {
      try {
        await api.media.addTagToImage(this.selectedImage.id, this.selected)
        this.fetchMoodboard()
      } catch (error) {
        console.log(error)
      }
      this.show = ''
      this.selectedImage = ''
      this.popoverShow = false
      this.selected = []
      this.loading = false
    }
  },
  mounted () {
    this.fetchProject()
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
