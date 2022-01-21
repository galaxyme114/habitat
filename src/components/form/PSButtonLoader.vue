<template>
  <button type="submit" class="btn btn-rounded btn-loader" :disabled="disabled">
    <div class="text">{{ text }}</div>
    <loader :loading="loading"/>
  </button>
</template>
<script>
import Loader from '@/components/Loader'
export default {
  components: { Loader },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: 'Submit'
    }
  }
}
</script>
