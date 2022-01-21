<template>
  <div>
    <input :value="length" v-if="element.segments && element.segments.length > 1" type="number" @change="$emit('length-change')"/>
    <input v-model.number="width" type="number" @input="handleWidthChange"/>
    <br />
    <button class="btn btn-outline-primary" @click="$emit('delete-element')">Delete</button>
    <stream-line-icon :icon="ArchitecturalFeatures.ArchitectureDoor" :stroke="iconConfig.colour" :size="iconConfig.size" />
  </div>
</template>
<script>
import { iconConfig, toolTipConfig } from './../../config'
import { ROOMPLAN } from '@/store/mutation-types'

import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import ArchitecturalFeatures from '@streamlinehq/streamline-regular/lib/building-construction/ArchitecturalFeatures'

export default {
  props: {
    length: {
      required: true
    },
    index: {
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
      ArchitecturalFeatures,
      origWidth: null,
      width: null,
      dataset: {}
    }
  },
  computed: {
    scale () {
      return this.width / this.origWidth
    }
  },
  methods: {
    handleWidthChange (e) {
      const size = this.width
      const dataset = {
        width: this.dataset.width * this.scale,
        height: this.dataset.height * this.scale,
        x: this.dataset.x * this.scale,
        y: this.dataset.y * this.scale
      }

      this.$store.commit(ROOMPLAN.ELEMENTS.UPDATE, {
        index: this.index,
        config: {
          width: size,
          height: size
        },
        dataset
      })
    }
  },
  created () {
    this.origWidth = this.width = this.element.config.width
    this.assetConfig = { ...this.element.assetConfig }
  }
}
</script>
