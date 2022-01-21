<template>
  <div class="project-preview">
    <div class="project-title d-flex justify-content-between">
      <div class="d-flex flex-column">
        <h3 @click="handleProjectNavigation" class="hover d-none d-lg-block">{{ project.name }}</h3>
        <h4 @click="handleProjectNavigation" class="hover d-block d-lg-none">{{ project.name }}</h4>
        <p class="last-updated">Updated {{lastUpdated}} ago</p>
      </div>
    </div>
    <div v-if="project.moodboard.images.length" class="row no-gutters m-0 pointer" @click="handleProjectNavigation">
      <div class="col-4 p-1">
        <div
          class="bgImage"
          :style="{
            backgroundImage: `url(${this.project.moodboard.images[0].url})`
          }"
        />
      </div>
      <div class="col-2">
        <div class="row no-gutters m-0">
          <div class="col p-1">
            <div
              v-if="this.project.moodboard.images[1]"
              class="bgImage small"
              :style="{
                backgroundImage: `url(${this.project.moodboard.images[1].url})`
              }"
            />
          </div>
        </div>
        <div class="row no-gutters m-0">
          <div class="col-6 p-1">
            <div
              v-if="this.project.moodboard.images[2]"
              class="bgImage small"
              :style="{
                backgroundImage: `url(${this.project.moodboard.images[2].url})`
              }"
            />
          </div>
          <div class="col-6 p-1">
            <div
              v-if="this.project.moodboard.images[3]"
              class="bgImage small"
              :style="{
                backgroundImage: `url(${this.project.moodboard.images[3].url})`
              }"
            />
          </div>
        </div>
      </div>
      <div class="col-2">
        <div class="row no-gutters m-0">
          <div class="col p-1">
            <div
              v-if="this.project.moodboard.images[4]"
              class="bgImage"
              :style="{
                backgroundImage: `url(${this.project.moodboard.images[4].url})`
              }"
            />
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="row no-gutters m-0">
          <div class="col-8 p-1">
            <div
              v-if="this.project.moodboard.images[5]"
              class="bgImage small"
              :style="{
                backgroundImage: `url(${this.project.moodboard.images[5].url})`
              }"
            />
          </div>
          <div class="col-4 p-1">
            <div
              v-if="this.project.moodboard.images[6]"
              class="bgImage small"
              :style="{
                backgroundImage: `url(${this.project.moodboard.images[6].url})`
              }"
            />
          </div>
        </div>
        <div class="row no-gutters m-0">
          <div class="col-4 p-1">
            <div
              v-if="this.project.moodboard.images[7]"
              class="bgImage small"
              :style="{
                backgroundImage: `url(${this.project.moodboard.images[7].url})`
              }"
            />
          </div>
          <div class="col-8 p-1">
            <div
              v-if="this.project.moodboard.images[8]"
              class="bgImage small"
              :style="{
                backgroundImage: `url(${this.project.moodboard.images[8].url})`
              }"
            >
              <div
                v-if="this.project.moodboard.images.length > 9"
                class="bgImage small"
                @click="$router.push({ name: 'mood-images', params: { moodboardId: $route.params.moodboardId } })"
                :style="{
                  position: 'absolute',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 'calc(100% - 1rem)',
                  zIndex: 99,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  cursor: 'pointer'
                }"
              >
                <div :style="{ fontSize: '32px', color: 'white' }">{{ `+${this.project.moodboard.images.length - 9}` }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-images d-flex justify-content-center align-items-center flex-column">
      No images in this project yet
    </div>
  </div>
</template>
<script>
import moment from 'moment'

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      moodboard: {}
    }
  },
  methods: {
    handleProjectNavigation () {
      this.$router.push({ name: 'public-project', params: { projectId: this.project.id } })
    }
  },
  computed: {
    lastUpdated: function () {
      return moment().from(this.project.updatedAt, true)
    }
  }
}
</script>
<style scoped>
.project-preview {
  margin-top: 50px;
}
.bgImage {
  background-size: cover;
  background-position: center;
  height: 416px;
  border-radius: 20px;
  z-index: 99;
}
.small {
  height: 200px;
}
.alt-button {
  min-width: 0;
}
.menu-box {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #d5d8e2;
  margin-left: 20px;
  background-color: white;
}
.menu-box:hover {
  cursor: pointer;
  background-color: #E9F4F3;
}
.no-images {
  margin: 10px 150px;
  height: 350px;
  border: 2px dashed #d5d8e2;
  background-color: white;
  border-radius: 20px;
}
.hover {
  cursor: pointer;
}
</style>
