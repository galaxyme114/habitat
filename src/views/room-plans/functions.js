// this function will return pointer position relative to the passed node
export const getRelativePointerPosition = function (node) {
  const transform = node.getAbsoluteTransform().copy()
  // to detect relative position we need to invert transform
  transform.invert()

  // get pointer (say mouse or touch) position
  const pos = node.getStage().getPointerPosition()

  // now we can find relative point
  return transform.point(pos)
}

export default {
  getRelativePointerPosition
}
