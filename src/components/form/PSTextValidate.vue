<template>
  <validation-provider
    tag="div"
    class="form-group"
    :style="{ display: 'flex', flexDirection: 'column', alignItems: 'left' }"
    :rules="validate"
    v-slot="{ errors, classes }"
  >
    <label v-if="label" :for="id" class="ml-2">{{ label }}</label>
    <div class="input-group" :class="classes">
      <div class="input-group-prepend" v-if="prepend">
        <span class="input-group-text">{{ prepend }}</span>
      </div>
      <input
        :value="value"
        @input="updateValue"
        :id="id"
        :type="type"
        :step="step"
        class="form-control"
        :class="classes"
        :placeholder="placeholder"
        :name="id"
        :disabled="disabled"
        :readonly="readonly"
      />
      <div class="input-group-append" v-if="append">
        <span class="input-group-text">{{ append }}</span>
      </div>
    </div>
    <transition name="fade-grow" mode="out-in">
      <div class="invalid-feedback" v-if="errors">{{ errors[0] }}</div>
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
    id: {},
    label: {
      default: null
    },
    type: {
      type: String,
      default: 'text'
    },
    value: {},
    placeholder: {},
    validate: {
      type: String,
      default: 'required'
    },
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
    step: {
      default: 0.01
    }
  },
  methods: {
    updateValue (e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>
