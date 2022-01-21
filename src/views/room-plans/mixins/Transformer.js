export default {
  methods: {
    data () {
      return {
        selectedShapeName: '',
        selectedShape: null
      }
    },
    updateShape () {
      console.log('updateRect', this.selectedShape)
      if (this.selectedShape === null) {
        this.transform.x = null
        this.transform.x = null
        this.transform.y = null
        this.transform.width = null
        this.transform.height = null
        this.transform.rotation = null
      }

      this.transform.x = this.selectedShape.x
      this.transform.y = this.selectedShape.y
      this.transform.width = this.selectedShape.scaleX * this.selectedShape.width
      this.transform.height = this.selectedShape.scaleY * this.selectedShape.height
      this.transform.rotation = this.selectedShape.rotation
    },
    dragEndTransform (e) {
      this.selectedShape.x = e.target.x()
      this.selectedShape.y = e.target.y()
      this.updateShape()
    },
    handleTransformEnd (e) {
      // update the state
      this.selectedShape.x = e.target.x()
      this.selectedShape.y = e.target.y()
      this.selectedShape.rotation = e.target.rotation()
      this.selectedShape.scaleX = e.target.scaleX()
      this.selectedShape.scaleY = e.target.scaleY()
      this.updateShape()
    },
    handleStageMouseDown (e) {
      // clicked on stage - clear selection
      if (e.target === e.target.getStage()) {
        this.updateShape()
        this.selectedShapeName = ''
        this.selectedShapeName = null
        this.updateTransformer()
        return
      }

      // clicked on transformer - do nothing
      if (e.target.getParent().className === 'Transformer') {
        return
      }

      // find clicked rect by its name
      const name = e.target.name()
      const rect = this.rectangles.find((r) => r.name === name)
      if (rect) {
        this.selectedShapeName = name
        this.selectedShape = rect
        this.showTransformControls = true
      } else {
        this.selectedShapeName = ''
        this.selectedShape = null
        this.showTransformControls = false
      }
      this.updateShape()
      this.updateTransformer()
    },
    updateTransformer () {
      // here we need to manually attach or detach Transformer node
      const transformerNode = this.$refs.transformer.getNode()
      const stage = transformerNode.getStage()
      const { selectedShapeName } = this

      const selectedNode = stage.findOne('.' + selectedShapeName)

      // do nothing if selected node is already attached
      if (selectedNode === transformerNode.node()) {
        return
      }

      if (selectedNode) {
        // attach to another node
        transformerNode.nodes([selectedNode])
        transformerNode.keepRatio(true)
        transformerNode.rotationSnaps([0, 45, 90, 135, 180, 225, 270, 315])
        transformerNode.rotationSnapTolerance(22.5)
      } else {
        // remove transformer
        transformerNode.nodes([])
      }
      transformerNode.getLayer().batchDraw()
    }
  }
}
