"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Twitter, DiscIcon as Discord } from "lucide-react"
import dynamic from "next/dynamic"
import BearFace3D from "@/components/BearFace3D"

const TeddioHero = dynamic(() => import("@/components/TeddioHero"), { ssr: false })

export default function Home() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <BearFace3D />
      {/*<CursorFollowingTeddie />
      <CustomCursor />*/}
      <header className="fixed w-full z-50 bg-black/50 backdrop-blur-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/">
            <img 
              src="/logo.png" 
              alt="Teddio Logo" 
              className="h-10 w-auto"
            />
          </Link>
          <div className="space-x-4">
            <Link href="/gallery" className="text-white hover:text-[#F27125] transition-colors">
              Gallery
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="h-screen relative flex items-center justify-center">
          {isClient && <TeddioHero />}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
          <div className="container mx-auto px-6 text-center relative z-20">
            <motion.h1
              className="text-6xl md:text-8xl font-extrabold mb-6 text-[#F27125]"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Teddio
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Exclusive Teddy Bear NFTs on Berachain
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button className="bg-[#F27125] text-white hover:bg-[#D85500] text-lg px-8 py-3 rounded-full">
                Coming Soon
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-black relative overflow-hidden">
          <div className="absolute inset-0 opacity-50">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F27125] to-[#D85500] transform -skew-y-6"></div>
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold mb-8 text-white">Join Our Community</h2>
              <p className="text-xl mb-8">
                Be part of the Teddio family. Connect with fellow collectors and get exclusive updates.
              </p>
              <div className="flex justify-center space-x-4">
                <Button asChild className="bg-black hover:bg-[#0c0c0c] text-white transition-colors p-3">
                  <Link href="https://x.com/teddiobears" target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500">&copy; 2025 Teddio NFT Collection. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

