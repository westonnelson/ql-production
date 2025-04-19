import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import Header from './components/Header'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QuoteLinker - Insurance Quote Platform',
  description: 'Get personalized insurance quotes tailored to your needs. Compare coverage options and find the right plan for you.',
  keywords: 'insurance, quotes, coverage, auto insurance, home insurance, life insurance, health insurance',
  authors: [{ name: 'QuoteLinker' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#00E0FF',
  icons: {
    icon: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  }
}

export const dynamic = 'force-dynamic'
export const preferredRegion = 'auto'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="icon" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              ${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ? `gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}');` : ''}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-full bg-background text-foreground antialiased`}>
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
          `}
        </Script>
        <Toaster position="top-right" />
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <a href="/" className="flex items-center space-x-2">
                  <Image src="/logo.svg" alt="QuoteLinker Logo" width={32} height={32} className="h-8 w-8" />
                  <span className="text-xl font-bold text-primary">QuoteLinker</span>
                </a>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t bg-background">
            <div className="container py-8 md:py-12">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <Image src="/logo.svg" alt="QuoteLinker Logo" width={24} height={24} className="h-6 w-6" />
                    <h3 className="text-lg font-semibold">QuoteLinker</h3>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    We help you find the right insurance coverage for your needs. Our platform makes it easy to compare quotes and make informed decisions.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Contact</h3>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li>Email: support@quotelinker.com</li>
                    <li>Phone: (555) 123-4567</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Legal</h3>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li><a href="/privacy" className="hover:text-primary">Privacy Policy</a></li>
                    <li><a href="/terms" className="hover:text-primary">Terms of Service</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} QuoteLinker. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      </body>
    </html>
  )
} 