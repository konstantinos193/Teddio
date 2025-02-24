"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function CursorFollowingTeddie() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", updateMousePosition)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
    }
  }, [])

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      animate={{ x: mousePosition.x - 25, y: mousePosition.y - 25 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    >
      <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="#F27125" />
        <circle cx="35" cy="40" r="5" fill="black" />
        <circle cx="65" cy="40" r="5" fill="black" />
        <path d="M40 60 Q50 70 60 60" stroke="black" strokeWidth="3" fill="none" />
      </svg>
    </motion.div>
  )
}

