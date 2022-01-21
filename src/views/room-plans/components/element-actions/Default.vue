<template>
  <div>
    <input :value="length" v-if="element.segments && element.segments.length > 1" type="number" @change="$emit('length-change')"/>
    <br />
    <button class="btn btn-outline-primary" @click="$emit('delete-element')">Delete</button>
    <pre>{{ element.type }}</pre>
  </div>
</template>
<script>
export default {
  props: {
    length: {
      required: true
    },
    element: {
      required: true
    }
  }
}
</script>
