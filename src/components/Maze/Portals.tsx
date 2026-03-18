import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { PORTALS, gridToWorld, type PortalInfo } from './mazeData';

interface PortalsProps {
  activePortal: PortalInfo | null;
}

function Portal({ portal, isActive }: { portal: PortalInfo; isActive: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += 0.01;
      ringRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (glowRef.current) {
      glowRef.current.intensity = isActive
        ? 2 + Math.sin(state.clock.elapsedTime * 3) * 0.5
        : 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  const [x, , z] = gridToWorld(portal.row, portal.col);

  return (
    <group position={[x, 0, z]}>
      {/* Base glow ring on floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.5, 0.7, 32]} />
        <meshStandardMaterial
          color={portal.color}
          emissive={portal.color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating torus portal */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={ringRef} position={[0, 1.5, 0]}>
          <torusGeometry args={[0.5, 0.08, 16, 32]} />
          <meshStandardMaterial
            color={portal.color}
            emissive={portal.color}
            emissiveIntensity={isActive ? 1.5 : 0.6}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      </Float>

      {/* Inner glow plane */}
      <Float speed={2} floatIntensity={0.5}>
        <mesh position={[0, 1.5, 0]}>
          <circleGeometry args={[0.4, 32]} />
          <meshStandardMaterial
            color={portal.color}
            emissive={portal.color}
            emissiveIntensity={isActive ? 2 : 0.8}
            transparent
            opacity={isActive ? 0.6 : 0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Float>

      {/* Label */}
      <Text
        position={[0, 2.4, 0]}
        fontSize={0.2}
        color={portal.color}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
      >
        {portal.label}
      </Text>

      {/* Point light */}
      <pointLight
        ref={glowRef}
        color={portal.color}
        intensity={0.8}
        distance={5}
        position={[0, 1.5, 0]}
      />

      {/* Particle-like small spheres */}
      {[...Array(6)].map((_, i) => (
        <Float
          key={i}
          speed={1 + i * 0.3}
          rotationIntensity={0.5}
          floatIntensity={0.8}
        >
          <mesh
            position={[
              Math.cos((i / 6) * Math.PI * 2) * 0.6,
              1.2 + (i % 3) * 0.3,
              Math.sin((i / 6) * Math.PI * 2) * 0.6,
            ]}
          >
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial
              color={portal.color}
              emissive={portal.color}
              emissiveIntensity={2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function Portals({ activePortal }: PortalsProps) {
  return (
    <group>
      {PORTALS.map((portal) => (
        <Portal
          key={portal.route}
          portal={portal}
          isActive={activePortal?.route === portal.route}
        />
      ))}
    </group>
  );
}
