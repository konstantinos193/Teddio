"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const nfts = [
  { id: 1, name: "Teddio #001", image: "/placeholder.svg?height=400&width=400&text=Teddio+#001" },
  { id: 2, name: "Teddio #002", image: "/placeholder.svg?height=400&width=400&text=Teddio+#002" },
  { id: 3, name: "Teddio #003", image: "/placeholder.svg?height=400&width=400&text=Teddio+#003" },
  { id: 4, name: "Teddio #004", image: "/placeholder.svg?height=400&width=400&text=Teddio+#004" },
]

export default function NFTCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % nfts.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + nfts.length) % nfts.length)
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: `${-currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {nfts.map((nft) => (
            <div key={nft.id} className="w-full flex-shrink-0">
              <img
                src={nft.image || "/placeholder.svg"}
                alt={nft.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              <h3 className="text-center mt-4 text-xl font-semibold text-[#F27125]">{nft.name}</h3>
            </div>
          ))}
        </motion.div>
      </div>
      <Button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
      >
        <ChevronLeft />
      </Button>
      <Button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
      >
        <ChevronRight />
      </Button>
    </div>
  )
}

