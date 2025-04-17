import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Auto Insurance Quotes | QuoteLinker',
  description: 'Get your personalized auto insurance quote in minutes. Compare rates from top providers and save on your car insurance.',
  openGraph: {
    title: 'Auto Insurance Quotes | QuoteLinker',
    description: 'Get your personalized auto insurance quote in minutes. Compare rates from top providers and save on your car insurance.',
    type: 'website',
    url: 'https://quotelinker.com/auto',
    images: [
      {
        url: '/og-auto.png',
        width: 1200,
        height: 630,
        alt: 'Auto Insurance Quotes | QuoteLinker',
      },
    ],
  },
}; 