<template>
  <transition name="fade" mode="out-in">
    <!-- <nav id="topbar" class="navbar navbar-expand-lg" :class="{ opaque: !authenticated }"> -->
    <nav id="topbar" class="navbar navbar-expand-lg navbar-light">
      <div class="container d-flex justify-content-lg-between w-100">
        <div class="w-25">
          <router-link class="navbar-brand" to="/">
            <img :src="logoSVG" />
          </router-link>

          <transition name="fade" mode="out-in" appear>
            <b-navbar-nav class="main-nav simplified" v-if="simplified">
              <b-nav-item
                :to="`/habitats/${this.$route.params.habitatId}/project/${this.$route.params.projectId}`"
                class="back-link"
                ><stream-line-icon :icon="Keyboard.KeyboardArrowLeft" :stroke="iconColour"
              /></b-nav-item>
              <li class="spacer"></li>
            </b-navbar-nav>
          </transition>
        </div>

        <b-navbar-nav class="main-nav d-none d-lg-flex">
          <!-- <li class="spacer"></li> -->
          <b-nav-item to="/explore" :link-attrs="{ title: 'Explore' }">Explore</b-nav-item>
          <b-nav-item to="/feed" :link-attrs="{ title: 'Feeds' }">Feeds</b-nav-item>
          <!-- <li class="spacer"></li> -->
          <b-nav-item id="habitatDropdown" :link-attrs="{ title: 'Habitats' }" class="habitat-nav d-flex">
            <div>
              Habitats
              <!-- <span class="pill-badge ml-3">{{ habitats.length }}</span> -->
              <b-icon-chevron-down></b-icon-chevron-down>
            </div>

            <HabitatNavDropDown :target="'habitatDropdown'" @optionSelected="handleCreateOption" />
          </b-nav-item>

          <!-- <b-nav-item to="/team" :link-attrs="{ title: 'Team' }">Team</b-nav-item> -->
          <!-- v-if="$route.name !== 'habitat-view' && $route.name !== 'project-view'" -->
          <!-- <b-button @click="focus" variant="primary" ref="createButton" class="btn btn-rounded btn-primary mt-2">
            <span class="thick-svg" :style="{ marginRight: '15px', marginBottom: '5px' }">
              <stream-line-icon :icon="RemoveAdd.Add" stroke="white" :size="16" /> </span
            >Create
          </b-button> -->
        </b-navbar-nav>

        <b-navbar-nav class="notification-mobile-nav d-lg-none position-absolute" style="right: 70px" @click="handleClickNotificationIcon">
          <b-nav-item
            to="/notifications"
            class="notification-menu"
          ><stream-line-icon :icon="Alert.AlarmBell" :stroke="iconColour" />
            <NewNotificationsCounter />
          </b-nav-item>
        </b-navbar-nav>
        <div class="w-25">
          <b-collapse id="nav-collapse" is-nav v-if="authenticated">
            <b-navbar-nav class="secondary-nav" v-if="authenticated">
            <b-nav-item to="/messages" class="position-relative">
              <stream-line-icon :icon="Conversation.ConversationChat1" :stroke="iconColour"/>
              <NewChatNotify :currentUserId="userId" />
            </b-nav-item>
            <b-nav-item
              id="notificationMenu"
              class="notification-menu"
              @click="handleClickNotificationIcon"
            ><stream-line-icon :icon="Alert.AlarmBell" :stroke="iconColour" />
              <NewNotificationsCounter />
              <NotificationNavDropDown :target="'notificationMenu'" />
            </b-nav-item>

              <b-nav-item-dropdown class="d-flex align-items-center nav-user" right text="Right align" id="profile-menu">
                <template slot="button-content">
                  <b-avatar v-if="user && user.image" variant="secondary" :src="user.image.url" size="2.5rem"></b-avatar>
                  <b-avatar v-else variant="secondary" :text="initials" size="2.5rem"></b-avatar>
                  <!-- <span class="name">{{ fullName }}</span>
                  <i class=" caret-down" /> -->
                </template>
                <b-dropdown-item href="/user/profile">View Profile</b-dropdown-item>
                <b-dropdown-item href="/user/settings">Settings</b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item href="#" @click.prevent="logout">Logout</b-dropdown-item>
              </b-nav-item-dropdown>
            </b-navbar-nav>
          </b-collapse>
        </div>
      </div>

      <!-- <CreatePopover :target="'create-button'" @optionSelected="handleCreateOption" /> -->

      <CreateHabitatModal :show="showCreateHabitatModal || createHabitat" @closeModal="closeModal" />
      <ArticleCreationModal :show="showArticleModal" :userId="userId" @close="showArticleModal = false" />
      <div class="bm-overlay-background"></div>

      <!-- Mobile menu -->
      <Slide right :isOpen="isOpen" overlay :crossIcon="false" :closeOnNavigation="true">
        <div class="text-dark font-weight-bold" @click.prevent="closeMobileMenu">
          <svg class="mr-1" width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 13L1 7L7 1" stroke="#141519" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="ml-2 current-page text-capitalize">{{ currentRouteName }}</span>
        </div>
        <div class="border-top"></div>
        <p class="py-3 mb-0">Menu</p>
        <a id="home" href="/explore">
          <span>Explore</span>
        </a>
        <a id="feed" href="/feed">
          <span>Feeds</span>
        </a>
        <a id="habitats" href="/habitats">
          <span>Habitats</span>
        </a>
        <div class="border-top mt-3"></div>
        <p class="py-3 mb-0">Account</p>
        <a id="profile" href="/user/profile">
          <span>View Profile</span>
        </a>
        <a id="settings" href="/user/settings">
          <span>Settings</span>
        </a>
        <a id="home" href="#">
          <svg class="mr-1" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.5 2.5L15.8333 2.5C16.2754 2.5 16.6993 2.6756 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667L17.5 15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5L12.5 17.5"
              stroke="#141519"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6.66667 5.83332L2.5 9.99999L6.66667 14.1667"
              stroke="#141519"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path d="M2.5 10L12.5 10" stroke="#141519" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="ml-1 align-self-center" @click.prevent="logout">Logout</span>
        </a>
      </Slide>
    </nav>
  </transition>
