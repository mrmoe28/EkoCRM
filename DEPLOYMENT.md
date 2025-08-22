# EkoSolar CRM - Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Database**: Set up a Turso database or Vercel Postgres
3. **GitHub Repository**: Code must be pushed to GitHub

## Quick Deploy to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mrmoe28/EkoCRM)

### Option 2: Manual Deployment

1. **Connect Repository**
   ```bash
   # Push to GitHub if not already done
   git push origin main
   ```

2. **Create Vercel Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Select "Next.js" framework (auto-detected)

3. **Configure Environment Variables**
   
   In Vercel dashboard, add these environment variables:
   
   **Required:**
   ```
   DATABASE_URL=libsql://your-database-url.turso.io
   DATABASE_AUTH_TOKEN=your-database-auth-token
   NEXT_PUBLIC_APP_URL=https://your-app-domain.vercel.app
   NODE_ENV=production
   ```
   
   **Optional:**
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
   NEXTAUTH_SECRET=your-32-character-secret
   NEXTAUTH_URL=https://your-app-domain.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)

## Database Setup

### Option 1: Turso (Recommended)

1. **Create Turso Database**
   ```bash
   # Install Turso CLI
   curl -sSfL https://get.tur.so/install.sh | bash
   
   # Create database
   turso db create ekosolarpros-crm
   
   # Get database URL
   turso db show ekosolarpros-crm --url
   
   # Create auth token
   turso db tokens create ekosolarpros-crm
   ```

2. **Run Migrations**
   ```bash
   # Set environment variables locally
   export DATABASE_URL="libsql://your-database-url.turso.io"
   export DATABASE_AUTH_TOKEN="your-token"
   
   # Run migrations
   npm run db:push
   ```

### Option 2: Vercel Postgres

1. **Add Vercel Postgres**
   - Go to your Vercel project dashboard
   - Click "Storage" tab
   - Add "Postgres" database
   - Copy the connection string

2. **Update Environment Variables**
   ```
   DATABASE_URL=your-vercel-postgres-url
   # No auth token needed for Vercel Postgres
   ```

## Domain Configuration

1. **Custom Domain (Optional)**
   - In Vercel dashboard, go to "Settings" > "Domains"
   - Add your custom domain
   - Update DNS records as instructed

2. **SSL Certificate**
   - Automatically provisioned by Vercel
   - No additional configuration needed

## Performance Optimizations

The app includes several production optimizations:

- **Bundle Optimization**: Automatic code splitting and tree shaking
- **Image Optimization**: WebP/AVIF format conversion
- **Console Removal**: Console logs removed in production
- **Security Headers**: XSS protection, content type sniffing prevention
- **Database Connection Pooling**: Optimized for serverless environments

## Monitoring & Health Checks

### Health Check Endpoint
- **URL**: `https://your-domain.vercel.app/api/health`
- **Purpose**: Monitor application and database health
- **Response**: JSON with status, uptime, and database connectivity

### Vercel Analytics
Add to environment variables:
```
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## Environment-Specific Configurations

### Development
```bash
npm run dev
```

### Production Preview
```bash
npm run preview
```

### Production Build
```bash
npm run build:production
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check TypeScript errors
   npm run type-check
   
   # Check linting
   npm run lint
   
   # Clean and rebuild
   npm run clean && npm install && npm run build
   ```

2. **Database Connection Issues**
   - Verify `DATABASE_URL` and `DATABASE_AUTH_TOKEN`
   - Check health endpoint: `/api/health`
   - Ensure database migrations are applied

3. **Environment Variables**
   - Double-check all required variables are set
   - Ensure no spaces in variable values
   - Redeploy after adding new variables

### Performance Issues

1. **Slow Page Loads**
   - Check Vercel Analytics
   - Optimize images and assets
   - Review bundle size with `npm run build:analyze`

2. **Database Queries**
   - Monitor database performance
   - Add proper indexes
   - Consider query optimization

## Scaling Considerations

- **Serverless Functions**: 30-second timeout configured
- **Database**: Turso scales automatically, Vercel Postgres has connection limits
- **CDN**: Global edge caching via Vercel
- **Regional Deployment**: Currently set to `iad1` (US East)

## Security

- **Environment Variables**: Never commit secrets to repository
- **HTTPS**: Enforced by default
- **Security Headers**: Configured in `next.config.js`
- **CORS**: Configured for API routes

## Support

For deployment issues:
1. Check Vercel function logs
2. Test health endpoint
3. Review this documentation
4. Check Next.js and Vercel documentation

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run build:production` | Full production build with checks |
| `npm run preview` | Local production preview |
| `npm run db:push` | Apply database schema |
| `npm run type-check` | TypeScript validation |
| `npm run lint` | Code linting |

**Health Check**: `GET /api/health`
**Framework**: Next.js 15
**Database**: Turso (LibSQL) or Vercel Postgres
**Styling**: Tailwind CSS with custom theme system