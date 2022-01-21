<template>
  <div>
    <div class="form-group w-25 mr-1">
      <label>Blocks</label>
      <input type="number" min="0.5" step="0.5" v-model="blocks" @input="updateBlocks" class="form-control">
    </div>

    <div class="form-group w-25 mr-1">
      <label>Width</label>
      <select v-model="width" @change="updateWidth" class="form-control mr-1">
        <option v-for="(width, i) in dimensions.widths" :key="i" :value="width">{{ width }}</option>
      </select>
    </div>

    <div class="form-group w-25 mr-1">
      <label>Depth</label>
      <select v-model="depth" @change="updateDepth" class="form-control mr-1">
        <option v-for="(depth, i) in dimensions.depths" :key="i" :value="depth">{{ depth }}</option>
      </select>
    </div>

    <div class="flex-grow-1"></div>

    <button class="btn btn-outline-primary mr-1" @click="$emit('delete-element')">Delete</button>

    <stream-line-icon :icon="Archives.ArchiveLocker1" :stroke="iconConfig.colour" :size="iconConfig.size" />
  </div>
</template>
<script>
import { iconConfig, toolTipConfig } from './../../config'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import Archives from '@streamlinehq/streamline-regular/lib/content/Archives'
import StandardDimensions from '../catalogue/standard-dimensions.json'
import { ROOMPLAN } from '@/store/mutation-types'
export default {
  props: {
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
      Archives,
      dimensions: StandardDimensions.cabinets,
      blocks: 1,
      width: StandardDimensions.cabinets.default.width,
      depth: StandardDimensions.cabinets.default.depth
    }
  },
  computed: {

  },
  methods: {
    updateBlocks (e) {
      this.$store.commit(ROOMPLAN.ELEMENTS.UPDATE, {
        index: this.index,
        config: {
          width: this.width / 10 * this.blocks
        }
      })
    },
    updateWidth (e) {
      this.$store.commit(ROOMPLAN.ELEMENTS.UPDATE, {
        index: this.index,
        config: {
          width: this.width / 10 * this.blocks
        }
      })
    },
    updateDepth (e) {
      this.$store.commit(ROOMPLAN.ELEMENTS.UPDATE, {
        index: this.index,
        config: {
          height: this.depth / 10
        }
      })
    }
  }
}
</script>
