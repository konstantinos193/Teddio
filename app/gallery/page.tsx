"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import BearFace3D from "@/components/BearFace3D"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <header className="fixed w-full z-50 bg-black/50 backdrop-blur-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/">
            <img 
              src="/logo.png" 
              alt="Teddio Logo" 
              className="h-10 w-auto"
            />
          </Link>
        </nav>
      </header>

      <main className="h-screen flex items-center justify-center">
        <motion.h1
          className="text-6xl md:text-8xl font-extrabold text-[#F27125] z-20"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Coming Soon
        </motion.h1>
      </main>
      
      <BearFace3D />
    </div>
  )
}