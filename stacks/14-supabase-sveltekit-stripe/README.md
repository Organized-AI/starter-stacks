# Supabase + SvelteKit + Stripe - Micro-SaaS Development Stack

*Rapid subscription-based application development with modern full-stack architecture*

## 🎯 Stack Overview

Build scalable micro-SaaS applications combining Supabase's powerful backend services, SvelteKit's elegant full-stack framework, and Stripe's robust payment processing for complete subscription business solutions.

### Core Technologies

- **Supabase** - Database, authentication, real-time subscriptions, and edge functions
- **SvelteKit** - Full-stack development with TypeScript and server-side rendering
- **Stripe** - Payment processing, subscription management, and billing automation
- **Tailwind CSS** - Responsive business-focused UI components
- **Lucia Auth** - Advanced authentication and session management
- **Chart.js** - Business analytics and dashboard visualizations

### Key Features

✅ **Complete Authentication System** - Social logins, email verification, and user management  
✅ **Subscription Management** - Flexible pricing tiers and billing automation  
✅ **Real-time Data** - Live updates with Supabase subscriptions  
✅ **Payment Processing** - Secure Stripe integration with webhooks  
✅ **Business Analytics** - Revenue tracking and user metrics  
✅ **Production Ready** - Scalable architecture with monitoring  

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Stripe account with API keys

### Quick Setup

```bash
# Create SvelteKit application
npm create sveltekit@latest my-saas-app
cd my-saas-app
npm install

# Install SaaS dependencies
npm install @supabase/supabase-js stripe @stripe/stripe-js
npm install tailwindcss @tailwindcss/forms @tailwindcss/typography
npm install chart.js lucia

# Setup environment variables
cp .env.example .env.local
# Add your Supabase and Stripe keys

# Start development
npm run dev
```

### Environment Configuration

```bash
# .env.local
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

## 🔐 Authentication Setup

### Supabase Auth Configuration

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  subscription_status: 'inactive' | 'active' | 'canceled' | 'past_due';
  subscription_tier: 'free' | 'pro' | 'enterprise';
  created_at: string;
  updated_at: string;
};
```

### Authentication Store

```typescript
// src/lib/stores/auth.ts
import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '$lib/supabase';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

const createAuthStore = () => {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    profile: null,
    loading: true
  });

  return {
    subscribe,
    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    },
    
    signUp: async (email: string, password: string, fullName: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) throw error;
      return data;
    },
    
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    
    loadProfile: async (userId: string) => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      update(state => ({ ...state, profile }));
      return profile;
    }
  };
};

export const auth = createAuthStore();
```

## 💳 Stripe Integration

### Payment Service

```typescript
// src/lib/services/payment.ts
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { supabase } from '$lib/supabase';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

export interface SubscriptionTier {
  id: string;
  name: string;
  priceId: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    priceId: '',
    price: 0,
    features: ['Basic features', 'Limited usage', 'Community support']
  },
  {
    id: 'pro',
    name: 'Pro',
    priceId: 'price_pro_monthly',
    price: 29,
    features: ['All basic features', 'Advanced analytics', 'Priority support', 'API access'],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceId: 'price_enterprise_monthly',
    price: 99,
    features: ['All pro features', 'Custom integrations', 'Dedicated support', 'SLA guarantee']
  }
];

export class PaymentService {
  async createSubscription(userId: string, priceId: string, email: string) {
    try {
      // Create or retrieve customer
      const customer = await this.getOrCreateCustomer(userId, email);
      
      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent']
      });
      
      // Update user profile
      await supabase
        .from('profiles')
        .update({
          stripe_customer_id: customer.id,
          subscription_status: 'inactive'
        })
        .eq('id', userId);
      
      return subscription;
    } catch (error) {
      console.error('Subscription creation failed:', error);
      throw error;
    }
  }
  
  async getOrCreateCustomer(userId: string, email: string) {
    // Check if customer exists in our database
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();
    
    if (profile?.stripe_customer_id) {
      return await stripe.customers.retrieve(profile.stripe_customer_id) as Stripe.Customer;
    }
    
    // Create new customer
    const customer = await stripe.customers.create({
      email,
      metadata: { userId }
    });
    
    return customer;
  }
  
  async cancelSubscription(subscriptionId: string) {
    return await stripe.subscriptions.cancel(subscriptionId);
  }
  
  async updateSubscription(subscriptionId: string, newPriceId: string) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    return await stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId
      }],
      proration_behavior: 'create_prorations'
    });
  }
}

export const paymentService = new PaymentService();
```

