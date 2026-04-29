import { Suspense } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import AtmosphereWidget from '@/components/AtmosphereWidget'
import ArtistSpotlight from '@/components/ArtistSpotlight'
import ClientMoodSelector from '@/components/ClientMoodSelector'
import ClientVibeCheckQuiz from '@/components/ClientVibeCheckQuiz'
import type { Mood, Room, ArtistSpotlight as ArtistSpotlightType } from '@/types'

// ─── Mock data (used when DB is not connected) ────────────────────────────────

const MOCK_MOODS: Mood[] = [
  {
    id: 'cozy',
    name: 'Cozy & Quiet',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    audioUrl: '',
    descriptor: 'Warm, still, and intimate',
  },
  {
    id: 'culinary',
    name: 'Culinary Adventure',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    audioUrl: '',
    descriptor: 'Flavour, craft, and local stories',
  },
  {
    id: 'wild',
    name: 'Wild & Adventurous',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    audioUrl: '',
    descriptor: 'Open skies and dramatic landscapes',
  },
]

const MOCK_ROOMS: Room[] = [
  {
    id: 'room-cozy',
    name: 'The Hearth Room',
    description: 'A warm, intimate room with a wood-burning stove and handmade quilts.',
    moodId: 'cozy',
    mood: MOCK_MOODS[0],
    vrImageUrl: 'https://pannellum.org/images/alma.jpg',
    povVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    photos: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'room-culinary',
    name: 'The Larder Suite',
    description: 'Overlooking the kitchen garden, with artisan breakfast served in-room.',
    moodId: 'culinary',
    mood: MOCK_MOODS[1],
    vrImageUrl: 'https://pannellum.org/images/alma.jpg',
    povVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    photos: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'room-wild',
    name: 'The Hilltop Loft',
    description: 'Floor-to-ceiling windows with panoramic countryside views.',
    moodId: 'wild',
    mood: MOCK_MOODS[2],
    vrImageUrl: 'https://pannellum.org/images/alma.jpg',
    povVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    photos: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const MOCK_SPOTLIGHT: ArtistSpotlightType = {
  id: 'spotlight-1',
  title: 'Sarah Meadows — Ceramic Artist',
  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  videoDuration: 180,
  description: `Sarah Meadows has been crafting hand-thrown ceramics in the village for over fifteen years. Her work adorns every breakfast table at Katey's BNB — from the speckled mugs that hold your morning coffee to the wide, shallow bowls that carry seasonal fruit from the garden. Sarah sources her clay from the local riverbank, a practice she learned from her grandmother, and fires each piece in a wood kiln she built herself in the orchard behind her studio. Every piece is unique, bearing the marks of the hands that shaped it and the fire that hardened it. When you hold one of Sarah's mugs, you are holding a small piece of this landscape. Her work is a reminder that the most beautiful things are often the most ordinary — a cup, a bowl, a plate — made extraordinary by the care and intention of the person who made them. Sarah's studio is open to visitors on Saturday mornings, and she occasionally runs wheel-throwing workshops for guests of the BNB. Ask Katey for details.`,
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
        include: { mood: true, photos: { include: { hotspots: true } } },
        take: 6,
      }),
      prisma.artistSpotlight.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      }),
    ])
    return {
      moods: moods as unknown as Mood[],
      rooms: rooms as unknown as Room[],
      spotlight: (spotlights[0] ?? null) as ArtistSpotlightType | null,
    }
  } catch {
    // DB not connected — use mock data
    return { moods: MOCK_MOODS, rooms: MOCK_ROOMS, spotlight: MOCK_SPOTLIGHT }
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const { moods, rooms, spotlight } = await getData()

  return (
    <>
      {/* Hero — Mood Selector */}
      <section aria-label="Choose your mood">
        <ClientMoodSelector moods={moods.length > 0 ? moods : MOCK_MOODS} />
      </section>

      {/* Atmosphere Widget */}
      <section className="bg-[#FAF8F5] px-4 py-6 flex justify-center" aria-label="Current atmosphere">
        <Suspense fallback={
          <div className="h-10 w-64 rounded-full bg-[#E8E4DF] animate-pulse" />
        }>
          <AtmosphereWidget />
        </Suspense>
      </section>

      {/* Rooms grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16" aria-labelledby="rooms-heading">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C4622D] mb-3">
            Our Rooms
          </p>
          <h2
            id="rooms-heading"
            className="text-3xl sm:text-4xl text-[#1C1917] mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Find Your Perfect Stay
          </h2>
          <p className="text-[#78716C] max-w-xl mx-auto">
            Each room is designed around a mood — choose the one that speaks to you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(rooms.length > 0 ? rooms : MOCK_ROOMS).map((room) => (
            <Link
              key={room.id}
              href={`/rooms/${room.id}`}
              className="group rounded-2xl border border-[#D6D0C8] bg-white overflow-hidden hover:shadow-md hover:border-[#C4622D]/50 transition-all"
            >
              {/* Room image placeholder */}
              <div className="aspect-video bg-gradient-to-br from-[#E8E4DF] to-[#D6D0C8] flex items-center justify-center">
                <span className="text-4xl" aria-hidden="true">🛏️</span>
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#C4622D] mb-1">
                  {room.mood?.name ?? 'Room'}
                </p>
                <h3
                  className="text-lg text-[#1C1917] mb-2 group-hover:text-[#C4622D] transition-colors"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {room.name}
                </h3>
                <p className="text-sm text-[#78716C] leading-relaxed line-clamp-2">
                  {room.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#C4622D]">
                  Explore room
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Vibe Check Quiz */}
      <section className="bg-[#F5F0EB] py-16 px-4" aria-labelledby="quiz-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C4622D] mb-3">
              Not Sure?
            </p>
            <h2
              id="quiz-heading"
              className="text-3xl sm:text-4xl text-[#1C1917] mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Take the Vibe Check
            </h2>
            <p className="text-[#78716C] max-w-xl mx-auto">
              Answer three quick questions and we&apos;ll match you with your perfect room.
            </p>
          </div>
          <ClientVibeCheckQuiz rooms={rooms.length > 0 ? rooms : MOCK_ROOMS} />
        </div>
      </section>

      {/* Artist Spotlight */}
      {spotlight && (
        <section
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
          aria-labelledby="spotlight-heading"
        >
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C4622D] mb-3">
              Local Stories
            </p>
            <h2
              id="spotlight-heading"
              className="text-3xl sm:text-4xl text-[#1C1917]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Meet the Makers
            </h2>
          </div>
          <ArtistSpotlight spotlight={spotlight} />
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-[#D6D0C8] bg-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-lg text-[#1C1917]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Katey&apos;s BNB
          </p>
          <p className="text-sm text-[#78716C]">
            © {new Date().getFullYear()} Katey&apos;s BNB. All rights reserved.
          </p>
          <Link href="/admin" className="text-sm text-[#78716C] hover:text-[#C4622D] transition-colors">
            Admin
          </Link>
        </div>
      </footer>
    </>
  )
}
