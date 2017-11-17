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
  const polar = controls.getPolarAngle() * (180 / Math.PI)
  const azimuthal = controls.getAzimuthalAngle() * (180 / Math.PI)
  if(e.key === 'r') {
    Spherical.toVector()
    console.log('𝜽:', azimuthal + '˚')
    console.log('φ:', polar + '˚')
    console.log('x =', controls.object.position.x, '= 𝜌 • sin(φ) • sin(𝜽) =', Math.sin(controls.getPolarAngle()) * Math.sin(controls.getAzimuthalAngle()) * Spherical.radius)
    console.log('y =', controls.object.position.y, '= 𝜌 • cos(φ) =', Spherical.radius, '• cos(' + controls.getPolarAngle() + ') =', Spherical.radius, '•', Math.cos(controls.getPolarAngle()), '=', Spherical.radius * Math.cos(controls.getPolarAngle()))
    console.log('z =', controls.object.position.z, '= 𝜌 • sin(φ) • cos(𝜽) =', Math.sin(controls.getPolarAngle()) * Math.cos(controls.getAzimuthalAngle()) * Spherical.radius)
    controls.reset()
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
