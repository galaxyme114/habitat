import {
  HABITATSADD,
  HABITATSUPDATE,
  HABITATSDELETE,
  CURRENTHABITATADD,
  CURRENTHABITATUPDATE,
  INVITETOKENADD,
  INVITETOKENCLEAR,
  HANDLEHABITATMODAL
} from '@/store/mutation-types'

import { Habitat, DataField, Habitats, HabitatName } from '@/store/types'

export default {
  [HABITATSADD] (state: Habitats, data: HabitatName[]) {
    state.habitats = data
  },
  [HABITATSUPDATE] (state: Habitats, data: HabitatName) {
    const habitat = state.habitats.find(habitat => habitat.id === data.id)
    if (habitat) {
      Object.assign(habitat, data)
    }
  },
  [HABITATSDELETE] (state: Habitats, id: string) {
    state.habitats = state.habitats.filter(habitat => habitat.id !== id)
  },
  [CURRENTHABITATADD] (state: Habitats, data: Habitat) {
    state.current = data
  },
  [CURRENTHABITATUPDATE] (state: Habitats, data: DataField) {
    state.current[data.id] = data.value
  },
  [INVITETOKENADD] (state: Habitats, token: string) {
    state.inviteToken = token
  },
  [INVITETOKENCLEAR] (state: Habitats) {
    state.inviteToken = ''
  },
  [HANDLEHABITATMODAL] (state: Habitats, visible: boolean) {
    state.createHabitat = visible
  }
}
