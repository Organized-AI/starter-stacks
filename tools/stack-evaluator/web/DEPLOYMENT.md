# 🚀 Deployment Guide - AI Tool Stack Evaluator

## Production Deployment to Vercel

### Prerequisites
- Node.js 18+ installed
- Vercel CLI installed: `npm i -g vercel`
- Access to organizedai.vip domain DNS settings

### Quick Deployment

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run tests and build**
   ```bash
   npm run test
   npm run build
   ```

3. **Deploy to Vercel**
   ```bash
   npm run deploy
   ```

### Custom Domain Setup

1. **Add domain in Vercel dashboard**
   - Go to Project Settings > Domains
   - Add `stack.organizedai.vip`

2. **Configure DNS (Cloudflare)**
   ```
   Type: CNAME
   Name: stack
   Target: cname.vercel-dns.com
   ```

### Environment Variables

Set these in Vercel dashboard:

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://stack.organizedai.vip
VERCEL_ANALYTICS_ID=<your-vercel-analytics-id>
```

### Monitoring & Health Checks

- **Health endpoint**: `https://stack.organizedai.vip/api/health`
- **Sitemap**: `https://stack.organizedai.vip/sitemap.xml`
- **Robots**: `https://stack.organizedai.vip/robots.txt`

### Performance Optimizations

- ✅ Static generation where possible
- ✅ Image optimization with WebP/AVIF
- ✅ Automatic code splitting
- ✅ CDN caching headers
- ✅ Compression enabled
- ✅ Security headers configured

### Post-Deployment Validation

1. **Test evaluation flow**
   ```bash
   curl https://stack.organizedai.vip/api/health
   ```

2. **Verify SSL certificate**
   ```bash
   curl -I https://stack.organizedai.vip
   ```

3. **Check Core Web Vitals**
   - Use PageSpeed Insights
   - Monitor in Vercel Analytics

### Rollback Procedure

If issues occur:
```bash
vercel rollback
```

### Monitoring Setup

- **Vercel Analytics**: Automatic performance monitoring
- **Health checks**: `/api/health` endpoint
- **Error tracking**: Console errors removed in production
- **Uptime monitoring**: Configure external service (Pingdom, UptimeRobot)

### Security Features

- ✅ Security headers (CSP, X-Frame-Options, etc.)
- ✅ HTTPS enforced
- ✅ No console logs in production
- ✅ Input validation with Zod
- ✅ Rate limiting ready (can be added)

---

**Deployment Status**: Ready for production ✅
**Expected Performance**: <100ms API response, 95+ Lighthouse score
**Uptime Target**: 99.9%