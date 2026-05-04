import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import AtmosphereWidget from '@/components/AtmosphereWidget'
import ArtistSpotlight from '@/components/ArtistSpotlight'
import RoomGallery from '@/components/RoomGallery'
import ClientMoodSelector from '@/components/ClientMoodSelector'
import type { Mood, Room, ArtistSpotlight as ArtistSpotlightType } from '@/types'

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_MOODS: Mood[] = [
  { id: 'cozy', name: 'Cozy & Quiet', videoUrl: '', audioUrl: '', descriptor: 'Warm, still, and intimate' },
  { id: 'culinary', name: 'Culinary Adventure', videoUrl: '', audioUrl: '', descriptor: 'Flavour, craft, and local stories' },
  { id: 'wild', name: 'Wild & Adventurous', videoUrl: '', audioUrl: '', descriptor: 'Open skies and dramatic landscapes' },
]

const MOCK_ROOM: Room = {
  id: 'the-sanctuary',
  name: "Katelyn's Sanctuary",
  description: 'A beautifully curated private room that transforms to match your chosen mood — from cozy and intimate to bold and adventurous. Every detail has been thoughtfully selected to create your perfect retreat.',
  vrImageUrl: '',
  povVideoUrl: '',
  photos: [],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const ROOM_IMAGES: string[] = [
  '/images/room/main-view.jpg',
  '/images/room/cozy-corner.jpg',
  '/images/room/bed-detail.jpg',
  '/images/room/amenities.jpg',
  '/images/room/room6.jpg',
  '/images/room/bathroom.jpg',
  '/images/room/window-view.jpg',
  '/images/room/detail1.jpg',
  '/images/room/detail2.jpg',
  '/images/room/detail3.jpg',
  '/images/room/detail4.jpg',
  '/images/room/detail5.jpg',
  '/images/room/detail6.jpg',
  '/images/room/detail7.jpg',
  '/images/room/detail8.jpg',
  '/images/room/detail9.jpg',
  '/images/room/detail10.jpg',
  '/images/room/detail11.jpg',
  '/images/room/detail12.jpg',
]

const MOCK_SPOTLIGHT: ArtistSpotlightType = {
  id: 'spotlight-1',
  title: 'Sarah Meadows — Ceramic Artist',
  videoUrl: '',
  videoDuration: 180,
  description: `Sarah Meadows has been crafting hand-thrown ceramics in the village for over fifteen years. Her beautiful pieces can be found throughout Katye's BnB — from the speckled mugs perfect for your morning coffee to the wide, shallow bowls ideal for fresh fruit. Every piece is unique, bearing the marks of the hands that shaped it and the fire that hardened it.`,
  externalUrl: 'https://example.com/sarah-meadows',
  isPublished: true,
  createdAt: new Date(),
}

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getData() {
  try {
    const [moods, rooms, spotlights] = await Promise.all([
      prisma.mood.findMany(),
      prisma.room.findMany({
        where: { isActive: true },
        include: { photos: { include: { hotspots: true } } },
        take: 1,
      }),
      prisma.artistSpotlight.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      }),
    ])
    return {
      moods: moods as unknown as Mood[],
      room: (rooms[0] ?? null) as Room | null,
      spotlight: (spotlights[0] ?? null) as ArtistSpotlightType | null,
    }
  } catch {
    return { moods: MOCK_MOODS, room: MOCK_ROOM, spotlight: MOCK_SPOTLIGHT }
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const { moods, room, spotlight } = await getData()

  return (
    <>
      {/* ── Hero ── */}
      <section aria-label="Hero">
        <ClientMoodSelector moods={moods.length > 0 ? moods : MOCK_MOODS} />
      </section>

      {/* ── Atmosphere strip ── */}
      <div className="bg-white border-b border-[#E2DDD6] px-4 py-4 flex justify-center">
        <Suspense fallback={<div className="h-8 w-56 rounded-full bg-[#EFEFEB] animate-pulse" />}>
          <AtmosphereWidget />
        </Suspense>
      </div>

      {/* ── Trust bar ── */}
      <div className="bg-[#1A1A18] text-white py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-8 text-sm">
          <span className="flex items-center gap-2 text-white/80"><span className="text-[#C9A84C]">★★★★★</span> Highly rated stays</span>
          <span className="w-px h-4 bg-white/20 hidden sm:block" />
          <span className="flex items-center gap-2 text-white/80">🔒 Secure booking</span>
          <span className="w-px h-4 bg-white/20 hidden sm:block" />
          <span className="flex items-center gap-2 text-white/80">📍 Ngong Road, Nairobi</span>
          <span className="w-px h-4 bg-white/20 hidden sm:block" />
          <span className="flex items-center gap-2 text-white/80">💳 M-Pesa · PayPal · Card</span>
        </div>
      </div>

      {/* ── Room showcase ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20" aria-labelledby="room-heading">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="section-label mb-4">The Space</p>
          <div className="divider mb-6" />
          <h2
            id="room-heading"
            className="text-4xl sm:text-5xl text-[#1A1A18] mb-5"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            One Room. Perfectly Yours.
          </h2>
          <p className="text-[#6B6860] max-w-lg mx-auto text-lg leading-relaxed">
            A private sanctuary curated around your mood — intimate, thoughtful, and entirely your own.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Gallery */}
          <div className="lg:sticky lg:top-8">
            <RoomGallery
              images={ROOM_IMAGES}
              roomName={room?.name ?? MOCK_ROOM.name}
            />
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <h3
                className="text-3xl text-[#1A1A18] mb-3"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {room?.name ?? MOCK_ROOM.name}
              </h3>
              <div className="w-10 h-0.5 bg-[#B85C2A] mb-5" />
              <p className="text-[#6B6860] leading-relaxed text-base">
                {room?.description ?? MOCK_ROOM.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🌿', label: 'Mood-responsive ambiance' },
                { icon: '🛁', label: 'Private bathroom' },
                { icon: '🍳', label: 'Fully equipped kitchen' },
                { icon: '🎨', label: 'Curated local art' },
                { icon: '🍽️', label: 'Restaurant delivery' },
                { icon: '📶', label: 'High-speed Wi-Fi' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-3 bg-[#FAFAF8] border border-[#E2DDD6] rounded-xl px-4 py-3">
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm text-[#1A1A18] font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* Location card */}
            <div className="bg-[#1A1A18] text-white rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C] mb-3">Location</p>
              <p className="font-semibold text-lg mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                Racecourse Gardens
              </p>
              <p className="text-white/70 text-sm mb-1">Ngong Road, Nairobi</p>
              <p className="text-white/70 text-sm mb-4">Block J · 3rd Floor · Door 14</p>
              <a
                href="https://maps.google.com/?q=Racecourse+Gardens+Ngong+Road+Nairobi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#C9A84C] hover:text-white transition-colors no-underline"
              >
                <span>📍</span> View on Google Maps →
              </a>
            </div>

            {/* Pricing + CTA */}
            <div className="border border-[#E2DDD6] rounded-2xl p-6 bg-white">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-[#1A1A18]" style={{ fontFamily: 'var(--font-serif)' }}>KES 2,500</span>
                <span className="text-[#6B6860] text-sm">/ night</span>
              </div>
              <p className="text-xs text-[#6B6860] mb-5">All taxes and fees included</p>
              <Link
                href="/booking"
                className="flex items-center justify-center gap-2 w-full bg-[#B85C2A] hover:bg-[#9A4D22] text-white py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:shadow-lg no-underline"
              >
                Book Your Stay
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Artist spotlight ── */}
      {spotlight && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20" aria-labelledby="spotlight-heading">
          <div className="text-center mb-12">
            <p className="section-label mb-4">Local Stories</p>
            <div className="divider mb-6" />
            <h2
              id="spotlight-heading"
              className="text-3xl sm:text-4xl text-[#1A1A18]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Meet the Makers
            </h2>
          </div>
          <ArtistSpotlight spotlight={spotlight} />
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="bg-[#1A1A18] text-white pt-14 pb-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Image src="/logo.png" alt="Katye's BnB logo" width={40} height={40} className="object-contain invert opacity-90" />
                <p className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Katye&apos;s BnB</p>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                An intimate, mood-driven sanctuary in the heart of Nairobi.
              </p>
            </div>
            {/* Location */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C] mb-3">Location</p>
              <p className="text-white/70 text-sm">Racecourse Gardens, Ngong Road</p>
              <p className="text-white/70 text-sm">Block J · 3rd Floor · Door 14</p>
              <a
                href="https://maps.google.com/?q=Racecourse+Gardens+Ngong+Road+Nairobi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9A84C] text-sm hover:text-white transition-colors mt-2 inline-block no-underline"
              >
                View on Google Maps →
              </a>
            </div>
            {/* Contact */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C] mb-3">Contact</p>
              <p className="text-white/70 text-sm mb-1">Owner</p>
              <a href="tel:0714122129" className="text-white font-medium text-sm hover:text-[#C9A84C] transition-colors no-underline">
                0714122129
              </a>
              <div className="mt-4">
                <Link
                  href="/booking"
                  className="inline-block bg-[#B85C2A] hover:bg-[#9A4D22] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors no-underline"
                >
                  Book Your Stay
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
            <p>© {new Date().getFullYear()} Katye&apos;s BnB. All rights reserved.</p>
            <Link href="/admin" className="hover:text-white/70 transition-colors no-underline">Admin</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
