import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import Head from 'next/head'
import CustomCursor from "@/components/CustomCursor"
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Teddio",
  description: "Exclusive Teddy Bear NFTs on Berachain",
  openGraph: {
    type: 'website',
    url: 'https://teddio.com',
    title: 'Teddio',
    description: 'Exclusive Teddy Bear NFTs on Berachain',
    siteName: 'Teddio',
    images: [
      {
        url: 'https://i.postimg.cc/zXdG6kG9/1500x500.jpg',
        width: 1200,
        height: 630,
        alt: 'Teddio Bear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teddio',
    description: 'Exclusive Teddy Bear NFTs on Berachain',
    images: ['https://i.postimg.cc/zXdG6kG9/1500x500.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://teddio.com" />
        <meta name="robots" content="index, follow" />
      </Head>
      <body className={`${inter.className} bg-black`}>
        <CustomCursor />
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}

import './globals.css'