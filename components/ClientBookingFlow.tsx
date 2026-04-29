'use client'

import dynamic from 'next/dynamic'
import type { Room } from '@/types'

const BookingFlow = dynamic(() => import('./BookingFlow'), { ssr: false })

interface Props {
  room?: Room
  initialRoomId?: string
}

export default function ClientBookingFlow(props: Props) {
  return <BookingFlow {...props} />
}
