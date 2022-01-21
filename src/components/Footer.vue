<template>
  <div class="app-footer">
    <div class="container d-flex d-md-flex row">
      <div class="col-12 col-md-5">
        <router-link class="navbar-brand" to="/">
          <img :src="logoWhiteSVG" />
        </router-link>
      </div>

      <div class="col-12 col-md-7">
        <div class="row">
          <div class="col-6 col-md-6 col-lg-4 footer-menu">
            <!-- <div class="title">FOLLOW US</div>
            <a href="">LinkedIn</a>
            <a href="">Instagram</a>
            <a href="">Facebook</a> -->
            <div class="title">ABOUT</div>
            <a href="">How Habitat Works</a>
            <a href="">Founders</a>
          </div>
          <div class="col-6 col-md-6 col-lg-4 footer-menu">
            <div class="title">PARTNERSHIPS</div>
            <a href="">Habitat for retail</a>
            <a href="">Industry partners</a>
          </div>
          <div class="col-12 col-lg-4 footer-menu">
            <div class="row">
              <div class="col-6 col-lg-12">
                <div class="title">SUPPORT</div>
                <a href="">Live Chat</a>
                <a href="">Help centre</a>
              </div>

              <div class="col-6 col-lg-12">
                <div class="spacer d-none d-lg-block"></div>
                <div class="title">TOOLS & TIPS</div>
                <a href="">Blog</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="content accordion d-block d-md-none" role="tablist">
      <b-button
        block
        squared
        v-b-toggle.accordion-1
        variant="link"
        class="text-white text-uppercase font-weight-bold text-left pl-0 border-top d-flex justify-content-between"
      >
        <span>About</span>
        <stream-line-icon :icon="RemoveAdd.Add" stroke="white" :size="16" class="icon-open" />
        <stream-line-icon :icon="RemoveAdd.Subtract" stroke="white" :size="16" class="icon-close" />
      </b-button>
      <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel" class="my-2">
        <a href="" class="d-block text-white">How Habitat Works</a>
        <a href="" class="d-block text-white">Founders</a>
      </b-collapse>

      <b-button
        block
        squared
        v-b-toggle.accordion-2
        variant="link"
        class="text-white text-uppercase font-weight-bold text-left pl-0 border-top d-flex justify-content-between"
      >
        <span>Support</span>
        <stream-line-icon :icon="RemoveAdd.Add" stroke="white" :size="16" class="icon-open" />
        <stream-line-icon :icon="RemoveAdd.Subtract" stroke="white" :size="16" class="icon-close" />
      </b-button>
      <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel" class="my-2">
        <a href="" class="d-block text-white">Live Chat</a>
        <a href="" class="d-block text-white">Help centre</a>
      </b-collapse>

      <b-button
        block
        squared
        v-b-toggle.accordion-3
        variant="link"
        class="text-white text-uppercase font-weight-bold text-left pl-0 border-top d-flex justify-content-between"
      >
        <span>Partnerships</span>
        <stream-line-icon :icon="RemoveAdd.Add" stroke="white" :size="16" class="icon-open" />
        <stream-line-icon :icon="RemoveAdd.Subtract" stroke="white" :size="16" class="icon-close" />
      </b-button>
      <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel" class="my-2">
        <a href="" class="d-block text-white">Habitat for retail</a>
        <a href="" class="d-block text-white">Industry partners</a>
      </b-collapse>
      <b-button
        block
        squared
        v-b-toggle.accordion-4
        variant="link"
        class="text-white text-uppercase font-weight-bold text-left pl-0 border-top d-flex justify-content-between"
      >
        <span>Tools & Tips</span>
        <stream-line-icon :icon="RemoveAdd.Add" stroke="white" :size="16" class="icon-open" />
        <stream-line-icon :icon="RemoveAdd.Subtract" stroke="white" :size="16" class="icon-close" />
      </b-button>
      <b-collapse id="accordion-4" accordion="my-accordion" role="tabpanel" class="my-2">
        <a href="" class="d-block text-white">Blog</a>
      </b-collapse>
    </div> -->
    <div class="bottom-section justify-content-center mt-5">
      <div class="copyright">
        &#169; 2021 The Habitat <span class="ml-1"><a href="">Privacy</a> &#183; <a href="">Terms</a></span>
      </div>
    </div>
  </div>
</template>
<script>
import logoWhiteSVG from '@/assets/img/habitat-logo-white.svg'
// import { BButton, BCollapse } from 'bootstrap-vue'
// import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
// import RemoveAdd from '@streamlinehq/streamline-regular/lib/interface-essential/RemoveAdd'

export default {
  components: {
    // BButton,
    // BCollapse,
    // StreamLineIcon
  },
  data () {
    return {
      logoWhiteSVG
      // RemoveAdd
    }
  }
}
</script>
