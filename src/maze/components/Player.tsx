import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  CELL_SIZE,
  PLAYER_START,
  PLAYER_START_VIEW,
  gridToWorld,
  isCollidingWithWall,
  worldToGrid,
} from "../data/mazeData";

const PLAYER_HEIGHT = 1.72;
const PLAYER_RADIUS = CELL_SIZE * 0.14;
const MOVE_SPEED = 7.4;
const ACCELERATION = 11;
const DRAG = 12;
const LOOK_SENSITIVITY = 0.0022;
const MAX_PITCH = Math.PI / 2.45;
const BOB_SPEED = 9.5;
const BOB_HEIGHT = 0.06;
const UP_AXIS = new THREE.Vector3(0, 1, 0);

interface PlayerProps {
  onPositionChange: (row: number, col: number, worldPos: THREE.Vector3) => void;
}

export default function Player({ onPositionChange }: PlayerProps) {
  const { camera, gl } = useThree();
  const keysRef = useRef<Set<string>>(new Set());
  const playerPosition = useRef(
    new THREE.Vector3(...gridToWorld(PLAYER_START.row, PLAYER_START.col)),
  );
  const velocity = useRef(new THREE.Vector3());
  const yaw = useRef(PLAYER_START_VIEW.yaw);
  const pitch = useRef(PLAYER_START_VIEW.pitch);
  const bobPhase = useRef(0);
  const swayPhase = useRef(0);
  const handsRootRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const reportPosition = useRef(new THREE.Vector3());
  const moveQuaternion = useRef(new THREE.Quaternion());
  const forwardVector = useRef(new THREE.Vector3());
  const rightVector = useRef(new THREE.Vector3());
  const desiredDirection = useRef(new THREE.Vector3());

  useEffect(() => {
    playerPosition.current.y = PLAYER_HEIGHT;
  }, []);

  useEffect(() => {
    const resetInputState = () => {
      keysRef.current.clear();
      velocity.current.set(0, 0, 0);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      keysRef.current.add(event.key.toLowerCase());
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.key.toLowerCase());
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement !== gl.domElement) {
        return;
      }

      yaw.current -= event.movementX * LOOK_SENSITIVITY;
      pitch.current -= event.movementY * LOOK_SENSITIVITY;
      pitch.current = THREE.MathUtils.clamp(
        pitch.current,
        -MAX_PITCH,
        MAX_PITCH,
      );
    };

    const handlePointerRequest = () => {
      if (document.pointerLockElement !== gl.domElement) {
        void gl.domElement.requestPointerLock();
      }
    };

    const handlePointerLockChange = () => {
      if (document.pointerLockElement !== gl.domElement) {
        resetInputState();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("blur", resetInputState);
    document.addEventListener("pointerlockchange", handlePointerLockChange);
    gl.domElement.addEventListener("click", handlePointerRequest);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("blur", resetInputState);
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      gl.domElement.removeEventListener("click", handlePointerRequest);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const activeCamera = state.camera;
    const moveForward =
      Number(keysRef.current.has("w")) - Number(keysRef.current.has("s"));
    const moveStrafe =
      Number(keysRef.current.has("d")) - Number(keysRef.current.has("a"));

    moveQuaternion.current.setFromAxisAngle(UP_AXIS, yaw.current);
    forwardVector.current.set(0, 0, -1).applyQuaternion(moveQuaternion.current);
    rightVector.current.set(1, 0, 0).applyQuaternion(moveQuaternion.current);

    desiredDirection.current
      .copy(forwardVector.current)
      .multiplyScalar(moveForward)
      .addScaledVector(rightVector.current, moveStrafe);
    desiredDirection.current.y = 0;

    if (desiredDirection.current.lengthSq() > 1) {
      desiredDirection.current.normalize();
    }

    const desiredVelocity = desiredDirection.current.multiplyScalar(MOVE_SPEED);
    const accelLerp = 1 - Math.exp(-ACCELERATION * delta);
    velocity.current.lerp(desiredVelocity, accelLerp);
    velocity.current.multiplyScalar(Math.exp(-DRAG * delta * 0.18));

    const nextX = playerPosition.current.x + velocity.current.x * delta;
    if (!isCollidingWithWall(nextX, playerPosition.current.z, PLAYER_RADIUS)) {
      playerPosition.current.x = nextX;
    } else {
      velocity.current.x = 0;
    }

    const nextZ = playerPosition.current.z + velocity.current.z * delta;
    if (!isCollidingWithWall(playerPosition.current.x, nextZ, PLAYER_RADIUS)) {
      playerPosition.current.z = nextZ;
    } else {
      velocity.current.z = 0;
    }

    const planarSpeed = Math.hypot(velocity.current.x, velocity.current.z);
    const moveFactor = THREE.MathUtils.clamp(planarSpeed / MOVE_SPEED, 0, 1);

    if (moveFactor > 0.04) {
      bobPhase.current += delta * BOB_SPEED * (0.55 + moveFactor * 0.75);
      swayPhase.current += delta * 7.5;
    } else {
      swayPhase.current += delta * 1.6;
    }

    const bobOffsetY = Math.sin(bobPhase.current) * BOB_HEIGHT * moveFactor;
    const bobOffsetX =
      Math.cos(bobPhase.current * 0.5) * BOB_HEIGHT * 0.22 * moveFactor;

    activeCamera.rotation.order = "YXZ";
    activeCamera.position.set(
      playerPosition.current.x + bobOffsetX,
      PLAYER_HEIGHT + bobOffsetY,
      playerPosition.current.z,
    );
    activeCamera.rotation.x = pitch.current;
    activeCamera.rotation.y = yaw.current;

    if (handsRootRef.current) {
      const idleLift = Math.sin(swayPhase.current * 0.75) * 0.01;
      handsRootRef.current.position.set(
        0,
        -0.72 + idleLift + Math.abs(Math.sin(bobPhase.current)) * 0.025 * moveFactor,
        -0.58,
      );
      handsRootRef.current.rotation.set(
        -0.04 + Math.sin(swayPhase.current * 0.9) * 0.01,
        0,
        Math.sin(swayPhase.current * 0.6) * 0.008,
      );
    }

    if (leftArmRef.current && rightArmRef.current) {
      const armSwing = Math.sin(bobPhase.current) * 0.14 * moveFactor;
      const idleSwing = Math.sin(swayPhase.current) * 0.02;

      leftArmRef.current.position.y = -0.06 - armSwing * 0.12 + idleSwing;
      rightArmRef.current.position.y = -0.03 + armSwing * 0.12 - idleSwing;

      leftArmRef.current.rotation.set(0.72 + armSwing, 0.22, 0.35 - armSwing * 0.18);
      rightArmRef.current.rotation.set(
        0.68 - armSwing,
        -0.22,
        -0.32 + armSwing * 0.18,
      );
    }

    const { row, col } = worldToGrid(
      playerPosition.current.x,
      playerPosition.current.z,
    );
    reportPosition.current.set(
      playerPosition.current.x,
      0,
      playerPosition.current.z,
    );
    onPositionChange(row, col, reportPosition.current);
  });

  return createPortal(
    <group ref={handsRootRef}>
      <group ref={leftArmRef} position={[-0.28, -0.06, 0]} rotation={[0.72, 0.22, 0.35]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.07, 0.42, 5, 10]} />
          <meshStandardMaterial color="#7c5d4d" roughness={0.98} metalness={0.02} />
        </mesh>
        <mesh position={[0, -0.17, 0.03]} castShadow>
          <sphereGeometry args={[0.09, 10, 10]} />
          <meshStandardMaterial color="#61473a" roughness={1} metalness={0} />
        </mesh>
        <mesh position={[0, 0.1, 0]} rotation={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[0.13, 0.12, 0.14]} />
          <meshStandardMaterial color="#3d3028" roughness={1} metalness={0} />
        </mesh>
        <mesh position={[0.01, 0.19, 0]} rotation={[0.12, 0.08, 0.08]} castShadow>
          <boxGeometry args={[0.18, 0.18, 0.24]} />
          <meshStandardMaterial color="#8b6e5e" roughness={0.98} metalness={0.01} />
        </mesh>
      </group>

      <group
        ref={rightArmRef}
        position={[0.28, -0.03, 0]}
        rotation={[0.68, -0.22, -0.32]}
      >
        <mesh castShadow>
          <capsuleGeometry args={[0.07, 0.42, 5, 10]} />
          <meshStandardMaterial color="#7c5d4d" roughness={0.98} metalness={0.02} />
        </mesh>
        <mesh position={[0, -0.17, 0.03]} castShadow>
          <sphereGeometry args={[0.09, 10, 10]} />
          <meshStandardMaterial color="#61473a" roughness={1} metalness={0} />
        </mesh>
        <mesh position={[0, 0.1, 0]} rotation={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[0.13, 0.12, 0.14]} />
          <meshStandardMaterial color="#3d3028" roughness={1} metalness={0} />
        </mesh>
        <mesh position={[-0.01, 0.19, 0]} rotation={[0.12, -0.08, -0.08]} castShadow>
          <boxGeometry args={[0.18, 0.18, 0.24]} />
          <meshStandardMaterial color="#8b6e5e" roughness={0.98} metalness={0.01} />
        </mesh>
      </group>
    </group>,
    camera,
  );
}
