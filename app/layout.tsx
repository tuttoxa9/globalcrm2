import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import "./globals.css"
import PWAInstallPrompt from "@/components/pwa-install-prompt"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
})

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "Global CRM - Система управления заявками",
  description: "Система управления заявками и клиентами",
  generator: 'v0.dev',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Global CRM',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Global CRM',
    title: 'Global CRM - Система управления заявками',
    description: 'Система управления заявками и клиентами',
  },
  twitter: {
    card: 'summary',
    title: 'Global CRM - Система управления заявками',
    description: 'Система управления заявками и клиентами',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <meta name="theme-color" content="#1F2937" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Global CRM" />
        <meta name="msapplication-TileColor" content="#1F2937" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />

        <link rel="icon" type="image/svg+xml" href="/icons/icon-192x192.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <link rel="mask-icon" href="/icons/icon-192x192.svg" color="#1F2937" />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} antialiased`}>
        {children}
        <PWAInstallPrompt />
      </body>
    </html>
  )
}
