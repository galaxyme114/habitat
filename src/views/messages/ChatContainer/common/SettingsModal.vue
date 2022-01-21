<template>
  <b-modal
    id="chat-settings-modal"
    class="chat-settings-modal"
    title="Settings"
    v-model="showModal"
    @hide="hide"
    hide-footer
  >
    <div class="">
      <div class="settings-tabs">
        <ul class="list-unstyled">
          <li>
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#CCCCCC" gradientColor1="#CCCCCC" gradientColor2="#CCCCCC"><path d="M13.314 7.565l-.136.126-10.48 10.488a2.27 2.27 0 003.211 3.208L16.388 10.9a2.251 2.251 0 00-.001-3.182l-.157-.146a2.25 2.25 0 00-2.916-.007zm-.848 2.961l1.088 1.088-8.706 8.713a.77.77 0 11-1.089-1.088l8.707-8.713zm4.386 4.48L16.75 15a.75.75 0 00-.743.648L16 15.75v.75h-.75a.75.75 0 00-.743.648l-.007.102c0 .38.282.694.648.743l.102.007H16v.75c0 .38.282.694.648.743l.102.007a.75.75 0 00.743-.648l.007-.102V18h.75a.75.75 0 00.743-.648L19 17.25a.75.75 0 00-.648-.743l-.102-.007h-.75v-.75a.75.75 0 00-.648-.743L16.75 15l.102.007zm-1.553-6.254l.027.027a.751.751 0 010 1.061l-.711.713-1.089-1.089.73-.73a.75.75 0 011.043.018zM6.852 5.007L6.75 5a.75.75 0 00-.743.648L6 5.75v.75h-.75a.75.75 0 00-.743.648L4.5 7.25c0 .38.282.693.648.743L5.25 8H6v.75c0 .38.282.693.648.743l.102.007a.75.75 0 00.743-.648L7.5 8.75V8h.75a.75.75 0 00.743-.648L9 7.25a.75.75 0 00-.648-.743L8.25 6.5H7.5v-.75a.75.75 0 00-.648-.743L6.75 5l.102.007zm12-2L18.75 3a.75.75 0 00-.743.648L18 3.75v.75h-.75a.75.75 0 00-.743.648l-.007.102c0 .38.282.693.648.743L17.25 6H18v.75c0 .38.282.693.648.743l.102.007a.75.75 0 00.743-.648l.007-.102V6h.75a.75.75 0 00.743-.648L21 5.25a.75.75 0 00-.648-.743L20.25 4.5h-.75v-.75a.75.75 0 00-.648-.743L18.75 3l.102.007z"></path></svg>
            Appearance
          </li>
        </ul>
      </div>
      <div>
        <div class="appearance-setting-view">
          <label class="color-radio primary">Light
            <input type="radio" v-model="theme" value="light" @click="$emit('theme', 'light')" />
            <span class="checkmark"></span>
          </label>
          <label class="color-radio primary">Dark
            <input type="radio" v-model="theme" value="dark" @click="$emit('theme', 'dark')" />
            <span class="checkmark"></span>
          </label>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { BModal } from 'bootstrap-vue'
import { mapState } from 'vuex'

export default {
  name: 'SettingsModal',
  props: ['show', 'theme'],
  components: {
    BModal
  },
  computed: {
    showModal: {
      get () {
        return this.show
      },
      set (newVal) {
        return newVal
      }
    },
    ...mapState({
      currentUser: (state) => state.auth.user
    })
  },
  methods: {
    ok () {
      this.$emit('ok')
    },
    hide () {
      this.$emit('hide')
    }
  }
}
</script>

<style lang="scss">
#chat-settings-modal .modal-header h5 {
  width: 100%;
  text-align: center;
}
</style>
