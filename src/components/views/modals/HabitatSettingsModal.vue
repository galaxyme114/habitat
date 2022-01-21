<template>
  <validation-observer ref="createHabitat" tag="form" v-slot="{ invalid }">
    <b-modal id="habitat-settings-modal" :visible="show" @hidden="hideModal">
      <template #modal-header>
        <!-- Emulate built in modal header close button action -->
        <div id="close-button" class="pointer" @click="hideModal">
          <stream-line-icon :icon="FormValidation.Close" :stroke="iconColour" :size="16" />
        </div>
        <div id="title">Habitat Settings</div>
      </template>
      <template #default>
        <PSTextValidate id="name" label="Habitat Name" placeholder="Your Habitats Name" v-model="habitatPlaceholder.name" />
        <label for="address" class="ml-2">Habitat Address</label>
        <div class="input-group">
          <vue-google-autocomplete
            id="habitat-address"
            classname="form-control mb-3"
            placeholder="Start typing your address"
            v-on:placechanged="getAddressData"
            :enable-geolocation="true"
            :value="habitatPlaceholder.address.fullAddress"
          />
        </div>
      </template>
      <template #modal-footer>
        <button class="btn btn-rounded btn-primary" :disabled="invalid" @click="updatedHabitat">Update Habitat</button>
      </template>
    </b-modal>
  </validation-observer>
</template>
<script>
import api from '@/api'
import { AGETAUTHENTICATEDUSER, ALOADHABITATS } from '@/store/action-types'
import { mapState } from 'vuex'
import { BModal } from 'bootstrap-vue'
import { ValidationObserver } from 'vee-validate'
import PSTextValidate from '@/components/form/PSTextValidate'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import FormValidation from '@streamlinehq/streamline-regular/lib/interface-essential/FormValidation'
import VueGoogleAutocomplete from 'vue-google-autocomplete'

export default {
  name: 'CreateHabitatModal',
  props: ['show', 'habitat'],
  components: {
    BModal,
    ValidationObserver,
    PSTextValidate,
    StreamLineIcon,
    VueGoogleAutocomplete
  },
  data () {
    return {
      FormValidation,
      address: {}
    }
  },
  computed: {
    ...mapState({
      iconColour: (state) => {
        if (state.auth.user === null || state.auth.user.theme === 'light') {
          return '#1E212B'
        }

        return 'ffffff'
      },
      user: (state) => state.auth.user
    }),
    habitatPlaceholder: {
      get: function () {
        return {
          name: this.habitat.name,
          id: this.habitat.id,
          address: this.habitat.address ?? ''
        }
      },
      set: function (newValue) {
        return newValue
      }
    }
  },
  methods: {
    hideModal () {
      this.$emit('closeModal')
    },
    async updatedHabitat () {
      await api.habitats.update(this.habitatPlaceholder)
      await this.$store.dispatch(ALOADHABITATS)
      await this.$store.dispatch(AGETAUTHENTICATEDUSER)
      this.$toasted.success('Habitat updated.')
      this.$emit('closeModal')
    },
    // eslint-disable-next-line
    getAddressData(addressData, placeResultsData, id) {
      this.habitatPlaceholder.address = { ...addressData, state: addressData.administrative_area_level_1 }
      delete this.habitatPlaceholder.administrative_area_level_1
      delete this.habitatPlaceholder.administrative_area_level_2
    }
  }
}
</script>
