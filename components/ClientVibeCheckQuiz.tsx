'use client'

import dynamic from 'next/dynamic'
import type { Room } from '@/types'

const VibeCheckQuiz = dynamic(() => import('./VibeCheckQuiz'), { ssr: false })

export default function ClientVibeCheckQuiz({ rooms }: { rooms: Room[] }) {
  return <VibeCheckQuiz rooms={rooms} />
}
