<template>
  <div class="form-group mb-3">
    <label v-if="label" :for="id" class="ml-2">{{ label }}</label>
    <div class="input-group">
      <div class="input-group-prepend" v-if="prepend">
        <span class="input-group-text">{{ prepend }}</span>
      </div>
      <input
          :value="value"
          @input="updateValue"
          :id="id"
          :type="type"
          class="form-control"
          :placeholder="placeholder"
          :name="id"
          :disabled="disabled"
          :autocomplete="autocomplete"
          :readonly="readonly"
          v-on:keyup.enter="onEnter"
      >
      <div class="input-group-append" v-if="append">
        <span class="input-group-text">{{ append }}</span>
      </div>
    </div>
    <div class="small text-muted" v-if="note !== false">{{ note }}</div>
  </div>
</template>
<script>
export default {
  props: {
    id: {},
    label: {
      default: null
    },
    value: {},
    placeholder: {},
    disabled: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      type: String,
      default: 'yes'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    prepend: {
      type: String
    },
    append: {
      type: String
    },
    type: {
      type: String,
      default: 'text'
    },
    note: {
      type: [String, Boolean],
      default: false
    }
  },
  methods: {
    updateValue: function (e) {
      this.$emit('input', e.target.value)
    },
    onEnter: function () {
      this.$emit('enter')
    }
  }
}
</script>
