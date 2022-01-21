<template>
  <div class="view-auth">
    <!-- <img :src="Image" :style="{ width: '100vh', position: 'fixed', top: 0, left: 0, opacity: 0.1, zIndex: 0 }" /> -->

    <div class="row justify-content-center">
      <div class="col-12 col-lg-10 col-xl-8">
        <div class="row">
          <div class="col-12 col-md-6 pt-5 pr-5">
            <img :src="logoSVG" :style="{ width: '170px', marginLeft: '2rem', marginBottom: '4rem' }" />
            <ul class="list-checked d-none d-md-block">
              <li>
                <stream-line-icon :icon="FormValidation.CheckCircle1" :stroke="iconColour" :size="22" />
                <div>
                  <h5>Build inspiration boards</h5>
                  <p>Search over 100k of inspiration images for your next prjects</p>
                </div>
              </li>
              <li>
                <stream-line-icon :icon="FormValidation.CheckCircle1" :stroke="iconColour" :size="22" />
                <div>
                  <h5>Plan your room</h5>
                  <p>Our interactive floor planner can be used to help brief tradespeople and builders</p>
                </div>
              </li>
              <li>
                <stream-line-icon :icon="FormValidation.CheckCircle1" :stroke="iconColour" :size="22" />
                <div>
                  <h5>Collaborate with your team</h5>
                  <p>Share your inspiration boards and Habitats with your family, builders or tradespeople</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="col-12 col-md-6">
            <validation-observer ref="observer" tag="form" v-slot="{ invalid }" @submit.prevent="submit()">
              <fieldset class="form-wrapper bg-white shadow" :style="{ borderRadius: '8px' }">
                <div class="title-container mb-5">
                  <h2>Create your FREE account</h2>
                  <div :style="{ display: 'flex' }">
                    <div :style="{ width: '50%', border: '1px solid rgba(30,33,43,0.1)' }" />
                    <div :style="{ width: '50%', border: '1px solid rgba(30,33,43,1)' }" />
                  </div>
                </div>

                <p-s-text-validate
                  id="email"
                  label="Email"
                  v-model="user.email"
                  placeholder="Email"
                  validate="email|required"
                />
                <p-s-text-validate id="first_name" label="First Name" v-model="user.firstName" placeholder="First Name" />
                <p-s-text-validate id="last_name" label="Last Name" v-model="user.lastName" placeholder="Last Name" />

                <div class="form-group mb-5">
                  <validation-provider name="password" rules="required" v-slot="{ errors, classes }">
                    <label for="password">Password</label>
                    <input
                      v-model="user.password"
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
                  <p-s-button-loader class="btn-primary w-100" text="Register" :disabled="invalid" :loading="loading" />
                  <br />
                  <div>
                    Already have an account?<span
                      ><router-link class="btn btn-link ml-1 text-styling" :to="{ name: 'login' }">Log in</router-link></span
                    >
                  </div>
                </div>
                <transition name="fade" mode="out-in">
                  <div class="alert alert-danger mt-3 mb-0" role="alert" v-if="failedRegister" v-html="failedMessage"></div>
                </transition>
              </fieldset>
            </validation-observer>
          </div>
        </div>
      </div>
    </div>
    <!-- <img :src="Image" :style="{ width: '100vh', position: 'fixed', top: 0, right: 0, opacity: 0.1, zIndex: 0 }" /> -->
  </div>
</template>
<script>
import { AREGISTER } from '@/store/action-types'
import store from '@/store'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import PSTextValidate from '@/components/form/PSTextValidate'
import PSButtonLoader from '@/components/form/PSButtonLoader'
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import FormValidation from '@streamlinehq/streamline-regular/lib/interface-essential/FormValidation'
import logoSVG from '@/assets/img/habitat-logo.svg'
import Image from '@/assets/img/backdrop.png'
import ImageGroup from '@/assets/img/image-group.png'
import { mapState } from 'vuex'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    StreamLineIcon,
    PSTextValidate,
    PSButtonLoader
  },
  data () {
    return {
      FormValidation,
      logoSVG,
      Image,
      ImageGroup,
      user: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        avatarColor: Math.floor(Math.random() * 13)
      },
      loading: false,
      failedRegister: false,
      failedMessage: 'Please fill out all of the fields.'
    }
  },
  computed: {
    ...mapState({
      state: state => state
    })
  },
  methods: {
    async submit () {
      this.failedRegister = false
      const isValid = await this.$refs.observer.validate()
      if (!isValid) {
        return
      }

      this.loading = true
      try {
        await store.dispatch(AREGISTER, this.user)
        await this.$router.push('/habitats')
      } catch (e) {
        this.failedMessage = e.response.data.message
        this.failedRegister = true
      }
      this.loading = false
    }
  },
  mounted () {
    console.log(this.state)
  }
}
</script>
