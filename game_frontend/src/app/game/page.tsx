'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// PUBLIC_INTERFACE
export default function GameWorldPage() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    // Scene setup
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#88c0d0');

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Simple cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: '#3B82F6' });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7);
    scene.add(light);

    // Animation loop
    let frameId: number;
    const animate = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup on component unmount
    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section style={{ width: '100%', height: '80vh', marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Game World</h2>
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          border: '2px solid #3B82F6',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      />
    </section>
  );
}
