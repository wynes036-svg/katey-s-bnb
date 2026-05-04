import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Stripe webhook handler
// In production, this verifies the Stripe signature and processes events.
// For now, it handles mock events and logs confirmation emails.

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  // In production:
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  // const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)

  let event: { type: string; data: { object: Record<string, unknown> } }

  try {
    event = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  // Handle mock/real checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as {
      id?: string
      metadata?: { bookingId?: string }
      customer_email?: string
    }

    const stripeSessionId = session.id
    const bookingId = session.metadata?.bookingId

    try {
      // Find the booking by stripe session ID or reservation ID
      const booking = await prisma.booking.findFirst({
        where: {
          OR: [
            stripeSessionId ? { stripeSessionId } : {},
            bookingId ? { reservationId: bookingId } : {},
          ].filter((w) => Object.keys(w).length > 0),
        },
        include: {
          room: true,
        },
      })

      if (!booking) {
        console.error('[stripe webhook] Booking not found for session:', stripeSessionId)
        return NextResponse.json({ received: true })
      }

      // Confirm the booking
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'CONFIRMED' },
      })

      // Generate welcome packet (mock URL)
      const welcomePacketUrl = `/api/bookings/${booking.reservationId}/welcome-packet`
      await prisma.booking.update({
        where: { id: booking.id },
        data: { welcomePacketUrl },
      })

      // Send confirmation email (mock — log to console)
      console.log('[Resend] Sending confirmation email to:', booking.guestEmail)
      console.log('[Resend] Booking details:', {
        reservationId: booking.reservationId,
        room: booking.room.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        totalPrice: booking.totalPrice,
        welcomePacketUrl,
      })

      // In production:
      // const resend = new Resend(process.env.RESEND_API_KEY)
      // await resend.emails.send({
      //   from: 'Katey\'s BNB <hello@kateys-bnb.com>',
      //   to: booking.guestEmail,
      //   subject: `Booking Confirmed — ${booking.room.name}`,
      //   html: generateConfirmationEmail(booking, welcomePacketUrl),
      // })

      return NextResponse.json({ received: true, status: 'confirmed' })
    } catch (error) {
      console.error('[stripe webhook] Error confirming booking:', error)
      return NextResponse.json(
        { error: 'Failed to process booking confirmation.' },
        { status: 500 }
      )
    }
  }

  // Acknowledge other event types
  return NextResponse.json({ received: true })
}
