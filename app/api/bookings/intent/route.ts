import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

interface BookingIntentBody {
  roomId: string
  checkIn: string
  checkOut: string
  guestName: string
  guestEmail: string
  breakfastSelections: Array<{
    personIndex: number
    items: string[]
    restrictions: string[]
  }>
  experienceIds: string[]
}

export async function POST(request: NextRequest) {
  let body: BookingIntentBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { roomId, checkIn, checkOut, guestName, guestEmail, breakfastSelections, experienceIds } = body

  // Basic validation
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
    // Atomic availability check + booking creation
    const booking = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Check for conflicting confirmed bookings (SELECT FOR UPDATE semantics)
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

      // Verify experiences exist and are active
      let experiences: Array<{ id: string; price: number }> = []
      if (experienceIds && experienceIds.length > 0) {
        experiences = await tx.localExperience.findMany({
          where: { id: { in: experienceIds }, isActive: true },
          select: { id: true, price: true },
        })

        if (experiences.length !== experienceIds.length) {
          throw new Error(
            'UNAVAILABLE: One or more selected experiences are no longer available.'
          )
        }
      }

      // Calculate total price (£150/night placeholder + experiences)
      const nights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      const roomPrice = nights * 15000 // £150/night in pence
      const experiencesTotal = experiences.reduce((sum, e) => sum + e.price, 0)
      const totalPrice = roomPrice + experiencesTotal

      // Create pending booking
      const newBooking = await tx.booking.create({
        data: {
          roomId,
          guestName,
          guestEmail,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          status: 'PENDING',
          totalPrice,
          breakfastSelections: breakfastSelections ?? [],
          experiences: {
            create: experiences.map((e) => ({
              experienceId: e.id,
              price: e.price,
            })),
          },
        },
        include: {
          experiences: true,
        },
      })

      return newBooking
    })

    // Create Stripe Checkout Session (mock for now)
    const stripeSessionId = `mock_session_${booking.id}`
    const checkoutUrl = `/booking/confirmation?session=${stripeSessionId}&bookingId=${booking.reservationId}`

    // In production, you would:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    // const session = await stripe.checkout.sessions.create({ ... })
    // checkoutUrl = session.url

    // Update booking with stripe session ID
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
        {
          error:
            'This room is not available for your selected dates. Please choose different dates.',
        },
        { status: 409 }
      )
    }

    if (message.startsWith('NOT_FOUND:')) {
      return NextResponse.json(
        { error: 'The selected room is no longer available.' },
        { status: 404 }
      )
    }

    if (message.startsWith('UNAVAILABLE:')) {
      return NextResponse.json(
        {
          error:
            'One or more selected experiences are no longer available. Please review your selections.',
        },
        { status: 409 }
      )
    }

    console.error('[/api/bookings/intent] Error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
