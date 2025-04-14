# Deployment Checklist

## Environment Variables
Make sure the following environment variables are set in your Vercel project:

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- [ ] `NEXT_PUBLIC_GTM_ID`
- [ ] `RESEND_API_KEY`
- [ ] `SALESFORCE_WEBHOOK_URL`

## Pre-deployment Checklist

### Analytics
- [ ] Google Analytics 4 property is set up
- [ ] Google Tag Manager container is configured
- [ ] Conversion tracking is set up in GA4

### Email
- [ ] Resend API is configured
- [ ] Email templates are tested
- [ ] Sender domains are verified

### Database
- [ ] Supabase project is created
- [ ] Database schema is deployed
- [ ] RLS policies are configured
- [ ] Database backups are enabled

### Assets
- [ ] Favicon is uploaded
- [ ] Brand icon is in place
- [ ] All images are optimized

### Testing
- [ ] Form validation works
- [ ] Email sending works
- [ ] Analytics events fire correctly
- [ ] Mobile responsiveness is verified
- [ ] Cross-browser testing completed

## Deployment Steps

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel
4. Deploy the project
5. Verify the deployment
   - Check form submission
   - Verify emails are sent
   - Confirm analytics are tracking
   - Test on multiple devices

## Post-deployment

1. Set up monitoring
2. Configure alerts
3. Test the live environment
4. Document any issues or bugs
5. Plan for regular maintenance 