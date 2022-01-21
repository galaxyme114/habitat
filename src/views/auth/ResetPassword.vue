<template>
  <div class="view-auth">
    <div class="get-started">
      <p>Don't have an account?</p>
      <router-link :to="{ name: 'register' }" class="btn btn-outline-dark btn-rounded">Get Started</router-link>
    </div>
    <div class="reset-password-container col-12 col-lg-4">
      <validation-observer ref="resetPasswordForm" tag="form" v-slot="{ invalid }" @submit.prevent="submit()">
        <fieldset>
          <legend>
            <h2>Reset your Password</h2>
            <h3>Enter and confirm your password below</h3>
          </legend>

          <div class="form-group">
            <validation-provider name="password" rules="required|min:8" v-slot="{ errors, classes }">
              <label for="password">Password</label>
              <input
                v-model="password"
                id="password"
                type="password"
                class="form-control"
                name="password"
                placeholder="Password"
                :class="classes"
                autofocus
              />
              <transition name="fade-grow" mode="out-in">
                <div class="invalid-feedback" v-if="errors">{{ errors[0] }}</div>
              </transition>
            </validation-provider>
          </div>
          <div class="form-group">
            <validation-provider name="passwordConfirm" rules="required|password:@password" v-slot="{ errors, classes }">
              <label for="passwordConfirm">Confirm password</label>
              <input
                v-model="passwordConfirm"
                id="passwordConfirm"
                type="password"
                class="form-control"
                name="passwordConfirm"
                placeholder="Confirm password"
                :class="classes"
                autofocus
              />
              <transition name="fade-grow" mode="out-in">
                <div class="invalid-feedback" v-if="errors">{{ errors[0] }}</div>
              </transition>
            </validation-provider>
          </div>

          <div class="action-container">
            <p-s-button-loader class="btn-primary" text="Reset Password" :disabled="invalid" :loading="loading" />
            <br />
            <router-link class="btn btn-link btn-sm" :to="{ name: 'login' }">Back to login</router-link>
          </div>
          <transition name="fade" mode="out-in">
            <div class="alert mt-3 mb-0" :class="messageClass" role="alert" v-show="message" v-html="messageText"></div>
          </transition>
        </fieldset>
      </validation-observer>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import PSButtonLoader from '@/components/form/PSButtonLoader'

extend('password', {
  params: ['target'],
  validate (value, { target }) {
    return value === target
  },
  message: 'Passwords do not match'
})

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    PSButtonLoader
  },
  data () {
    return {
      password: '',
      passwordConfirm: '',
      token: null,
      loading: false,
      message: false,
      messageText: null,
      messageClass: null
    }
  },
  methods: {
    async submit () {
      this.message = false
      this.messageText = null
      const isValid = await this.$refs.resetPasswordForm.validate()
      if (!isValid) {
        return
      }
      this.loading = true
      try {
        const response = await api.auth.resetPassword(this.token, this.password)
        this.messageClass = 'alert-success'
        this.messageText = response.data.message
        this.message = true
        setTimeout(() => {
          this.$router.push('/login')
        }, 5000)
      } catch (e) {
        this.messageClass = 'alert-danger'
        this.messageText = e.response.data.message
        this.message = true
      }
      this.loading = false
    }
  },
  created () {
    this.token = this.$route.query.token ? this.$route.query.token : null
  }
}
</script>
