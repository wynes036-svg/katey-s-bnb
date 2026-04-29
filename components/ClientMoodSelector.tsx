'use client'

import dynamic from 'next/dynamic'
import type { Mood } from '@/types'

const MoodSelector = dynamic(() => import('./MoodSelector'), { ssr: false })

export default function ClientMoodSelector({ moods }: { moods: Mood[] }) {
  return <MoodSelector moods={moods} />
}
