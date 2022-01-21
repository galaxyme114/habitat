// import Vue from 'vue'
import {
  ROOMPLAN, ROOMPLANADD
} from '@/store/mutation-types'
import {
  RoomPlanStore,
  RoomPlan,
  WallSegment,
  Point,
  Element,
  ElementSegmentIndex,
  Attached
} from '@/store/types'
import cloneDeep from 'lodash/cloneDeep'

function saveHistory (state: RoomPlanStore) {
  // cut newer history
  if (state.historyStep < state.history.length - 1) {
    state.history.splice(state.historyStep + 1, state.history.length)
  }
  state.history.push(cloneDeep(state.elements))
  state.historyStep += 1
}

function dist (p1: Point, p2: Point) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
}

function isPointOnLine (p0: Point, [p1, p2]: Point[]) {
  // I think that function is not correct for all cases
  const diff = Math.abs(dist(p0, p1) + dist(p0, p2) - dist(p1, p2))
  return diff < 0.000001
}

function isLineOnLine (smallLine: Point[], largeLine: Point[]) {
  return isPointOnLine(smallLine[0], largeLine) && isPointOnLine(smallLine[1], largeLine)
}

// from here: https://jsfiddle.net/shishirraven/4dmjh0sa/
function findClosestPointOnLine (p: Point, line: Point[]) {
  const [a, b] = line
  const atob = { x: b.x - a.x, y: b.y - a.y }
  const atop = { x: p.x - a.x, y: p.y - a.y }
  const len = atob.x * atob.x + atob.y * atob.y
  const dot = atop.x * atob.x + atop.y * atob.y
  const t = Math.min(1, Math.max(0, dot / len))
  // const ddot = ( b.x - a.x ) * ( p.y - a.y ) - ( b.y - a.y ) * ( p.x - a.x );
  return {
    x: a.x + atob.x * t,
    y: a.y + atob.y * t
  }
}

function getAttachedObjects (elements: Element[], wall: Element) {
  const attached: Attached[] = []
  elements.forEach(otherElement => {
    if (otherElement === wall) {
      return false
    }
    // don't check walls
    if (otherElement.type === 'wall') {
      return false
    }

    for (let i = 0; i < wall.segments.length - 1; i++) {
      const segment = [wall.segments[i], wall.segments[i + 1]]
      if (isLineOnLine(otherElement.segments, segment)) {
        attached.push({ element: otherElement, indexSegment: i, delta: dist(segment[0], otherElement.segments[0]) / dist(segment[0], segment[1]) })
      }
    }
  })
  return attached
}

const vectorAB = (a: WallSegment, b: WallSegment) => {
  return {
    x: b.x - a.x,
    y: b.y - a.y
  }
}

