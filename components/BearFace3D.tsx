"use client"

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PerfectBear() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Materials
    const bearMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.8 });
    const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x332211, roughness: 0.6 });
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.3, metalness: 0.5 });

    // Head (rounded cube for a more natural look)
    const headGeometry = new THREE.SphereGeometry(1, 32, 32);
    const head = new THREE.Mesh(headGeometry, bearMaterial);
    scene.add(head);

    // Ears (better placement & slight tilt for realism)
    const earGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const leftEar = new THREE.Mesh(earGeometry, bearMaterial);
    leftEar.position.set(-0.7, 1, -0.1);
    leftEar.scale.set(1.2, 1.1, 1);
    head.add(leftEar);

    const rightEar = new THREE.Mesh(earGeometry, bearMaterial);
    rightEar.position.set(0.7, 1, -0.1);
    rightEar.scale.set(1.2, 1.1, 1);
    head.add(rightEar);

    // Eyes (reflective and positioned for a cuter look)
    const eyeGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.35, 0.3, 0.9);
    head.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.35, 0.3, 0.9);
    head.add(rightEye);

    // Nose (more rounded and natural placement)
    const noseGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const nose = new THREE.Mesh(noseGeometry, darkMaterial);
    nose.position.set(0, 0, 1);
    nose.scale.set(1.2, 0.8, 1);
    head.add(nose);

    // Mouth (small but visible bear-like snout)
    const mouthGeometry = new THREE.TorusGeometry(0.1, 0.02, 16, 32);
    const mouth = new THREE.Mesh(mouthGeometry, darkMaterial);
    mouth.position.set(0, -0.2, 1);
    mouth.rotation.x = Math.PI / 2;
    head.add(mouth);

    // Lighting for a soft, natural look
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 3;

    // Smooth mouse movement animation
    const mouse = new THREE.Vector2();
    const targetRotation = new THREE.Vector2();
    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Map mouse position to rotation angles
      targetRotation.x = -mouse.y * 0.2; // Negate Y-axis rotation to fix inversion
      targetRotation.y = mouse.x * 0.2; // Horizontal rotation remains the same
    };
    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      
      // Smoothly interpolate towards target rotation
      head.rotation.x += (targetRotation.x - head.rotation.x) * 0.1;
      head.rotation.y += (targetRotation.y - head.rotation.y) * 0.1;
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none" />;
}