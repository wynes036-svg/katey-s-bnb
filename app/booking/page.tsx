import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import ClientBookingFlow from '@/components/ClientBookingFlow'
import type { Room } from '@/types'

// ─── Mock room ────────────────────────────────────────────────────────────────

const MOCK_ROOM: Room = {
  id: 'the-sanctuary',
  name: "Katelyn's Sanctuary",
  description: 'Our beautifully curated room transforms to match your chosen mood - from cozy and intimate to wild and adventurous.',
  vrImageUrl: '',
  povVideoUrl: '',
  photos: [],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

async function getRoom(): Promise<Room> {
  try {
    const room = await prisma.room.findFirst({
      where: { isActive: true },
      include: { photos: { include: { hotspots: true } } },
    })
    return (room as unknown as Room) ?? MOCK_ROOM
  } catch {
    return MOCK_ROOM
  }
}

interface BookingPageProps {
  searchParams: Promise<{ mood?: string }>
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { mood } = await searchParams
  const room = await getRoom()

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Navigation */}
      <nav className="border-b border-[#E2DDD6] bg-white px-4 py-4 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#6B6860] hover:text-[#B85C2A] transition-colors no-underline"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            Back
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-xl text-[#1A1A18] no-underline"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            <Image src="/logo.png" alt="Katye's BnB logo" width={32} height={32} className="object-contain" />
            Katye&apos;s BnB
          </Link>
          <div className="text-xs text-[#6B6860] hidden sm:block">🔒 Secure booking</div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <p className="section-label mb-3">Booking</p>
          <div className="divider mb-5" />
          <h1
            className="text-3xl sm:text-4xl text-[#1A1A18] mb-3"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Reserve Your Stay
          </h1>
          <p className="text-[#6B6860] max-w-md mx-auto text-sm">
            Complete the steps below to secure your booking at Katye&apos;s BnB.
          </p>
        </div>

        {/* Room card */}
        <div className="max-w-xl mx-auto mb-8 rounded-2xl border border-[#E2DDD6] bg-white p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F5EDE6] flex items-center justify-center text-2xl flex-shrink-0">🏡</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#1A1A18]">{room.name}</p>
            <p className="text-sm text-[#6B6860] truncate">{room.description}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-[#B85C2A]">KES 2,500</p>
            <p className="text-xs text-[#6B6860]">per night</p>
          </div>
        </div>

        {/* Booking flow wizard */}
        <Suspense fallback={<div className="h-64 rounded-2xl bg-[#EFEFEB] animate-pulse" />}>
          <ClientBookingFlow room={room} initialRoomId={room.id} />
        </Suspense>
      </main>
    </div>
  )
}
