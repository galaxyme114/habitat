<template>
  <div class="form-group mb-3">
    <div class="d-flex align-items-center">
      <label v-if="label" :for="id" class="ml-2">{{ label }}</label>
      <div v-if="optional" class="d-flex align-items-center" :style="{ marginBottom: '0.5rem', color: 'rgba(30,33,43,0.3)' }">
        <span :style="{ marginRight: '10px', marginLeft: '25px', fontSize: '30px', lineHeight: '10px', color: '#1E212B' }">&#183;</span>
        optional
      </div>
    </div>
    <div class="input-group">
      <div class="input-group-prepend" v-if="prepend">
        <span class="input-group-text">{{ prepend }}</span>
      </div>
      <textarea
        :value="value"
        @input="updateValue"
        :id="id"
        class="form-control"
        :placeholder="placeholder"
        :name="id"
        :disabled="disabled"
        :readonly="readonly"
        :rows="4"
        v-on:keyup.enter="onEnter"
      />
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
    note: {
      type: [String, Boolean],
      default: false
    },
    optional: {
      type: Boolean,
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
