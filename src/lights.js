import * as THREE from 'three'

const light = new THREE.AmbientLight(0x404040),
      directionalLight = new THREE.DirectionalLight(0xffffff)

export {light, directionalLight}
