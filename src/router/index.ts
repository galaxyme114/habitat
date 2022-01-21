import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import { ACHECKAUTH } from '@/store/action-types'
import { INVITETOKENADD } from '@/store/mutation-types'
import store from '@/store'

import AuthIndex from '@/views/auth/Index.vue'
import Index from '@/views/Index.vue'

import Home from '@/views/Home.vue'
import UserSettings from '@/views/auth/Settings.vue'
import Profile from '@/views/auth/Profile.vue'
import HabitatNew from '@/views/habitats/New.vue'
import HabitatsView from '@/views/habitats/ViewAll.vue'
import HabitatView from '@/views/habitats/ViewHabitat.vue'
import HabitatInspiration from '@/views/habitats/Inspiration.vue'
import HabitatSettings from '@/views/habitats/Settings.vue'
import HabitatInvite from '@/views/habitats/UserInvite.vue'
import ProjectView from '@/views/projects/View.vue'
import ArchivedProjects from '@/views/projects/Archived.vue'
import ArticleView from '@/views/articles/View.vue'
import Explore from '@/views/explore/Index.vue'
import MoodImages from '@/views/mood-board/MoodImages.vue'
import Feed from '@/views/feed/View.vue'
import Search from '@/views/feed/Search.vue'
import PublicProject from '@/views/public/Project.vue'
import PublicArticle from '@/views/public/Article.vue'
import PublicProfile from '@/views/public/Profile.vue'
import PublicHabitat from '@/views/public/Habitat.vue'
import ProjectNew from '@/views/projects/New.vue'
import UserFollowing from '@/views/feed/UserFollowing.vue'
import NotificationsViewAll from '@/views/notifications/ViewAll.vue'
// import Layout from '@/views/mood-board/Layout.vue'

import RoomPlansIndex from '@/views/room-plans/Index.vue'
import RoomPlansList from '@/views/room-plans/List.vue'
import RoomPlansCreate from '@/views/room-plans/Create.vue'

import ChatView from '@/views/messages/ChatView.vue'

// import Chat from '@/views/plan/Chat.vue'
// import QA from '@/views/plan/QA.vue'

