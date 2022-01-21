<template>
  <div class="d-flex flex-column justify-content-center align-items-center h-100">
    <h1 class="mb-5">Create a new habitat</h1>
    <validation-observer ref="loginForm" tag="form" v-slot="{ invalid }" @submit.prevent="createHabitat" class="w-50">
      <fieldset>
        <PSTextValidate id="name" label="Habitat Name" v-model="name" placeholder="Kitchen Renovation" class="mb-3" />
        <PSTextValidate id="description" label="Description" v-model="description" class="mb-3" />
        <validation-provider
          tag="div"
          class="form-group mb-3"
          :style="{ display: 'flex', flexDirection: 'column', alignItems: 'left' }"
          name="habitat-address"
          rules="required"
          v-slot="{ errors, classes }"
        >
          <label for="address" class="ml-2">Address</label>
          <div class="input-group" :class="classes">
            <vue-google-autocomplete
              id="habitat-address"
              classname="form-control"
              placeholder="Start typing your address"
              v-on:placechanged="getAddressData"
              enable-geolocation
              v-model="address"
              :class="classes"
            />
          </div>
          <transition name="fade-grow" mode="out-in">
            <div class="invalid-feedback" v-if="errors">{{ errors[0] }}</div>
          </transition>
        </validation-provider>
        <div class="form-group mb-5">
          <button type="submit" class="btn btn-rounded btn-primary" :disabled="invalid">GET STARTED</button>
        </div>
      </fieldset>
    </validation-observer>
    <!-- <div v-if="habitats.length > 1">
      <div class="mb-5">Or</div>
      <div class="form-group mb-5">
        <button class="btn btn-rounded btn-outline-secondary" @clic="selectHabitat">select existing habitat</button>
      </div>
    </div> -->
  </div>
</template>

<script>
import api from '@/api'
import { mapState } from 'vuex'
import PSTextValidate from '@/components/form/PSTextValidate'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { AGETAUTHENTICATEDUSER, ALOADHABITATS } from '@/store/action-types' // ALOADCURRENTHABITAT,
import VueGoogleAutocomplete from 'vue-google-autocomplete'

export default {
  components: {
    PSTextValidate,
    ValidationObserver,
    ValidationProvider,
    VueGoogleAutocomplete
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      habitats: (state) => state.habitats.habitats
    })
  },
  data () {
    return {
      name: null,
      address: null,
      description: null
    }
  },
  methods: {
    async createHabitat () {
      await api.habitats.add({ name: this.name, address: this.address, description: this.description, owners: [this.user.id] })
      await this.$store.dispatch(ALOADHABITATS)
      await this.$store.dispatch(AGETAUTHENTICATEDUSER)
      // await this.$store.dispatch(ALOADCURRENTHABITAT)
      await this.$router.push('/habitats')
    },
    selectHabitat () {
      this.$toasted.info('Not available yet!')
    },
    // eslint-disable-next-line
    getAddressData (addressData, placeResultsData, id) {
      this.address = { ...addressData, state: addressData.administrative_area_level_1 }
      delete this.address.administrative_area_level_1
      delete this.address.administrative_area_level_2
    }
  }
}
</script>
