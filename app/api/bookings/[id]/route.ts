import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'Booking ID is required.' }, { status: 400 })
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { reservationId: id },
      include: {
        room: true,
        experiences: {
          include: { experience: true },
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('[/api/bookings/[id]] Error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve booking.' },
      { status: 500 }
    )
  }
}
