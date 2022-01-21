<template>
  <div class="inspiration-image">
    <img :src="image.url" class="card-img-top radius size" />
    <button class="delete-icon" :id="image.id" @click="focus" :ref="image.id">
      <stream-line-icon :icon="Delete.Bin1" :stroke="iconColour" :size="20" />
    </button>
    <div class="tag-container" v-if="image.tags && image.tags.length">
      <div v-for="(tag, i) in image.tags" class="tag" :style="{ ...getColor(tag) }" :key="i"># {{ tag }}</div>
    </div>
    <b-popover :target="image.id" placement="top" triggers="focus">
      <div class="mb-2">Confirm Delete</div>
      <div class="d-flex flex-row justify-content-center">
        <b-button @click="deleteImage" variant="primary" class="alt-button">Yes</b-button>
      </div>
    </b-popover>
  </div>
</template>
<script>
import api from '@/api'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import Delete from '@streamlinehq/streamline-regular/lib/interface-essential/Delete'
import { mapState } from 'vuex'
import { BPopover, BButton } from 'bootstrap-vue'

export default {
  props: ['image', 'moodboard'],
  components: {
    StreamLineIcon,
    BPopover,
    BButton
  },
  data () {
    return {
      Delete,
      colors: [
        { color: '#70A288', backgroundColor: '#D8EAE0' },
        { color: '#F76F8E', backgroundColor: '#F2D9DF' },
        { color: '#784590', backgroundColor: '#C3ACCE' },
        { color: '#457090', backgroundColor: '#CFEBF7' }
      ]
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
    getColor (tag) {
      if (tag === 'featured') {
        return { color: '#D18C08', backgroundColor: '#FFF4DB' }
      }

      const rand = Math.floor(Math.random() * 3)

      return this.colors[rand]
    },
    focus () {
      this.$refs[this.image.id].focus()
    },
    async deleteImage () {
      try {
        await api.moodBoard.deleteImage(this.image.id, this.moodboard)
        this.$toasted.success('Image removed')
        this.$emit('refresh')
      } catch (error) {
        this.$toasted.error('Image not removed')
      }
    }
  }
}
</script>
