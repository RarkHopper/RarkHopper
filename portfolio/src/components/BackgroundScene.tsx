import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import type * as THREE from 'three';

// Floating particles that gently move and respond to scroll
function FloatingParticles({ scrollProgress }: { scrollProgress: number }) {
  const particlesRef = useRef<THREE.Points>(null);

  // Create particle positions
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(60 * 3); // 60 particles

    for (let i = 0; i < 60; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30; // z
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;

      // Scroll-based particle movement
      const scrollEffect = scrollProgress * 2;

      // Gentle floating motion with scroll displacement
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        // Original floating motion
        positions[i + 1] += Math.sin(state.clock.elapsedTime * 0.5 + positions[i] * 0.01) * 0.002;

        // Scroll-based movement - particles flow away from center
        const particleIndex = i / 3;
        const angle = particleIndex * 0.5;

        // Move particles outward and upward as user scrolls
        positions[i] += Math.cos(angle) * scrollEffect * 0.05; // x movement
        positions[i + 1] += scrollEffect * 0.08; // y movement (upward)
        positions[i + 2] += Math.sin(angle) * scrollEffect * 0.05; // z movement
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;

      // Fade out particles as they move away
      if (particlesRef.current.material) {
        const material = particlesRef.current.material as THREE.PointsMaterial;
        material.opacity = Math.max(0.1, 0.6 - scrollProgress * 0.5);
      }
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={60}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#8b5cf6"
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Simple underwater wave effect
function UnderwaterWave({ scrollProgress }: { scrollProgress: number }) {
  const waveRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (waveRef.current) {
      const time = state.clock.elapsedTime;

      // Gentle wave distortion
      const geometry = waveRef.current.geometry as THREE.PlaneGeometry;
      const positions = geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        positions[i + 2] =
          Math.sin(x * 0.1 + time * 0.5) * 0.5 + Math.sin(y * 0.1 + time * 0.3) * 0.3;
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();

      // Move wave with scroll
      waveRef.current.position.y = -scrollProgress * 20;

      // Fade with scroll
      const material = waveRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = Math.max(0, 0.1 - scrollProgress * 0.05);
    }
  });

  return (
    <mesh ref={waveRef} position={[0, 0, -30]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[60, 60, 32, 32]} />
      <meshStandardMaterial color="#06b6d4" transparent opacity={0.1} wireframe />
    </mesh>
  );
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.4} />
      <pointLight position={[-10, -10, -10]} color="#8b5cf6" intensity={0.2} />
      <pointLight position={[15, 15, 10]} color="#3b82f6" intensity={0.15} />

      {/* 3D Elements */}
      <FloatingParticles scrollProgress={scrollProgress} />
      <UnderwaterWave scrollProgress={scrollProgress} />

      {/* Camera controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

export default function BackgroundScene() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('#hero');
      if (!heroSection) return;

      const heroHeight = heroSection.clientHeight;
      const scrolled = window.scrollY;
      const progress = Math.min(scrolled / heroHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{
          position: [0, 0, 20],
          fov: 60,
        }}
        style={{ background: 'transparent' }}
      >
        {/* Fog for depth */}
        <fog attach="fog" args={['#09090b', 15, 45]} />
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