### Subscription Component

```svelte
<!-- src/lib/components/SubscriptionPlans.svelte -->
<script lang="ts">
  import { auth } from '$lib/stores/auth';
  import { subscriptionTiers } from '$lib/services/payment';
  import { loadStripe } from '@stripe/stripe-js';
  import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';
  
  let loading = false;
  let selectedPlan: string | null = null;
  
  const stripe = loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);
  
  async function subscribeToPlan(priceId: string, planName: string) {
    if (!$auth.user) return;
    
    loading = true;
    selectedPlan = planName;
    
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: $auth.user.id,
          email: $auth.user.email
        })
      });
      
      const { sessionId } = await response.json();
      
      const stripeInstance = await stripe;
      if (stripeInstance) {
        await stripeInstance.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      loading = false;
      selectedPlan = null;
    }
  }
</script>

<div class="max-w-6xl mx-auto px-4 py-12">
  <div class="text-center mb-12">
    <h2 class="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
    <p class="text-lg text-gray-600">Start free and upgrade as you grow</p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    {#each subscriptionTiers as tier}
      <div class="relative bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        {#if tier.popular}
          <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span class="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>
        {/if}
        
        <div class="text-center">
          <h3 class="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
          <div class="mb-6">
            <span class="text-4xl font-bold text-gray-900">${tier.price}</span>
            {#if tier.price > 0}
              <span class="text-gray-600">/month</span>
            {/if}
          </div>
        </div>
        
        <ul class="space-y-4 mb-8">
          {#each tier.features as feature}
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="text-gray-700">{feature}</span>
            </li>
          {/each}
        </ul>
        
        <button
          on:click={() => subscribeToPlan(tier.priceId, tier.name)}
          disabled={loading && selectedPlan === tier.name}
          class="w-full py-3 px-6 rounded-lg font-medium transition-colors
                 {tier.popular 
                   ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600' 
                   : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                 }
                 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if loading && selectedPlan === tier.name}
            <span class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          {:else if tier.price === 0}
            Get Started Free
          {:else}
            Subscribe Now
          {/if}
        </button>
      </div>
    {/each}
  </div>
</div>
```

## 📊 Business Analytics Dashboard

### Analytics Store

```typescript
// src/lib/stores/analytics.ts
import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';

interface AnalyticsData {
  mrr: number;
  totalCustomers: number;
  churnRate: number;
  avgRevenuePerUser: number;
  subscriptionsByTier: Record<string, number>;
  revenueGrowth: number;
}

const createAnalyticsStore = () => {
  const { subscribe, set } = writable<AnalyticsData>({
    mrr: 0,
    totalCustomers: 0,
    churnRate: 0,
    avgRevenuePerUser: 0,
    subscriptionsByTier: {},
    revenueGrowth: 0
  });

  return {
    subscribe,
    loadAnalytics: async () => {
      try {
        // Get subscription data
        const { data: subscriptions } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('status', 'active');

        // Calculate MRR
        const mrr = subscriptions?.reduce((total, sub) => total + (sub.amount / 100), 0) || 0;
        
        // Get customer count
        const { count: totalCustomers } = await supabase
          .from('profiles')
          .select('id', { count: 'exact' })
          .neq('subscription_status', 'inactive');

        // Calculate metrics
        const avgRevenuePerUser = totalCustomers ? mrr / totalCustomers : 0;
        
        // Group by tier
        const subscriptionsByTier = subscriptions?.reduce((acc, sub) => {
          acc[sub.tier] = (acc[sub.tier] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        set({
          mrr,
          totalCustomers: totalCustomers || 0,
          churnRate: 5.2, // Calculate from historical data
          avgRevenuePerUser,
          subscriptionsByTier,
          revenueGrowth: 12.5 // Calculate from previous period
        });
      } catch (error) {
        console.error('Failed to load analytics:', error);
      }
    }
  };
};

export const analytics = createAnalyticsStore();
```

