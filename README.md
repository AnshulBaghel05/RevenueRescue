# RevenueRescue - Shopify Store Audit SaaS

A professional Shopify store auditing platform that analyzes stores for performance, conversion, and revenue optimization issues.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **3D Graphics**: Three.js via React Three Fiber
- **Backend**: Next.js API routes + Supabase
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + Shopify OAuth
- **Payments**: Razorpay
- **Deployment**: Vercel

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
# Fill in your API keys
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
saas/
├── app/                    # Next.js app directory
│   ├── (marketing)/       # Landing pages
│   ├── (auth)/           # Authentication pages
│   ├── (dashboard)/      # Protected dashboard routes
│   └── api/              # API routes
├── components/            # React components
│   ├── landing/          # Landing page components
│   ├── audit/            # Audit result components
│   ├── dashboard/        # Dashboard components
│   ├── three/            # 3D background components
│   ├── shared/           # Reusable UI components
│   └── layout/           # Layout components
├── lib/                   # Utility libraries
│   ├── supabase/         # Supabase client setup
│   ├── shopify/          # Shopify OAuth & API
│   ├── audit/            # Audit engine & analyzers
│   ├── payments/         # Razorpay integration
│   └── pdf/              # PDF report generation
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── styles/               # Global styles

```

## Features

### MVP Features (15 Core Features)

**Performance & Speed (5 features)**
1. Overall Store Health Score (A-F grade)
2. Page Load Speed Analysis (desktop + mobile)
3. Largest Contentful Paint (LCP) detector
4. Image Optimization Scanner
5. Unused App Detector

**Conversion Killers (5 features)**
6. Missing Trust Signals Checker
7. Checkout Speed Analysis
8. Mobile Usability Score
9. Broken Link Detector
10. Product Page Completeness

**Revenue Impact (3 features)**
11. Revenue Recovery Calculator
12. Cart Abandonment Reason Detector
13. Conversion Rate Benchmark

**Actionable Insights (2 features)**
14. Priority Fix List (ranked by revenue impact)
15. One-Click Export Report (PDF)

## Development Timeline

- **Phase 1**: Foundation (Week 1-2) ← Current
- **Phase 2**: Landing Page (Week 2-3)
- **Phase 3**: Authentication (Week 3-4)
- **Phase 4**: Audit Engine (Week 4-6)
- **Phase 5**: Dashboard & Results (Week 6-7)
- **Phase 6**: Payments (Week 7-8)
- **Phase 7**: PDF Export (Week 8)
- **Phase 8**: Polish & Testing (Week 9-10)
- **Phase 9**: Deployment (Week 10)
- **Phase 10**: Launch (Week 11+)

## License

Private - All rights reserved
