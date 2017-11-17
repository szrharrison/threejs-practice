import {controls} from './cameras'
import {Quaternion, Vector3} from 'three'

function CartesianCoordinateHandler(x,y,z) {
  this.x = x
  this.y = y
  this.z = z
}
CartesianCoordinateHandler.toSpherical = function(x,y,z) {
  let radius = Math.sqrt(x**2 + y**2 + z**2),
      polar = Math.acos(y / radius)  * (180 / Math.PI),
      azimuthal = Math.asin(x / Math.sqrt(x**2 + z**2)) * (180 / Math.PI)

  return {radius, polar, azimuthal}
}
CartesianCoordinateHandler.prototype.toSpherical = function() {
  return CartesianCoordinateHandler.toSpherical(this.x, this.y, this.z)
}
CartesianCoordinateHandler.prototype.length = function() {
  return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2)
}


function SphericalCoordinateHandler(controls) {
  this.controls = controls
  this.defaultPosition = {
    vector: controls.position0.clone(),
    quaternion: controls.object.quaternion.clone()
  }
  this.vector = this.controls.object.position
  this.quaternion = this.controls.object.quaternion
  this.radius = this.vector.length()
  this.azimuthal = {}
  this.polar = {}
  this.azimuthal.rads = controls.getAzimuthalAngle()
  this.azimuthal.degs = this.azimuthal.rads * (180 / Math.PI)
  this.polar.rads = controls.getPolarAngle()
  this.polar.degs = this.polar.rads * (180 / Math.PI)
}
SphericalCoordinateHandler.prototype.update = function() {
  this.vector = this.controls.object.position
  this.quaternion = this.controls.object.quaternion
  this.radius = this.controls.object.position.length()
  this.azimuthal.rads = this.controls.getAzimuthalAngle()
  this.azimuthal.degs = this.azimuthal.rads * (180 / Math.PI)
  this.polar.rads = this.controls.getPolarAngle()
  this.polar.degs = this.polar.rads * (180 / Math.PI)
}
SphericalCoordinateHandler.prototype.toVector = function(rho, azimuthal, polar) {
  let x, y, z
  if(rho !== undefined && azimuthal !== undefined && polar !== undefined) {
    x = rho * Math.sin(azimuthal) * Math.sin(polar)
    y = rho * Math.cos(polar)
    z = rho * Math.sin(polar) * Math.cos(azimuthal)
  } else {
    this.update()
    x = this.radius * Math.sin(this.azimuthal.rads) * Math.sin(this.polar.rads),
    y = this.radius * Math.cos(this.polar.rads),
    z = this.radius * Math.sin(this.polar.rads) * Math.cos(this.azimuthal.rads)
    console.log({x,y,z})
    console.log(CartesianCoordinateHandler.toSpherical(x,y,z))
    console.log({radius: this.radius, polar: this.polar.degs, azimuthal: this.azimuthal.degs})
    console.log(this.controls.object.position)
    console.log(this.controls.object.quaternion)
  }
}
SphericalCoordinateHandler.prototype.travel = function(to, from) {
  this.update()
  console.log('travel was called:')
  if(from === undefined) {
    from = this.position
  }
  const start = from.clone(),
        scope = this
  let t = 0
  function step() {
    t += 0.05
    let stepQ = new Quaternion(),
        stepV = new Vector3
    Quaternion.slerp(start, to.quaternion, stepQ, t)
    from.set(stepQ.x,stepQ.y,stepQ.z,stepQ.w)
    if(t < 1) {
      requestAnimationFrame(step)
    }
  }
  step()
  // if(from === undefined) {
  //   from = {radius: this.radius, polar: this.polar.rads, azimuthal: this.azimuthal.rads}
  // }
  // if(to.hasOwnProperty('x')) {
  //   to = CartesianCoordinateHandler.toSpherical(to.x, to.y, to.z)
  // }
  // if(from.hasOwnProperty('x')) {
  //   from = CartesianCoordinateHandler.toSpherical(from.x, from.y, from.z)
  // }
  // if(typeof to.polar === 'object') {
  //   to.polar = to.polar.rads
  //   to.azimuthal = to.azimuthal.rads
  // }
  // if(typeof from.polar === 'object') {
  //   from.polar = from.polar.rads
  //   from.azimuthal = from.azimuthal.rads
  // }
  // const extend = to.radius - from.radius,
  //       rotate = to.polar - from.polar,
  //       elevate = to.azimuthal - from.azimuthal,
  //       extendStep = extend / 30,
  //       rotateStep = rotate / 30,
  //       elevateStep = elevate / 30,
  //       step = {radius: extendStep, polar: rotateStep, azimuthal: elevateStep}
  //
  // function increment(current, stop, step) {
  //   if(Math.abs(step.radius) > Math.abs(stop.radius - current.radius)) {
  //     step.radius = 0
  //     current.radius = stop.radius
  //   } else {
  //     current.radius = current.radius - step.radius
  //   }
  //   if(Math.abs(step.polar) > Math.abs(stop.polar - current.polar)) {
  //     step.polar = 0
  //     current.polar = stop.polar
  //   } else {
  //     current.polar = current.polar - step.polar
  //   }
  //   if(Math.abs(step.azimuthal) > Math.abs(stop.azimuthal - current.azimuthal)) {
  //     step.azimuthal = 0
  //     current.azimuthal = stop.azimuthal
  //   } else {
  //     current.azimuthal = current.azimuthal - step.azimuthal
  //   }
  // }
}
SphericalCoordinateHandler.prototype.reset = function() {
  this.travel(this.defaultPosition)
}


export default new SphericalCoordinateHandler(controls)
