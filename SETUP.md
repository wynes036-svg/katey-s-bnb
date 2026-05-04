# Katye's BnB - Setup Guide

## 🏡 About
Katye's BnB is an intimate, mood-driven Bed & Breakfast website featuring a single beautifully curated room that transforms based on guest preferences.

## 📸 Adding Your Room Images

### Image Folders
- `public/images/room/` - Main room photos
- `public/images/gallery/` - Additional gallery images  
- `public/images/moods/` - Mood-specific ambiance photos

### Recommended Room Photos
Add these images to `public/images/room/`:
1. `main-view.jpg` - Main room overview
2. `cozy-corner.jpg` - Reading nook or seating area
3. `bathroom.jpg` - Bathroom view
4. `window-view.jpg` - View from the window
5. `bed-detail.jpg` - Close-up of the bed area
6. `amenities.jpg` - Special amenities or details

### Image Requirements
- **Format**: JPG or PNG
- **Size**: At least 1200px wide for best quality
- **Aspect Ratio**: 4:3 recommended for main images
- **File Size**: Under 2MB each for fast loading

### How to Add Images
1. Take high-quality photos of your room
2. Resize/optimize them if needed
3. Save them in `public/images/room/` with the suggested names
4. The website will automatically display them in the gallery

## 🚀 Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (we use Neon)

### Getting Started
```bash
# Install dependencies
npm install --legacy-peer-deps

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Visit http://localhost:3000 to see your site!

### Environment Variables
Copy `.env.example` to `.env` and fill in:
- `DATABASE_URL` - PostgreSQL connection string
- `STRIPE_SECRET_KEY` - For payments (optional)
- `NEXTAUTH_SECRET` - For authentication
- Other API keys as needed

## 🌐 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment
```bash
npm run build
npm start
```

## 🎨 Customization

### Colors & Branding
- Main colors defined in `app/globals.css`
- Fonts: Inter (body) and Playfair Display (headings)
- Update metadata in `app/layout.tsx`

### Content
- Room description: `app/page.tsx`
- Mood options: Database or mock data in `app/page.tsx`
- Artist spotlights: Admin panel or database

## 📱 Features

- **Mood Selection**: Guests choose their vibe
- **Room Gallery**: Showcase your space
- **360° Tours**: VR room exploration (when configured)
- **Booking System**: Stripe integration
- **Admin Panel**: Manage content at `/admin`
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 16
- **Database**: PostgreSQL with Prisma
- **Styling**: Tailwind CSS
- **Payments**: Stripe
- **Authentication**: NextAuth
- **Deployment**: Vercel

## 📞 Support

Need help? Check the documentation or reach out for assistance with:
- Image optimization
- Content management
- Booking system setup
- Custom features