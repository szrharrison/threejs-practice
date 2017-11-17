import {cube} from './objects'

function CubePositionHandler() {
  this.startingMouseX = null
  this.startingMouseY = null
  this.rotationX = 0
  this.rotationY = 0
  this.rotationZ = 0
  this.currentMouseX = null
  this.currentMouseY = null
  this.isMouseDown = false
}
CubePositionHandler.prototype.mouseDown = function(e) {
  this.startingMouseX = e.clientX
  this.startingMouseY = e.clientY
  this.currentMouseX = e.clientX
  this.currentMouseY = e.clientY
  this.isMouseDown = true
}
CubePositionHandler.prototype.mouseMove = function(e) {
  if(this.isMouseDown) {
    this.rotationX += e.clientX - this.currentMouseX
    this.rotationY += e.clientY - this.currentMouseY
    this.currentMouseX = e.clientX
    this.currentMouseY = e.clientY
    updatePosition(this.rotationX, this.rotationY)
  }
}
CubePositionHandler.prototype.mouseUp = function(e) {
  this.startingMouseX = null
  this.startingMouseY = null
  this.currentMouseX = null
  this.currentMouseY = null
  this.isMouseDown = false
}
CubePositionHandler.prototype.doubleClick = function(e) {
  updateRotation([this.rotationX, this.rotationY], [0, 0])
  this.rotationX = 0
  this.rotationY = 0
}
export function updatePosition(x, y) {
  cube.rotation.x = y * (Math.PI / 180)
  cube.rotation.y = x * (Math.PI / 180)
}

function updateRotation(start, stop, step = [null,null], current = [null,null]) {
  if(step[0] === null) {
    step[0] = (start[0] - stop[0]) / 30
    current[0] = start[0]
  }
  if(step[1] === null) {
    step[1] = (start[1] - stop[1]) / 30
    current[1] = start[1]
  }
  current[1] = current[1] - step[1]
  current[0] = current[0] - step[0]

  if(Math.abs(step[0]) > Math.abs(stop[0] - current[0])) {
    step[0] = 0
    current[0] = stop[0]
  }
  if(Math.abs(step[1]) > Math.abs(stop[1] - current[1])) {
    step[1] = 0
    current[1] = stop[1]
  }
  cube.rotation.x = current[1] * (Math.PI / 180)
  cube.rotation.y = current[0] * (Math.PI / 180)

  if(!(current[0] === stop[0] && current[1] === stop[1])) {
    requestAnimationFrame(() => updateRotation(start, stop, step, current))
  }
}

export default new CubePositionHandler()
