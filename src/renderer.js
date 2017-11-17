import {WebGLRenderer} from 'three'

import positionHandler from './CubePositionHandler'

const renderer = new WebGLRenderer()

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

renderer.domElement.addEventListener(
  'mousedown', (e) => positionHandler.mouseDown(e)
)
renderer.domElement.addEventListener(
  'mousemove', (e) => positionHandler.mouseMove(e)
)
renderer.domElement.addEventListener(
  'mouseup', (e) => positionHandler.mouseUp(e)
)
renderer.domElement.addEventListener(
  'dblclick', (e) => positionHandler.doubleClick(e)
)

export default renderer
