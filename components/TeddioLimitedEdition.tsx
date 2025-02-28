import Image from "next/image"
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
          <Image
            src="https://i.postimg.cc/GhWZkz9p/Pop-Funko-Teddio.gif"
            alt="Teddio Limited Edition"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      </div>
    </ScrollReveal>
  )
}

