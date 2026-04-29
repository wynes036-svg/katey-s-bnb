import { Suspense } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ClientBookingFlow from '@/components/ClientBookingFlow'
import type { Room } from '@/types'

// ─── Mock rooms ───────────────────────────────────────────────────────────────

const MOCK_ROOMS: Room[] = [
  {
    id: 'room-cozy',
    name: 'The Hearth Room',
    description: 'A warm, intimate room with a wood-burning stove and handmade quilts.',
    moodId: 'cozy',
    mood: { id: 'cozy', name: 'Cozy & Quiet', videoUrl: '', audioUrl: '', descriptor: 'Warm, still, and intimate' },
    vrImageUrl: '',
    povVideoUrl: '',
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
    mood: { id: 'culinary', name: 'Culinary Adventure', videoUrl: '', audioUrl: '', descriptor: 'Flavour, craft, and local stories' },
    vrImageUrl: '',
    povVideoUrl: '',
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
    mood: { id: 'wild', name: 'Wild & Adventurous', videoUrl: '', audioUrl: '', descriptor: 'Open skies and dramatic landscapes' },
    vrImageUrl: '',
    povVideoUrl: '',
    photos: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function getRooms(): Promise<Room[]> {
  try {
    const rooms = await prisma.room.findMany({
      where: { isActive: true },
      include: { mood: true, photos: { include: { hotspots: true } } },
    })
    return rooms.length > 0 ? (rooms as unknown as Room[]) : MOCK_ROOMS
  } catch {
    return MOCK_ROOMS
  }
}

async function getRoomById(id: string): Promise<Room | undefined> {
  try {
    const room = await prisma.room.findFirst({
      where: { id, isActive: true },
      include: { mood: true, photos: { include: { hotspots: true } } },
    })
    return (room as unknown as Room) ?? MOCK_ROOMS.find((r) => r.id === id)
  } catch {
    return MOCK_ROOMS.find((r) => r.id === id)
  }
}

interface BookingPageProps {
  searchParams: Promise<{ roomId?: string }>
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { roomId } = await searchParams
  const [rooms, selectedRoom] = await Promise.all([
    getRooms(),
    roomId ? getRoomById(roomId) : Promise.resolve(undefined),
  ])

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Navigation */}
      <nav className="border-b border-[#D6D0C8] bg-white px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#78716C] hover:text-[#C4622D] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            Back to home
          </Link>
          <Link
            href="/"
            className="text-lg font-semibold text-[#1C1917]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Katey&apos;s BNB
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C4622D] mb-3">
            Booking
          </p>
          <h1
            className="text-3xl sm:text-4xl text-[#1C1917] mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Curate Your Stay
          </h1>
          <p className="text-[#78716C] max-w-xl mx-auto">
            Personalise every detail of your visit — from breakfast to local adventures.
          </p>
        </div>

        {/* Room selector (if no room pre-selected) */}
        {!selectedRoom && (
          <div className="mb-10">
            <h2
              className="text-xl text-[#1C1917] mb-4 text-center"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Choose Your Room
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {rooms.map((room) => (
                <Link
                  key={room.id}
                  href={`/booking?roomId=${room.id}`}
                  className="rounded-2xl border border-[#D6D0C8] bg-white p-5 hover:border-[#C4622D] hover:shadow-sm transition-all group"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#C4622D] mb-1">
                    {room.mood?.name}
                  </p>
                  <h3
                    className="text-lg text-[#1C1917] mb-2 group-hover:text-[#C4622D] transition-colors"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {room.name}
                  </h3>
                  <p className="text-sm text-[#78716C] line-clamp-2">{room.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Booking flow wizard */}
        {selectedRoom && (
          <div>
            <div className="mb-6 rounded-xl border border-[#D6D0C8] bg-white p-4 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#C4622D] mb-0.5">
                  Selected Room
                </p>
                <p className="font-semibold text-[#1C1917]">{selectedRoom.name}</p>
                <p className="text-sm text-[#78716C]">{selectedRoom.mood?.name}</p>
              </div>
              <Link
                href="/booking"
                className="text-sm text-[#78716C] hover:text-[#C4622D] transition-colors"
              >
                Change
              </Link>
            </div>

            <Suspense fallback={<div className="h-64 rounded-2xl bg-[#E8E4DF] animate-pulse" />}>
              <ClientBookingFlow room={selectedRoom} initialRoomId={selectedRoom.id} />
            </Suspense>
          </div>
        )}
      </main>
    </div>
  )
}
