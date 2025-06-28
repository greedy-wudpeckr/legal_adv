import { Navbar } from '@/components/ui/resizable-navbar';
import './globals.css';
import type { Metadata } from 'next';
import { Layout } from '@/components/layout/Layout';

export const metadata: Metadata = {
  title: 'EduVerse - Interactive Learning Platform',
  description: 'Learn through immersive storytelling with AI-powered avatars',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">

      <body className="min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  )
}