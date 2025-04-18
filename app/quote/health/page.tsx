import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import QuoteForm from '@/components/QuoteForm'

export default function HealthInsuranceQuote() {
  const searchParams = useSearchParams()
  const utmSource = searchParams?.get('utm_source') || null

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gray-50">
        <QuoteForm utmSource={utmSource} />
      </div>
    </Suspense>
  )
} 