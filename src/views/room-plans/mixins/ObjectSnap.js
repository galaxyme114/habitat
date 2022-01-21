// https://konvajs.org/docs/sandbox/Objects_Snapping.html
// NOTE this mixin is dependent on Index.vue, I made it as a mixin to separate the functionality
import Konva from 'konva'
const GUIDELINE_OFFSET = 5
const WALL_WIDTH = 5

export default {
  data () {
    return {
      wallGuides: {
        vertical: [],
        horizontal: []
      }
    }
  },
  watch: {
    dimensions: {
      deep: true,
      immediate: true,
      handler () {
        this.$nextTick(this.getWallGuides)
      }
    }
  },
  // NOTE VUEX STATE Coming from component that mixin is used from, requires walls & elements
  methods: {
    getWallGuides () {
      this.wallGuides.horizontal = []
      this.wallGuides.vertical = []
      this.walls.forEach(wall => {
        console.log(wall)
        wall.segments.forEach(segment => {
          console.log(segment)
          const guideItem = wall.getNode()
          const box = guideItem.getClientRect()

          // and we can snap to all edges of shapes
          if (box.width < WALL_WIDTH) {
            this.wallGuides.vertical.push([box.y, box.y + box.height])
          }
          if (box.height < WALL_WIDTH) {
            this.wallGuides.horizontal.push([box.x, box.x + box.width])
          }
        })
      })
      this.wallGuides.horizontal = this.wallGuides.horizontal.flat()
      this.wallGuides.vertical = this.wallGuides.vertical.flat()
    },

    // were can we snap our objects?
    // walls and other objects, edges and centers
    getLineGuideStops (skipShape) {
      const stage = this.$refs.stage.getNode()

      // we can snap to stage borders and the center of the stage
      const vertical = [this.drawInset.x, stage.width() - this.drawInset.x] // , stage.width() / 2 - this.drawInset.x]
      const horizontal = [this.drawInset.y, stage.height() - this.drawInset.x] // , stage.height() / 2 - this.drawInset.x]
      const transformer = stage.findOne('Transformer')

      // and we snap over edges and center of each object on the canvas
      stage.find('Rect').forEach((guideItem) => {
        if (guideItem === skipShape || transformer === guideItem.parent) {
          return
        }

        const box = guideItem.getClientRect()

        // and we can snap to all edges of shapes
        vertical.push([box.x, box.x + box.width / 2, box.x + box.width])
        horizontal.push([box.y, box.y + box.height / 2, box.y + box.height])
      })

      if (this.wallGuides.vertical.length > 0) {
        vertical.push(this.wallGuides.vertical)
        horizontal.push(this.wallGuides.horizontal)
      }

      return {
        vertical: vertical.flat().filter((value, index, self) => self.indexOf(value) === index),
        horizontal: horizontal.flat().filter((value, index, self) => self.indexOf(value) === index)
      }
    },

    // what points of the object will trigger to snapping?
    // all edges and center
    getObjectSnappingEdges (node) {
      const box = node.getClientRect()
      const absPos = node.absolutePosition()

      return {
        vertical: [
          {
            guide: Math.round(box.x),
            offset: Math.round(absPos.x - box.x),
            snap: 'start'
          },
          {
            guide: Math.round(box.x + box.width / 2),
            offset: Math.round(absPos.x - box.x - box.width / 2),
            snap: 'center'
          },
          {
            guide: Math.round(box.x + box.width),
            offset: Math.round(absPos.x - box.x - box.width),
            snap: 'end'
          }
        ],
        horizontal: [
          {
            guide: Math.round(box.y),
            offset: Math.round(absPos.y - box.y),
            snap: 'start'
          },
          {
            guide: Math.round(box.y + box.height / 2),
            offset: Math.round(absPos.y - box.y - box.height / 2),
            snap: 'center'
          },
          {
            guide: Math.round(box.y + box.height),
            offset: Math.round(absPos.y - box.y - box.height),
            snap: 'end'
          }
        ]
      }
    },

    // find all snapping possibilities
    getGuides (lineGuideStops, itemBounds) {
      const resultV = []
      lineGuideStops.vertical.forEach((lineGuide) => {
        itemBounds.vertical.forEach((itemBound) => {
          const diff = Math.abs(lineGuide - itemBound.guide)
          // if the distance between guild line and object snap point is close we can consider this for snapping
          if (diff < GUIDELINE_OFFSET) {
            resultV.push({
              lineGuide: lineGuide,
              diff: diff,
              snap: itemBound.snap,
              offset: itemBound.offset
            })
          }
        })
      })

      const resultH = []
      lineGuideStops.horizontal.forEach((lineGuide) => {
        itemBounds.horizontal.forEach((itemBound) => {
          const diff = Math.abs(lineGuide - itemBound.guide)
          if (diff < GUIDELINE_OFFSET) {
            resultH.push({
              lineGuide: lineGuide,
              diff: diff,
              snap: itemBound.snap,
              offset: itemBound.offset
            })
          }
        })
      })

      // find closest snap
      const minV = resultV.sort((a, b) => a.diff - b.diff)[0]
      const minH = resultH.sort((a, b) => a.diff - b.diff)[0]

      const guides = []
      if (minV) {
        guides.push({
          lineGuide: minV.lineGuide,
          offset: minV.offset,
          orientation: 'V',
          snap: minV.snap
        })
      }
      if (minH) {
        guides.push({
          lineGuide: minH.lineGuide,
          offset: minH.offset,
          orientation: 'H',
          snap: minH.snap
        })
      }
      return guides
    },

    drawGuides (guides) {
      const layer = this.$refs.items.getNode()
      guides.forEach((lg) => {
        // horizontal
        let points = [-6000, 0, 6000, 0]
        let pos = { x: 0, y: lg.lineGuide }
        if (lg.orientation === 'V') {
          // vertical
          points = [0, -6000, 0, 6000]
          pos = { x: lg.lineGuide, y: 0 }
        }
        const line = new Konva.Line({
          points: points,
          stroke: 'rgb(0, 161, 255)',
          strokeWidth: 1,
          name: 'guid-line',
          dash: [4, 6]
        })
        layer.add(line)
        line.absolutePosition(pos)
        layer.batchDraw()
      })
    },
    dragMove (e) {
      const layer = this.$refs.items.getNode()

      // clear all previous lines on the screen
      layer.find('.guid-line').destroy()

      // find possible snapping lines
      const lineGuideStops = this.getLineGuideStops(e.target)
      // find snapping points of current object
      const itemBounds = this.getObjectSnappingEdges(e.target)

      // now find where can we snap current object
      const guides = this.getGuides(lineGuideStops, itemBounds)

      // do nothing of no snapping
      if (!guides.length) {
        return
      }

      this.drawGuides(guides)

      // now force object position
      const absPos = e.target.absolutePosition()
      guides.forEach((lg) => {
        switch (lg.orientation) {
          case 'V': {
            absPos.x = lg.lineGuide + lg.offset
            break
          }
          case 'H': {
            absPos.y = lg.lineGuide + lg.offset
            break
          }
        }
        e.target.absolutePosition(absPos)
      })
    },
    dragEndSnap () {
      const layer = this.$refs.items.getNode()

      // clear all previous lines on the screen
      layer.find('.guid-line').destroy()
      layer.batchDraw()
    }
  }
}
