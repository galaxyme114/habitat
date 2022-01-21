<template>
  <div>
    <div
      class="app-container"
      :class="{ 'app-mobile': isDevice, 'app-mobile-dark': theme === 'dark' }"
    >
      <chat-container
        v-if="showChat"
        :current-user-id="this.currentUser.id"
        :theme="theme"
        :is-device="isDevice"
        :users="users"
        @theme="handleChangeTheme"
      />
    </div>
  </div>
</template>

<script>
import api from '@/api'
import { mapState } from 'vuex'
import ChatContainer from './ChatContainer/Index'

export default {
  name: 'ChatView',
  components: {
    ChatContainer
  },

  data () {
    return {
      theme: 'light',
      showChat: true,
      users: [],
      isDevice: false,
      updatingData: false
    }
  },

  computed: {
    ...mapState({
      currentUser: (state) => state.auth.user
    })
  },

  watch: {
    users () {
      this.showChat = false
      setTimeout(() => (this.showChat = true), 150)
    }
  },

  methods: {
    async fetchPublicUsers () {
      try {
        let users = []
        const response = await api.user.fetchAllUsers(this.currentUser.id)
        response.data.forEach((user) => {
          const userData = {
            _id: user.id,
            avatar: user.image ? user.image.url : '',
            avatarColor: user.avatarColor ? user.avatarColor : '',
            initialAvatarText: user.firstName ? user.firstName.substring(0, 1) + user.lastName.substring(0, 1) : '',
            fullName: user.fullName,
            firstName: user.firstName
          }

          users = [...users, userData]
        })
        this.users = users
      } catch (e) {
        console.log(e)
      }
    },
    handleChangeTheme (theme) {
      this.theme = theme
    }
  },

  mounted () {
    this.isDevice = window.innerWidth < 500
    window.addEventListener('resize', ev => {
      if (ev.isTrusted) this.isDevice = window.innerWidth < 500
    })

    this.fetchPublicUsers()
  }
}
</script>

<style lang="scss">
body {
  background: #fafafa;
  margin: 0;
}

input {
  -webkit-appearance: none;
}

.app-container {
  font-family: 'Quicksand', sans-serif;
  padding: 20px 30px 30px;
}

.app-mobile {
  padding: 0;

  &.app-mobile-dark {
    background: #131415;
  }

  .user-logged {
    margin: 10px 5px 0 10px;
  }

  select {
    margin: 10px 0;
  }

  .button-theme {
    margin: 10px 10px 0 0;

    .button-github {
      height: 23px;

      img {
        height: 23px;
      }
    }
  }
}

select {
  height: 20px;
  outline: none;
  border: 1px solid #e0e2e4;
  border-radius: 4px;
  background: #fff;
  margin-bottom: 20px;
}

.button-theme {
  float: right;
  display: flex;
  align-items: center;

  .button-light {
    background: #fff;
    border: 1px solid #46484e;
    color: #46484e;
  }

  .button-dark {
    background: #1c1d21;
    border: 1px solid #1c1d21;
  }

  button {
    color: #fff;
    outline: none;
    cursor: pointer;
    border-radius: 4px;
    padding: 6px 12px;
    margin-left: 10px;
    border: none;
    font-size: 14px;
    transition: 0.3s;
    vertical-align: middle;

    &.button-github {
      height: 30px;
      background: none;
      padding: 0;
      margin-left: 20px;

      img {
        height: 30px;
      }
    }

    &:hover {
      opacity: 0.8;
    }

    &:active {
      opacity: 0.6;
    }

    @media only screen and (max-width: 768px) {
      padding: 3px 6px;
      font-size: 13px;
    }
  }
}

.version-container {
  padding-top: 20px;
  text-align: right;
  font-size: 14px;
  color: grey;
}
</style>
