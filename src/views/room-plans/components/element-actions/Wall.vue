<template>
  <div>
    <button class="btn btn-outline-primary" @click="$emit('delete-element')">Delete</button>
    <stream-line-icon :icon="Construction.ConstructionBrick" :stroke="iconConfig.colour" :size="iconConfig.size" />
  </div>
</template>
<script>
import { iconConfig, toolTipConfig } from './../../config'

import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import Construction from '@streamlinehq/streamline-regular/lib/building-construction/Construction'

export default {
  props: {
    length: {
      required: true
    },
    element: {
      required: true
    }
  },
  components: {
    StreamLineIcon
  },
  data () {
    return {
      iconConfig,
      toolTipConfig,
      Construction
    }
  }
}
</script>
