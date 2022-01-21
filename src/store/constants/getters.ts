import { GetterTree } from 'vuex'
import { Constant, Constants, RootState } from '@/store/types'

export default {
  getConstantByValue: (state: Constants, getters: GetterTree<Constants, RootState>, rootState: RootState) => (constant: string, value: string) => {
    if (rootState.constants[constant]) {
      // throw new Error('CONSTANT NOT DEFINED')
      return null
    }
    const item = rootState.constants[constant].find((item: Constant) => (item.label === value) || (item.slug === value))
    return item || null
  },
  getConstantById: (state: Constants, getters: GetterTree<Constants, RootState>, rootState: RootState) => (constant: string, id: string) => {
    if (rootState.constants[constant]) {
      // throw new Error('CONSTANT NOT DEFINED')
      return null
    }
    const item = rootState.constants[constant].find((item: Constant) => (item.id === id))
    return item || null
  }
}
