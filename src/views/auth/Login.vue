<template>
  <div class="view-auth">
    <div class="row p-md-5 justify-content-center">
      <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4" style="z-index: 10;">
        <validation-observer ref="loginForm" tag="form" v-slot="{ invalid }" @submit.prevent="submit()">
          <img :src="logoSVG" :style="{ width: '170px', marginBottom: '4rem' }" />

          <legend>
            <div :style="{ width: '100%' }">
              <h2 :style="{ textAlign: 'left' }">Log in</h2>
              <div :style="{ display: 'flex' }">
                <div :style="{ width: '50%', border: '1px solid rgba(30,33,43,0.1)' }" />
                <div :style="{ width: '50%', border: '1px solid rgba(30,33,43,1)' }" />
              </div>
            </div>
          </legend>

          <fieldset class="p-4 pt-5 bg-white shadow" :style="{ borderRadius: '0 0 8px 8px' }">
            <div class="form-group">
              <validation-provider name="email" rules="required" v-slot="{ errors, classes }">
                <label for="email">Email Address</label>
                <input
                  tabindex="2"
                  v-model="credentials.email"
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

            <div class="form-group">
              <validation-provider name="password" rules="required" v-slot="{ errors, classes }">
                <div :style="{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }">
                  <label for="password">Password</label>
                  <router-link
                    :to="{ name: 'forgot-password' }"
                    class="btn btn-link"
                    :style="{ lineheight: '1', fontWeight: '500', fontSize: '14px' }"
                    >Forgot your password?</router-link
                  >
                </div>
                <input
                  tabindex="2"
                  v-model="credentials.password"
                  id="password"
                  type="password"
                  class="form-control"
                  name="password"
                  placeholder="Password"
                  :class="classes"
                />
                <transition name="fade-grow" mode="out-in">
                  <div class="invalid-feedback" v-if="errors">{{ errors[0] }}</div>
                </transition>
              </validation-provider>
            </div>

            <div class="action-container">
              <transition name="fade" mode="out-in">
                <div
                  class="text-danger mt-0 mb-3 align-self-start"
                  role="alert"
                  v-if="failedLogin"
                  v-html="failedMessage"
                ></div>
              </transition>
              <p-s-button-loader
                tabindex="3"
                class="btn-primary w-100"
                text="Login"
                :disabled="invalid"
                :loading="loading"
              />
              <div class="mt-5">
                New to Habitat?<span
                  ><router-link class="btn btn-link ml-1 text-styling" :to="{ name: 'register' }"
                    >Create your free account</router-link
                  ></span
                >
              </div>
            </div>
          </fieldset>
        </validation-observer>
      </div>
      <div class="">
        <img :src="Image" :style="{ width: '100vh', position: 'fixed', top: 0, right: 0, opacity: 0.1, zIndex: 0 }" />
        <!-- <img :src="ImageGroup" :style="{ width: '900px', position: 'fixed', top: '50px', right: '100px', zIndex: 2 }" class="d-none d-xxl-block"/> -->
        <!-- <div
          :style="{
            height: '100vh',
            width: '433px',
            backgroundImage: 'linear-gradient(to left, rgba(248,248,248,0), rgba(248,248,248,1)',
            position: 'fixed',
            top: 0,
            right: '30vw',
            zIndex: 1
          }"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { ALOGIN } from '@/store/action-types'
import store from '@/store'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import PSButtonLoader from '@/components/form/PSButtonLoader'
import logoSVG from '@/assets/img/habitat-logo.svg'
import Image from '@/assets/img/backdrop.png'
// import ImageGroup from '@/assets/img/image-group.png'
import { mapState } from 'vuex'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    PSButtonLoader
  },
  data () {
    return {
      logoSVG,
      Image,
      // ImageGroup,
      credentials: {
        email: '',
        password: ''
      },
      loading: false,
      failedLogin: false,
      failedMessage: '! Please check your credentials and try again.'
    }
  },
  computed: {
    ...mapState({
      state: state => state
    })
  },
  methods: {
    async submit () {
      this.failedLogin = false
      const isValid = await this.$refs.loginForm.validate()
      if (!isValid) {
        return
      }

      this.loading = true
      try {
        // const response =
        await store.dispatch(ALOGIN, this.credentials)
        // if (response.data.user.habitats.current) {
        //   await this.$router.push({ name: 'habitats-view', params: { id: response.data.user.habitats.current.id } })
        // }
        this.$router.push({ name: 'habitats-view' })
      } catch (e) {
        console.log(e)
        this.failedLogin = true
        this.failedMessage = e.response.data.message
      }
      this.loading = false
    }
  },
  mounted () {
    console.log(this.state)
  }
}
</script>
