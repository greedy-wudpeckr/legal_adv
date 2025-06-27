import { Navbar } from '@/components/ui/resizable-navbar';
import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ApnaWakeel.ai',
  description: 'Legal Aid for everyone',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      
      <body className="min-h-screen">
        <div className='mb-12'><Navbar/></div>
        {children}</body>
    </html>
  )
}