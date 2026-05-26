import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aura.systems';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// ── Per-locale metadata ─────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTR = locale === 'tr';

  const title = isTR
    ? 'AURA Analitik — Sertifikalı Yapısal Analiz · Ege Bölgesi'
    : 'AURA Analytics — Certified Structural Analysis · Aegean Region';

  const description = isTR
    ? 'Ege bölgesindeki her mülk için bağımsız, laboratuvar onaylı yapısal analiz. ISO 9001 · Eurocode 8 sertifikalı. Sismik tehlike simülasyonu · AES-256 şifreli raporlar 14 günde teslim.'
    : 'Independent, lab-verified structural analysis for every property in the Aegean region. ISO 9001 · Eurocode 8 certified. Seismic hazard simulation · AES-256 encrypted reports in 14 days.';

  const keywords = isTR
    ? [
        'yapısal analiz Türkiye',
        'bina deprem analizi',
        'yapı inceleme Ege',
        'Eurocode 8 sismik analiz',
        'TBDY 2018 sertifikalı rapor',
        'Bodrum yapısal mühendis',
        'Fethiye bina raporu',
        'Kalkan mülk analizi',
        'ISO 9001 mühendislik',
        'bina güvenlik belgesi',
        'deprem risk değerlendirmesi',
      ]
    : [
        'structural analysis Turkey',
        'building inspection Aegean',
        'Eurocode 8 seismic analysis',
        'Bodrum structural engineer',
        'Fethiye building report',
        'Kalkan property analysis',
        'ISO 9001 engineering Turkey',
        'TBDY 2018 certified report',
        'building safety certificate Turkey',
        'earthquake risk assessment',
        'seismic hazard Turkey',
      ];

  const ogLocale   = isTR ? 'tr_TR' : 'en_US';
  const altLocale  = isTR ? 'en_US' : 'tr_TR';
  const altLang    = isTR ? 'en' : 'tr';

  return {
    title: {
      default:  title,
      template: `%s | AURA Analytics`,
    },
    description,
    keywords,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        en:          `${SITE_URL}/en`,
        tr:          `${SITE_URL}/tr`,
        'x-default': `${SITE_URL}/en`,
      },
    },
    openGraph: {
      type:            'website',
      locale:          ogLocale,
      alternateLocale: altLocale,
      url:             `${SITE_URL}/${locale}`,
      siteName:        'AURA Analytics',
      title,
      description,
      images: [
        {
          url:    '/opengraph-image',
          width:  1200,
          height: 630,
          alt:    'AURA Analytics — Know Your Building. Certified.',
        },
      ],
    },
    twitter: {
      card:        'summary_large_image',
      site:        '@aura_analytics',
      creator:     '@aura_analytics',
      title,
      description,
      images:      ['/opengraph-image'],
    },
    other: {
      'og:locale:alternate': altLocale,
      'content-language':    altLang,
    },
  };
}

// ── JSON-LD structured data ─────────────────────────────────────────────────
function JsonLd({ locale }: { locale: string }) {
  const isTR = locale === 'tr';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type':  'Organization',
        '@id':    `${SITE_URL}/#organization`,
        name:     'Aura Engineering',
        url:      SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url:     `${SITE_URL}/icon`,
          width:   32,
          height:  32,
        },
        image:       `${SITE_URL}/opengraph-image`,
        description: isTR
          ? 'Ege bölgesinde ISO 9001 ve Eurocode 8 sertifikalı bağımsız yapısal mühendislik firması.'
          : 'Independent structural engineering firm certified to ISO 9001 and Eurocode 8 standards, serving the Aegean region.',
        address: {
          '@type':           'PostalAddress',
          streetAddress:     'Kalkan',
          addressLocality:   'Antalya',
          addressCountry:    'TR',
        },
        contactPoint: {
          '@type':            'ContactPoint',
          email:              'info@aura.systems',
          telephone:          '+90 555 AURA 01',
          contactType:        'customer service',
          availableLanguage:  ['English', 'Turkish'],
          hoursAvailable: {
            '@type':    'OpeningHoursSpecification',
            dayOfWeek:  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens:      '09:00',
            closes:     '18:00',
          },
        },
        sameAs: [
          SITE_URL,
        ],
      },
      {
        '@type':   'WebSite',
        '@id':     `${SITE_URL}/#website`,
        url:       SITE_URL,
        name:      'AURA Analytics',
        description: isTR
          ? 'Sertifikalı Yapısal Analiz Platformu'
          : 'Certified Structural Analysis Platform',
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: ['en-US', 'tr-TR'],
        potentialAction: {
          '@type':  'SearchAction',
          target: {
            '@type':      'EntryPoint',
            urlTemplate: `${SITE_URL}/en?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type':       'ProfessionalService',
        '@id':         `${SITE_URL}/#service`,
        name:          'Aura Engineering',
        url:           SITE_URL,
        image:         `${SITE_URL}/opengraph-image`,
        priceRange:    '€€€',
        serviceType:   'Structural Engineering Analysis',
        areaServed: [
          { '@type': 'City', name: 'Bodrum' },
          { '@type': 'City', name: 'Fethiye' },
          { '@type': 'City', name: 'Kalkan' },
          { '@type': 'City', name: 'Datça' },
          { '@type': 'GeoRegion', name: 'Aegean Region, Turkey' },
        ],
        knowsAbout: [
          'Structural Engineering',
          'Seismic Analysis',
          'Eurocode 8',
          'ISO 9001',
          'Building Inspection',
          'Concrete Testing',
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name:    'Structural Analysis Services',
          itemListElement: [
            {
              '@type':      'Offer',
              name:         isTR ? 'Tam Yapısal Denetim' : 'Full Structural Audit',
              description:  isTR
                ? 'GPR yeraltı taraması, karot çıkarımı, Eurocode 8 sismik simülasyon ve sertifikalı rapor'
                : 'GPR subsurface scan, core extraction, Eurocode 8 seismic simulation and certified report',
              price:        '12500',
              priceCurrency:'EUR',
            },
          ],
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ── Layout ──────────────────────────────────────────────────────────────────
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'tr')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <JsonLd locale={locale} />
      {children}
    </NextIntlClientProvider>
  );
}
