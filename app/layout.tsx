import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';

const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin', 'cyrillic'],
});

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
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
        className={`${jost.variable} ${cormorant.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
