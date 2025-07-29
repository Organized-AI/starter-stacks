# Deployment Guide

Deployment instructions for each tech stack option.

## Option 1: Next.js + Vercel AI SDK

### Vercel Deployment
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Environment Variables
```bash
vercel env add OPENAI_API_KEY
vercel env add ANTHROPIC_API_KEY
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
```

## Option 2: FastAPI + Streamlit

### Docker Deployment
```yaml
# docker-compose.yml
version: '3.8'
services:
  streamlit:
    build: .
    ports:
      - "8501:8501"
  api:
    build: ./api
    ports:
      - "8000:8000"
  postgres:
    image: pgvector/pgvector:pg15
    environment:
      POSTGRES_DB: ai_tool
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
```

### Cloud Deployment
- **Railway**: Connect GitHub repo, auto-deploy
- **Google Cloud Run**: Container-based deployment
- **AWS ECS**: Managed container orchestration

## Option 3: Astro + Cloudflare

### Cloudflare Pages
```bash
npm run build
npx wrangler pages deploy dist
```

### Workers Deployment
```bash
cd workers
npx wrangler deploy
```

## Option 4: Replit + Gumloop

### Replit Deployment
- Click "Deploy" in Replit interface
- Configure custom domain
- Set environment variables in Secrets

### Gumloop Integration
- Workflows deploy automatically
- Configure webhooks for external triggers

## Option 5: Windsurf + Claude Code

### AI-Suggested Deployment
```bash
claude-code deploy --platform vercel
claude-code deploy --platform railway
claude-code deploy --platform cloudflare
```

### Manual Deployment
Depends on chosen tech stack - follow specific platform guides.

## Option 6: Lovable + Supabase

### Automatic Deployment
- Lovable auto-deploys to Vercel
- Supabase provides production database
- Custom domains available in dashboard

### Configuration
```bash
# Supabase CLI
npx supabase init
npx supabase db push
npx supabase functions deploy
```

## Environment Variables by Stack

### Common Variables
```env
# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_AI_API_KEY=

# Database
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=

# Auth
NEXTAUTH_SECRET=
JWT_SECRET=
```

### Stack-Specific
```env
# Cloudflare
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=

# Replit
REPL_ID=
REPL_SLUG=

# Gumloop
GUMLOOP_API_KEY=
GUMLOOP_WEBHOOK_SECRET=
```

## CI/CD Setup

### GitHub Actions Example
```yaml
name: Deploy AI Tool
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
```

## Monitoring and Analytics

### Error Tracking
- **Sentry**: Error monitoring across all stacks
- **LogRocket**: Session replay for debugging
- **DataDog**: Infrastructure monitoring

### AI Usage Analytics
- Track token usage per user
- Monitor response times
- Cost analysis per AI provider

### Recommended Tools by Stack
- **Option 1**: Vercel Analytics + Sentry
- **Option 2**: Grafana + Prometheus
- **Option 3**: Cloudflare Analytics
- **Option 4**: Replit built-in monitoring
- **Option 5**: AI-recommended monitoring setup
- **Option 6**: Supabase Analytics + Vercel Analytics
