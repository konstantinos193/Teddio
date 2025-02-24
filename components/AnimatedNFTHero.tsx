"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function AnimatedNFTHero() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Base NFT Image */}
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20(43)-CgVdYRtqgVQtps8JRWGU80uAhA2zXF.png"
          alt="Teddio NFT"
          layout="fill"
          objectFit="contain"
          className="animate-float"
        />

        {/* Animated Crown */}
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

        {/* Blinking Eyes */}
        <motion.div
          className="absolute top-[30%] left-[20%] w-[60%] h-[10%]"
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, repeatDelay: 2 }}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20(43)-CgVdYRtqgVQtps8JRWGU80uAhA2zXF.png"
            alt="Eyes"
            layout="fill"
            objectFit="contain"
            className="eyes-clip"
          />
        </motion.div>
      </motion.div>

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-[#F27125]/30 via-[#F27125]/10 to-transparent animate-pulse" />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .crown-clip {
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
        }
        .eyes-clip {
          clip-path: inset(40% 5% 40% 5%);
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