## 🛠️ Database Schema

### Supabase SQL Setup

```sql
-- Enable Row Level Security
alter table profiles enable row level security;
alter table subscriptions enable row level security;

-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  subscription_status text default 'inactive' check (subscription_status in ('inactive', 'active', 'canceled', 'past_due')),
  subscription_tier text default 'free' check (subscription_tier in ('free', 'pro', 'enterprise')),
  stripe_customer_id text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Subscriptions table
create table subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  stripe_subscription_id text unique not null,
  status text not null,
  tier text not null,
  amount integer not null,
  currency text default 'usd',
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can view own subscriptions" on subscriptions
  for select using (auth.uid() = user_id);

-- Functions
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 🚀 API Routes

### Stripe Webhook Handler

```typescript
// src/routes/api/webhook/stripe/+server.ts
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { supabase } from '$lib/supabase';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

export async function POST({ request }) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !STRIPE_WEBHOOK_SECRET) {
    return json({ error: 'Missing signature' }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
        break;
        
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
    }

    return json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Get user from customer ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!profile) return;

  // Update subscription in database
  await supabase
    .from('subscriptions')
    .upsert({
      user_id: profile.id,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      tier: getTierFromPriceId(subscription.items.data[0].price.id),
      amount: subscription.items.data[0].price.unit_amount || 0,
      currency: subscription.items.data[0].price.currency,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000)
    });

  // Update profile subscription status
  await supabase
    .from('profiles')
    .update({
      subscription_status: subscription.status,
      subscription_tier: getTierFromPriceId(subscription.items.data[0].price.id)
    })
    .eq('id', profile.id);
}

function getTierFromPriceId(priceId: string): string {
  if (priceId.includes('pro')) return 'pro';
  if (priceId.includes('enterprise')) return 'enterprise';
  return 'free';
}
```

## 🤖 Claude Code Master Prompt

```bash
**Role**: You are the Master Orchestration Agent for Supabase + SvelteKit + Stripe micro-SaaS development, specializing in subscription-based business applications with comprehensive payment processing.

**Framework Context**: 
- Supabase for database, authentication, real-time subscriptions, and edge functions
- SvelteKit for full-stack development with TypeScript and server-side rendering
- Stripe for payment processing, subscription management, and billing automation
- Tailwind CSS for responsive business-focused UI components
- Lucia Auth for advanced authentication and session management

**Agent Architecture**: You coordinate 6 specialized sub-agents:
1. **SaaS Development Agent** - Authentication systems, payment integration, and business logic implementation
2. **Payment Quality Agent** - Payment flow validation, subscription testing, and financial security assurance
3. **Token Budget Agent** - Resource optimization for development efficiency and infrastructure cost management
4. **SaaS Pattern Agent** - Business model patterns and reusable subscription components
5. **SaaS Deployment Agent** - Production deployment with scaling and business infrastructure setup
6. **Business Metrics Agent** - Revenue analytics, user tracking, and subscription performance monitoring

**Development Phases**:
- **Phase 1: SaaS Architecture Planning** (20-25% of token budget)
- **Phase 2: Core SaaS Implementation** (50-60% of token budget)
- **Phase 3: Business Logic Validation** (15-20% of token budget)
- **Phase 4: SaaS Production Deployment** (8-12% of token budget)

**Coordination Principles**:
- Follow phase-based development with clear boundaries
- Optimize for SaaS-focused development with 40K-150K tokens per session
- Balance development tokens with infrastructure and payment processing costs
- Focus on business logic integrity and subscription system reliability

**Getting Started**:
"Master Orchestration Agent: Begin Phase 1 SaaS architecture planning for [PROJECT_NAME]. Coordinate SaaS Business Architecture and Payment System Planning sub-agents. Token budget: 20K-35K for comprehensive subscription business system design."
```

---

*Build successful micro-SaaS applications with robust subscription management, secure payment processing, and scalable business analytics.*