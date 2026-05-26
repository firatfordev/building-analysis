import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aura.systems';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'AURA Analytics — Certified Structural Analysis · Aegean Region',
    template: '%s | AURA Analytics',
  },
  description:
    'Independent, lab-verified structural analysis for every property in the Aegean region. ISO 9001 · Eurocode 8 certified. Seismic hazard simulation · AES-256 encrypted reports delivered in 14 days.',
  keywords: [
    'structural analysis Turkey',
    'building inspection Aegean',
    'Eurocode 8 seismic analysis',
    'yapı analizi Türkiye',
    'bina deprem analizi',
    'Bodrum structural engineer',
    'Fethiye building report',
    'Kalkan property analysis',
    'ISO 9001 engineering Turkey',
    'TBDY 2018 certified report',
    'building safety certificate Turkey',
    'earthquake risk assessment',
  ],
  authors: [{ name: 'Aura Engineering', url: SITE_URL }],
  creator: 'Aura Engineering',
  publisher: 'Aura Engineering',
  category: 'Structural Engineering',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/icon', type: 'image/png', sizes: '32x32' }],
    apple: [{ url: '/apple-icon', type: 'image/png', sizes: '180x180' }],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    siteName: 'AURA Analytics',
    title: 'AURA Analytics — Certified Structural Analysis · Aegean Region',
    description:
      'Independent, lab-verified structural analysis for every property in the Aegean region. ISO 9001 · Eurocode 8 certified.',
    url: SITE_URL,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'AURA Analytics — Know Your Building. Certified.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@aura_analytics',
    creator: '@aura_analytics',
    title: 'AURA Analytics — Certified Structural Analysis',
    description:
      'Independent, lab-verified structural analysis. Eurocode 8 · ISO 9001. Reports in 14 days.',
    images: ['/opengraph-image'],
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      data-scroll-behavior="smooth"
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
