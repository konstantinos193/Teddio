"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function AnimatedTeddyBear() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    mountRef.current.appendChild(renderer.domElement)

    // Create a simple teddy bear shape
    const geometry = new THREE.SphereGeometry(1, 32, 32)
    const material = new THREE.MeshPhongMaterial({ color: 0xf27125 })
    const bear = new THREE.Mesh(geometry, material)
    scene.add(bear)

    // Add ears
    const earGeometry = new THREE.SphereGeometry(0.3, 32, 32)
    const leftEar = new THREE.Mesh(earGeometry, material)
    leftEar.position.set(-0.7, 0.7, 0.5)
    bear.add(leftEar)

    const rightEar = new THREE.Mesh(earGeometry, material)
    rightEar.position.set(0.7, 0.7, 0.5)
    bear.add(rightEar)

    // Add eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 32, 32)
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 })
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    leftEye.position.set(-0.3, 0.2, 0.9)
    bear.add(leftEye)

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    rightEye.position.set(0.3, 0.2, 0.9)
    bear.add(rightEye)

    // Add nose
    const noseGeometry = new THREE.SphereGeometry(0.1, 32, 32)
    const noseMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 })
    const nose = new THREE.Mesh(noseGeometry, noseMaterial)
    nose.position.set(0, -0.1, 1)
    bear.add(nose)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    camera.position.z = 5

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = false

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)
      bear.rotation.y += 0.01
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0" />
}

