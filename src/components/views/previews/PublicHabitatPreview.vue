<template>
  <div class="habitat-preview-container">
    <div class="habitat-preview-body">
      <div v-if="!images.length">
        <div class="row m-1">
          <div class="col-12 px-1">
            <div class="habitat-preview-image missing-image">No Habitat Images</div>
          </div>
        </div>
      </div>
      <div class="hover" @click="$router.push({ name: 'public-habitat', params: { habitatId: habitat.id } })">
        <div v-if="images.length === 1">
          <div class="row m-1 mb-2">
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
      <div class="py-2">
        <h6 class="hover" @click="$router.push({ name: 'public-habitat', params: { habitatId: habitat.id } })">
          {{ habitat.name }}
        </h6>
      </div>
      <div id="habitat-info">
        <div :style="{ display: 'flex' }">
          <div
            class="habitat-owner"
            :id="`${habitat.id}-owner-${i}`"
            v-for="(owner, i) in habitat.owners"
            :key="`${habitat.id}-owner-${i}`"
          >
            <div
              v-if="owner.image"
              class="profile-image"
              :style="{ backgroundImage: `url(${owner.image.url})`, height: '32px', width: '32px' }"
            />
            <img v-else :src="placeholder" :alt="owner.fullName" />
            <b-popover :target="`${habitat.id}-owner-${i}`" :placement="'top'" triggers="hover">
              <div class="pop">{{ owner.fullName }}</div>
            </b-popover>
          </div>
          <div
            class="habitat-owner habitat-user"
            v-for="(user, i) in habitat.users"
            :key="`userImage${i}`"
            :id="`${habitat.id}-userImage-${i}`"
          >
            <div
              v-if="user.image"
              class="profile-image"
              :style="{ backgroundImage: `url(${user.image.url})`, height: '32px', width: '32px' }"
            />
            <img v-else :src="placeholder" :alt="user.fullName" />
            <b-popover :target="`${habitat.id}-userImage-${i}`" :placement="'top'" triggers="hover">
              <div class="pop">{{ user.fullName }}</div>
            </b-popover>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import api from '@/api'
// import { mapState } from 'vuex'
import placeholder from '@/assets/icons/placeholder@2x.png'
import { BPopover } from 'bootstrap-vue'

export default {
  props: ['habitat'],
  components: {
    BPopover
  },
  data () {
    return {
      placeholder,
      images: [],
      containerWidth: null,
      popoverShow: false,
      showAddImagePopover: false,
      showModal: false,
      showTeamModal: false,
      hoverCheck: true
    }
  },
  watch: {
    habitat: {
      deep: true,
      handler () {
        this.collateHabitatImages()
      }
    }
  },
  methods: {
    collateHabitatImages () {
      this.images = []
      this.images = this.images.concat(this.habitat.moodboard.images)
      this.habitat.projects.forEach((project) => {
        this.images = this.images.concat(project.moodboard.images)
      })
    }
  },
  mounted () {
    this.collateHabitatImages()
  }
}
</script>
