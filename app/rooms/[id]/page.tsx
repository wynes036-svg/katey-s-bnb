import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ArtistSpotlight from '@/components/ArtistSpotlight'
import ClientVRTourViewer from '@/components/ClientVRTourViewer'
import ClientPOVTourPlayer from '@/components/ClientPOVTourPlayer'
import type { Room, ArtistSpotlight as ArtistSpotlightType, Hotspot } from '@/types'

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_HOTSPOTS: Hotspot[] = [
  {
    id: 'h1',
    photoId: 'p1',
    pitch: 10,
    yaw: 180,
    title: 'Hand-thrown Ceramic Mug',
    description:
      'This mug was crafted by local ceramicist Sarah Meadows using clay sourced from the nearby riverbank. Each piece is unique, fired in a wood kiln in her orchard studio. The speckled glaze is achieved through a natural ash process that has been used in this region for centuries.',
  },
  {
    id: 'h2',
    photoId: 'p1',
    pitch: -5,
    yaw: 90,
    title: 'Handwoven Wool Blanket',
    description:
      'Woven by the Thornton family at their hillside farm just three miles away. The wool comes from their own flock of Herdwick sheep, known for their hardy fleece. The pattern is a traditional local design passed down through four generations of the family.',
  },
  {
    id: 'h3',
    photoId: 'p1',
    pitch: 5,
    yaw: 270,
    title: 'Wildflower Honey',
    description:
      'Harvested from hives kept in the meadow behind the property. The beekeeper, James, has been tending these hives for over twenty years. The honey changes character with the seasons — lighter and floral in spring, deeper and richer by late summer when the heather blooms.',
  },
]

const MOCK_ROOMS: Record<string, Room> = {
  'room-cozy': {
    id: 'room-cozy',
    name: 'The Hearth Room',
    description:
      'A warm, intimate room with a wood-burning stove and handmade quilts. Sink into the deep armchair with a book while the fire crackles beside you.',
    moodId: 'cozy',
    mood: { id: 'cozy', name: 'Cozy & Quiet', videoUrl: '', audioUrl: '', descriptor: 'Warm, still, and intimate' },
    vrImageUrl: 'https://pannellum.org/images/alma.jpg',
    povVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    photos: [{ id: 'p1', roomId: 'room-cozy', url: 'https://pannellum.org/images/alma.jpg', hotspots: MOCK_HOTSPOTS }],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'room-culinary': {
    id: 'room-culinary',
    name: 'The Larder Suite',
    description:
      'Overlooking the kitchen garden, with artisan breakfast served in-room. Wake to the scent of fresh bread and the sound of birdsong.',
    moodId: 'culinary',
    mood: { id: 'culinary', name: 'Culinary Adventure', videoUrl: '', audioUrl: '', descriptor: 'Flavour, craft, and local stories' },
    vrImageUrl: 'https://pannellum.org/images/alma.jpg',
    povVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    photos: [{ id: 'p2', roomId: 'room-culinary', url: 'https://pannellum.org/images/alma.jpg', hotspots: MOCK_HOTSPOTS }],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'room-wild': {
    id: 'room-wild',
    name: 'The Hilltop Loft',
    description:
      'Floor-to-ceiling windows with panoramic countryside views. Fall asleep under the stars and wake to a horizon that stretches for miles.',
    moodId: 'wild',
    mood: { id: 'wild', name: 'Wild & Adventurous', videoUrl: '', audioUrl: '', descriptor: 'Open skies and dramatic landscapes' },
    vrImageUrl: 'https://pannellum.org/images/alma.jpg',
    povVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    photos: [{ id: 'p3', roomId: 'room-wild', url: 'https://pannellum.org/images/alma.jpg', hotspots: MOCK_HOTSPOTS }],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}

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

async function getRoom(id: string): Promise<{ room: Room; spotlight: ArtistSpotlightType | null }> {
  try {
    const [room, spotlights] = await Promise.all([
      prisma.room.findFirst({
        where: { id, isActive: true },
        include: {
          mood: true,
          photos: { include: { hotspots: true } },
          spotlights: { where: { isPublished: true }, take: 1 },
        },
      }),
      prisma.artistSpotlight.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      }),
    ])

    if (!room) {
      // Try mock data
      const mockRoom = MOCK_ROOMS[id]
      if (!mockRoom) return { room: null as unknown as Room, spotlight: null }
      return { room: mockRoom, spotlight: MOCK_SPOTLIGHT }
    }

    const spotlight =
      (room as unknown as { spotlights: ArtistSpotlightType[] }).spotlights?.[0] ??
      spotlights[0] ??
      null

    return { room, spotlight }
  } catch {
    // DB not connected — use mock data
    const mockRoom = MOCK_ROOMS[id]
    if (!mockRoom) return { room: null as unknown as Room, spotlight: null }
    return { room: mockRoom, spotlight: MOCK_SPOTLIGHT }
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface RoomPageProps {
  params: Promise<{ id: string }>
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params
  const { room, spotlight } = await getRoom(id)

  if (!room) notFound()

  const firstPhoto = room.photos?.[0]
  const hotspots = firstPhoto?.hotspots ?? []

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
            Back to rooms
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Room header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C4622D] mb-2">
            {room.mood?.name}
          </p>
          <h1
            className="text-3xl sm:text-4xl text-[#1C1917] mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {room.name}
          </h1>
          <p className="text-[#78716C] text-lg leading-relaxed max-w-2xl">
            {room.description}
          </p>
        </div>

        {/* VR Tour */}
        <section className="mb-10" aria-labelledby="vr-tour-heading">
          <h2
            id="vr-tour-heading"
            className="text-xl text-[#1C1917] mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            360° Room Tour
          </h2>
          <ClientVRTourViewer
            imageUrl={room.vrImageUrl}
            hotspots={hotspots}
          />
          {hotspots.length > 0 && (
            <p className="mt-2 text-xs text-[#78716C] text-center">
              Click the hotspot markers to discover the stories behind each detail
            </p>
          )}
        </section>

        {/* POV Tour */}
        <section className="mb-10" aria-labelledby="pov-tour-heading">
          <h2
            id="pov-tour-heading"
            className="text-xl text-[#1C1917] mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Experience Your Stay
          </h2>
          <ClientPOVTourPlayer
            videoUrl={room.povVideoUrl}
            title={`${room.name} — first-person walkthrough`}
          />
          <p className="mt-2 text-xs text-[#78716C] text-center">
            A first-person walkthrough from waking up through the breakfast experience
          </p>
        </section>

        {/* Booking CTA */}
        <section className="mb-12 rounded-2xl bg-[#C4622D] p-8 text-center text-white">
          <h2
            className="text-2xl mb-3"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Ready to Book?
          </h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Secure your stay in {room.name} and start planning your perfect experience.
          </p>
          <Link
            href={`/booking?roomId=${room.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-[#C4622D] transition-colors hover:bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#C4622D]"
          >
            Book {room.name}
          </Link>
        </section>

        {/* Artist Spotlight */}
        {spotlight && (
          <section aria-labelledby="spotlight-heading">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#C4622D] mb-2">
                Local Stories
              </p>
              <h2
                id="spotlight-heading"
                className="text-2xl text-[#1C1917]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Meet the Makers
              </h2>
            </div>
            <ArtistSpotlight spotlight={spotlight} />
          </section>
        )}
      </main>
    </div>
  )
}
