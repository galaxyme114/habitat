<template>
  <b-popover id="create-popover" :target="target" :placement="'bottomright'" triggers="focus">
    <div class="header">Create New</div>
    <div class="top-divider" />
    <div class="option-container" @click="handleOptionClick('project')">
      <span :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '10px' }"
        ><stream-line-icon :icon="ConceptionProjects.ProjectNotesBuildings" :size="20"
      /></span>
      <div class="option-text">
        <div class="option-title">Project</div>
        <div class="option-description">Curate Images, Articles & Room plans into one space.</div>
      </div>
    </div>
    <div class="option-container" @click="handleOptionClick('article')">
      <span :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '10px' }"
        ><stream-line-icon :icon="Newspapers.NewspaperFold" :size="20"
      /></span>
      <div class="option-text">
        <div class="option-title">Article</div>
        <div class="option-description">Tell a story, document your journey.</div>
      </div>
    </div>
    <div class="option-container" @click="handleOptionClick('room-plan')">
      <span :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '10px' }"
        ><stream-line-icon :icon="MapsDimensions.RealEstateDimensionsMap" :size="20"
      /></span>
      <div class="option-text">
        <div class="option-title">Room Plan</div>
        <div class="option-description">Plan out your room, explore different layouts.</div>
      </div>
    </div>
    <div class="divider" />
    <div class="option-container" @click="handleOptionClick('habitat')">
      <span :style="{ backgroundColor: '#F8F8F8', padding: '10px', borderRadius: '8px', marginRight: '10px' }"
        ><stream-line-icon :icon="Folders.FolderHome" :size="20"
      /></span>
      <div class="option-text">
        <div class="option-title">Habitat</div>
        <div class="option-description">Group projects together into Habitats</div>
      </div>
    </div>
  </b-popover>
</template>

<script>
import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import ConceptionProjects from '@streamlinehq/streamline-regular/lib/building-construction/ConceptionProjects'
import Newspapers from '@streamlinehq/streamline-regular/lib/content/Newspapers'
import MapsDimensions from '@streamlinehq/streamline-regular/lib/real-estate/MapsDimensions'
import Folders from '@streamlinehq/streamline-regular/lib/files-folders/Folders'
import { BPopover } from 'bootstrap-vue'

export default {
  name: 'CreatePopover',
  props: ['show', 'target'],
  components: {
    StreamLineIcon,
    BPopover
  },
  data () {
    return {
      ConceptionProjects,
      Newspapers,
      MapsDimensions,
      Folders
    }
  },
  methods: {
    handleOptionClick (type) {
      console.log(type)
      this.$emit('optionSelected', type)
    }
  }
}
</script>
