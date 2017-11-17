import * as THREE from 'three'

import OrbitControls from 'three-orbitcontrols'


const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        50
      ),
      controls = new OrbitControls(camera)

camera.position.set(0,4,10)
controls.update()
controls.saveState()

export {camera, controls}
