import * as THREE from 'three'

const geometry = new THREE.BoxGeometry(1,1,1),
      material = new THREE.MeshLambertMaterial(),
      cube = new THREE.Mesh(geometry, material)

cube.material.color.setHSL(Math.random() , 1, 0.5)

export {cube}
