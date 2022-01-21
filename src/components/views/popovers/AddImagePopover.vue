<template>
  <b-popover id="add-image-popover" :target="target" placement="top" triggers="focus">
    <div @click="$router.push({ name: 'explore' })" class="popover-item">
      <span>
        <stream-line-icon :icon="TravelMetaphor.TravelMapFinger" :stroke="iconColour" :size="20" />
        Search & Explore
      </span>
    </div>
    <div @click="handleUploadImageClick" class="popover-item">
      <span>
        <stream-line-icon :icon="Folders.FolderImage" :stroke="iconColour" :size="20" />
        Upload Images
      </span>
    </div>
  </b-popover>
</template>
<script>
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import { BPopover } from 'bootstrap-vue'
import Folders from '@streamlinehq/streamline-regular/lib/files-folders/Folders'
import TravelMetaphor from '@streamlinehq/streamline-regular/lib/travel/TravelMetaphor'
import { mapState } from 'vuex'

export default {
  props: ['target'],
  components: {
    StreamLineIcon,
    BPopover
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
  data () {
    return {
      Folders,
      TravelMetaphor
    }
  },
  methods: {
    handleUploadImageClick () {
      this.$emit('uploadImage')
    }
  }
}
</script>
