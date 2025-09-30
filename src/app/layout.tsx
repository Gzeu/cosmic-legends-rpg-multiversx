import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cosmic Legends RPG - MultiversX',
  description: 'AI-powered MultiversX RPG with dynamic NFTs and cross-chain interoperability',
  keywords: ['multiversx', 'blockchain', 'gaming', 'rpg', 'ai', 'nft', 'cross-chain'],
  authors: [{ name: 'Pricop George', url: 'https://github.com/Gzeu' }],
  openGraph: {
    title: 'Cosmic Legends RPG - MultiversX',
    description: 'AI-powered MultiversX RPG with dynamic NFTs and cross-chain interoperability',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cosmic Legends RPG - MultiversX',
    description: 'AI-powered MultiversX RPG with dynamic NFTs and cross-chain interoperability',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
