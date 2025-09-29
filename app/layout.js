import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Pleyazul Oráculos - Sabiduría Ancestral',
  description: 'Consulta los oráculos ancestrales: Tarot, I Ching y Rueda Medicinal. Encuentra guía espiritual y claridad en tu camino.',
  keywords: 'tarot, i ching, rueda medicinal, oráculos, lectura espiritual, adivinación',
  manifest: '/manifest.json',
  themeColor: '#8B4513',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8B4513" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${inter.className} antialiased bg-gradient-to-br from-amber-50 to-orange-100 min-h-screen`}>
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}