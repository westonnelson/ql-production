# QuoteLinker - Insurance Quote Capture App

A production-ready, scalable insurance quote capture application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- Streamlined 3-step life insurance quote form
- Modern, user-friendly UI with brand consistency
- Form validation with Zod
- Supabase integration for data storage
- Google Analytics 4 and Google Tag Manager integration
- Responsive design with Tailwind CSS
- TypeScript for type safety
- SEO optimized
- UTM tracking support
- Privacy Policy and Terms of Service pages
- Email notifications via Resend

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account
- Google Analytics 4 account
- Google Tag Manager account
- Resend account for email notifications

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/quotelinker.git
   cd quotelinker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXX
   NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
   RESEND_API_KEY=your-resend-key
   SALESFORCE_WEBHOOK_URL=your-salesforce-url
   ```

4. Set up the Supabase database:
   - Create a new Supabase project
   - Run the SQL schema provided in the project documentation
   - Enable Row Level Security (RLS) policies

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
quotelinker/
├── app/
│   ├── components/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   │   ├── quote/
│   │   │   └── life/
│   │   │       └── page.tsx
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   ├── terms/
│   │   │   └── page.tsx
│   │   ├── thank-you/
│   │   │   └── life/
│   │   │       └── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── lib/
│   │   ├── supabaseClient.ts
│   │   └── email.ts
│   ├── types/
│   │   └── quote.ts
│   └── public/
└── ...
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions and checklist.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@quotelinker.com or join our Slack channel. 