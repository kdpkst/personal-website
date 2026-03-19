import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CAMERA_OFFSET = new THREE.Vector3(0, 8, 8);
const LOOK_OFFSET = new THREE.Vector3(0, 0, -1);
const LERP_SPEED = 3;

interface CameraRigProps {
  playerWorldPosRef: RefObject<THREE.Vector3>;
}

export default function CameraRig({ playerWorldPosRef }: CameraRigProps) {
  const targetCamPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const playerWorldPos = playerWorldPosRef.current;

    if (!playerWorldPos) {
      return;
    }

    targetCamPos.current.copy(playerWorldPos).add(CAMERA_OFFSET);
    targetLookAt.current.copy(playerWorldPos).add(LOOK_OFFSET);

    const t = 1 - Math.exp(-LERP_SPEED * delta);
    state.camera.position.lerp(targetCamPos.current, t);

    const currentLookAt = new THREE.Vector3();
    state.camera.getWorldDirection(currentLookAt);
    currentLookAt.multiplyScalar(10).add(state.camera.position);
    currentLookAt.lerp(targetLookAt.current, t);
    state.camera.lookAt(targetLookAt.current);
  });

  return null;
}
