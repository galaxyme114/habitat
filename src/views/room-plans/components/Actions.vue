<template>
  <div id="actions">
    <button id="walls" class="btn" :class="{ active: drawingMode === 'wall'}" @click="createWall"><stream-line-icon :icon="Construction.ConstructionBrick" :stroke="iconConfig.colour" :size="iconConfig.size" /></button>
    <b-tooltip target="walls" title="Walls" triggers="hover" placement="right" offset="4" custom-class="roomplanner-tooltip"><stream-line-icon :icon="Alerts.InformationCircle" :stroke="toolTipConfig.colour" :size="toolTipConfig.size" /><div>Walls</div></b-tooltip>

    <hr/>

    <button id="doors" class="btn" :class="{ active: drawingMode === 'door'}" @click="openPopover"><stream-line-icon :icon="ArchitecturalFeatures.ArchitectureDoor" :stroke="iconConfig.colour" :size="iconConfig.size" /></button>
    <b-tooltip target="doors" title="Doors" triggers="hover" placement="right" offset="4" custom-class="roomplanner-tooltip"><stream-line-icon :icon="Alerts.InformationCircle" :stroke="toolTipConfig.colour" :size="toolTipConfig.size" /><div>Doors</div></b-tooltip>
    <b-popover target="doors" placement="rightbottom" title="Doors" trigger="click"><doors @catalogue-drag-start="$emit('catalogue-drag-start', $event)"/></b-popover>

    <button id="windows" class="btn" :class="{ active: drawingMode === 'window'}" @click="openPopover"><stream-line-icon :icon="ArchitecturalFeatures.ArchitectureWindow" :stroke="iconConfig.colour" :size="iconConfig.size" /></button>
    <b-tooltip target="windows" title="Windows" triggers="hover" placement="right" offset="4" custom-class="roomplanner-tooltip"><stream-line-icon :icon="Alerts.InformationCircle" :stroke="toolTipConfig.colour" :size="toolTipConfig.size" /><div>Windows</div></b-tooltip>
    <b-popover target="windows" placement="right" title="Windows" trigger="click"><windows @catalogue-drag-start="$emit('catalogue-drag-start', $event)"/></b-popover>

    <button id="cabinets" class="btn" :class="{ active: drawingMode === 'cabinets'}" @click="openPopover"><stream-line-icon :icon="Archives.ArchiveLocker1" :stroke="iconConfig.colour" :size="iconConfig.size" /></button>
    <b-tooltip target="cabinets" title="Cabinets" triggers="hover" placement="right" offset="4" custom-class="roomplanner-tooltip"><stream-line-icon :icon="Alerts.InformationCircle" :stroke="toolTipConfig.colour" :size="toolTipConfig.size" /><div>Cabinets</div></b-tooltip>
    <b-popover target="cabinets" placement="right" title="Cabinets" trigger="click"><cabinets @catalogue-drag-start="catalogueDragStart"/></b-popover>

    <hr/>

    <button id="appliances" class="btn" :class="{ active: drawingMode === 'appliances'}" @click="openPopover"><stream-line-icon :icon="AppliancesIcons.AppliancesOven" :stroke="iconConfig.colour" :size="iconConfig.size" /></button>
    <b-tooltip target="appliances" title="Appliances" triggers="hover" placement="right" offset="4" custom-class="roomplanner-tooltip"><stream-line-icon :icon="Alerts.InformationCircle" :stroke="toolTipConfig.colour" :size="toolTipConfig.size" /><div>Appliances</div></b-tooltip>
    <b-popover target="appliances" placement="right" title="Appliances" trigger="click"><appliances @catalogue-drag-start="$emit('catalogue-drag-start', $event)"/></b-popover>

    <button id="other" class="btn" :class="{ active: drawingMode === 'other'}" @click="openPopover"><stream-line-icon :icon="WaterFountain.WaterFountainSink1" :stroke="iconConfig.colour" :size="iconConfig.size" /></button>
    <b-tooltip target="other" title="Other" triggers="hover" placement="right" offset="4" custom-class="roomplanner-tooltip"><stream-line-icon :icon="Alerts.InformationCircle" :stroke="toolTipConfig.colour" :size="toolTipConfig.size" /><div>Other</div></b-tooltip>
    <b-popover target="other" placement="right" title="Other" trigger="click"><other @catalogue-drag-start="$emit('catalogue-drag-start', $event)"/></b-popover>

    <hr/>

    <button id="settings" class="btn" :class="{ active: drawingMode === 'cabinets'}" @click="openPopover"><stream-line-icon :icon="Books.BookOpenBookmark" :stroke="iconConfig.colour" :size="iconConfig.size" /></button>
    <b-tooltip target="settings" title="Settings" triggers="hover" placement="right" offset="4" custom-class="roomplanner-tooltip"><stream-line-icon :icon="Alerts.InformationCircle" :stroke="toolTipConfig.colour" :size="toolTipConfig.size" /><div>Settings</div></b-tooltip>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { ROOMPLAN } from '@/store/mutation-types'

import { BPopover, BTooltip } from 'bootstrap-vue'

import { iconConfig, toolTipConfig } from './../config'

import StreamLineIcon from '@streamlinehq/streamline-icons-vue'
import Construction from '@streamlinehq/streamline-regular/lib/building-construction/Construction'
import ArchitecturalFeatures from '@streamlinehq/streamline-regular/lib/building-construction/ArchitecturalFeatures'
import AppliancesIcons from '@streamlinehq/streamline-regular/lib/food-drinks/Appliances'
import WaterFountain from '@streamlinehq/streamline-regular/lib/wayfinding/WaterFountain'
import Archives from '@streamlinehq/streamline-regular/lib/content/Archives'
import Books from '@streamlinehq/streamline-regular/lib/content/Books'
import Alerts from '@streamlinehq/streamline-regular/lib/interface-essential/Alerts'

import Cabinets from '@/views/room-plans/components/catalogue/Cabinets'
import Doors from '@/views/room-plans/components/catalogue/Doors'
import Windows from '@/views/room-plans/components/catalogue/Windows'
import Appliances from '@/views/room-plans/components/catalogue/Appliances'
import Other from '@/views/room-plans/components/catalogue/Other'

export default {
  components: {
    BPopover,
    BTooltip,
    StreamLineIcon,
    Doors,
    Windows,
    Cabinets,
    Appliances,
    Other
  },
  data () {
    return {
      iconConfig,
      toolTipConfig,
      Construction,
      ArchitecturalFeatures,
      AppliancesIcons,
      WaterFountain,
      Archives,
      Books,
      Alerts
    }
  },
  computed: mapState({
    drawingMode: state => state.roomPlans.drawingMode,
    walls: state => state.roomPlans.elements.filter(element => element.type === 'wall'),
    elements: state => state.roomPlans.elements
  }),
  methods: {
    catalogueDragStart (e) {
      this.$emit('catalogue-drag-start', e)
    },
    createWall () {
      this.$root.$emit('bv::hide::popover')
      this.$store.commit(ROOMPLAN.DRAWING.TOGGLE, 'wall')
      this.$emit('finish-wall')
    },
    openPopover () {
      this.$store.commit(ROOMPLAN.DRAWING.TOGGLE, null)
      this.$root.$emit('bv::hide::popover')
      this.$root.$emit('bv::hide::tooltip')
      this.$emit('finish-wall')
    }
  }
}
</script>
