import Link from 'next/link'
import { prisma } from '@/lib/prisma'

interface ConfirmationPageProps {
  searchParams: Promise<{ bookingId?: string; session?: string }>
}

async function getBooking(reservationId: string) {
  try {
    return await prisma.booking.findUnique({
      where: { reservationId },
      include: {
        room: { include: { mood: true } },
        experiences: { include: { experience: true } },
      },
    })
  } catch {
    return null
  }
}

export default async function BookingConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { bookingId } = await searchParams
  const booking = bookingId ? await getBooking(bookingId) : null

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-[#D6D0C8] bg-white px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-center">
          <Link
            href="/"
            className="text-lg font-semibold text-[#1C1917]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Katey&apos;s BNB
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg text-center">
          {/* Success icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg className="h-10 w-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1
            className="text-3xl text-[#1C1917] mb-3"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Booking Confirmed!
          </h1>

          {booking ? (
            <>
              <p className="text-[#78716C] mb-8">
                Thank you, {booking.guestName}. Your stay at{' '}
                <strong className="text-[#1C1917]">{booking.room.name}</strong> is confirmed.
                A confirmation email has been sent to{' '}
                <strong className="text-[#1C1917]">{booking.guestEmail}</strong>.
              </p>

              <div className="rounded-2xl border border-[#D6D0C8] bg-white p-6 text-left mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#78716C]">Reservation ID</span>
                    <span className="font-mono font-medium text-[#1C1917]">
                      {booking.reservationId.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#78716C]">Room</span>
                    <span className="font-medium text-[#1C1917]">{booking.room.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#78716C]">Check-in</span>
                    <span className="font-medium text-[#1C1917]">
                      {new Date(booking.checkIn).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#78716C]">Check-out</span>
                    <span className="font-medium text-[#1C1917]">
                      {new Date(booking.checkOut).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-[#E8E4DF] pt-3">
                    <span className="font-semibold text-[#1C1917]">Total</span>
                    <span className="font-bold text-[#C4622D]">
                      £{(booking.totalPrice / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {booking.welcomePacketUrl && (
                <a
                  href={booking.welcomePacketUrl}
                  className="mb-4 inline-flex items-center gap-2 rounded-xl border border-[#C4622D] px-6 py-3 text-sm font-semibold text-[#C4622D] transition-colors hover:bg-[#C4622D] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#C4622D]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                  </svg>
                  Download Welcome Packet
                </a>
              )}
            </>
          ) : (
            <p className="text-[#78716C] mb-8">
              Your booking has been received. A confirmation email will be sent to you shortly.
            </p>
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#C4622D] px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#A8521F] focus:outline-none focus:ring-2 focus:ring-[#C4622D] focus:ring-offset-2"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}
