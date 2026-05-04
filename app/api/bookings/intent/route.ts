import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

interface BookingIntentBody {
  roomId: string
  checkIn: string
  checkOut: string
  guestName: string
  guestEmail: string
}

export async function POST(request: NextRequest) {
  let body: BookingIntentBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { roomId, checkIn, checkOut, guestName, guestEmail } = body

  if (!roomId || !checkIn || !checkOut || !guestName || !guestEmail) {
    return NextResponse.json(
      { error: 'Missing required fields: roomId, checkIn, checkOut, guestName, guestEmail.' },
      { status: 400 }
    )
  }

  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return NextResponse.json({ error: 'Invalid date format.' }, { status: 400 })
  }

  if (checkOutDate <= checkInDate) {
    return NextResponse.json(
      { error: 'Check-out must be after check-in.' },
      { status: 400 }
    )
  }

  try {
    const booking = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Check for conflicting confirmed bookings
      const conflict = await tx.booking.findFirst({
        where: {
          roomId,
          status: 'CONFIRMED',
          AND: [
            { checkIn: { lt: checkOutDate } },
            { checkOut: { gt: checkInDate } },
          ],
        },
      })

      if (conflict) {
        throw new Error('CONFLICT: Room is not available for the selected dates.')
      }

      // Verify room exists and is active
      const room = await tx.room.findFirst({
        where: { id: roomId, isActive: true },
      })

      if (!room) {
        throw new Error('NOT_FOUND: Room not found or is no longer available.')
      }

      // Calculate total price — KES 2500/night (stored as 250000 cents)
      const nights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      const totalPrice = nights * 250000

      const newBooking = await tx.booking.create({
        data: {
          roomId,
          guestName,
          guestEmail,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          status: 'PENDING',
          totalPrice,
        },
      })

      return newBooking
    })

    // Mock Stripe session (replace with real Stripe in production)
    const stripeSessionId = `mock_session_${booking.id}`
    const checkoutUrl = `/booking/confirmation?session=${stripeSessionId}&bookingId=${booking.reservationId}`

    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripeSessionId },
    })

    return NextResponse.json({
      bookingId: booking.reservationId,
      checkoutUrl,
      totalPrice: booking.totalPrice,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    if (message.startsWith('CONFLICT:')) {
      return NextResponse.json(
        { error: 'This room is not available for your selected dates. Please choose different dates.' },
        { status: 409 }
      )
    }

    if (message.startsWith('NOT_FOUND:')) {
      return NextResponse.json(
        { error: 'The selected room is no longer available.' },
        { status: 404 }
      )
    }

    console.error('[/api/bookings/intent] Error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
