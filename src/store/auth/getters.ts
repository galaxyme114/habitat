// import { GetterTree } from 'vuex'
import { Auth } from '@/store/types' // , RootState

export default {
  isAdministrator: (state: Auth) => state.user && state.user.role >= 3 // , getters: GetterTree<Auth, RootState>, rootState: RootState
  // TODO Need to find a better solution for this
  // getters.getConstantByValue('userRoles', 'Administrator').id
}
