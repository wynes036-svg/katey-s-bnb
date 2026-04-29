'use client'

import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

// Consumers should lazy-load this component via next/dynamic with ssr: false
// to avoid SSR issues with hls.js and the video element.

interface POVTourPlayerProps {
  videoUrl: string
  posterUrl?: string
  title?: string
}

export default function POVTourPlayer({
  videoUrl,
  posterUrl,
  title,
}: POVTourPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const isHLS = videoUrl.endsWith('.m3u8')

    if (isHLS && Hls.isSupported()) {
      // Use hls.js for HLS streaming
      const hls = new Hls({
        // Enable low-latency and smooth streaming for ≥10 Mbps connections
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        startLevel: -1, // auto quality selection
      })
      hls.loadSource(videoUrl)
      hls.attachMedia(video)
      hlsRef.current = hls
    } else {
      // Native HLS support (Safari) or non-HLS URL
      video.src = videoUrl
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [videoUrl])

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleEnded = () => {
    setIsPlaying(false)
  }

  const handlePlayButtonClick = () => {
    videoRef.current?.play()
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={posterUrl}
        controls
        preload="metadata"
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        aria-label={title ?? 'POV room tour video'}
        playsInline
      />

      {/* Play button overlay — visible until the video starts playing */}
      {!isPlaying && (
        <button
          onClick={handlePlayButtonClick}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/30 hover:bg-black/40 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset group"
          aria-label={`Play${title ? ` ${title}` : ' video'}`}
        >
          {/* Circular play icon */}
          <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 group-hover:bg-white transition-colors shadow-lg">
            <svg
              className="w-7 h-7 text-gray-900 ml-1"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>

          {title && (
            <span className="text-white text-sm font-medium drop-shadow-md px-4 text-center">
              {title}
            </span>
          )}
        </button>
      )}
    </div>
  )
}
