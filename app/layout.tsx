import type { Metadata } from 'next';
import { Geist, Geist_Mono, Mooli, Playfair_Display } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const mooli = Mooli({
  variable: '--font-mooli',
  weight: '400',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'NUANCE — Permanent · Lashes · Brows',
  description: 'Перманентный макияж, наращивание ресниц, оформление бровей, обучение и магазин Aromatic 89.',
  metadataBase: new URL(process.env.SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'NUANCE — Permanent · Lashes · Brows',
    description: 'Естественная красота и мастерство в деталях.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NUANCE — Permanent · Lashes · Brows',
    description: 'Естественная красота и мастерство в деталях.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${mooli.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
