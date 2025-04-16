import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Agent Dashboard | QuoteLinker',
  description: 'Manage your insurance leads, track performance, and grow your business with our comprehensive agent dashboard.',
};

export default function AgentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Here's an overview of your performance.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Leads</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">248</p>
            <p className="mt-1 text-sm text-green-600">↑ 12% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">32%</p>
            <p className="mt-1 text-sm text-green-600">↑ 5% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Active Policies</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">156</p>
            <p className="mt-1 text-sm text-green-600">↑ 8% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">$12,450</p>
            <p className="mt-1 text-sm text-green-600">↑ 15% from last month</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Leads */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((lead) => (
                    <div key={lead} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">John Doe</h3>
                        <p className="text-sm text-gray-500">Life Insurance Quote Request</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          New
                        </span>
                        <button className="text-[#00E0FF] hover:text-[#00E0FF]/80 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Subscription Status</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Current Plan</span>
                    <span className="text-sm font-medium text-gray-900">Professional</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Billing Cycle</span>
                    <span className="text-sm font-medium text-gray-900">Monthly</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Next Payment</span>
                    <span className="text-sm font-medium text-gray-900">May 1, 2024</span>
                  </div>
                  <div className="pt-4">
                    <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00E0FF] hover:bg-[#00E0FF]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E0FF]">
                      Manage Subscription
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <Link
                    href="/agent/leads"
                    className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E0FF]"
                  >
                    View All Leads
                  </Link>
                  <Link
                    href="/agent/policies"
                    className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E0FF]"
                  >
                    Manage Policies
                  </Link>
                  <Link
                    href="/agent/settings"
                    className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E0FF]"
                  >
                    Account Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 