</template>
<script>

import api from '@/api'
import { mapState } from 'vuex'
import logoSVG from '@/assets/img/habitat-logo.svg'

import { LOGOUT, HANDLEHABITATMODAL, NEW_NOTIFICATIONS_COUNT_ADD } from '@/store/mutation-types'
import { BIconChevronDown, BCollapse, BNavbarNav, BNavItem, BNavItemDropdown, BDropdownItem, BAvatar } from 'bootstrap-vue'

import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import Conversation from '@streamlinehq/streamline-regular/lib/messages-chat-smileys/Conversation'
import Alert from '@streamlinehq/streamline-regular/lib/interface-essential/Alert'
import Keyboard from '@streamlinehq/streamline-regular/lib/interface-essential/Keyboard'
import RemoveAdd from '@streamlinehq/streamline-regular/lib/interface-essential/RemoveAdd'
import ConceptionProjects from '@streamlinehq/streamline-regular/lib/building-construction/ConceptionProjects'
// import CreatePopover from './common/CreatePopover'
import HabitatNavDropDown from './common/HabitatNavDropDown'
import NotificationNavDropDown from './common/NotificationNavDropDown'
import CreateHabitatModal from './common/CreateHabitatModal'
import NewNotificationsCounter from '@/components/common/NewNotificationsCounter'
import NewChatNotify from '@/components/common/NewChatNotify'
import ArticleCreationModal from './views/modals/ArticleCreationModal'

import placeholder from '@/assets/icons/placeholder@2x.png'
import { Slide } from 'vue-burger-menu'

export default {
  components: {
    BIconChevronDown,
    BCollapse,
    BNavbarNav,
    BNavItem,
    BNavItemDropdown,
    BDropdownItem,
    BAvatar,
    Slide,
    ArticleCreationModal,
    StreamLineIcon,
    // CreatePopover,
    HabitatNavDropDown,
    CreateHabitatModal,
    NotificationNavDropDown,
    NewNotificationsCounter,
    NewChatNotify
  },
  data () {
    return {
      logoSVG,
      Conversation,
      Alert,
      Keyboard,
      RemoveAdd,
      ConceptionProjects,
      placeholder,
      showModal: false,
      showCreateHabitatModal: false,
      showArticleModal: false,
      showPopover: false,
      projectName: '',
      isOpen: false
    }
  },
  computed: {
    ...mapState({
      iconColour: state => {
        if (state.auth.user === null || state.auth.user.theme === 'light') {
          return '#000000'
        }
        return '#ffffff'
      },
      fullName: state => state.auth.user && state.auth.user.fullName,
      initials: state =>
        state.auth.user && state.auth.user.firstName
          ? state.auth.user.firstName.substring(0, 1) + state.auth.user.lastName.substring(0, 1)
          : '',
      userImage: state => (state.auth.user && state.auth.user.image !== null ? state.auth.user.image : placeholder),
      user: state => state.auth.user,
      userId: state => state.auth.user.id,
      authenticated: state => state.auth.authenticated,
      createHabitat: state => state.habitats.createHabitat,
      habitats: state => state.habitats.habitats,
      currentRouteName () {
        return this.$route.name.replaceAll('-', ' ')
      }
    }),
    simplified () {
      return this.$route.name === 'room-plans-edit'
    }
  },
  methods: {
    openMobileMenu () {
      this.isOpen = true
    },
    closeMobileMenu () {
      this.isOpen = false
    },
    logout () {
      this.$store.commit(LOGOUT)
      this.$router.push('/login')
    },
    toggleModal () {
      this.showModal = !this.showModal
    },
    async handleClickNotificationIcon () {
      try {
        await api.notifications.initializeNewNotificationsCount(this.userId)
        this.$store.commit(NEW_NOTIFICATIONS_COUNT_ADD, 0)
      } catch (error) {
        console.error(error)
      }
    },
    handleCreateOption (type) {
      switch (type) {
        case 'habitat':
          this.showPopover = false
          this.showCreateHabitatModal = true
          break
        // case 'project':
        //   this.showPopover = false
        //   this.$router.push({ name: 'project-new' })
        //   break
        // case 'room-plan':
        //   this.showPopover = false
        //   this.$router.push({ name: 'rooms-plans-create' })
        //   break
        // case 'article':
        //   this.showPopover = false
        //   this.showArticleModal = true
        //   break
      }
    },
    closeModal () {
      this.showCreateHabitatModal = false
      this.$store.commit(HANDLEHABITATMODAL, false)
    },
    focus () {
      this.$refs.createButton.focus()
    }
  }
}
</script>
