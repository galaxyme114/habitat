<template>
  <validation-provider tag="div" class="form-group" :name="label" :rules="vValidation" v-slot="{ errors, classes }">
    <label :for="id">{{ label }}</label>
    <select
      :id="id"
      :value="value"
      @change="updateChange"
      @input="updateValue"
      :name="id"
      class="form-control"
      :class="classes"
      :disabled="disabled"
    >
      <option :value="null" v-if="nullValue">Please Select</option>
      <option v-for="item in data" :key="item.key" :value="item.key">{{ item.value }}</option>
    </select>
    <transition name="fade-grow" mode="out-in">
      <div class="invalid-feedback" v-if="errors && showValidation">{{ errors[0] }}</div>
    </transition>
  </validation-provider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  components: {
    ValidationProvider
  },
  props: {
    label: {},
    id: {},
    value: {},
    data: {},
    nullValue: {
      type: Boolean,
      default: false
    },
    showValidation: {
      type: Boolean,
      default: true
    },
    validate: {
      type: String,
      default: 'required'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    vValidation () {
      if (this.showValidation) {
        return this.validate
      }
      return null
    }
  },
  methods: {
    updateValue: function (e) {
      this.$emit('input', e.target.value)
    },
    updateChange: function (e) {
      this.$emit('change', e.target.value)
    }
  }
}
</script>