import FourZeroFour from '@/views/404.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  // Auth
  {
    path: '/login',
    name: 'login',
    component: AuthIndex,
    props: {
      show: 'login'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: AuthIndex,
    props: {
      show: 'register'
    }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: AuthIndex,
    props: {
      show: 'forgot-password'
    }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: AuthIndex,
    props: {
      show: 'reset-password'
    }
  },

  // Public
  {
    path: '/public',
    component: Index,
    children: [
      {
        path: 'habitat/:habitatId',
        name: 'public-habitat',
        component: PublicHabitat
      },
      {
        path: 'project/:projectId',
        name: 'public-project',
        component: PublicProject
      },
      {
        path: 'article/:articleId',
        name: 'public-article',
        component: PublicArticle
      },
      {
        path: 'profile/:userId',
        name: 'public-profile',
        component: PublicProfile
      }
    ]
  },

  // Home
  {
    path: '',
    name: 'home',
    component: Home,
    redirect: '/habitats'
  },

  // Notification
  {
    path: '/notifications',
    name: 'notifications',
    component: NotificationsViewAll,
    props: {
      show: 'notifications'
    }
  },

  // Messages
  {
    path: '/messages',
    name: 'messages',
    component: ChatView,
    props: {
      show: 'messages'
    }
  },

  // User
  {
    path: '/user',
    component: Index,
    children: [
      {
        path: 'settings',
        name: 'user-settings',
        component: UserSettings
      },
      {
        path: 'profile',
        name: 'user-profile',
        component: Profile
      }
    ]
  },

  // Habitat
  {
    path: '/habitats',
    component: Index,
    children: [
      {
        path: '',
        name: 'habitats-view',
        component: HabitatsView
      },
      {
        path: 'new',
        name: 'habitat-new',
        component: HabitatNew
      },
      {
        path: 'settings',
        name: 'habitat-settings',
        component: HabitatSettings
      },
      {
        path: 'invite',
        name: 'habitat-invite',
        component: HabitatInvite
      },
      {
        path: ':habitatId',
        name: 'habitat-view',
        component: HabitatView
      },
      {
        path: ':habitatId/inspiration/:type',
        name: 'habitat-inspiration',
        component: HabitatInspiration
      },

      // Project
      {
        path: ':habitatId/project/:projectId',
        name: 'project-view',
        component: ProjectView
      },
      {
        path: ':habitatId/archived-projects',
        name: 'archived-projects',
        component: ArchivedProjects
      },

      // Article
      {
        path: ':habitatId/project/:projectId/article/:articleId',
        name: 'article-view',
        component: ArticleView
      },

      // Moodboard
      {
        path: ':habitatId/project/:projectId/moodboard',
        name: 'moodboard',
        component: MoodImages
      },

      // Roomplans by habitat
      {
        path: ':habitatId/room-plans',
        name: 'room-plans-list-habitat',
        component: RoomPlansList
      },

      // Roomplans by project
      {
        path: ':habitatId/project/:projectId/room-plans',
        name: 'room-plans-list',
        component: RoomPlansList
      },

      {
        path: ':habitatId/project/:projectId/room-plans/:roomPlanId',
        name: 'room-plans-edit',
        component: RoomPlansIndex,
        props: true
      }
    ]
  },

  // TODO change
  // {
  //   path: '/team',
  //   name: 'team',
  //   component: ArticleView
  // },

  // Explore
  {
    path: '/explore',
    name: 'explore',
    component: Explore
  },

  // Social Feed
  {
    path: '/feed',
    component: Index,
    children: [
      {
        path: '',
        name: 'social-feed',
        component: Feed
      },
      {
        path: 'user-following',
        name: 'user-following',
        component: UserFollowing
      },
      {
        path: 'search/:type?/:term?',
        name: 'search',
        component: Search
      }
    ]
  },

  // Room Planner
  {
    path: '/room-plans',
    component: Index,
    redirect: '/room-plans/rooms',
    children: [
      {
        path: 'rooms',
        name: 'rooms-plans-list',
        component: RoomPlansList
      },
      {
        path: 'create',
        name: 'rooms-plans-create',
        component: RoomPlansCreate
      },
      {
        path: ':id',
        name: 'rooms-plans-edit',
        component: RoomPlansIndex
      }
    ]
  },

  // Project
  {
    name: 'project-new',
    path: '/project/new',
    component: ProjectNew
  },

  // // Habitat Plan
  // {
  //   path: '/habitats-plan',
  //   component: Index,
  //   children: [
  //     {
  //       path: 'q-and-a',
  //       name: 'habitats-plan-qa',
  //       component: QA
  //     },
  //     {
  //       path: 'chat',
  //       name: 'habitats-plan-chat',
  //       component: Chat
  //     }
  //   ]
  // },

  // Catch all
  {
    path: '*',
    name: 'not-found-not-found',
    component: FourZeroFour
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  linkExactActiveClass: 'active-exact',
  routes
})

const openAuthRoutes = [
  'login',
  'register',
  'forgot-password',
  'reset-password',
  'public-profile',
  'public-project',
  'public-article'
]

/**
 * Interceptor for Authentication.
 */
router.beforeEach(async (to, from, next) => {
  // NOTE the following is for stupid typescript handling
  let toName = to.name
  if (!toName) {
    toName = ''
  }
  // console.log(to)
  if (toName === 'habitat-invite' && to.query.token) {
    await store.commit(INVITETOKENADD, to.query.token)
  }

  // Check if to.name === 'invite' get token from to.query.token and create new route to add token to store
  // Maybe create a watcher in the home ('/') screen to watch for this token and call the route if it exists.

  if (!store.state.auth.authenticated) {
    try {
      await store.dispatch(ACHECKAUTH)
      if (toName === 'habitat-invite') {
        next()
      } else if (openAuthRoutes.includes(toName)) {
        next('/')
      } else {
        next()
      }
    } catch (e) {
      if (toName === 'habitat-invite') {
        // TODO: What if they already have an account and aren't logged in?
        next('/register')
      } else if (!openAuthRoutes.includes(toName)) {
        next('/login')
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

export default router
