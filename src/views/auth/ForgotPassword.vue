<template>
  <div class="view-auth">
    <div class="row p-md-5">
      <div class="col-12 " style="z-index: 10;">
        <validation-observer ref="forgotPasswordForm" tag="form" v-slot="{ invalid }" @submit.prevent="submit()" novalidate>
          <img :src="logoSVG" :style="{ width: '170px', marginLeft: '2rem', marginBottom: '4rem' }" />

          <fieldset class="form-wrapper bg-white shadow">
            <div class="w-100 mb-3">
              <h3 class="mb-3">Reset your password</h3>
              <p>
                Enter the email address associated with your account, and we'll send you a link to reset your password.
              </p>
            </div>

            <div class="form-group">
              <validation-provider name="email" rules="required|email" v-slot="{ errors, classes }">
                <!-- <label for="email">Email</label> -->
                <input
                  v-model="email"
                  id="email"
                  type="email"
                  class="form-control"
                  name="email"
                  placeholder="Email"
                  :class="classes"
                  autofocus
                />
                <transition name="fade-grow" mode="out-in">
                  <div class="invalid-feedback" v-if="errors">{{ errors[0] }}</div>
                </transition>
              </validation-provider>
            </div>

            <div class="action-container">
              <p-s-button-loader class="btn-primary" text="Continue" :disabled="invalid" :loading="loading" />
              <br />
            </div>
            <transition name="fade" mode="out-in">
              <div class="alert mt-3 mb-0" :class="messageClass" role="alert" v-show="message" v-html="messageText"></div>
            </transition>
          </fieldset>

          <div class="action-container">
            <div>
              Don't have an account?<span
                ><router-link class="btn btn-link ml-1" :to="{ name: 'register' }">Sign up</router-link></span
              >
            </div>
          </div>
        </validation-observer>
      </div>
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import api from '@/api'
import PSButtonLoader from '@/components/form/PSButtonLoader'
import logoSVG from '@/assets/img/habitat-logo.svg'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    PSButtonLoader
  },
  data () {
    return {
      logoSVG,
      email: '',
      loading: false,
      message: false,
      messageText: null,
      messageClass: null
    }
  },
  methods: {
    async submit () {
      const isValid = await this.$refs.forgotPasswordForm.validate()
      this.message = false
      this.messageText = null
      this.loading = true
      if (!isValid) {
        return
      }
      try {
        const response = await api.auth.forgotPassword(this.email)
        this.messageClass = 'alert-success'
        this.messageText = response.data.message
        setTimeout(() => {
          this.$router.push('/login')
        }, 5000)
      } catch (e) {
        this.messageClass = 'alert-danger'
        this.messageText = e.response.data.message
      }
      this.message = true
      this.loading = false
    }
  }
}
</script>
