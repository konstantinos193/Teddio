"use client"

import ScrollReveal from "./ScrollReveal"

export default function TeddioBrandVideo() {
  return (
    <ScrollReveal>
      <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8 py-16">
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#f27125]">Redefining the Teddy Bear Experience</h2>
          <p className="text-lg text-white">
            Teddio will be a brand like no other. The 1st truly exclusive Teddy Bear collection that is linked to both
            real life & Web3 in a hybrid model. Teddio is about to change the Teddy Bear game forever. Are you Ready for
            Teddy?
          </p>
        </div>
        <div className="w-full md:w-1/2 aspect-square relative">
          <img 
            src="https://i.postimg.cc/GhWZkz9p/Pop-Funko-Teddio.gif" 
            alt="Teddio Animated GIF" 
            className="w-full h-full object-cover rounded-lg" 
          />
        </div>
      </div>
    </ScrollReveal>
  )
}
