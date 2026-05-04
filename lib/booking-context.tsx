'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import type { BookingFlowState } from '@/types'

// ─── Actions ────────────────────────────────────────────────────────────────

type BookingAction =
  | { type: 'SET_ROOM'; roomId: string }
  | { type: 'SET_DATES'; checkIn: Date; checkOut: Date }
  | { type: 'SET_GUEST'; guestName: string; guestEmail: string }
  | { type: 'SET_PAYMENT_ERROR'; error: string | null }
  | { type: 'RESET' }

// ─── Initial state ───────────────────────────────────────────────────────────

const initialState: BookingFlowState = {
  roomId: null,
  checkIn: null,
  checkOut: null,
  guestName: '',
  guestEmail: '',
  totalPrice: 0,
  paymentError: null,
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function bookingReducer(state: BookingFlowState, action: BookingAction): BookingFlowState {
  switch (action.type) {
    case 'SET_ROOM':
      return { ...state, roomId: action.roomId }

    case 'SET_DATES':
      return { ...state, checkIn: action.checkIn, checkOut: action.checkOut }

    case 'SET_GUEST':
      return { ...state, guestName: action.guestName, guestEmail: action.guestEmail }

    case 'SET_PAYMENT_ERROR':
      return { ...state, paymentError: action.error }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface BookingContextValue {
  state: BookingFlowState
  dispatch: React.Dispatch<BookingAction>
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState)
  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within a BookingProvider')
  return ctx
}
