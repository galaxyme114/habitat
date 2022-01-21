<template>
  <div id="room-planner" v-if="loaded">
    <div id="stage" :class="stageClass" tabindex="1" @keydown="handleKeyDown" @dragover.prevent @drop.prevent="dropStage">
      <v-stage ref="stage" :config="stageConfig" @wheel="wheel" @click="handleClick" @tap="handleClick" @mousedown="handleMousedown" @mousemove="handleMouseMove" @mouseup="handleMouseup" @dragstart="handleDragStart" @dragend="handleDragEnd">
        <grid :config="gridConfig"/>
        <v-layer ref="drawing">
          <elements ref="elements"/>
          <v-transformer ref="transformer" :config="transformerConfig" />
        </v-layer>
      </v-stage>
    </div>

    <actions @catalogue-drag-start="catalogueDragStart" @finish-wall="finishWall" />

    <controls @zoom="zoom($event)" />

    <element-actions v-if="selectedElementIndex !== null"/>

    <div id="bottom-bar">
      <loader :loading="loadingSaving" colour="#f26b6b" class="mr-4"/>
      <router-link :to="{ name: 'project-view', habitatId: this.habitatId, projectId: this.projectId }" :disabled="loadingSaving" class="btn btn-rounded btn-secondary mr-2">Cancel</router-link>
      <button class="btn btn-rounded btn-primary" @click="save" :disabled="loadingSaving">Save</button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { debounce } from 'lodash'
import api from '@/api'
import WallConstants from '@/views/room-plans/components/walls/constants'

import Grid from '@/views/room-plans/components/Grid'
import Elements from '@/views/room-plans/components/Elements'
import ElementActions from '@/views/room-plans/components/element-actions/Index'
import Actions from '@/views/room-plans/components/Actions'
import Controls from '@/views/room-plans/components/Controls'

import { ROOMPLAN } from '@/store/mutation-types'

import ObjectSnap from '@/views/room-plans/mixins/ObjectSnap'
import { AROOMPLANS } from '@/store/action-types'
import Loader from '@/components/Loader'

import AssetsList from '@/views/room-plans/components/catalogue/assets-list.json'

import { getRelativePointerPosition } from '@/views/room-plans/functions'

// import Transformer from '@/views/room-plans/mixins/Transformer'

// const MARGINBOTTOM = 48
// const MARGIN = 16

// const INSET = 10
//
// const dragBoundFunc = function (pos) {
//   const xOuter = this.parent.parent.width() - INSET - this.width()
//   if (pos.x < INSET) {
//     pos.x = INSET
//   } else if (pos.x > xOuter) {
//     pos.x = xOuter
//   }
//
//   const yOuter = this.parent.parent.height() - INSET - this.height()
//   if (pos.y < INSET) {
//     pos.y = INSET
//   } else if (pos.y > yOuter) {
//     pos.y = yOuter
//   }
//   return pos
// }

