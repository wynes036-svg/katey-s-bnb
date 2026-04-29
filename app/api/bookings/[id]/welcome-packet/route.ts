import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateWelcomePacket } from '@/lib/welcome-packet'

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
      include: { room: true },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 })
    }

    if (booking.status !== 'CONFIRMED') {
      return NextResponse.json(
        { error: 'Welcome packet is only available for confirmed bookings.' },
        { status: 403 }
      )
    }

    const pdfBuffer = await generateWelcomePacket({
      guestName: booking.guestName,
      roomName: booking.room.name,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      reservationId: booking.reservationId,
    })

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="welcome-packet-${booking.reservationId}.pdf"`,
        'Content-Length': String(pdfBuffer.length),
      },
    })
  } catch (error) {
    console.error('[/api/bookings/[id]/welcome-packet] Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate welcome packet.' },
      { status: 500 }
    )
  }
}
