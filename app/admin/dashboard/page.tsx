'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HealthStatus {
  status: string;
  timestamp: string;
  services: {
    database: {
      status: string;
      message: string;
    };
    salesforce: {
      status: string;
      message: string;
    };
    email: {
      status: string;
      message: string;
    };
  };
}

interface Metrics {
  formSubmissions: number;
  conversionRate: number;
  averageTimeOnSite: number;
  bounceRate: number;
}

export default function AdminDashboard() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [healthResponse, metricsResponse] = await Promise.all([
          fetch('/api/health'),
          fetch('/api/metrics')
        ]);

        if (!healthResponse.ok || !metricsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const healthData = await healthResponse.json();
        const metricsData = await metricsResponse.json();

        setHealth(healthData);
        setMetrics(metricsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Database</h2>
          <div className={`text-lg ${health?.services.database.status === 'healthy' ? 'text-green-500' : 'text-red-500'}`}>
            {health?.services.database.status}
          </div>
          <p className="text-sm text-gray-500 mt-2">{health?.services.database.message}</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Salesforce</h2>
          <div className={`text-lg ${health?.services.salesforce.status === 'healthy' ? 'text-green-500' : 'text-red-500'}`}>
            {health?.services.salesforce.status}
          </div>
          <p className="text-sm text-gray-500 mt-2">{health?.services.salesforce.message}</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Email Service</h2>
          <div className={`text-lg ${health?.services.email.status === 'healthy' ? 'text-green-500' : 'text-red-500'}`}>
            {health?.services.email.status}
          </div>
          <p className="text-sm text-gray-500 mt-2">{health?.services.email.message}</p>
        </Card>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Form Submissions</h2>
          <div className="text-3xl font-bold">{metrics?.formSubmissions}</div>
          <div className="text-sm text-gray-500 mt-2">Last 30 days</div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Conversion Rate</h2>
          <div className="text-3xl font-bold">{metrics?.conversionRate}%</div>
          <div className="text-sm text-gray-500 mt-2">Last 30 days</div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Average Time on Site</h2>
          <div className="text-3xl font-bold">{metrics?.averageTimeOnSite}s</div>
          <div className="text-sm text-gray-500 mt-2">Last 30 days</div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Bounce Rate</h2>
          <div className="text-3xl font-bold">{metrics?.bounceRate}%</div>
          <div className="text-sm text-gray-500 mt-2">Last 30 days</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="mt-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Form Submissions Over Time</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { date: '2024-03-18', submissions: 10 },
                { date: '2024-03-19', submissions: 15 },
                { date: '2024-03-20', submissions: 12 },
                { date: '2024-03-21', submissions: 18 },
                { date: '2024-03-22', submissions: 20 },
                { date: '2024-03-23', submissions: 25 },
                { date: '2024-03-24', submissions: 22 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="submissions" stroke="#00B4D8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
} 