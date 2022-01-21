<template>
  <div id="user-settings">
    <h3 class="d-none d-lg-block">Settings</h3>
    <h4 class="d-block d-lg-none">Settings</h4>
    <div class="settings-card">
      <div class="settings-card-header">
        <div class="item-border" :class="{ highlight: selected == 'profile' }" @click="selected = 'profile'">
          Edit Profile
        </div>
        <div class="item-border" :class="{ highlight: selected == 'password' }" @click="selected = 'password'">
          Change Password
        </div>
        <div class="item-border" :class="{ highlight: selected == 'notification' }" @click="selected = 'notification'">
          Notifications
        </div>
      </div>
      <div class="settings-card-body">
        <div v-if="selected == 'profile'">
          <div class="user-image-wrap" :style="{ width: '70%' }">
            <label class="label-width">Profile Photo</label>
            <div class="hover" @click="showModal = true">
              <div
                v-if="user.image"
                class="profile-image"
                :style="{ backgroundImage: `url(${user.image.url})`, height: '120px', width: '120px' }"
              />
              <img v-else :src="placeholder" :alt="user.fullName" />
            </div>
          </div>
          <validation-observer ref="observer" tag="form" v-slot="{ invalid }" @submit.prevent="submit">
            <fieldset :style="{ width: '70%' }">
              <div class="setting-item">
                <label class="label-width">Name</label>
                <div class="setting-item name-settings" :style="{ marginBottom: '0' }">
                  <PSTextValidate
                    id="first_name"
                    label="First Name"
                    v-model="user.firstName"
                    @input="updateValue('firstName', $event)"
                    placeholder="First Name"
                    :style="{ marginRight: '20px', minWidth: '215px' }"
                  />
                  <PSTextValidate
                    id="last_name"
                    label="Last Name"
                    v-model="user.lastName"
                    @input="updateValue('lastName', $event)"
                    placeholder="Last Name"
                    :style="{ minWidth: '215px' }"
                  />
                </div>
              </div>
              <div class="setting-item">
                <label class="label-width">Email</label>
                <PSTextValidate
                  id="email"
                  v-model="user.email"
                  @input="updateValue('email', $event)"
                  placeholder="Email"
                  :validate="emailValidation"
                  :style="{ maxWidth: '450px', width: '100%' }"
                />
              </div>
              <div class="setting-item align-items-start">
                <label class="label-width mt-2">Bio</label>
                <PSTextArea
                  id="bio"
                  @input="updateValue('bio', $event)"
                  v-model="user.bio"
                  placeholder="Bio"
                  :style="{ maxWidth: '450px', width: '100%' }"
                />
              </div>
              <div class="setting-item">
                <label class="label-width">Phone Number</label>
                <PSInput
                  id="phone_number"
                  @input="updateValue('phone', $event)"
                  v-model="user.phone"
                  placeholder="0434 123 456"
                  :style="{ maxWidth: '450px', width: '100%' }"
                />
              </div>
              <div class="setting-item">
                <label class="label-width">Private Profile</label>
                <b-form-checkbox :style="{ marginLeft: '5px' }" switch size="xl" />
              </div>
              <div class="form-group" :style="{ marginLeft: '190px' }">
                <button type="submit" class="btn btn-rounded btn-secondary" :disabled="invalid">Save</button>
              </div>
            </fieldset>
          </validation-observer>
        </div>
        <div v-else-if="selected == 'password'" :style="{ marginTop: '20px' }">
          <validation-observer ref="password-form" tag="form" v-slot="{ invalid }" @submit.prevent="updatePassword">
            <fieldset :style="{ width: '70%' }">
              <div class="setting-item">
                <label class="label-width">New Password</label>
                <PSTextValidate
                  id="new_password"
                  name="password"
                  type="password"
                  v-model="password"
                  placeholder="Enter your new password"
                  :style="{ maxWidth: '450px', width: '100%' }"
                />
              </div>
              <div class="setting-item">
                <label class="label-width">Confirm New Password</label>
                <PSTextValidate
                  id="email"
                  v-model="confirm"
                  type="password"
                  placeholder="Confirm your new password"
                  :style="{ maxWidth: '450px', width: '100%' }"
                />
              </div>
              <div class="form-group" :style="{ marginLeft: '190px' }">
                <button type="submit" class="btn btn-rounded btn-secondary" :disabled="invalid">Save</button>
              </div>
            </fieldset>
          </validation-observer>
        </div>
        <div v-if="selected == 'notification'">
          <div id="notifications" class="pt-3">
            <div class="container">
              <div id="header" class="mb-5 d-flex justify-content-between align-items-center">
                <h3>Notifications</h3>
                <span v-if="notifications.length > 0" class="clear-all" @click="showClearNotificationConfirm = true">Clear All</span>
              </div>
              <div v-for="(notification, index) in notifications" :key="`notification-${index}`" class="notification mb-3 pb-3">
                <div class="d-flex">
                  <span :style="{ backgroundColor: '#e9f4f3', padding: '17px', borderRadius: '8px', marginRight: '15px' }">
                    <b-icon-bookmark-star style="width: 30px; height: 30px;"></b-icon-bookmark-star>
                  </span>
                  <div>
                    <h5>{{ notification.title }} <small class="text-muted ml-2">{{ notification.timeDiff }}</small></h5>
                    <p class="text-muted">{{ notification.text }}</p>
                  </div>
                </div>
              </div>
              <div v-if="notifications.length === 0">
                <h3 class="text-muted">No Data</h3>
              </div>
            </div>
            <ClearNotificationsConfirm
              :show="showClearNotificationConfirm"
              @close="showClearNotificationConfirm = false"
              @ok="handleClearAll"
            />
          </div>
        </div>
      </div>
    </div>
    <b-modal v-model="showModal" title="Upload Images" ok-only ok-title="Done" @ok="fetchUser">
      <dropzone id="dropzone" :url="url" accepted-file-types="image/*" :header="headers" />
    </b-modal>
  </div>
