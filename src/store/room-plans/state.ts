export default {
  dimensionUnits: 'mm',
  stageConfig: {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1
  },
  roomPlan: {},
  history: [[]],
  historyStep: 0,
  drawingMode: null,
  selectedElementIndex: null,
  selectedSegmentIndex: null,
  elements: [],
  cursor: null,
  catalogue: {
    doors: [],
    windows: [],
    cupboards: [],
    appliances: []
  }

  // Probably not needed
  // modal: {
  //   visible: false,
  //   x: 0,
  //   y: 0,
  //   title: null,
  //   component: null
  // }
}
