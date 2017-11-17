import {controls} from './cameras'

function CartesianCoordinateHandler(x,y,z) {
  this.x = x
  this.y = y
  this.z = z
}
CartesianCoordinates.prototype.length = function() {
  return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2)
}
CartesianCoordinates.prototype.length = function() {
  return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2)
}


function SphericalCoordinateHandler(controls) {
  this.controls = controls
  this.defaultVector = controls.position0
  this.vector = controls.position0
  this.radius = this.vectorCoordinates.length()
  this.azimuthal = {}
  this.polar = {}
  this.azimuthal.rads = controls.getAzimuthalAngle()
  this.azimuthal.degs = this.azimuthal.rads * (180 / Math.PI)
  this.polar.rads = controls.getPolarAngle()
  this.polar.degs = this.polar.rads * (180 / Math.PI)
}
SphericalCoordinateHandler.prototype.update = function() {
  this.vector = controls.object.position
  this.radius = controls.object.position.length()
  this.azimuthal.rads = controls.getAzimuthalAngle()
  this.azimuthal.degs = this.azimuthal.rads * (180 / Math.PI)
  this.polar.rads = controls.getPolarAngle()
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
  }
}
SphericalCoordinateHandler.prototype.reset = function() {
  console.log(this.vectorCoordinates)
  console.log(this.azimuthalAngle)
  console.log(this.polarAngle)
}


export default new SphericalCoordinateHandler(controls)
