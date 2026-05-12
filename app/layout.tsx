import type { Metadata } from 'next'
import { Space_Grotesk, Syne_Mono, Inter } from 'next/font/google'
import './globals.css'
import Cursor from '@/components/cursor'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const syneMono = Syne_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-syne-mono',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://anar-erdene.vercel.app'),
  title: 'Anar-Erdene Gantulga — Designer & Developer',
  description:
    'UX/UI designer and frontend developer based in Ulaanbaatar. I design and build digital products where clarity matters more than decoration.',
  openGraph: {
    title: 'Anar-Erdene Gantulga — Designer & Developer',
    description: 'UX/UI designer and frontend developer. Clarity over decoration.',
    url: 'https://anar-erdene.vercel.app',
    siteName: 'Anar-Erdene Gantulga',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${syneMono.variable} ${inter.variable}`}
    >
      <body>
        <Cursor />
        <a href="#main" className="skip-to-main">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
