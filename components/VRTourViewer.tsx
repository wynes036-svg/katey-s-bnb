'use client'

import { useEffect, useRef, useState } from 'react'
import type { Hotspot } from '@/types'

// react-pannellum is a WebGL-based 360° panorama viewer
// It must only be imported on the client side (no SSR)
// Consumers should lazy-load this component via next/dynamic with ssr: false
import ReactPannellum from 'react-pannellum'

interface HotspotOverlayProps {
  hotspot: Hotspot
  onClose: () => void
}

function HotspotOverlay({ hotspot, onClose }: HotspotOverlayProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hotspot-overlay-title"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label="Close"
        >
          <span aria-hidden="true" className="text-gray-600 text-lg leading-none">
            ×
          </span>
        </button>

        <h2
          id="hotspot-overlay-title"
          className="text-xl font-semibold text-gray-900 mb-3 pr-8"
        >
          {hotspot.title}
        </h2>

        <p className="text-gray-700 leading-relaxed">{hotspot.description}</p>
      </div>
    </div>
  )
}

interface VRTourViewerProps {
  imageUrl: string
  hotspots: Hotspot[]
  onHotspotClick?: (hotspot: Hotspot) => void
}

export default function VRTourViewer({
  imageUrl,
  hotspots,
  onHotspotClick,
}: VRTourViewerProps) {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null)
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Detect WebGL support on mount
    const supported = typeof window !== 'undefined' && !!window.WebGLRenderingContext
    setWebGLSupported(supported)
  }, [])

  const handleHotspotClick = (hotspot: Hotspot) => {
    setActiveHotspot(hotspot)
    onHotspotClick?.(hotspot)
  }

  const handleOverlayClose = () => {
    setActiveHotspot(null)
  }

  // Map our Hotspot type to Pannellum's hotspot format
  const pannellumHotspots = hotspots.map((h) => ({
    pitch: h.pitch,
    yaw: h.yaw,
    type: 'info' as const,
    text: h.title,
    handleClick: () => handleHotspotClick(h),
  }))

  const pannellumConfig = {
    autoLoad: true,
    showControls: true,
    mouseZoom: true,
    compass: false,
    hotSpots: pannellumHotspots,
  }

  // While detecting WebGL, render nothing to avoid flash
  if (webGLSupported === null) {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-xl animate-pulse" />
    )
  }

  // WebGL fallback: static image gallery
  if (!webGLSupported) {
    return (
      <div
        data-testid="room-photo-gallery"
        className="w-full rounded-xl overflow-hidden bg-gray-100"
      >
        <img
          src={imageUrl}
          alt="Room photo"
          className="w-full h-auto object-cover"
        />
      </div>
    )
  }

  // WebGL available: render Pannellum 360° viewer
  return (
    <div ref={containerRef} className="w-full aspect-video rounded-xl overflow-hidden relative">
      <ReactPannellum
        id="vr-tour-viewer"
        sceneId="main-scene"
        imageSource={imageUrl}
        config={pannellumConfig}
        style={{ width: '100%', height: '100%' }}
      />

      {activeHotspot && (
        <HotspotOverlay hotspot={activeHotspot} onClose={handleOverlayClose} />
      )}
    </div>
  )
}
