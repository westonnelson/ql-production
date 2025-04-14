# QuoteLinker

A modern life insurance quote platform built with Next.js and Supabase.

## Features

- Multi-step quote form with validation
- Real-time form validation
- Mobile-responsive design
- Lead tracking and management
- Email notifications
- UTM parameter tracking

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- React Hook Form
- Zod

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/quotelinker.git
cd quotelinker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
NEXT_PUBLIC_GTM_ID=your_gtm_id
NEXT_PUBLIC_CALENDLY_URL=your_calendly_url
RESEND_API_KEY=your_resend_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

1. Create a new Supabase project
2. Run the schema migration in `supabase/schema.sql`
3. Update your environment variables with the Supabase credentials

## Deployment

The project is set up for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add the environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 