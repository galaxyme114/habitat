<template>
  <div class="followed-project-container">
    <div class="title-container">
      <div class="image hover" @click="handleProfileNavigation">
        <div
          v-if="owner && owner.image"
          class="profile-image"
          :style="{ backgroundImage: `url(${owner.image.url})`, height: '48px', width: '48px' }"
        />
        <img v-else :src="placeholder" alt="user-image" :style="{ height: '48px', width: '48px' }" />
      </div>
      <div class="details">
        <div class="title pointer" @click="handleProjectNavigation">{{ project.name }}</div>
        <div class="owner" @click="handleProfileNavigation">Curated by {{ owner.firstName }} {{ owner.lastName }}</div>
      </div>
    </div>
    <div
      class="image-container pointer"
      @click="handleProjectNavigation"
      :key="refresh"
      v-if="project.moodboard.images.length"
    >
      <div
        v-for="index in this.getIndex()"
        :style="{
          width: 100 / getIndex() + '%',
          height: '140px',
          backgroundSize: 'cover',
          backgroundImage: `url(${project.moodboard.images[index - 1].url})`,
          backgroundPosition: 'center',
          display: 'inline-block'
        }"
        class="project-image"
        :key="`abc${index}`"
      />
    </div>
    <div v-else class="image-container"/>
    <div class="followed-project-tags">
      <div class="tag-pill" v-for="(tag, i) in project.tags" :key="`followed-project-tag-${i}`">
        <span># </span>{{ tag }}
      </div>
    </div>
  </div>
</template>
<script>
import placeholder from '@/assets/icons/placeholder@2x.png'

export default {
  props: ['project'],
  data () {
    return {
      placeholder,
      itemWidths: ['25', '25', '25', '25'],
      refresh: 'refresh'
    }
  },
  computed: {
    owner: function () {
      if (Array.isArray(this.project.habitat.owners)) {
        return this.project.habitat.owners[0]
      } else {
        return this.project.habitat.owners
      }
    }
  },
  methods: {
    getIndex () {
      if (this.project.moodboard.images.length > 4) {
        return 4
      } else {
        return this.project.moodboard.images.length
      }
    },
    getImageWidth () {
      let totalWidth = 100

      for (let i = 0; i < this.getIndex(); i++) {
        const width = Math.floor(Math.random() * (33 - 10 + 1)) + 10
        if (width > this.totalWidth) {
          this.itemWidths[i] = totalWidth
        }
        if (i === 3) {
          this.itemWidths[i] = totalWidth
        } else {
          totalWidth -= width
          this.itemWidths[i] = width
        }
      }
      this.refresh = 'refreshed'
    },
    handleProjectNavigation () {
      this.$router.push(`/public/project/${this.project.id}`)
    },
    handleProfileNavigation () {
      this.$router.push(`/public/profile/${this.owner.id}`)
    }
  },
  mounted () {
    this.getImageWidth()
  }
}
</script>
