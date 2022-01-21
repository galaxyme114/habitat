<template>
  <div id="controls">
    <div class="top">
      <button id="select" class="btn" @click="toggleSelect"><stream-line-icon :icon="Select.Cursor" :stroke="iconConfig.colour" :size="iconConfig.size" /></button>
      <b-tooltip target="select" title="Select" triggers="hover" placement="left" offset="4" custom-class="roomplanner-tooltip"><stream-line-icon :icon="Alerts.InformationCircle" :stroke="toolTipConfig.colour" :size="toolTipConfig.size" /><div>Select</div></b-tooltip>

      <hr/>

      <button id="layers" class="btn" @click="openPopover"><stream-line-icon :icon="Layers.Layers" :stroke="iconConfig.colour" :size="iconConfig.size" /></button>
      <b-tooltip target="layers" title="Layers" triggers="hover" placement="left" offset="4" custom-class="roomplanner-tooltip"><stream-line-icon :icon="Alerts.InformationCircle" :stroke="toolTipConfig.colour" :size="toolTipConfig.size" /><div>Layers</div></b-tooltip>
      <b-popover target="layers" placement="left" title="Layers" trigger="click"><layers-control /></b-popover>

      <button id="control-settings" class="btn" @click="openPopover"><stream-line-icon :icon="Settings.Cog" :stroke="iconConfig.colour" :size="iconConfig.size" /></button>
      <b-tooltip target="control-settings" title="Settings" triggers="hover" placement="left" offset="4" custom-class="roomplanner-tooltip"><stream-line-icon :icon="Alerts.InformationCircle" :stroke="toolTipConfig.colour" :size="toolTipConfig.size" /><div>Settings</div></b-tooltip>
      <b-popover target="control-settings" placement="left" title="Settings" trigger="click"><settings-control /></b-popover>

      <hr/>

      <button id="undo" class="btn" @click="undo" :disabled="!hasUndo"><stream-line-icon :icon="Rotate.RotateBack" :stroke="iconConfig.colour" :size="iconConfig.size" /></button>
      <b-tooltip target="undo" title="Undo" triggers="hover" placement="left" offset="4" custom-class="roomplanner-tooltip"><stream-line-icon :icon="Alerts.InformationCircle" :stroke="toolTipConfig.colour" :size="toolTipConfig.size" /><div>Undo</div></b-tooltip>

      <button id="redo" class="btn" @click="redo" :disabled="!hasRedo"><stream-line-icon :icon="Rotate.RotateForward" :stroke="iconConfig.colour" :size="iconConfig.size" /></button>
      <b-tooltip target="redo" title="Redo" triggers="hover" placement="left" offset="4" custom-class="roomplanner-tooltip"><stream-line-icon :icon="Alerts.InformationCircle" :stroke="toolTipConfig.colour" :size="toolTipConfig.size" /><div>Redo</div></b-tooltip>

    </div>
    <div class="pan">
      <button id="pan" class="btn" @click="togglePan" :class="{ active: drawingMode === 'pan' || drawingMode === 'panning' }"><stream-line-icon :icon="Diagrams.DiagramAllDirectionExpand" :stroke="iconConfig.colour" :size="iconConfig.size" /></button>
      <b-tooltip target="pan" title="Pan" triggers="hover" placement="left" offset="4" custom-class="roomplanner-tooltip"><stream-line-icon :icon="Alerts.InformationCircle" :stroke="toolTipConfig.colour" :size="toolTipConfig.size" /><div>Pan</div></b-tooltip>
    </div>
    <div class="zoom">
      <button class="btn" @click="zoomIn"><stream-line-icon :icon="RemoveAdd.Add" :stroke="iconConfig.colour" :size="iconConfig.size" /></button>
      <button class="btn" @click="zoomOut"><stream-line-icon :icon="RemoveAdd.Subtract" :stroke="iconConfig.colour" :size="iconConfig.size" /></button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { ROOMPLAN } from '@/store/mutation-types'

import { BPopover, BTooltip } from 'bootstrap-vue'

import { iconConfig, toolTipConfig } from './../config'

import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import Select from '@streamlinehq/streamline-regular/lib/interface-essential/Select'
import GridsRulers from '@streamlinehq/streamline-regular/lib/design/GridsRulers'
import Layers from '@streamlinehq/streamline-regular/lib/design/Layers'
import Settings from '@streamlinehq/streamline-regular/lib/interface-essential/Settings'
import Rotate from '@streamlinehq/streamline-regular/lib/design/Rotate'
import RemoveAdd from '@streamlinehq/streamline-regular/lib/interface-essential/RemoveAdd'
import Diagrams from '@streamlinehq/streamline-regular/lib/arrows-diagrams/Diagrams'
import Alerts from '@streamlinehq/streamline-regular/lib/interface-essential/Alerts'

import LayersControl from '@/views/room-plans/components/controls/Layers'
import SettingsControl from '@/views/room-plans/components/controls/Settings'

export default {
  components: {
    BPopover,
    BTooltip,
    StreamLineIcon,
    LayersControl,
    SettingsControl
  },
  data () {
    return {
      iconConfig,
      toolTipConfig,
      Select,
      GridsRulers,
      Layers,
      Settings,
      Rotate,
      RemoveAdd,
      Diagrams,
      Alerts
    }
  },
  computed: {
    ...mapState({
      drawingMode: state => state.roomPlans.drawingMode,
      hasUndo: state => state.roomPlans.historyStep > 0,
      hasRedo: state => state.roomPlans.historyStep < state.roomPlans.history.length - 1
    })
  },
  methods: {
    openPopover (e) {
      this.$store.commit(ROOMPLAN.DRAWING.TOGGLE, null)
      this.$root.$emit('bv::hide::popover')
      this.$root.$emit('bv::hide::tooltip')
      console.log(e)
    },
    toggleSelect () {
      this.$store.commit(ROOMPLAN.DRAWING.TOGGLE, 'select')
    },
    togglePan () {
      this.$store.commit(ROOMPLAN.DRAWING.TOGGLE, 'pan')
    },
    zoomIn () {
      this.$emit('zoom', 0.5)
    },
    zoomOut () {
      this.$emit('zoom', -0.5)
    },
    undo () {
      this.$store.commit(ROOMPLAN.HISTORY.UNDO)
    },
    redo () {
      this.$store.commit(ROOMPLAN.HISTORY.REDO)
    }
  }
}
</script>
