import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insurance Education Hub | QuoteLinker',
  description: 'Learn about different types of insurance, coverage options, and how to choose the right policy for your needs. Expert guides, videos, and resources.',
  openGraph: {
    title: 'Insurance Education Hub | QuoteLinker',
    description: 'Learn about different types of insurance, coverage options, and how to choose the right policy for your needs. Expert guides, videos, and resources.',
    type: 'website',
    url: 'https://quotelinker.com/education',
    images: [
      {
        url: '/og-education.png',
        width: 1200,
        height: 630,
        alt: 'Insurance Education Hub | QuoteLinker',
      },
    ],
  },
};

const articles = [
  {
    id: 1,
    title: 'Understanding Life Insurance: A Complete Guide',
    excerpt: 'Learn about different types of life insurance policies and how to choose the right coverage for your needs.',
    category: 'Life Insurance',
    image: '/images/education/life-insurance-guide.jpg',
    date: '2024-04-15',
    readTime: '8 min read',
  },
  {
    id: 2,
    title: 'Health Insurance Basics: What You Need to Know',
    excerpt: 'A comprehensive overview of health insurance plans, coverage options, and how to maximize your benefits.',
    category: 'Health Insurance',
    image: '/images/education/health-insurance-basics.jpg',
    date: '2024-04-14',
    readTime: '10 min read',
  },
  {
    id: 3,
    title: 'Disability Insurance: Protecting Your Income',
    excerpt: 'Understand how disability insurance works and why it\'s crucial for protecting your financial future.',
    category: 'Disability Insurance',
    image: '/images/education/disability-insurance-guide.jpg',
    date: '2024-04-13',
    readTime: '7 min read',
  },
  {
    id: 4,
    title: 'Medicare Supplement Plans Explained',
    excerpt: 'Everything you need to know about Medicare supplement plans and how they can enhance your coverage.',
    category: 'Supplemental Health',
    image: '/images/education/medicare-supplement-guide.jpg',
    date: '2024-04-12',
    readTime: '9 min read',
  },
  {
    id: 5,
    title: 'Auto Insurance: Coverage Types and Requirements',
    excerpt: 'A detailed guide to auto insurance coverage types, state requirements, and how to save on your premium.',
    category: 'Auto Insurance',
    image: '/images/education/auto-insurance-guide.jpg',
    date: '2024-04-11',
    readTime: '8 min read',
  },
  {
    id: 6,
    title: 'How to Compare Insurance Quotes',
    excerpt: 'Learn the best practices for comparing insurance quotes and finding the most suitable coverage.',
    category: 'Insurance Tips',
    image: '/images/education/compare-quotes-guide.jpg',
    date: '2024-04-10',
    readTime: '6 min read',
  },
];

const videos = [
  {
    id: 1,
    title: 'Life Insurance Explained in 5 Minutes',
    thumbnail: '/images/education/video-life-insurance.jpg',
    duration: '5:23',
    category: 'Life Insurance',
  },
  {
    id: 2,
    title: 'Understanding Health Insurance Plans',
    thumbnail: '/images/education/video-health-insurance.jpg',
    duration: '7:45',
    category: 'Health Insurance',
  },
  {
    id: 3,
    title: 'Disability Insurance: What You Need to Know',
    thumbnail: '/images/education/video-disability-insurance.jpg',
    duration: '6:12',
    category: 'Disability Insurance',
  },
  {
    id: 4,
    title: 'Medicare Supplement Plans: A Quick Guide',
    thumbnail: '/images/education/video-medicare-supplement.jpg',
    duration: '4:56',
    category: 'Supplemental Health',
  },
];

export default function EducationHub() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Insurance Education Hub</h1>
          <p className="text-xl text-gray-600">
            Expert guides, videos, and resources to help you make informed insurance decisions
          </p>
        </div>

        {/* Featured Articles */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article key={article.id} className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{article.category}</span>
                    <span className="mx-2">•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link href={`/education/articles/${article.id}`} className="hover:text-[#00E0FF]">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <Link
                    href={`/education/articles/${article.id}`}
                    className="text-[#00E0FF] hover:text-[#00E0FF]/80 font-medium"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Video Library */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Video Library</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-1">{video.category}</div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    <Link href={`/education/videos/${video.id}`} className="hover:text-[#00E0FF]">
                      {video.title}
                    </Link>
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {['Life Insurance', 'Health Insurance', 'Disability Insurance', 'Supplemental Health', 'Auto Insurance'].map((category) => (
              <Link
                key={category}
                href={`/education/category/${category.toLowerCase().replace(' ', '-')}`}
                className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-[#00E0FF] hover:shadow-md transition-all"
              >
                <span className="text-gray-900 font-medium">{category}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 