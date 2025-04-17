import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Life Insurance Quotes | QuoteLinker',
  description: 'Secure your family\'s future with comprehensive life insurance coverage. Compare quotes from top providers and find the best rates.',
  openGraph: {
    title: 'Life Insurance Quotes | QuoteLinker',
    description: 'Secure your family\'s future with comprehensive life insurance coverage. Compare quotes from top providers and find the best rates.',
    type: 'website',
    url: 'https://quotelinker.com/life',
    images: [
      {
        url: '/images/life-insurance.jpg',
        width: 1200,
        height: 630,
        alt: 'Life Insurance Coverage'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Life Insurance Quotes | QuoteLinker',
    description: 'Secure your family\'s future with comprehensive life insurance coverage. Compare quotes from top providers and find the best rates.',
    images: ['/images/life-insurance.jpg']
  }
}; 