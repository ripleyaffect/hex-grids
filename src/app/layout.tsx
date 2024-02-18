import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ThemeProvider } from '~/components/theme/theme-provider';

import './globals.css'
import { NavBar } from '~/components/layout/nav-bar';
import { cn } from '~/lib/utils';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ripley - Hex Grids',
  description: 'Hexagon Grid Image Generator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'min-h-screen')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen">
            <NavBar />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
