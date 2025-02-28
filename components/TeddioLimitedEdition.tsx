"use client"

import ScrollReveal from "./ScrollReveal"

export default function TeddioLimitedEdition() {
  return (
    <ScrollReveal>
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-16">
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#f27125]">Limited Edition Drops</h2>
          <p className="text-lg text-white">
            Teddio is building Teddy Bears. We will be creating limited edition Teddy Bear drops that will be released
            in short batches exclusively to our NFT holders 1st and then to our followers.
          </p>
        </div>
        <div className="w-full md:w-1/2 aspect-square relative">
          <video 
            className="w-full h-full object-cover rounded-lg" 
            loop 
            muted 
            playsInline 
            autoPlay>
            <source src="https://ipfs.io/ipfs/bafybeicv72pkkens53grjjomkbfesh3iutt6whwjnhj6uwropczlz376qu" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </ScrollReveal>
  )
}
