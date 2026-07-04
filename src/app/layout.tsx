import type { Metadata } from 'next'
import { Playfair_Display, Archivo } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'FitCheck',
    template: '%s | FitCheck',
  },
  description:
    'Upload your outfit and get an instant AI-powered fashion rating with color harmony analysis, occasion match scores, and swap recommendations.',
  keywords: ['fashion', 'outfit rating', 'AI fashion', 'style check', 'outfit analysis'],
  openGraph: {
    type: 'website',
    siteName: 'FitCheck',
    title: 'FitCheck — AI Outfit Rating',
    description: 'Get instant AI fashion ratings for your outfits.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" style={{ height: '100%' }} className={`${playfair.variable} ${archivo.variable}`}>
      <body
        style={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  )
}