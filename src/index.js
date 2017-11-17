import * as THREE from 'three'

import OrbitControls from 'three-orbitcontrols'

import './styles.css'

import renderer from './renderer'
import {cube} from './objects'
import {light, directionalLight} from './lights'
import {controls, camera} from './cameras'
import Spherical from './SphericalCoordinateHandler'


const scene = new THREE.Scene()

document.addEventListener('keydown', function(e) {
  if(e.key === 'r') {
    Spherical.toVector()
    Spherical.reset()
  }
})

scene.add(cube)
scene.add(light)
scene.add(directionalLight)
directionalLight.position.set(0,0,3)

let color = Math.random()

cube.material.color.setHSL(color , 1, 0.5)

function animate() {
  requestAnimationFrame(animate)

  color += 0.001
  cube.material.color.setHSL(color , 1, 0.5 )
  renderer.render(scene, camera)
}
animate()
