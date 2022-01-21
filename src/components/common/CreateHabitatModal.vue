<template>
  <validation-observer ref="createHabitat" tag="form" v-slot="{ invalid }">
    <b-modal id="new-habitat-modal" :visible="show" @hidden="hideModal">
      <template #modal-header="{ close }">
        <!-- Emulate built in modal header close button action -->
        <div id="close-button" class="pointer" @click="close()">
          <stream-line-icon :icon="FormValidation.Close" :stroke="iconColour" :size="16" />
        </div>
        <div id="title">Create a New Habitat</div>
      </template>
      <template #default>
        <div id="name-wrap">
          <PSTextValidate id="name" label="Habitat Name" placeholder="Your Habitats Name" v-model="habitat.name" />
          <span
            id="settings-button"
            @click="showSettings = !showSettings"
            :class="showSettings ? 'settings-button-active' : null"
          >
            <stream-line-icon :icon="Settings.Cog" :stroke="iconColour" :size="22" />
          </span>
        </div>
        <div class="settings-wrap" :class="showSettings ? 'show' : null">
            <label for="address" class="ml-2">Address (Optional)</label>
            <div class="input-group">
              <vue-google-autocomplete
                id="habitat-address"
                classname="form-control mb-3"
                placeholder="Start typing your address"
                v-on:placechanged="getAddressData"
                :enable-geolocation="true"
                v-model="habitat.address"
              />
            </div>
          <div id="teammates-wrap">
            <PSInput label="Invite Teammates (Optional)" placeholder="user@email.com" @enter="addInvitee" v-model="invitee" />
            <div id="teammates">
              <div v-for="(invitee, i) of invitees" :key="`teammate-${i}`" class="teammate">
                {{ invitee }}
                <span class="remove-teammate" @click="invitees.splice(i, 1)">
                  <stream-line-icon :icon="FormValidation.Close" :stroke="iconColour" :size="16" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #modal-footer>
        <button class="btn btn-rounded btn-primary" :disabled="invalid" @click="createHabitat">
          Create Habitat
        </button>
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
import PSInput from '@/components/form/PSInput'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import FormValidation from '@streamlinehq/streamline-regular/lib/interface-essential/FormValidation'
import Settings from '@streamlinehq/streamline-regular/lib/interface-essential/Settings'
import VueGoogleAutocomplete from 'vue-google-autocomplete'

export default {
  name: 'CreateHabitatModal',
  props: ['show'],
  components: {
    BModal,
    ValidationObserver,
    PSTextValidate,
    PSInput,
    StreamLineIcon,
    VueGoogleAutocomplete
  },
  data () {
    return {
      FormValidation,
      Settings,
      habitat: {
        name: '',
        address: null
      },
      showSettings: true,
      invitee: '',
      invitees: []
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
    })
  },
  methods: {
    hideModal () {
      this.$emit('closeModal')
    },
    addInvitee () {
      this.invitees.push(this.invitee)
      this.invitee = ''
    },
    async createHabitat () {
      const newHabitat = await api.habitats.add({ ...this.habitat, owners: [this.user.id] })
      for (const invitee of this.invitees) {
        await api.habitats.addUser(invitee, newHabitat.id, this.user.fullName)
      }
      await this.$store.dispatch(ALOADHABITATS)
      await this.$store.dispatch(AGETAUTHENTICATEDUSER)
      this.$toasted.success('Habitat created.')
      this.reset()
      this.$emit('closeModal')
      await this.$router.push('/habitats')
    },
    reset () {
      this.habitat = {
        name: '',
        address: null
      }
      this.invitees = []
      this.invitee = ''
    },
    selectHabitat () {
      this.$toasted.info('Not available yet!')
    },
    getAddressData (addressData, placeResultsData, id) {
      this.habitat.address = { ...addressData, state: addressData.administrative_area_level_1 }
      delete this.habitat.address.administrative_area_level_1
      delete this.habitat.address.administrative_area_level_2
      console.log(this.habitat.address)
    }
  }
}
</script>
