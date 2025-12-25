# RevenueRescue - Shopify Store Audit SaaS

**Professional Shopify store auditing platform that analyzes stores for performance, conversion, and revenue optimization opportunities.**

> Transform underperforming Shopify stores into revenue-generating machines with AI-powered audits and actionable insights.

---

## 🚀 Features

### Core Audit Features
- **Overall Store Health Score** - A-F grading system with detailed breakdown
- **Performance Analysis** - Page speed, LCP, image optimization detection
- **Conversion Optimization** - Trust signals, checkout speed, mobile usability
- **Revenue Recovery Calculator** - Estimated revenue loss and recovery potential
- **Priority Fix List** - Ranked by revenue impact
- **PDF Export Reports** - Professional branded reports

### Advanced Analytics (Pro Plan)
- **Trend Analysis** - Track store improvements over time
- **Audit Comparison** - Compare two audits side-by-side
- **Predictive Forecasting** - AI-powered score predictions using linear regression
- **AI Insights** - Automated insights and recommendations

### Pricing Plans
- **Free**: 1 audit/month - Try before you buy
- **Starter ($29/mo)**: 10 audits/month + PDF exports + trends
- **Pro ($79/mo)**: 50 audits/month + analytics + forecasting + priority support

---

## 🛠 Tech Stack

- **Framework**: Next.js 16.0.10 (App Router)
- **Language**: TypeScript 5.6.3
- **Database**: Supabase (PostgreSQL 15.x)
- **Authentication**: Supabase Auth
- **Payments**: Razorpay
- **PDF Generation**: @react-pdf/renderer
- **Charts**: Recharts 3.6.0
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

---

## 📦 Quick Start

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd saas
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup
Apply migrations in order (see [DEPLOYMENT.md](DEPLOYMENT.md)):
```bash
# Via Supabase Dashboard SQL Editor
# Run migrations 001-008 in sequence
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
saas/
├── app/
│   ├── (marketing)/          # Landing, pricing, legal pages
│   ├── (auth)/               # Login, signup
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── dashboard/        # Main dashboard + trends/compare/analytics
│   │   ├── audit/            # Audit results page
│   │   ├── payment-success/  # Payment confirmation
│   │   └── payment-failed/   # Payment retry
│   └── api/
│       ├── audit/            # Audit creation API
│       ├── payments/         # Razorpay integration
│       └── pdf/              # PDF export API
├── components/
│   ├── landing/              # Hero, features, pricing
│   ├── dashboard/            # Dashboard UI components
│   ├── audit/                # Audit result components
│   └── shared/               # Reusable UI components
├── lib/
│   ├── supabase/             # Database clients
│   ├── payments/             # Razorpay integration
│   ├── pdf/                  # PDF generation
│   └── audit/                # Audit engine (analyzers)
├── hooks/
│   └── useAuth.ts            # Authentication hook
├── supabase/
│   └── migrations/           # Database migrations (001-008)
└── types/                    # TypeScript definitions
```

---

## 🔐 Security Features

- **Row-Level Security (RLS)** - Database-level user isolation
- **Audit Logging** - Complete trail of sensitive operations
- **Limit Enforcement** - Automatic tier limit validation at database level
- **Input Validation** - Server-side validation on all inputs
- **Secure Payment Flow** - Razorpay signature verification
- **HTTPS Only** - Enforced in production

Security Grade: **A+**

---

## 📊 Database Schema

**10 Tables**:
- `profiles` - User data and subscription info
- `audits` - Audit results and history
- `subscriptions` - Razorpay subscription tracking
- `payments` - Payment transactions
- `audit_exports` - PDF export metadata
- `audit_logs` - Security audit trail
- `analytics_events` - User interaction tracking
- `user_preferences` - User settings
- `shopify_stores` - Shopify store metadata
- `shopify_connections` - OAuth tokens

**Key Functions**:
- `get_dashboard_stats()` - Efficient dashboard data retrieval
- `calculate_score_prediction()` - Predictive forecasting
- `check_audit_limit()` - Automatic limit enforcement
- `archive_old_audits()` - Data retention management

---

## 🚢 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

**Quick Deploy to Vercel**:
```bash
npm run build
vercel --prod
```

**Required Environment Variables** (Set in Vercel Dashboard):
- All variables from `.env.example`
- Configure domain and SSL
- Set up Razorpay webhooks

---

## 📈 Monetization

### Revenue Model
- **Subscription-based SaaS**
- **Monthly recurring revenue (MRR)**
- **3 pricing tiers** (Free, Starter $29, Pro $79)
- **Target market**: Shopify store owners (2M+ potential customers)

### Growth Strategy
- **Free tier** for lead generation
- **Content marketing** to Shopify communities
- **SEO** targeting "Shopify store audit" keywords
- **Partner program** with Shopify agencies

---

## 🧪 Testing

```bash
# Run type checking
npm run build

# Check for errors
npm run lint
```

**Manual Testing Checklist**:
- [ ] User signup and login
- [ ] Create audit (free tier)
- [ ] Payment flow (Starter/Pro)
- [ ] PDF export
- [ ] Analytics dashboard (Pro users)
- [ ] Tier limit enforcement

---

## 📞 Support & Documentation

- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Sales Materials**: [SALES_DECK.md](SALES_DECK.md)
- **API Docs**: [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md)

---

## 📄 License

**Private & Proprietary** - All rights reserved

This is a commercial SaaS product. Unauthorized copying, distribution, or modification is prohibited.

---

## 🎯 Roadmap

**Completed**:
- ✅ Core audit engine (15 features)
- ✅ User authentication
- ✅ Payment integration (Razorpay)
- ✅ PDF export
- ✅ Advanced analytics dashboard
- ✅ Predictive forecasting
- ✅ Database security hardening

**Upcoming**:
- [ ] Shopify OAuth integration
- [ ] Email notifications
- [ ] Team accounts
- [ ] White-label reports
- [ ] API access for agencies

---

**Built with ❤️ for Shopify store owners**