export default {
  [ROOMPLANADD] (state: RoomPlanStore, roomPlan: RoomPlan) {
    if (roomPlan.snapShots && roomPlan.snapShots.length > 0) {
      console.log('merge snapShot', roomPlan.snapShots[roomPlan.snapShots.length - 1].state)
      const snapshot = roomPlan.snapShots[roomPlan.snapShots.length - 1].state
      snapshot.selectedElementIndex = null
      snapshot.selectedSegmentIndex = null
      Object.assign(state, roomPlan.snapShots[roomPlan.snapShots.length - 1].state)
    } else {
      console.log('no snapshots', cloneDeep(roomPlan))
    }

    const roomPlanSansSnapShots = cloneDeep(roomPlan)
    delete roomPlanSansSnapShots.snapShots

    // Just in case they saved it while something was selected.
    roomPlanSansSnapShots.selectedElementIndex = null
    roomPlanSansSnapShots.selectedSegmentIndex = null

    Object.assign(state.roomPlan, roomPlanSansSnapShots)
  },

  [ROOMPLAN.CURSOR] (state: RoomPlanStore, data: string|null) {
    state.cursor = data
  },
  [ROOMPLAN.CURSORS.DEFAULT] (state: RoomPlanStore) {
    state.cursor = null
  },
  [ROOMPLAN.CURSORS.POINTER] (state: RoomPlanStore) {
    state.cursor = 'pointer'
  },
  [ROOMPLAN.CURSORS.GRAB] (state: RoomPlanStore) {
    state.cursor = 'grab'
  },
  [ROOMPLAN.CURSORS.GRABBING] (state: RoomPlanStore) {
    state.cursor = 'grabbing'
  },

  [ROOMPLAN.DRAWING.TOGGLE] (state: RoomPlanStore, mode: string) {
    if (state.drawingMode === mode) {
      state.drawingMode = null
      return
    }
    state.drawingMode = mode

    if (state.drawingMode === 'pan') {
      state.cursor = 'grab'
    } else {
      state.cursor = 'pointer'
    }
  },

  [ROOMPLAN.SELECT.TOGGLE] (state: RoomPlanStore, mode: string) {
    if (state.drawingMode === mode) {
      state.drawingMode = null
      return
    }
    state.drawingMode = mode
  },

  [ROOMPLAN.ELEMENTS.ADD] (state: RoomPlanStore, element: Element) {
    // NOTE Start Layering
    switch (element.type) {
      case 'wall':
        state.elements.unshift(element)
        break
      default:
        state.elements.push(element)
    }
    saveHistory(state)
  },
  [ROOMPLAN.ELEMENTS.DELETE] (state: RoomPlanStore, indexToRemove: number|null = null) {
    if (indexToRemove === null) {
      indexToRemove = state.selectedElementIndex
    }

    if (indexToRemove === null) {
      return
    }

    console.log('ROOMPLAN.ELEMENTS.DELETE', indexToRemove)

    const element = state.elements[indexToRemove]
    if (state.selectedSegmentIndex === 0) {
      element.segments.splice(state.selectedSegmentIndex, 1)
    } else if (state.selectedSegmentIndex === element.segments.length - 2) {
      element.segments.splice(state.selectedSegmentIndex + 1, 1)
    } else if (state.selectedSegmentIndex) {
      const el1 = JSON.parse(JSON.stringify(element))
      const el2 = JSON.parse(JSON.stringify(element))
      el1.segments = el1.segments.slice(0, state.selectedSegmentIndex + 1)
      el2.segments = el2.segments.slice(state.selectedSegmentIndex + 1, el2.segments.length)
      state.elements.splice(indexToRemove, 1, el1, el2)
    } else {
      state.elements.splice(indexToRemove, 1)
    }
    // remove element
    state.selectedElementIndex = null
    state.selectedSegmentIndex = null
    saveHistory(state)
  },
  [ROOMPLAN.ELEMENTS.UPDATE] (state: RoomPlanStore, element: Element) {
    Object.assign(state.elements[element.index].config, element.config)
    if (element.segments) {
      state.elements[element.index].segments.forEach((segment, i) => {
        Object.assign(state.elements[element.index].segments[i], element.segments[i])
      })
    }
    if (element.dataset) {
      console.log('update elelement dataset', element)
      Object.assign(state.elements[element.index].dataset, element.dataset)
    }
    saveHistory(state)
  },
  [ROOMPLAN.ELEMENTS.SNAP] (state: RoomPlanStore, data: Element) {
    const element = state.elements[data.index]
    const center = {
      x: (element.segments[0].x + element.segments[1].x) / 2,
      y: (element.segments[0].y + element.segments[1].y) / 2
    }
    const elementDist = dist(element.segments[0], element.segments[1])
    state.elements.forEach(otherElement => {
      if (otherElement.type !== 'wall') {
        return
      }
      for (let i = 0; i < otherElement.segments.length - 1; i++) {
        const segment = [otherElement.segments[i], otherElement.segments[i + 1]]
        const closest = findClosestPointOnLine(center, segment)
        const isClose = dist(closest, center) < 20
        if (!isClose) {
          return
        }
        const centerDelta = dist(segment[0], closest) / dist(segment[0], segment[1])
        const halfDelta = elementDist / 2 / dist(segment[0], segment[1])
        const firstDelta = centerDelta - halfDelta
        const secondDelta = centerDelta + halfDelta

        element.segments = [{
          x: segment[0].x * (1 - firstDelta) + segment[1].x * firstDelta,
          y: segment[0].y * (1 - firstDelta) + segment[1].y * firstDelta
        }, {
          x: segment[0].x * (1 - secondDelta) + segment[1].x * secondDelta,
          y: segment[0].y * (1 - secondDelta) + segment[1].y * secondDelta
        }]
      }
    })
    saveHistory(state)
  },
  [ROOMPLAN.ELEMENTS.SELECT] (state: RoomPlanStore, data: ElementSegmentIndex) {
    state.selectedElementIndex = data?.elementIndex ?? null
    state.selectedSegmentIndex = data?.segmentIndex ?? null
  },

  [ROOMPLAN.WALLS.ADD] (state: RoomPlanStore, data: Element) {
    state.elements.push(data)
    saveHistory(state)
  },
  [ROOMPLAN.WALLS.DELETE] (state: RoomPlanStore, index: number) {
    state.elements.splice(index, 1)
    saveHistory(state)
  },
  [ROOMPLAN.WALLSEGMENT.ADD] (state: RoomPlanStore, data: { indexWall: number; indexSegment: number; wallSegment: WallSegment }) {
    state.elements[data.indexWall].segments.splice(data.indexSegment, 0, data.wallSegment)

    // const wallSegment = Vue.observable(data.wallSegment)
    // state.elements[data.indexWall].segments.push(wallSegment)
    // console.log('ROOMPLAN.WALLSEGMENT.ADD', data.indexWall, data.wallSegment, wallSegment, state.elements[data.indexWall])

    saveHistory(state)
  },
  [ROOMPLAN.WALLSEGMENT.UPDATE] (state: RoomPlanStore, data: { indexWall: number; indexSegment: number; wallSegment: WallSegment }) {
    console.log('WALLSEGMENT.UPDATE', data)
    const wall = state.elements[data.indexWall]
    const attached = getAttachedObjects(state.elements, wall)
    Object.assign(wall.segments[data.indexSegment], data.wallSegment)
    // ts-ignore
    attached.forEach(({ element, indexSegment, delta }) => {
      const moved = indexSegment === data.indexSegment || indexSegment + 1 === data.indexSegment
      if (!moved) {
        return
      }

      // get width of door/window
      const width = dist(element.segments[0], element.segments[1])

      // now we need to fit it into a new position of wall:
      const wallSegment = [wall.segments[indexSegment], wall.segments[indexSegment + 1]]
      const wallWidth = dist(wallSegment[0], wallSegment[1])
      const partOfWall = width / wallWidth

      // delta = Math.min(delta, 1 - delta)

      const secondDelta = delta + partOfWall

      const segment = [{
        x: wallSegment[0].x * (1 - delta) + wallSegment[1].x * delta,
        y: wallSegment[0].y * (1 - delta) + wallSegment[1].y * delta
      }, {
        x: wallSegment[0].x * (1 - secondDelta) + wallSegment[1].x * secondDelta,
        y: wallSegment[0].y * (1 - secondDelta) + wallSegment[1].y * secondDelta
      }]

      element.segments = segment
      saveHistory(state)
    })
    // now we need to update all attached objects
    // should we have "attachedTo" property?
  },
  [ROOMPLAN.WALLSEGMENT.DELETE] (state: RoomPlanStore, data: { indexWall: number; indexSegment: number }) {
    console.log('ROOMPLAN.WALLSEGMENT.DELETE', state.elements[data.indexWall].segments.length, data.indexWall, data.indexSegment)
    state.elements[data.indexWall].segments.splice(data.indexSegment, 1)
    saveHistory(state)
  },

  // For dragging
  [ROOMPLAN.WALLS.UPDATE] (state: RoomPlanStore, data: { index: number; delta: [WallSegment, WallSegment] }) {
    const ab = vectorAB(data.delta[0], data.delta[1])
    state.elements[data.index].segments.forEach(segment => {
      segment.x += ab.x
      segment.y += ab.y
    })

    saveHistory(state)
  },

  [ROOMPLAN.HISTORY.SAVE] (state: RoomPlanStore) {
    saveHistory(state)
  },
  [ROOMPLAN.HISTORY.UNDO] (state: RoomPlanStore) {
    if (state.historyStep === 0) {
      console.log('no undo action')
      return
    }

    state.historyStep -= 1
    state.elements = cloneDeep(state.history[state.historyStep])
  },
  [ROOMPLAN.HISTORY.REDO] (state: RoomPlanStore) {
    if (state.historyStep === state.history.length) {
      console.log('no redo action')
      return
    }
    state.historyStep += 1
    state.elements = cloneDeep(state.history[state.historyStep])
  },

  [ROOMPLAN.DIMENSIONUNITS.SET] (state: RoomPlanStore, units: string) {
    state.dimensionUnits = units
  },

  [ROOMPLAN.STAGECONFIG.SET] (state: RoomPlanStore, stageConfig: object) {
    state.stageConfig = {
      ...state.stageConfig,
      ...stageConfig
    }
  }
}
