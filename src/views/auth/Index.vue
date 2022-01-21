<template>
  <transition name="fade" mode="out-in">
    <component :is="show"/>
  </transition>
</template>
<script>
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import ResetPassword from '@/views/auth/ResetPassword.vue'

export default {
  props: {
    show: {
      required: true
    }
  },
  components: {
    Login,
    Register,
    ForgotPassword,
    ResetPassword
  }
}
</script>
