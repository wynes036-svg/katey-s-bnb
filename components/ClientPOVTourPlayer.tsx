'use client'

import dynamic from 'next/dynamic'

const POVTourPlayer = dynamic(() => import('./POVTourPlayer'), { ssr: false })

interface Props {
  videoUrl: string
  posterUrl?: string
  title?: string
}

export default function ClientPOVTourPlayer(props: Props) {
  return <POVTourPlayer {...props} />
}
