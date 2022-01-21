<template>
  <validation-provider tag="div" class="form-group" name="Habitat" v-slot="{ errors, classes }" rules="select_required">
    <v-select :options="options" label="text" :value="value" @input="updateValue" :clearable="false" class="mt-2" :class="classes">
      <template v-slot:option="option">
        <div v-if="!option.value"></div>
        <div v-else class="select-option">
          <img v-if="option.image" :src="option.image" />
          <span v-else :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '10px' }"
            ><stream-line-icon :icon="Pictures.PictureLandscape" :size="20"
          /></span>
          {{ option.text }}
        </div>
      </template>
      <template v-slot:selected-option="option">
        <div v-if="!option.value">
          <div class="select-option default-option">
            <span :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '10px' }"
              ><stream-line-icon :icon="ConceptionProjects.ProjectNotesBuildings" :size="20"
            /></span>
            <div class="option-text">
              <div class="option-title">Add to a {{variant === 'habitat' ? 'Habitat' : 'Project'}}</div>
              <div class="option-description">Curate Images, Articles & Room plans into one space.</div>
            </div>
          </div>
        </div>
        <div v-else class="select-option">
          <img v-if="option.image" :src="option.image" />
          <span v-else :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '10px' }"
            ><stream-line-icon :icon="Pictures.PictureLandscape" :size="20"
          /></span>
          {{ option.text }}
        </div>
      </template>
      <template #list-footer>
        <div id="list-footer" class="pointer">{{ footerButtonLabel }}</div>
      </template>
    </v-select>
    <transition name="fade-grow" mode="out-in">
      <div class="invalid-feedback" v-if="errors">{{ errors[0] }}</div>
    </transition>
  </validation-provider>
</template>
<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import Pictures from '@streamlinehq/streamline-regular/lib/images-photography/Pictures'
import ConceptionProjects from '@streamlinehq/streamline-regular/lib/building-construction/ConceptionProjects'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import { ValidationProvider } from 'vee-validate'

export default {
  name: 'PSSelectValidate',
  props: {
    options: {
      required: true
    },
    footerButtonLabel: {
      type: String,
      default: 'Submit'
    },
    value: {},
    validate: {
      type: String,
      default: 'required'
    },
    variant: {
      type: String,
      default: 'habitat'
    }
  },
  components: {
    vSelect,
    StreamLineIcon,
    ValidationProvider
  },
  data () {
    return {
      Pictures,
      ConceptionProjects
    }
  },
  methods: {
    updateValue (value) {
      this.$emit('change', value)
    },
    isRequired (value) {
      return value.value ? true : 'This field is required'
    }
  }
}
</script>