export default {
  props: {
    habitatId: {
      required: true
    },
    projectId: {
      required: true
    },
    roomPlanId: {
      required: true
    }
  },
  components: {
    Loader,
    Grid,
    Elements,
    Actions,
    Controls,
    ElementActions
  },
  mixins: [ObjectSnap],
  computed: {
    stage () {
      return this.$refs.stage.getNode()
    },
    ...mapState({
      stageClass: state => {
        const classes = []
        if (state.roomPlans.cursor !== null) {
          classes.push(`cursor-${state.roomPlans.cursor}`)
        }
        return classes.join(' ')
      },
      selectedElementIndex (state) {
        const selectedElementIndex = state.roomPlans.selectedElementIndex
        console.log('selectedElementIndex', selectedElementIndex)

        const transformer = this.$refs.transformer ? this.$refs.transformer.getNode() : null
        if (selectedElementIndex === null) {
          if (transformer !== null) {
            transformer.nodes([])
            transformer.getLayer().batchDraw()
          }
          return null
        }

        console.log('still going')

        console.log('other stuff', transformer, this.selectedElement.type, ['door', 'window', 'cabinet', 'svg-konva', 'room-object'].includes(this.selectedElement.type))
        if (['door', 'window', 'cabinet', 'svg-konva', 'room-object'].includes(this.selectedElement.type)) {
          const node = this.$refs.drawing.getNode().children[0].children[selectedElementIndex]
          // const node = this.$refs.elements.$refs['element-' + selectedElementIndex].getNode()
          // const node = this.$refs.elements.getNode().children[this.selectedElementIndex]

          transformer.nodes([node])

          // TODO maybe get config from item if set otherwise set the default
          // this.transformerConfig.enabledAnchors = ['top-center', 'bottom-center']
        } else {
          transformer.nodes([])
        }

        transformer.getLayer().batchDraw()

        return selectedElementIndex
      },

      selectedElement (state) {
        return state.roomPlans.selectedElementIndex !== null ? state.roomPlans.elements[state.roomPlans.selectedElementIndex] : null
      },
      drawingMode: (state) => {
        return state.roomPlans.drawingMode
      },
      walls: state => state.roomPlans.elements.filter(e => e.type === 'wall'),
      elements: state => state.roomPlans.elements,
      stateStageConfig: state => state.roomPlans.stageConfig
    })
  },
  data () {
    return {
      loaded: false,
      loadingSaving: false,
      stageConfig: {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1
      },
      gridConfig: {
        width: 0,
        height: 0,
        x: 0,
        y: 0
      },
      rectangles: [],
      transformerConfig: {
        rotationSnaps: [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 185, 300, 315, 330, 345],
        rotationSnapTolerance: 5,
        resizeEnabled: false,
        enabledAnchors: ['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right'],
        keepRatio: false,
        borderEnabled: false,
        rotateAnchorOffset: 10,
        anchorStroke: '#f26b6b',
        anchorCornerRadius: 10,
        anchorSize: 20,
        useSingleNodeRotation: true
        // ,
        // boundBoxFunc (oldBox, newBox) {
        //   return newBox
        // }
      },
      panStart: {
        mouse: null,
        stage: null
      }
    }
  },
  methods: {
    fitStageIntoParentContainer () {
      const stageContainer = document.getElementById('stage')
      if (!stageContainer) {
        return
      }

      const topbar = document.getElementById('topbar')
      const bottomBar = document.getElementById('bottom-bar')
      const width = stageContainer.offsetWidth
      const height = window.innerHeight - topbar.offsetHeight - bottomBar.offsetHeight - 64
      this.stageConfig.width = width
      this.stageConfig.height = height
      this.gridConfig.width = width * 4
      this.gridConfig.height = height * 4
      this.gridConfig.x = 0 - width * 2
      this.gridConfig.y = 0 - height * 2
    },
    updateStateStageConfig: debounce(function () {
      this.$store.commit(ROOMPLAN.STAGECONFIG.SET, this.stageConfig)
    }, 500),
    dragPan (point) {
      const newPos = {
        x: this.panStart.stage.x - (this.panStart.mouse.x - point.x),
        y: this.panStart.stage.y - (this.panStart.mouse.y - point.y)
      }

      this.stageConfig.x = newPos.x
      this.stageConfig.y = newPos.y

      this.updateStateStageConfig()
    },
    zoom (direction, fromPointer = false) {
      const oldScale = this.stage.scaleX()
      const pointer = fromPointer ? this.stage.getPointerPosition() : { x: this.stage.width() / 2, y: this.stage.height() / 2 }

      // TODO maybe scale the pointer position skewing it towards the center the further away from the center it is.

      const mousePointTo = {
        x: (pointer.x - this.stage.x()) / oldScale,
        y: (pointer.y - this.stage.y()) / oldScale
      }

      const scaleBy = fromPointer ? 1.02 : 1.4
      let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy
      // Limit scale
      if (newScale > 2) {
        newScale = 2
      } else if (newScale < 0.5) {
        newScale = 0.5
      }

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale
      }

      if (fromPointer) {
        this.stageConfig.scaleX = newScale
        this.stageConfig.scaleY = newScale
        this.stageConfig.x = newPos.x
        this.stageConfig.y = newPos.y
      } else {
        this.stage.to({
          x: newPos.x,
          y: newPos.y,
          scaleX: newScale,
          scaleY: newScale,
          duration: 0.5
        })
      }

      this.updateStateStageConfig()
    },
    wheel (event) {
      this.zoom(event.evt.deltaY, true)
    },

    handleKeyDown (e) {
      if (e.key === 'Escape') {
        this.$store.commit(ROOMPLAN.DRAWING.TOGGLE, null)
        this.finishWall()
      }
    },

    handleMousedown (e) {
      // console.log('handleMousedown', this.drawingMode, e)
      if (this.drawingMode !== 'pan') {
        return
      }
      this.$store.commit(ROOMPLAN.DRAWING.TOGGLE, 'panning')
      this.panStart = {
        mouse: {
          x: e.evt.x,
          y: e.evt.y
        },
        stage: {
          x: this.stage.x(),
          y: this.stage.y()
        }
      }
    },
    handleMouseup (e) {
      // console.log('handleMouseuo', e, this.drawingMode)
      if (this.drawingMode !== 'panning') {
        return
      }
      this.$store.commit(ROOMPLAN.DRAWING.TOGGLE, 'pan')
      this.panStart = null
    },
    handleMouseMove (e) {
      if (this.drawingMode === 'panning') {
        this.dragPan({
          x: e.evt.x,
          y: e.evt.y
        })
        return
      }

      if (this.drawingMode !== 'wall') {
        return
      }

      const point = getRelativePointerPosition(e.target.getStage())
      console.log('mouseMove', point, e, this.node)

      // try to snap point to corner
      // const corners = e.target.getStage().find('.corner')
      // corners.forEach(corner => {
      //   if (corner === this.node) {
      //     return
      //   }
      //   if (Math.abs(corner.x() - point.x) < WallConstants.SNAP_OFFSET) {
      //     point.x = corner.x()
      //   }
      //   if (Math.abs(corner.y() - point.y) < WallConstants.SNAP_OFFSET) {
      //     point.y = corner.y()
      //   }
      // })

      // snap to 5
      point.x = Math.ceil(point.x / 5) * 5
      point.y = Math.ceil(point.y / 5) * 5

      // update the position of the corner and segment
      if (this.drawingMode === 'wall') {
        let indexWall
        const wall = this.elements.find((element, i) => {
          if (element.type === 'wall' && element.config.isDrawing !== false) {
            indexWall = i
            return true
          }
          return false
        })

        if (wall && wall.segments.length > 1) {
          this.$store.commit(ROOMPLAN.WALLSEGMENT.UPDATE, {
            indexWall,
            indexSegment: wall.config.isDrawing === 'start' ? 0 : wall.segments.length - 1,
            wallSegment: point
          })
        }
      }
    },
    handleClick (e) {
      console.log('handleClick index', e)
      const clickedOnElement = e.target.findAncestor('.element', true)
      if (!clickedOnElement && !this.drawingMode) {
        this.$store.commit(ROOMPLAN.ELEMENTS.SELECT, null)
        return
      }

      // TODO Refactor drawingMode to canvasMode and create constants object with all possible states
      if (this.drawingMode === 'pan' || this.drawingMode === 'panning') {
        // TODO Maybe click and drag
        return
      }

      const point = getRelativePointerPosition(e.target.getStage())

      // try to snap point
      const corners = e.target.getStage().find('.corner')
      corners.forEach(corner => {
        if (corner === this.node) {
          return
        }
        if (Math.abs(corner.x() - point.x) < WallConstants.SNAP_OFFSET) {
          point.x = corner.x()
        }
        if (Math.abs(corner.y() - point.y) < WallConstants.SNAP_OFFSET) {
          point.y = corner.y()
        }
      })

      if (this.drawingMode === 'wall') {
        const wall = this.walls.find(w => w.config.isDrawing !== false)
        // const clickedOnCorner = !!e.target.findAncestor('.corner')
        // if (wall && clickedOnCorner) {
        //   console.log('DELETE WALL')
        //   this.$store.commit(ROOMPLAN.DRAWING.TOGGLE, 'wall')
        //   this.$store.commit(ROOMPLAN.WALLSEGMENT.DELETE, {
        //     wallIndex: this.elements.indexOf(wall),
        //     segmentIndex: wall.config.isDrawing === 'start' ? 0 : wall.segments.length - 1
        //   })
        //   this.finishWall()
        // } else
        if (wall) {
          console.log('ADD WALL SEGMENT')
          this.$store.commit(ROOMPLAN.WALLSEGMENT.ADD, {
            indexWall: this.elements.indexOf(wall),
            indexSegment: wall.config.isDrawing === 'start' ? 0 : wall.segments.length - 1,
            wallSegment: point
          })
        } else {
          console.log('ADD WALL', point)
          this.$store.commit(ROOMPLAN.ELEMENTS.ADD, {
            type: 'wall',
            config: {
              thickness: WallConstants.THICKNESS,
              width: WallConstants.THICKNESS,
              height: WallConstants.HEIGHT,
              isDrawing: 'end'
            },
            segments: [
              { ...point },
              { ...point }
            ]
          })
        }
        // return
      }

      // if (this.drawingMode === 'door') {
      //   this.$store.commit(ROOMPLAN.ELEMENTS.ADD, {
      //     type: 'door',
      //     config: {
      //       thickness: WallConstants.THICKNESS,
      //       width: WallConstants.THICKNESS,
      //       height: WallConstants.HEIGHT
      //     },
      //     segments: [
      //       point,
      //       {
      //         x: point.x,
      //         y: point.y + 100
      //       }
      //     ]
      //   })
      //   this.$store.commit(ROOMPLAN.DRAWING.TOGGLE, null)
      //   return
      // }
      //
      // if (this.drawingMode === 'stove') {
      //   this.$store.commit(ROOMPLAN.ELEMENTS.ADD, {
      //     type: 'stove',
      //     config: {
      //       width: 100,
      //       height: 100,
      //       rotation: 0
      //     },
      //     src: './svg/Appliances/thpa-appliance-stove-top-01.svg',
      //     segments: [
      //       point
      //     ]
      //   })
      //
      //   this.$store.commit(ROOMPLAN.DRAWING.TOGGLE, null)
      //   return
      // }
      //
      // if (this.drawingMode === 'window') {
      //   this.$store.commit(ROOMPLAN.ELEMENTS.ADD, {
      //     type: 'window',
      //     config: {
      //       thickness: WallConstants.THICKNESS,
      //       width: WallConstants.THICKNESS,
      //       height: WallConstants.HEIGHT
      //     },
      //     segments: [
      //       point,
      //       {
      //         x: point.x,
      //         y: point.y + 100
      //       }
      //     ]
      //   })
      //
      //   this.$store.commit(ROOMPLAN.DRAWING.TOGGLE, null)
      //   return
      // }
    },
    finishWall () {
      // call it in case we have unfinished wall on the canvas
      let indexWall
      const wall = this.elements.find((element, i) => {
        if (element.type === 'wall' && element.config.isDrawing !== false) {
          indexWall = i
          return true
        }
        return false
      })

      if (!wall) {
        return
      }

      if (wall.config.isDrawing === 'start') {
        this.$store.commit(ROOMPLAN.WALLSEGMENT.DELETE, {
          indexWall,
          indexSegment: 0
        })
      } else if (wall.config.isDrawing === 'end') {
        this.$store.commit(ROOMPLAN.WALLSEGMENT.DELETE, {
          indexWall,
          indexSegment: wall.segments.length - 1
        })
      }

      this.$store.commit(ROOMPLAN.ELEMENTS.UPDATE, {
        index: indexWall,
        config: {
          isDrawing: false
        }
      })
    },

    // Left Toolbar
    createWall () {
      this.$store.commit(ROOMPLAN.DRAWING.TOGGLE, 'wall')
      this.finishWall()
    },
    createDoor () {
      this.$store.commit(ROOMPLAN.DRAWING.TOGGLE, 'door')
      this.finishWall()
    },
    createWindow () {
      this.$store.commit(ROOMPLAN.DRAWING.TOGGLE, 'window')
      this.finishWall()
    },
    createStove () {
      this.$store.commit(ROOMPLAN.DRAWING.TOGGLE, 'stove')
      this.finishWall()
    },
    toggleCatalogue () {
      this.$root.$emit('bv::hide::popover')
      if (this.$refs.catalogue) {
        this.$refs.catalogue.$refs.panels.reset()
      }
    },

    handleDragStart (e) {
      // console.log('dragStart', e)
    },
    handleDragEnd (e) {
      // console.log('dragEnd', e)
    },

    // Drag & Drop
    catalogueDragStart (e) {
      console.log('catalogueDragStart', e)
      this.dragItem = e
    },
    dropStage (e) {
      console.log('dropStage', e, this.dragItem, this.dragItem.target.classList[0], this.dragItem.target.classList[1])
      const stage = this.$refs.stage.getStage()
      stage.setPointersPositions(e)
      const pos = getRelativePointerPosition(stage)
      pos.x -= this.dragItem.offsetX
      pos.y -= this.dragItem.offsetY

      const groundDepth = 60
      const overheadDepth = 32
      let dataset = {}
      let assetConfig = {}
      switch (this.dragItem.target.classList[0]) {
        case 'drag-svg':
          dataset = Object.assign({}, this.dragItem.target.dataset)
          for (const prop in dataset) {
            const parsed = parseInt(dataset[prop], 10)
            dataset[prop] = isNaN(parsed) ? dataset[prop] : parsed
          }

          if (typeof dataset.type !== 'undefined' && typeof dataset.index !== 'undefined') {
            assetConfig = AssetsList[dataset.type][dataset.index]
          }

          console.log('assetConfig', assetConfig, AssetsList, dataset.type, dataset.index)

          this.$store.commit(ROOMPLAN.ELEMENTS.ADD, {
            type: dataset.type ? dataset.type : 'svg-konva',
            layer: dataset.layer ? dataset.layer : 'general',
            segments: [pos],
            config: {
              width: assetConfig.width ? assetConfig.width : 150,
              height: assetConfig.height ? assetConfig.height : 150,
              ...pos
            },
            src: this.dragItem.target.src,
            assetConfig
          })
          break
        case 'drag-room-object':
          console.log(this.dragItem.target)
          this.$store.commit(ROOMPLAN.ELEMENTS.ADD, {
            type: 'room-object',
            segments: [pos],
            config: {
              width: 100,
              height: 100
            },
            objectName: this.dragItem.target.dataset.name,
            configTransformer: {
              rotationSnaps: [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 185, 300, 315, 330, 345],
              rotationSnapTolerance: 5,
              enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
            }
          })
          break
        case 'drag-cabinet':
          console.log('drag-cabinet')
          this.$store.commit(ROOMPLAN.ELEMENTS.ADD, {
            type: 'cabinet',
            layer: ['cabinets', 'ground'],
            segments: [pos],
            config: {
              width: overheadDepth * 2,
              height: overheadDepth * 2,
              stroke: '#000000',
              strokeWidth: 2
            }
          })
          break
        case 'drag-cabinet-overhead':
          console.log('drag-cabinet-overhead')
          this.$store.commit(ROOMPLAN.ELEMENTS.ADD, {
            type: 'cabinet',
            layer: ['cabinets', 'overhead'],
            segments: [pos],
            config: {
              width: groundDepth,
              height: groundDepth * 2,
              stroke: '#000000',
              lineCap: 'round',
              lineJoin: 'round',
              strokeWidth: 2,
              dasheEnabled: true,
              dash: [2, 4]
            }
          })
          break
        case 'drag-cabinet-shape':
          // eslint-disable-next-line
          let dash = {}
          // eslint-disable-next-line
          const segments = [{ x: 0, y: 0 }]
          // eslint-disable-next-line
          const layer = ['cabinets']
          switch (this.dragItem.target.classList[1]) {
            case 'l-shape-ground':
              segments.push({ x: 2 * groundDepth, y: 0 })
              segments.push({ x: 2 * groundDepth, y: groundDepth })
              segments.push({ x: groundDepth, y: groundDepth })
              segments.push({ x: groundDepth, y: 2 * groundDepth })
              segments.push({ x: 0, y: 2 * groundDepth })
              layer.push('ground')
              break
            case 'l-shape-overhead':
              segments.push({ x: 2 * overheadDepth, y: 0 })
              segments.push({ x: 2 * overheadDepth, y: overheadDepth })
              segments.push({ x: overheadDepth, y: overheadDepth })
              segments.push({ x: overheadDepth, y: 2 * overheadDepth })
              segments.push({ x: 0, y: 2 * overheadDepth })
              dash = {
                dasheEnabled: true,
                dash: [2, 4]
              }
              layer.push('overhead')
              break
          }

          this.$store.commit(ROOMPLAN.ELEMENTS.ADD, {
            type: 'cabinet-shape',
            layer,
            segments: segments,
            config: {
              x: pos.x,
              y: pos.y,
              stroke: '#000000',
              lineCap: 'round',
              lineJoin: 'round',
              strokeWidth: 2,
              ...dash
            }
          })
          break
      }
    },

    async save () {
      this.loadingSaving = true
      await this.$store.dispatch(AROOMPLANS.SAVE, { image: this.$refs.stage.getNode().toDataURL() })
      this.loadingSaving = false
    }
  },
  async created () {
    console.log('edit room plan', this.habitatId, this.projectId, this.roomPlanId)
    await api.roomPlans.get(this.roomPlanId)
    this.loaded = true
    this.$nextTick(() => {
      this.fitStageIntoParentContainer()

      // this.stageConfig.scaleX = this.scale
      // this.stageConfig.scaleY = this.scale
      // this.stageConfig.x = this.pan.x
      // this.stageConfig.y = this.pan.y

      this.stage.to({
        x: this.stateStageConfig.x,
        y: this.stateStageConfig.y,
        scaleX: this.stateStageConfig.scaleX,
        scaleY: this.stateStageConfig.scaleY,
        duration: 0.5
      })

      this.$store.commit(ROOMPLAN.DRAWING.TOGGLE, null)
    })
  },
  mounted () {
    window.addEventListener('resize', this.fitStageIntoParentContainer)
    document.querySelector('body').style.overflow = 'hidden'
  },
  destroyed () {
    window.removeEventListener('resize', this.fitStageIntoParentContainer)
    document.querySelector('body').style.overflow = 'auto'
  }
}
</script>
