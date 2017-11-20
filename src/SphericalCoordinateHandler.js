import {controls} from './cameras'
import {Quaternion, Vector3} from 'three'

function CartesianCoordinateHandler(x,y,z) {
  this.x = x
  this.y = y
  this.z = z
}
CartesianCoordinateHandler.toSpherical = function(x,y,z) {
  let radius = Math.sqrt(x**2 + y**2 + z**2),
      polar = Math.acos(y / radius),
      azimuthal = Math.asin(x / Math.sqrt(x**2 + z**2))

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
SphericalCoordinateHandler.prototype.toVector = function(radius, azimuthal, polar) {
  let x, y, z
  if(radius !== undefined && azimuthal !== undefined && polar !== undefined) {
    x = radius * Math.sin(azimuthal) * Math.sin(polar)
    y = radius * Math.cos(polar)
    z = radius * Math.sin(polar) * Math.cos(azimuthal)
  } else {
    this.update()
    x = this.radius * Math.sin(this.azimuthal.rads) * Math.sin(this.polar.rads),
    y = this.radius * Math.cos(this.polar.rads),
    z = this.radius * Math.sin(this.polar.rads) * Math.cos(this.azimuthal.rads)
  }
  return {x,y,z}
}
SphericalCoordinateHandler.prototype.travel = function(to, from) {
  this.update()
  const cos = Math.cos,
        sin = Math.sin,
        acos = Math.acos,
        asin = Math.asin,
        atan2 = Math.atan2,
        tan = Math.tan,
        PI = Math.PI
  console.log('Travel was called:')
  if(from === undefined) {
    from = {
      vector: this.vector,
      quaternion: this.quaternion
    }
  }
  let t = 0,
      currentSpherical = CartesianCoordinateHandler.toSpherical(from.vector.x, from.vector.y, from.vector.z),
      nextSpherical = CartesianCoordinateHandler.toSpherical(to.vector.x, to.vector.y, to.vector.z),
      R = this.radius,
      polar1 = currentSpherical.polar,
      polar2 = nextSpherical.polar,
      polarDelta = polar2 - polar1,
      azimuthal1 = currentSpherical.azimuthal,
      azimuthal2 = nextSpherical.azimuthal,
      azimuthalDelta = azimuthal2 - azimuthal1,
      a = Math.sin(azimuthalDelta/2) * Math.sin(azimuthalDelta/2) +
          Math.cos(azimuthal1) * Math.cos(azimuthal2) *
          Math.sin(polarDelta/2) * Math.sin(polarDelta/2),
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  c = Math.round(c * 100000) / 100000

  const startQ = from.quaternion.clone(),
        scope = this,
        chord = to.vector.clone().sub(from.vector),
        unitChord = {
          '∆x': chord.x / R, //cos(polar2)*sin(azimuthal2) - cos(polar1)*sin(azimuthal1),
          '∆y': chord.y / R, // cos(polar2)*cos(azimuthal2) - cos(polar1)*cos(azimuthal1),
          '∆z': chord.z / R // sin(polar2) - sin(polar1)
        },
        chordLength = Math.sqrt(unitChord['∆x'] ** 2 + unitChord['∆y'] ** 2 + unitChord['∆z'] ** 2),
        centralAngle = 2 * Math.asin(chordLength / 2)
  console.log('length:', chordLength)
  console.log('angle:', centralAngle * (180 / PI))
  console.log('Other angle:', c * (180 / PI))
  console.log('chord deltas:', {'∆x': chord.x, '∆y': chord.y, '∆z': chord.z})
  console.log('unitChord deltas:', {'∆x': unitChord['∆x'] * R, '∆y': unitChord['∆y'] * R, '∆z': unitChord['∆z'] * R})
  console.log({
    polar1: polar1 * (180 / Math.PI),
    polar2: polar2 * (180 / Math.PI)
  }, {
    azimuthal1: azimuthal1 * (180 / Math.PI),
    azimuthal2: azimuthal2 * (180 / Math.PI)
  })
  let fromX = from.vector.x,
      fromY = from.vector.y,
      fromZ = from.vector.z
  function step() {

    let stepQ = new Quaternion(),
        stepV = new Vector3(),
        u, v,
        x = from.vector.x,
        y = from.vector.y,
        z = from.vector.z
    if(c !== 0) {
      let pDelt = polarDelta * t,
          p = polar1 + pDelt,
          aDelt = azimuthalDelta * t,
          a = azimuthal1 + aDelt,
          v = scope.toVector(R, a, p)

      x = v.x
      y = v.y
      z = v.z
      // u = sin((1 - t) * centralAngle) / sin(centralAngle)
      // v = sin(t * centralAngle) / sin(centralAngle)
      // y = u * cos(polar1) * cos(azimuthal1) +
      //     v * cos(polar2) * cos(azimuthal2)
      // z = u * sin(polar1) * cos(azimuthal1) +
      //     v * sin(polar2) * cos(azimuthal2)
      // x = u * sin(azimuthal1) + v * sin(azimuthal2)
      // // x = Math.round(x * R * 1000) / 1000
      // // y = Math.round(y * R * 1000) / 1000
      // // z = Math.round(z * R * 1000) / 1000
      // x = x * R
      // y = y * R
      // z = z * R
    }

    console.log('     t =', t)
    console.log('   from:', {
      x: fromX,
      y: fromY,
      z: fromZ
    })
    console.log('current:', {x,y,z})
    console.log('\n')
    t += 0.05
    Quaternion.slerp(startQ, to.quaternion, stepQ, t)
    from.quaternion.set(stepQ.x,stepQ.y,stepQ.z,stepQ.w)
    from.vector.set(x,y,z)
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
