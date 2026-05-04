'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookingProvider, useBooking } from '@/lib/booking-context'
import type { Room } from '@/types'

// ─── Step definitions ────────────────────────────────────────────────────────

const STEPS = [
  { id: 'dates', label: 'Dates' },
  { id: 'guests', label: 'Guests' },
  { id: 'kitchen', label: 'Kitchen Info' },
  { id: 'review', label: 'Review' },
  { id: 'payment', label: 'Payment' },
] as const

type StepId = (typeof STEPS)[number]['id']

// ─── Step: Dates ─────────────────────────────────────────────────────────────

function DatesStep({ onNext }: { onNext: () => void }) {
  const { state, dispatch } = useBooking()
  const [checkIn, setCheckIn] = useState(
    state.checkIn ? state.checkIn.toISOString().split('T')[0] : ''
  )
  const [checkOut, setCheckOut] = useState(
    state.checkOut ? state.checkOut.toISOString().split('T')[0] : ''
  )
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  function handleNext() {
    if (!checkIn || !checkOut) {
      setError('Please select both check-in and check-out dates.')
      return
    }
    const inDate = new Date(checkIn)
    const outDate = new Date(checkOut)
    if (outDate <= inDate) {
      setError('Check-out must be after check-in.')
      return
    }
    dispatch({ type: 'SET_DATES', checkIn: inDate, checkOut: outDate })
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-2xl text-[#1C1917] mb-2"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Choose Your Dates
        </h2>
        <p className="text-[#78716C] text-sm">When would you like to stay?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="check-in"
            className="block text-sm font-medium text-[#1C1917] mb-1.5"
          >
            Check-in
          </label>
          <input
            id="check-in"
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => {
              setCheckIn(e.target.value)
              setError('')
            }}
            className="w-full rounded-lg border border-[#D6D0C8] px-3 py-2.5 text-sm text-[#1C1917] focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]"
          />
        </div>
        <div>
          <label
            htmlFor="check-out"
            className="block text-sm font-medium text-[#1C1917] mb-1.5"
          >
            Check-out
          </label>
          <input
            id="check-out"
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => {
              setCheckOut(e.target.value)
              setError('')
            }}
            className="w-full rounded-lg border border-[#D6D0C8] px-3 py-2.5 text-sm text-[#1C1917] focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        onClick={handleNext}
        className="w-full rounded-xl bg-[#C4622D] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#A8521F] focus:outline-none focus:ring-2 focus:ring-[#C4622D] focus:ring-offset-2"
      >
        Continue
      </button>
    </div>
  )
}

// ─── Step: Guests ─────────────────────────────────────────────────────────────

