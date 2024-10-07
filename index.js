var drag = (function () {

  var positionFromEvent = function (event) {
    if ('touches' in event && event.touches.length > 0) {
      return { x: event.touches[0].pageX, y: event.touches[0].pageY }
    }
    if ('pageX' in event) {
      return { x: event.pageX, y: event.pageY }
    }
    return { x: 0, y: 0 }
  }

  /**
  * @typedef {{x:number, y:number}} Point
  *  
  * @param {{target:Element, direction?:"horizontal" | "vertical", input?:"touch" | "mouse"}} options 
  * @param {(state:"began" | "moved" | "ended", velocity:Point, position:Point) => void} update 
  * @returns {{dispose: () => void}}
  */
  var gesture = function ({ target, direction, input }, update) {
    var position = { x: 0, y: 0 }
    var velocity = { x: 0, y: 0 }
    var directed = undefined

    var handler = function (event) {
      const eventPosition = positionFromEvent(event)

      switch (event.type) {
        case "mousedown":
          event.stopPropagation()
          document.addEventListener("mousemove", handler)
          document.addEventListener("mouseup", handler)
        case "touchstart":
          event.stopPropagation()
          velocity = { x: 0, y: 0 }
          position = eventPosition
          directed = undefined
          update("began", velocity, eventPosition)
          break

        case "mousemove":
        case "touchmove":
          velocity.x = eventPosition.x - position.x
          velocity.y = eventPosition.y - position.y
          position = eventPosition
          if (directed == undefined && (velocity.x != 0 || velocity.y != 0)) {
            directed = Math.abs(velocity.y) > Math.abs(velocity.x) ? "vertical" : "horizontal"
          }
          if (direction == undefined || direction == directed) {
            event.preventDefault()
            update("moved", velocity, eventPosition)
          }
          break

        case "mouseup":
          document.removeEventListener("mousemove", handler)
          document.removeEventListener("mouseup", handler)
        case "touchend":
        case "touchcancel":
          update("ended", velocity, eventPosition)
          break
      }
    }

    if (input != "touch") {
      target.ondragstart = () => false
      target.addEventListener("mousedown", handler);
    }

    if (input != "mouse") {
      target.addEventListener("touchstart", handler);
      target.addEventListener("touchmove", handler);
      target.addEventListener("touchend", handler);
      target.addEventListener("touchcancel", handler);
    }

    return {
      dispose: function () {
        document.removeEventListener("mousemove", handler);
        document.removeEventListener("mouseup", handler);
        target.ondragstart = null
        target.removeEventListener("mousedown", handler);
        target.removeEventListener("touchstart", handler);
        target.removeEventListener("touchmove", handler);
        target.removeEventListener("touchend", handler);
        target.removeEventListener("touchcancel", handler);
      }
    }
  }

  return { createGesture: gesture }

})()

if (typeof module !== 'undefined') {
  module.exports = drag
}