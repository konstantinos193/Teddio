"use client"

import { motion } from "framer-motion"

export default function AnimatedTeddyHero() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.svg
        viewBox="0 0 400 400"
        className="w-[300px] md:w-[400px] h-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Glow */}
        <motion.circle
          cx="200"
          cy="200"
          r="150"
          fill="url(#orangeGlow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Bear Body */}
        <motion.path
          d="M160 280 L240 280 C270 280 290 260 290 220 L290 180 C290 120 270 100 200 100 C130 100 110 120 110 180 L110 220 C110 260 130 280 160 280Z"
          fill="#FF69B4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Flannel Shirt */}
        <motion.path
          d="M140 200 L260 200 L260 270 L140 270Z"
          fill="#FF0000"
          opacity={0.8}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 0.8 }}
          transition={{ delay: 0.3 }}
        />

        {/* Plaid Pattern */}
        <motion.g
          stroke="#800000"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <line x1="160" y1="200" x2="160" y2="270" />
          <line x1="180" y1="200" x2="180" y2="270" />
          <line x1="200" y1="200" x2="200" y2="270" />
          <line x1="220" y1="200" x2="220" y2="270" />
          <line x1="240" y1="200" x2="240" y2="270" />
          <line x1="140" y1="220" x2="260" y2="220" />
          <line x1="140" y1="240" x2="260" y2="240" />
        </motion.g>

        {/* Gray Undershirt */}
        <motion.path
          d="M170 210 L230 210 L230 260 L170 260Z"
          fill="#CCCCCC"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        />

        {/* Crown */}
        <motion.path
          d="M170 90 L230 90 L240 70 L210 85 L200 65 L190 85 L160 70 L170 90Z"
          fill="#FFD700"
          stroke="#000"
          strokeWidth="2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
        >
          <animate
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="-2 200 80"
            to="2 200 80"
            dur="1s"
            repeatCount="indefinite"
            additive="sum"
          />
        </motion.path>

        {/* Eyes */}
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }}>
          <circle cx="180" cy="150" r="8" fill="#000" />
          <circle cx="220" cy="150" r="8" fill="#000" />
        </motion.g>

        {/* Nose */}
        <motion.path
          d="M195 165 L205 165 L200 175 Z"
          fill="#000"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 }}
        />

        {/* Mouth */}
        <motion.path
          d="M190 185 Q200 190 210 185"
          stroke="#000"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        />

        {/* Gradient Definitions */}
        <defs>
          <radialGradient id="orangeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F27125" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F27125" stopOpacity="0" />
          </radialGradient>
        </defs>
      </motion.svg>

      {/* Floating Effect */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        svg {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