function GuestsStep({
  onNext,
  onBack,
  guestCount,
  setGuestCount,
}: {
  onNext: () => void
  onBack: () => void
  guestCount: number
  setGuestCount: (n: number) => void
}) {
  const { state, dispatch } = useBooking()
  const [name, setName] = useState(state.guestName)
  const [email, setEmail] = useState(state.guestEmail)
  const [error, setError] = useState('')

  function handleNext() {
    if (!name.trim() || !email.trim()) {
      setError('Please enter your name and email.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    dispatch({ type: 'SET_GUEST', guestName: name.trim(), guestEmail: email.trim() })
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-2xl text-[#1C1917] mb-2"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Your Details
        </h2>
        <p className="text-[#78716C] text-sm">
          We&apos;ll use these to confirm your booking.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="guest-name" className="block text-sm font-medium text-[#1C1917] mb-1.5">
            Full name
          </label>
          <input
            id="guest-name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError('') }}
            placeholder="Jane Smith"
            className="w-full rounded-lg border border-[#D6D0C8] px-3 py-2.5 text-sm text-[#1C1917] placeholder-[#78716C] focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]"
          />
        </div>
        <div>
          <label htmlFor="guest-email" className="block text-sm font-medium text-[#1C1917] mb-1.5">
            Email address
          </label>
          <input
            id="guest-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }}
            placeholder="jane@example.com"
            className="w-full rounded-lg border border-[#D6D0C8] px-3 py-2.5 text-sm text-[#1C1917] placeholder-[#78716C] focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]"
          />
        </div>
        <div>
          <label htmlFor="guest-count" className="block text-sm font-medium text-[#1C1917] mb-1.5">
            Number of guests
          </label>
          <select
            id="guest-count"
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            className="w-full rounded-lg border border-[#D6D0C8] px-3 py-2.5 text-sm text-[#1C1917] focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 rounded-xl border border-[#D6D0C8] px-6 py-3.5 text-sm font-medium text-[#78716C] transition-colors hover:bg-[#E8E4DF] focus:outline-none focus:ring-2 focus:ring-[#C4622D]"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="flex-1 rounded-xl bg-[#C4622D] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#A8521F] focus:outline-none focus:ring-2 focus:ring-[#C4622D] focus:ring-offset-2"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// ─── Step: Kitchen Info ─────────────────────────────────────────────────────────

function KitchenStep({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2
          className="text-2xl text-[#1C1917] mb-4"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Self-Catering Kitchen
        </h2>
        <p className="text-[#78716C]">
          Your room includes a fully equipped kitchen for your convenience. Please bring your own food and beverages, or we can arrange restaurant delivery from local establishments.
        </p>
      </div>

      <div className="bg-[#F5F0EB] rounded-xl p-6">
        <h3 className="font-semibold text-[#1C1917] mb-4">Kitchen Appliances & Amenities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-[#1C1917]">Cooking</h4>
            <ul className="text-sm text-[#78716C] space-y-1">
              <li>• Full-size refrigerator & freezer</li>
              <li>• Electric stovetop & oven</li>
              <li>• Microwave</li>
              <li>• Toaster</li>
              <li>• Electric kettle</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-[#1C1917]">Essentials</h4>
            <ul className="text-sm text-[#78716C] space-y-1">
              <li>• Cookware & utensils</li>
              <li>• Plates, bowls & glasses</li>
              <li>• Basic seasonings & oils</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#FEF7ED] border border-[#C4622D]/20 rounded-xl p-6">
        <h3 className="font-semibold text-[#C4622D] mb-2">Please Note</h3>
        <p className="text-[#78716C] text-sm mb-3">
          We provide all kitchen appliances and cookware, but guests are responsible for bringing their own food, 
          beverages, and any special dietary items. Local grocery stores and markets are within easy reach.
        </p>
        <div className="bg-white/50 rounded-lg p-4 mt-4">
          <h4 className="font-medium text-[#1C1917] mb-2">🍽️ Restaurant Delivery Available</h4>
          <p className="text-[#78716C] text-sm">
            Prefer not to cook? We can arrange restaurant delivery services from local establishments. 
            Ask us for recommendations and delivery options during your stay.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 rounded-xl border border-[#D6D0C8] px-6 py-3.5 text-sm font-medium text-[#78716C] transition-colors hover:bg-[#E8E4DF] focus:outline-none focus:ring-2 focus:ring-[#C4622D]"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 rounded-xl bg-[#C4622D] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#A8521F] focus:outline-none focus:ring-2 focus:ring-[#C4622D] focus:ring-offset-2"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// ─── Step: Review ─────────────────────────────────────────────────────────────

function ReviewStep({
  onNext,
  onBack,
  room,
}: {
  onNext: () => void
  onBack: () => void
  room?: Room
}) {
  const { state } = useBooking()

  function formatDate(d: Date | null) {
    if (!d) return '—'
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  function formatPrice(cents: number) {
    return `KES ${(cents / 100).toFixed(0)}`
  }

  const nights =
    state.checkIn && state.checkOut
      ? Math.ceil(
          (state.checkOut.getTime() - state.checkIn.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0

  const roomPrice = room ? nights * 250000 : 0 // KES 2500/night (stored in cents)
  const total = roomPrice

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-2xl text-[#1C1917] mb-2"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Review Your Stay
        </h2>
        <p className="text-[#78716C] text-sm">
          Please check everything looks right before payment.
        </p>
      </div>

      <div className="rounded-2xl border border-[#D6D0C8] bg-white divide-y divide-[#E8E4DF]">
        {/* Room */}
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#78716C] mb-1">
            Room
          </p>
          <p className="font-semibold text-[#1C1917]">{room?.name ?? 'Selected room'}</p>
          <p className="text-sm text-[#78716C]">{room?.description}</p>
        </div>

        {/* Dates */}
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#78716C] mb-1">
            Dates
          </p>
          <p className="text-sm text-[#1C1917]">
            {formatDate(state.checkIn)} → {formatDate(state.checkOut)}
          </p>
          <p className="text-sm text-[#78716C]">{nights} night{nights !== 1 ? 's' : ''}</p>
        </div>

        {/* Guest */}
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#78716C] mb-1">
            Guest
          </p>
          <p className="text-sm text-[#1C1917]">{state.guestName}</p>
          <p className="text-sm text-[#78716C]">{state.guestEmail}</p>
        </div>

        {/* Kitchen Info */}
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#78716C] mb-2">
            Kitchen & Dining Options
          </p>
          <p className="text-sm text-[#1C1917] mb-1">
            Fully equipped kitchen available for self-catering
          </p>
          <p className="text-sm text-[#78716C]">
            Restaurant delivery services can be arranged
          </p>
        </div>



        {/* Location */}
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#78716C] mb-2">
            Location
          </p>
          <div className="flex items-start gap-2">
            <span className="text-base mt-0.5">📍</span>
            <div>
              <p className="text-sm text-[#1C1917] font-medium">Racecourse Gardens, Ngong Road</p>
              <p className="text-sm text-[#78716C]">Block J, 3rd Floor — Door 14</p>
              <a
                href="https://maps.google.com/?q=Racecourse+Gardens+Ngong+Road+Nairobi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#C4622D] hover:underline mt-1 inline-block"
              >
                View on Google Maps →
              </a>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#78716C] mb-2">
            Contact
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#C4622D]/10 flex items-center justify-center text-[#C4622D]">
              👤
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1C1917]">Owner</p>
              <a
                href="tel:0714122129"
                className="text-sm text-[#C4622D] hover:underline font-medium"
              >
                0714122129
              </a>
            </div>
          </div>
          <p className="text-xs text-[#78716C] mt-2">
            Have questions? Reach out to the owner directly before completing your booking.
          </p>
        </div>

        {/* Total */}
        <div className="p-5 bg-[#FAF8F5]">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-[#1C1917]">Total</p>
            <p className="text-lg font-bold text-[#C4622D]">{formatPrice(total)}</p>
          </div>
          <p className="text-xs text-[#78716C] mt-1">Includes all taxes and fees</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 rounded-xl border border-[#D6D0C8] px-6 py-3.5 text-sm font-medium text-[#78716C] transition-colors hover:bg-[#E8E4DF] focus:outline-none focus:ring-2 focus:ring-[#C4622D]"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 rounded-xl bg-[#C4622D] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#A8521F] focus:outline-none focus:ring-2 focus:ring-[#C4622D] focus:ring-offset-2"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  )
}

// ─── Step: Payment ────────────────────────────────────────────────────────────

function PaymentStep({
  onBack,
  room,
}: {
  onBack: () => void
  room?: Room
}) {
  const { state, dispatch } = useBooking()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'stripe' | 'mpesa' | 'paypal'>('stripe')

  async function handlePayment() {
    if (!state.roomId || !state.checkIn || !state.checkOut) return

    setLoading(true)
    dispatch({ type: 'SET_PAYMENT_ERROR', error: null })

    try {
      if (selectedPaymentMethod === 'mpesa') {
        // Handle M-Pesa payment
        dispatch({
          type: 'SET_PAYMENT_ERROR',
          error: null,
        })
        // For now, show M-Pesa instructions
        alert(`M-Pesa Payment Instructions:\n\n1. Go to M-Pesa on your phone\n2. Select "Send Money"\n3. Enter Phone Number: 0714122129\n4. Enter Amount: KES ${(state.totalPrice / 100).toFixed(0)}\n5. Enter your M-Pesa PIN\n6. Send reference: ${state.guestName.replace(/\s+/g, '').toUpperCase()}\n\nAfter payment, we'll confirm your booking via email.`)
        return
      }

      if (selectedPaymentMethod === 'paypal') {
        // Handle PayPal payment - redirect to PayPal
        const paypalUrl = `https://www.paypal.com/paypalme/katyesbnb/${(state.totalPrice / 100 / 130).toFixed(2)}`
        window.open(paypalUrl, '_blank')
        alert('After completing PayPal payment, we will confirm your booking via email.')
        return
      }

      // Default Stripe payment
      const res = await fetch('/api/bookings/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: state.roomId,
          checkIn: state.checkIn.toISOString(),
          checkOut: state.checkOut.toISOString(),
          guestName: state.guestName,
          guestEmail: state.guestEmail,
          paymentMethod: selectedPaymentMethod,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        dispatch({
          type: 'SET_PAYMENT_ERROR',
          error: data.error ?? 'Payment failed. Please try again.',
        })
        return
      }

      // Redirect to Stripe checkout
      if (data.checkoutUrl) {
        router.push(data.checkoutUrl)
      }
    } catch {
      dispatch({
        type: 'SET_PAYMENT_ERROR',
        error: 'An unexpected error occurred. Your selections have been preserved.',
      })
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (cents: number) => `KES ${(cents / 100).toFixed(0)}` // Display KES without decimals
  const formatPayPalPrice = (cents: number) => `$${(cents / 100 / 130).toFixed(2)}` // Convert KES to USD for PayPal

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-2xl text-[#1C1917] mb-2"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Choose Payment Method
        </h2>
        <p className="text-[#78716C] text-sm">
          Select your preferred payment method to complete your booking.
        </p>
      </div>

      {/* Payment error */}
      {state.paymentError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <strong>Payment issue:</strong> {state.paymentError}
        </div>
      )}

      {/* Payment Methods */}
      <div className="space-y-3">
        {/* Stripe/Card Payment */}
        <label className={`block rounded-xl border-2 p-4 cursor-pointer transition-all ${
          selectedPaymentMethod === 'stripe' 
            ? 'border-[#C4622D] bg-[#C4622D]/5' 
            : 'border-[#D6D0C8] hover:border-[#C4622D]/50'
        }`}>
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value="stripe"
              checked={selectedPaymentMethod === 'stripe'}
              onChange={(e) => setSelectedPaymentMethod(e.target.value as 'stripe')}
              className="w-4 h-4 text-[#C4622D] border-[#D6D0C8] focus:ring-[#C4622D]"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-[#1C1917]">Credit/Debit Card</span>
                <span className="text-xs bg-[#C4622D] text-white px-2 py-0.5 rounded">Secure</span>
              </div>
              <p className="text-sm text-[#78716C]">Pay securely with Visa, Mastercard, or other cards via Stripe</p>
              <p className="text-sm font-medium text-[#C4622D] mt-1">{formatPrice(state.totalPrice)}</p>
            </div>
            <div className="text-2xl">💳</div>
          </div>
        </label>

        {/* M-Pesa Payment */}
        <label className={`block rounded-xl border-2 p-4 cursor-pointer transition-all ${
          selectedPaymentMethod === 'mpesa' 
            ? 'border-[#C4622D] bg-[#C4622D]/5' 
            : 'border-[#D6D0C8] hover:border-[#C4622D]/50'
        }`}>
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value="mpesa"
              checked={selectedPaymentMethod === 'mpesa'}
              onChange={(e) => setSelectedPaymentMethod(e.target.value as 'mpesa')}
              className="w-4 h-4 text-[#C4622D] border-[#D6D0C8] focus:ring-[#C4622D]"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-[#1C1917]">M-Pesa</span>
                <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">Mobile Money</span>
              </div>
              <p className="text-sm text-[#78716C]">Send money via M-Pesa to: <strong>0714122129</strong></p>
              <p className="text-sm font-medium text-green-600 mt-1">{formatPrice(state.totalPrice)}</p>
            </div>
            <div className="text-2xl">📱</div>
          </div>
        </label>

        {/* PayPal Payment */}
        <label className={`block rounded-xl border-2 p-4 cursor-pointer transition-all ${
          selectedPaymentMethod === 'paypal' 
            ? 'border-[#C4622D] bg-[#C4622D]/5' 
            : 'border-[#D6D0C8] hover:border-[#C4622D]/50'
        }`}>
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={selectedPaymentMethod === 'paypal'}
              onChange={(e) => setSelectedPaymentMethod(e.target.value as 'paypal')}
              className="w-4 h-4 text-[#C4622D] border-[#D6D0C8] focus:ring-[#C4622D]"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-[#1C1917]">PayPal</span>
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">Digital Wallet</span>
              </div>
              <p className="text-sm text-[#78716C]">Pay securely with your PayPal account or linked cards</p>
              <p className="text-sm font-medium text-blue-600 mt-1">{formatPayPalPrice(state.totalPrice)}</p>
            </div>
            <div className="text-2xl">🅿️</div>
          </div>
        </label>
      </div>

      {/* M-Pesa Instructions */}
      {selectedPaymentMethod === 'mpesa' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <h3 className="font-medium text-green-800 mb-2">M-Pesa Payment Instructions</h3>
          <ol className="text-sm text-green-700 space-y-1">
            <li>1. Go to M-Pesa on your phone</li>
            <li>2. Select <strong>"Send Money"</strong></li>
            <li>3. Enter Phone Number: <strong>0714122129</strong></li>
            <li>4. Enter Amount: <strong>{formatPrice(state.totalPrice)}</strong></li>
            <li>5. Enter your M-Pesa PIN to send</li>
            <li>6. Reference: <strong>{state.guestName.replace(/\s+/g, '').toUpperCase()}</strong></li>
          </ol>
          <p className="text-xs text-green-600 mt-2">💡 After payment, we'll confirm your booking via email</p>
        </div>
      )}

      {/* Summary */}
      <div className="rounded-xl border border-[#D6D0C8] bg-[#FAF8F5] p-5">
        <p className="text-sm text-[#78716C] mb-1">Booking for</p>
        <p className="font-semibold text-[#1C1917]">{state.guestName}</p>
        <p className="text-sm text-[#78716C]">{room?.name}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 rounded-xl border border-[#D6D0C8] px-6 py-3.5 text-sm font-medium text-[#78716C] transition-colors hover:bg-[#E8E4DF] focus:outline-none focus:ring-2 focus:ring-[#C4622D] disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="flex-1 rounded-xl bg-[#C4622D] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#A8521F] focus:outline-none focus:ring-2 focus:ring-[#C4622D] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing…' : selectedPaymentMethod === 'mpesa' ? 'Get M-Pesa Instructions' : selectedPaymentMethod === 'paypal' ? 'Pay with PayPal' : 'Pay with Card'}
        </button>
      </div>

      <p className="text-xs text-center text-[#78716C]">
        🔒 All payments are secure and encrypted
      </p>
    </div>
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function StepProgress({
  steps,
  currentIndex,
}: {
  steps: typeof STEPS
  currentIndex: number
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-colors ${
                i < currentIndex
                  ? 'bg-[#C4622D] text-white'
                  : i === currentIndex
                  ? 'bg-[#C4622D] text-white ring-2 ring-[#C4622D] ring-offset-2'
                  : 'bg-[#E8E4DF] text-[#78716C]'
              }`}
              aria-current={i === currentIndex ? 'step' : undefined}
            >
              {i < currentIndex ? '✓' : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-8 sm:w-12 mx-1 transition-colors ${
                  i < currentIndex ? 'bg-[#C4622D]' : 'bg-[#E8E4DF]'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-[#78716C] text-center">
        Step {currentIndex + 1} of {steps.length}: {steps[currentIndex].label}
      </p>
    </div>
  )
}

// ─── Main BookingFlow component ───────────────────────────────────────────────

interface BookingFlowProps {
  room?: Room
  initialRoomId?: string
}

function BookingFlowInner({ room }: { room?: Room }) {
  const { dispatch } = useBooking()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [guestCount, setGuestCount] = useState(1)

  // Set room in context on mount
  useState(() => {
    if (room) {
      dispatch({ type: 'SET_ROOM', roomId: room.id })
    }
  })

  const currentStep = STEPS[currentStepIndex]

  function goNext() {
    setCurrentStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
  }

  function goBack() {
    setCurrentStepIndex((i) => Math.max(i - 1, 0))
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <StepProgress steps={STEPS} currentIndex={currentStepIndex} />

      <div className="rounded-2xl border border-[#D6D0C8] bg-white p-6 sm:p-8 shadow-sm">
        {currentStep.id === 'dates' && <DatesStep onNext={goNext} />}
        {currentStep.id === 'guests' && (
          <GuestsStep
            onNext={goNext}
            onBack={goBack}
            guestCount={guestCount}
            setGuestCount={setGuestCount}
          />
        )}
        {currentStep.id === 'kitchen' && (
          <KitchenStep onNext={goNext} onBack={goBack} />
        )}
        {currentStep.id === 'review' && (
          <ReviewStep onNext={goNext} onBack={goBack} room={room} />
        )}
        {currentStep.id === 'payment' && (
          <PaymentStep onBack={goBack} room={room} />
        )}
      </div>
    </div>
  )
}

export default function BookingFlow({ room, initialRoomId }: BookingFlowProps) {
  return (
    <BookingProvider>
      <BookingFlowInner room={room} />
    </BookingProvider>
  )
}
