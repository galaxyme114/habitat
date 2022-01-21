<template>
  <b-popover
    id="add-content-popover"
    :target="target"
    placement="top"
    triggers="focus"
  >
    <div @click="$router.push({ name: 'explore' })">
      <span>
        <stream-line-icon :icon="TravelMetaphor.TravelMapFinger" :stroke="iconColour" :size="20" />
        Search & Explore
      </span>
    </div>
    <div @click="image">
      <span>
        <stream-line-icon :icon="Folders.FolderImage" :stroke="iconColour" :size="20" />
        Upload Images
      </span>
    </div>
    <div @click="article">
      <span>
        <stream-line-icon :icon="Edit.PenWritePaper" :stroke="iconColour" :size="20" />
        Article
      </span>
    </div>
    <div @click="note">
      <span>
        <stream-line-icon :icon="Notes.NotesList" :stroke="iconColour" :size="20" />
        Note
      </span>
    </div>
    <div @click="link">
      <span>
        <stream-line-icon :icon="LinkUnlink.Hyperlink3" :stroke="iconColour" :size="20" />
        Link / Url
      </span>
    </div>
    <div @click="roomPlan">
      <span>
        <stream-line-icon :icon="MapsDimensions.RealEstateDimensionsBlock" :stroke="iconColour" :size="20" />
        Room plan
      </span>
    </div>
  </b-popover>
</template>
<script>
import { mapState } from 'vuex'
import { BPopover } from 'bootstrap-vue'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import TravelMetaphor from '@streamlinehq/streamline-regular/lib/travel/TravelMetaphor'
import Folders from '@streamlinehq/streamline-regular/lib/files-folders/Folders'
import Edit from '@streamlinehq/streamline-regular/lib/interface-essential/Edit'
import Notes from '@streamlinehq/streamline-regular/lib/content/Notes'
import LinkUnlink from '@streamlinehq/streamline-regular/lib/interface-essential/LinkUnlink'
import MapsDimensions from '@streamlinehq/streamline-regular/lib/real-estate/MapsDimensions'

export default {
  name: 'AddContentPopover',
  props: ['target'],
  components: {
    BPopover,
    StreamLineIcon
  },
  data () {
    return {
      TravelMetaphor,
      Folders,
      Edit,
      Notes,
      LinkUnlink,
      MapsDimensions
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
    image () {
      this.$emit('image')
    },
    article () {
      this.$emit('article')
    },
    note () {
      this.$emit('note')
    },
    link () {
      this.$emit('link')
    },
    roomPlan () {
      this.$emit('roomPlan')
    }
  }
}
</script>
