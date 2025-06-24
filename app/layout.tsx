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
      <body>{children}</body>
    </html>
  )
}
