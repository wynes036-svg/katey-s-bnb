'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookingProvider, useBooking } from '@/lib/booking-context'
import BreakfastPlanner from './BreakfastPlanner'
import LocalExperienceSelector from './LocalExperienceSelector'
import type { Room, LocalExperience } from '@/types'

// ─── Step definitions ────────────────────────────────────────────────────────

const STEPS = [
  { id: 'dates', label: 'Dates' },
  { id: 'guests', label: 'Guests' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'experiences', label: 'Experiences' },
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

// ─── Step: Breakfast ─────────────────────────────────────────────────────────

function BreakfastStep({
  onNext,
  onBack,
  guestCount,
}: {
  onNext: () => void
  onBack: () => void
  guestCount: number
}) {
  const { state, dispatch } = useBooking()

  return (
    <div className="space-y-6">
      <BreakfastPlanner
        guestCount={guestCount}
        selections={state.breakfastSelections}
        onChange={(selections) => dispatch({ type: 'SET_BREAKFAST', selections })}
      />

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

// ─── Step: Experiences ────────────────────────────────────────────────────────

function ExperiencesStep({
  onNext,
  onBack,
  room,
}: {
  onNext: () => void
  onBack: () => void
  room?: Room
}) {
  const { state, dispatch } = useBooking()

  function handleAdd(experience: LocalExperience) {
    dispatch({ type: 'ADD_EXPERIENCE', experience })
  }

  function handleRemove(experienceId: string) {
    dispatch({ type: 'REMOVE_EXPERIENCE', experienceId })
  }

  return (
    <div className="space-y-6">
      <LocalExperienceSelector
        moodId={room?.moodId}
        checkIn={state.checkIn}
        checkOut={state.checkOut}
        selectedExperiences={state.selectedExperiences}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />

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

  function formatPrice(pence: number) {
    return `£${(pence / 100).toFixed(2)}`
  }

  const nights =
    state.checkIn && state.checkOut
      ? Math.ceil(
          (state.checkOut.getTime() - state.checkIn.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0

  const roomPrice = room ? nights * 15000 : 0 // £150/night placeholder
  const experiencesTotal = state.selectedExperiences.reduce((sum, e) => sum + e.price, 0)
  const total = roomPrice + experiencesTotal

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

        {/* Breakfast */}
        {state.breakfastSelections.length > 0 && (
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#78716C] mb-2">
              Breakfast
            </p>
            {state.breakfastSelections.map((sel) => (
              <div key={sel.personIndex} className="text-sm text-[#1C1917] mb-1">
                <span className="font-medium">
                  {state.breakfastSelections.length > 1
                    ? `Guest ${sel.personIndex + 1}: `
                    : ''}
                </span>
                {sel.items.length > 0 ? sel.items.join(', ') : 'No items selected'}
                {sel.restrictions.length > 0 && (
                  <span className="text-[#78716C]"> · {sel.restrictions.join(', ')}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Experiences */}
        {state.selectedExperiences.length > 0 && (
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#78716C] mb-2">
              Experiences
            </p>
            {state.selectedExperiences.map((exp) => (
              <div key={exp.id} className="flex justify-between text-sm text-[#1C1917] mb-1">
                <span>{exp.title}</span>
                <span className="text-[#C4622D]">{formatPrice(exp.price)}</span>
              </div>
            ))}
          </div>
        )}

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

  async function handlePayment() {
    if (!state.roomId || !state.checkIn || !state.checkOut) return

    setLoading(true)
    dispatch({ type: 'SET_PAYMENT_ERROR', error: null })

    try {
      const res = await fetch('/api/bookings/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: state.roomId,
          checkIn: state.checkIn.toISOString(),
          checkOut: state.checkOut.toISOString(),
          guestName: state.guestName,
          guestEmail: state.guestEmail,
          breakfastSelections: state.breakfastSelections,
          experienceIds: state.selectedExperiences.map((e) => e.id),
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

      // Redirect to Stripe checkout (or mock URL)
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

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-2xl text-[#1C1917] mb-2"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Secure Payment
        </h2>
        <p className="text-[#78716C] text-sm">
          You&apos;ll be redirected to our secure payment provider to complete your booking.
        </p>
      </div>

      {/* Payment error — preserved selections */}
      {state.paymentError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <strong>Payment issue:</strong> {state.paymentError}
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
          {loading ? 'Processing…' : 'Pay Now'}
        </button>
      </div>

      <p className="text-xs text-center text-[#78716C]">
        🔒 Payments are processed securely via Stripe
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
        {currentStep.id === 'breakfast' && (
          <BreakfastStep onNext={goNext} onBack={goBack} guestCount={guestCount} />
        )}
        {currentStep.id === 'experiences' && (
          <ExperiencesStep onNext={goNext} onBack={goBack} room={room} />
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
