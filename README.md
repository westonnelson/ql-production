# QuoteLinker

QuoteLinker is a modern insurance quote platform that connects consumers with insurance agents. The platform allows users to request quotes for various insurance products, including auto, life, home, disability, and supplemental health insurance.

## Features

- **Multi-step Quote Forms**: User-friendly forms for different insurance types
- **Real-time Form Analytics**: Track form submissions, abandonments, and completions
- **Email Notifications**: Automatic emails to consumers and agents
- **Salesforce Integration**: Seamless lead-to-opportunity flow
- **UTM Tracking**: Track marketing campaign performance
- **Admin Dashboard**: Monitor form submissions and conversion rates
- **Health Monitoring**: Check the status of various services

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase Edge Functions
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend
- **CRM**: Salesforce
- **Analytics**: Custom implementation with Supabase

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Salesforce account (for CRM integration)
- Resend account (for email)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/quotelinker.git
   cd quotelinker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your credentials.

4. Run database migrations:
   ```bash
   ./scripts/run-migrations.sh
   ```

5. Deploy Supabase Edge Functions:
   ```bash
   ./scripts/deploy-edge-functions.sh
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
quotelinker/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── quote/            # Quote form pages
│   └── admin/            # Admin dashboard
├── components/           # React components
├── lib/                  # Utility functions
├── public/               # Static assets
├── supabase/             # Supabase configuration
│   ├── functions/        # Edge Functions
│   └── migrations/       # Database migrations
├── scripts/              # Deployment scripts
└── docs/                 # Documentation
```

## Deployment

### Vercel Deployment

1. Push your changes to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel
4. Deploy

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

## Documentation

- [Salesforce Integration](docs/salesforce-integration.md)
- [Form Analytics](docs/form-analytics.md)
- [Email Templates](docs/email-templates.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Salesforce](https://www.salesforce.com/)
- [Resend](https://resend.com/) 