</template>

<script>
import api from './../../api'
import { AGETAUTHENTICATEDUSER, FETCH_NOTIFICATIONS } from '@/store/action-types'
import { mapState, mapGetters } from 'vuex'
import PSTextValidate from '../../components/form/PSTextValidate.vue'
import PSTextArea from '../../components/form/PSTextArea.vue'
import PSInput from '../../components/form/PSInput'
import { ValidationObserver } from 'vee-validate'
import placeholder from '@/assets/icons/placeholder@2x.png'
import { BFormCheckbox, BModal, BIconBookmarkStar } from 'bootstrap-vue'
import ClearNotificationsConfirm from '@/components/views/modals/ClearNotificationsConfirm'
import Dropzone from '../../components/form/DropZone'

export default {
  components: {
    ValidationObserver,
    PSTextValidate,
    PSTextArea,
    PSInput,
    BFormCheckbox,
    BModal,
    Dropzone,
    BIconBookmarkStar,
    ClearNotificationsConfirm
  },
  data: function () {
    return {
      placeholder,
      selected: 'profile',
      password: null,
      confirm: null,
      firstRun: true,
      lightDark: false,
      url: process.env.VUE_APP_API_URL + '/v1/media/user-profile',
      showModal: false,
      showClearNotificationConfirm: false
    }
  },
  computed: {
    user: {
      get () {
        return this.$store.state.auth.user
      },
      set (data) {
        return data
      }
    },
    emailValidation () {
      return 'required|email|api_validate_email:' + this.user.id
    },
    ...mapState({
      roles: (state) => state.constants.roles,
      themes: (state) =>
        Object.keys(state.constants.themes).map((key) => {
          return { key, value: state.constants.themes[key] }
        }),
      statuses: (state) => state.constants.statuses,
      headers: (state) => {
        return { Authorization: 'Bearer ' + state.auth.tokens.access.token }
      },
      userId: state => state.auth.user.id,
      notifications: state => state.notifications.notifications
    }),
    ...mapGetters(['isAdministrator'])
  },
  methods: {
    updateValue (name, e) {
      this.user[name] = e
    },
    async submit () {
      const isValid = await this.$refs.observer.validate()
      if (!isValid) {
        this.$toasted.error('User not updated.')
      }
      await api.auth.update({
        id: this.user.id,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        bio: this.user.bio,
        phone: this.user.phone
      })
      this.$toasted.success('User Updated')
    },
    async updatePassword () {
      // const isValid = await this.$refs['password-form'].validate()
      if (this.password !== this.confirm) {
        this.$toasted.error('Passwords must match')
        this.password = null
        this.confirm = null
        return
      }
      try {
        await api.auth.update({
          id: this.user.id,
          password: this.password
        })
        this.$toasted.success('Password updated')
        this.password = null
        this.confirm = null
        this.selected = 'profile'
      } catch (e) {
      }
    },
    async fetchUser () {
      await this.$store.dispatch(AGETAUTHENTICATEDUSER)
    },
    async handleClearAll () {
      try {
        await api.notifications.deleteAllNotifications(this.userId)
        this.$toasted.success('Notifications have been deleted!')
      } catch (e) {
        this.$toasted.error(e.response.data.message)
      }
      this.$store.dispatch(FETCH_NOTIFICATIONS)
    }
  },
  watch: {
    async lightDark () {
      if (this.firstRun) {
        return null
      }

      let theme = 'light'
      if (this.lightDark) {
        theme = 'dark'
      }

      this.user = {
        id: 'theme',
        value: theme
      }

      await api.auth.update({
        id: this.user.id,
        theme
      })
    }
  },
  created () {
    if (this.user.theme === 'dark') {
      this.lightDark = true
    }
    this.firstRun = false

    if (this.$route.query.tab === 'notification') {
      this.selected = 'notification'
    }
  }
}
</script>
