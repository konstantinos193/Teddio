"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, useAnimation } from "framer-motion"

export default function InteractiveNFTHero() {
  const [isWaving, setIsWaving] = useState(false)
  const [isJumping, setIsJumping] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    const sequence = async () => {
      await controls.start({ scale: [0.8, 1.1, 1], transition: { duration: 0.5 } })
      await controls.start({ y: [0, -20, 0], transition: { repeat: 3, duration: 0.3 } })
    }
    sequence()
  }, [controls])

  const handleWave = () => {
    setIsWaving(true)
    setTimeout(() => setIsWaving(false), 1000)
  }

  const handleJump = () => {
    setIsJumping(true)
    setTimeout(() => setIsJumping(false), 500)
  }

  const handleSpeak = () => {
    setIsSpeaking(true)
    setTimeout(() => setIsSpeaking(false), 2000)
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] cursor-pointer"
        animate={controls}
        drag
        dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Base NFT Image */}
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20(43)-CgVdYRtqgVQtps8JRWGU80uAhA2zXF.png"
          alt="Teddio NFT"
          layout="fill"
          objectFit="contain"
          className={isJumping ? "animate-jump" : ""}
          onClick={handleJump}
        />

        {/* Waving Arm */}
        <motion.div
          className="absolute top-[40%] right-[10%] w-[30%] h-[30%]"
          animate={isWaving ? { rotate: [0, 20, 0, 20, 0] } : {}}
          transition={{ duration: 1 }}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20(43)-CgVdYRtqgVQtps8JRWGU80uAhA2zXF.png"
            alt="Waving Arm"
            layout="fill"
            objectFit="contain"
            className="arm-clip"
            onClick={handleWave}
          />
        </motion.div>

        {/* Crown */}
        <motion.div
          className="absolute top-[5%] left-[25%] w-[50%] h-[20%]"
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20(43)-CgVdYRtqgVQtps8JRWGU80uAhA2zXF.png"
            alt="Crown"
            layout="fill"
            objectFit="contain"
            className="crown-clip"
          />
        </motion.div>

        {/* Eyes */}
        <motion.div
          className="absolute top-[30%] left-[20%] w-[60%] h-[10%]"
          animate={isSpeaking ? { scaleY: [1, 0.5, 1] } : {}}
          transition={{ repeat: isSpeaking ? Number.POSITIVE_INFINITY : 0, duration: 0.3 }}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20(43)-CgVdYRtqgVQtps8JRWGU80uAhA2zXF.png"
            alt="Eyes"
            layout="fill"
            objectFit="contain"
            className="eyes-clip"
            onClick={handleSpeak}
          />
        </motion.div>

        {/* Speech Bubble */}
        {isSpeaking && (
          <motion.div
            className="absolute top-[-20%] right-[-20%] bg-white text-black p-2 rounded-lg"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            Hello, I'm Teddio!
          </motion.div>
        )}
      </motion.div>

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-[#F27125]/30 via-[#F27125]/10 to-transparent animate-pulse" />

      <style jsx>{`
        .arm-clip {
          clip-path: polygon(70% 50%, 100% 0%, 100% 100%);
        }
        .crown-clip {
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
        }
        .eyes-clip {
          clip-path: inset(40% 5% 40% 5%);
        }
        @keyframes jump {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-jump {
          animation: jump 0.5s ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.1; }
        }
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

