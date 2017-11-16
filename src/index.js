import * as THREE from 'three'

import OrbitControls from 'three-orbitcontrols'

import './styles.css'


const scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        50
      ),
      renderer = new THREE.WebGLRenderer()
      // controls = new OrbitControls(camera)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

camera.position.set(0,0,10)
camera.lookAt(new THREE.Vector3(0, 0, 0))
// controls.update()

const geometry = new THREE.BoxGeometry(1,1,1),
      material = new THREE.MeshBasicMaterial(),
      cube = new THREE.Mesh(geometry, material)

scene.add(cube)
updatePosition(45, 30)

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
  updatePosition(45,30)
  this.rotationX = 45
  this.rotationY = 30
}
function updatePosition(x, y) {
  cube.rotation.x = y * (Math.PI / 180)
  cube.rotation.y = x * (Math.PI / 180)
}

const positionHandler = new CubePositionHandler()

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
let color = Math.random()

cube.material.color.setHSL(color , 1, 0.5)

function animate() {
  requestAnimationFrame(animate)


  color += 0.001
  cube.material.color.setHSL(color , 1, 0.5 )
  // controls.update()
  renderer.render(scene, camera)
}
animate()
