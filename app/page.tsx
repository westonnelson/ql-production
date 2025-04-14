'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to life insurance quote form
    router.push('/quote/life')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Redirecting...</h1>
        <p className="mt-2 text-gray-600">Please wait while we redirect you to the quote form.</p>
      </div>
    </div>
  )
} 