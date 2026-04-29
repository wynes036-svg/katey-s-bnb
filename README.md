# Katey's BNB

A mood-driven, immersive Bed & Breakfast booking website built with Next.js 15 App Router.

## Features

- **Mood Selector** — Choose a vibe on the homepage; background video and ambient audio update instantly
- **360° VR Tours** — Pannellum-powered WebGL panoramas with interactive hotspots
- **POV Tour Videos** — HLS-streamed first-person room walkthroughs
- **Vibe Check Quiz** — Three-question personality quiz with cosine-similarity room matching
- **Booking Flow** — Multi-step wizard: Dates → Guests → Breakfast Planner → Local Experiences → Review → Payment
- **Atmosphere Widget** — Live weather data with 30-minute server-side cache
- **Artist Spotlights** — Cinematic video features of local makers
- **Persistent CTA** — Fixed "Book Your Vibe" button (hidden during booking flow)
- **Welcome Packet** — PDF generation with Google Maps + Apple Maps deep links
- **Admin Interface** — Manage rooms, moods, experiences, and spotlights

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: PostgreSQL via Prisma ORM
- **Payments**: Stripe Checkout
- **Email**: Resend
- **Media Storage**: Cloudflare R2
- **Weather**: OpenWeatherMap API
- **PDF**: @react-pdf/renderer
- **Auth**: NextAuth.js (credentials provider)
- **Styling**: Tailwind CSS v4

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/kateys_bnb"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend (email)
RESEND_API_KEY="re_..."

# OpenWeatherMap
OPENWEATHERMAP_API_KEY="..."
PROPERTY_LAT="51.5074"
PROPERTY_LON="-0.1278"

# Cloudflare R2
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET="kateys-bnb"
R2_PUBLIC_URL="https://cdn.kateys-bnb.com"

# App URL (for server-side fetches)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 3. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### 5. Access the admin interface

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin).

Default credentials (development only):
- **Username**: `admin`
- **Password**: `admin`

> ⚠️ Change these credentials before deploying to production.

## Project Structure

```
sensory-stay/
├── app/
│   ├── admin/              # Admin interface pages
│   │   ├── login/          # Admin login
│   │   ├── rooms/          # Room management
│   │   ├── moods/          # Mood management
│   │   ├── experiences/    # Experience management
│   │   └── spotlights/     # Artist spotlight management
│   ├── api/
│   │   ├── admin/          # Admin API routes (auth-gated)
│   │   ├── auth/           # NextAuth route handler
│   │   ├── bookings/       # Booking intent + retrieval
│   │   ├── experiences/    # Public experiences API
│   │   ├── quiz/           # Quiz result API
│   │   ├── weather/        # Weather cache API
│   │   └── webhooks/       # Stripe webhook handler
│   ├── booking/            # Booking flow pages
│   ├── rooms/[id]/         # Room detail pages
│   ├── layout.tsx          # Root layout (SessionProvider, PersistentCTA)
│   └── page.tsx            # Homepage
├── components/             # React components
│   ├── MoodSelector.tsx
│   ├── VRTourViewer.tsx
│   ├── POVTourPlayer.tsx
│   ├── VibeCheckQuiz.tsx
│   ├── AtmosphereWidget.tsx
│   ├── ArtistSpotlight.tsx
│   ├── PersistentCTA.tsx
│   ├── BookingFlow.tsx
│   ├── BreakfastPlanner.tsx
│   ├── LocalExperienceSelector.tsx
│   └── index.ts
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   ├── quiz.ts             # Quiz scoring logic
│   ├── auth.ts             # NextAuth config
│   ├── admin-auth.ts       # Admin session helpers
│   ├── booking-context.tsx # Booking flow state (React Context + useReducer)
│   └── welcome-packet.tsx  # PDF generation
├── prisma/
│   └── schema.prisma       # Database schema
└── types/
    └── index.ts            # Shared TypeScript types
```

## Deployment

### Deploy to Vercel

```bash
npx vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

**Required environment variables** — set these in your Vercel project settings before deploying.

### Stripe Webhooks

After deploying, configure a Stripe webhook endpoint pointing to:
```
https://your-domain.com/api/webhooks/stripe
```

Events to listen for:
- `checkout.session.completed`

### Database

Use [Neon](https://neon.tech) or [Supabase](https://supabase.com) for a managed PostgreSQL database compatible with Vercel's serverless environment.

## Development Notes

- **Mock data**: When `DATABASE_URL` is not set or the database is unreachable, all pages fall back to mock data so the site remains functional during development.
- **Mock payments**: The Stripe integration returns a mock checkout URL. Connect real Stripe keys to enable actual payments.
- **Mock weather**: The weather widget returns mock data when `OPENWEATHERMAP_API_KEY` is not set.
- **Mock emails**: Confirmation emails are logged to the console instead of being sent when `RESEND_API_KEY` is not set.
