<template>
  <div class="habitat-preview-container">
    <div class="habitat-preview-body">
      <div v-if="!images.length" @click="$router.push({ name: 'public-project', params: { projectId: project.id } })">
        <div class="row m-1">
          <div class="col-12 px-1">
            <div class="habitat-preview-image missing-image">
              <div>No Project Images</div>
            </div>
          </div>
        </div>
      </div>
      <div class="hover" @click="$router.push({ name: 'public-project', params: { projectId: project.id } })">
        <div v-if="images.length === 1">
          <div class="row m-1">
            <div class="col-12 px-1">
              <div
                class="habitat-preview-image"
                :style="{ backgroundImage: `url(${images[0].url})`, height: '400px' }"
              ></div>
            </div>
          </div>
        </div>
        <div v-else-if="images.length === 2">
          <div class="row m-1">
            <div class="col-12 px-1">
              <div class="habitat-preview-image" :style="{ backgroundImage: `url(${images[0].url})` }"></div>
            </div>
          </div>
          <div class="row m-1">
            <div class="col-12 px-1">
              <div class="habitat-preview-image" :style="{ backgroundImage: `url(${images[1].url})` }"></div>
            </div>
          </div>
        </div>
        <div v-else-if="images.length > 2">
          <div class="row m-1">
            <div class="col-12 px-1">
              <div class="habitat-preview-image" :style="{ backgroundImage: `url(${images[0].url})` }"></div>
            </div>
          </div>
          <div class="row m-1">
            <div class="col-4 px-1">
              <div
                class="habitat-preview-image"
                :style="images[1] ? { backgroundImage: `url(${images[1].url})` } : null"
              ></div>
            </div>
            <div class="col-8 px-1">
              <div
                class="habitat-preview-image"
                :style="images[2] ? { backgroundImage: `url(${images[2].url})` } : null"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div id="habitat-info" class="align-items-center">
        <div class="d-flex flex-column justify-content-center">
          <h6 class="hover" @click="$router.push({ name: 'public-project', params: { projectId: project.id } })">
            {{ project.name }}
          </h6>
          <p :style="{marginBottom: '0px'}">{{project.habitat.name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'ProfileProjectPreview',
  props: ['project'],
  data () {
    return {
      containerWidth: null,
      popoverShow: false,
      hoverCheck: true
    }
  },
  computed: {
    images: function () {
      return this.project.moodboard.images
    }
  },
  methods: {
    handlePopoverClick () {
      this.showAddImagePopover = !this.showAddImagePopover
    },
    handleUploadImageClick () {
      this.showModal = true
      this.showAddImagePopover = false
    },
    ok () {
      this.$emit('ok')
    },
    handleManageTeam () {
      this.showTeamModal = !this.showTeamModal
    }
  }
}
</script>
