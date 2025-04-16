import { useEffect, useState } from 'react'
import { getFormPerformanceMetrics } from '@/lib/form-analytics'

type Metrics = Awaited<ReturnType<typeof getFormPerformanceMetrics>>

export default function FormAnalytics({ insuranceType }: { insuranceType: string }) {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMetrics() {
      setLoading(true)
      try {
        const data = await getFormPerformanceMetrics(insuranceType, timeframe)
        setMetrics(data)
      } catch (error) {
        console.error('Error loading form metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMetrics()
  }, [insuranceType, timeframe])

  if (loading) {
    return <div>Loading metrics...</div>
  }

  if (!metrics) {
    return <div>No metrics available</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Form Performance Metrics</h2>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as 'day' | 'week' | 'month')}
          className="rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="day">Last 24 Hours</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Completion Rate"
          value={`${(metrics.completionRate * 100).toFixed(1)}%`}
          description="Percentage of users who complete the form"
        />
        <MetricCard
          title="Average Time"
          value={`${Math.round(metrics.averageTimeToComplete / 60)} min`}
          description="Average time to complete the form"
        />
        <MetricCard
          title="Abandonment Rate"
          value={`${(metrics.abandonmentRate * 100).toFixed(1)}%`}
          description="Percentage of users who abandon the form"
        />
        <MetricCard
          title="Top Abandonment Step"
          value={`Step ${metrics.topAbandonmentStep}`}
          description="Most common step where users abandon"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Field Error Rates</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Object.entries(metrics.fieldErrorRates).map(([field, rate]) => (
            <div
              key={field}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="text-sm text-gray-500">{field}</div>
              <div className="text-2xl font-bold">
                {(rate * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">A/B Test Results</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Object.entries(metrics.variantPerformance).map(([variant, data]) => (
            <div
              key={variant}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="text-lg font-semibold">{variant}</div>
              <div className="mt-2 space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Completion Rate: </span>
                  <span className="font-medium">
                    {(data.completionRate * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Average Time: </span>
                  <span className="font-medium">
                    {Math.round(data.averageTimeToComplete / 60)} min
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{description}</div>
    </div>
  )
} 