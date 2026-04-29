'use client'

import dynamic from 'next/dynamic'
import type { Hotspot } from '@/types'

const VRTourViewer = dynamic(() => import('./VRTourViewer'), { ssr: false })

interface Props {
  imageUrl: string
  hotspots: Hotspot[]
  onHotspotClick?: (hotspot: Hotspot) => void
}

export default function ClientVRTourViewer(props: Props) {
  return <VRTourViewer {...props} />
}
