import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CAMERA_OFFSET = new THREE.Vector3(0, 8, 8);
const LOOK_OFFSET = new THREE.Vector3(0, 0, -1);
const LERP_SPEED = 3;

interface CameraRigProps {
  playerWorldPos: THREE.Vector3;
}

export default function CameraRig({ playerWorldPos }: CameraRigProps) {
  const targetCamPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    // Calculate target camera position (above and behind player)
    targetCamPos.current.copy(playerWorldPos).add(CAMERA_OFFSET);

    // Calculate look-at target (slightly ahead of player)
    targetLookAt.current.copy(playerWorldPos).add(LOOK_OFFSET);

    // Smooth lerp
    const t = 1 - Math.exp(-LERP_SPEED * delta);
    state.camera.position.lerp(targetCamPos.current, t);

    // Smooth look-at
    const currentLookAt = new THREE.Vector3();
    state.camera.getWorldDirection(currentLookAt);
    currentLookAt.multiplyScalar(10).add(state.camera.position);
    currentLookAt.lerp(targetLookAt.current, t);
    state.camera.lookAt(targetLookAt.current);
  });

  return null;
}
