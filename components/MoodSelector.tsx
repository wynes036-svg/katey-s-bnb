'use client'

import { useEffect, useRef, useState } from 'react'
import type { Mood } from '@/types'

interface MoodSelectorProps {
  moods: Mood[]
}

export default function MoodSelector({ moods }: MoodSelectorProps) {
  const [activeMoodIndex, setActiveMoodIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // On mount: read mute preference from localStorage and preload video assets
  useEffect(() => {
    const stored = localStorage.getItem('sensory-stay-muted')
    if (stored !== null) {
      setIsMuted(stored === 'true')
    }

    // Preload all mood video assets
    moods.forEach((mood) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'video'
      link.href = mood.videoUrl
      document.head.appendChild(link)
    })

    // Create the audio element
    const audio = new Audio()
    audio.loop = true
    audio.volume = 0.3
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [moods])

  // When activeMoodIndex changes, update video src and swap audio
  useEffect(() => {
    if (!moods.length) return

    const mood = moods[activeMoodIndex]

    // Update video src
    if (videoRef.current) {
      videoRef.current.src = mood.videoUrl
      videoRef.current.load()
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked; silently ignore
      })
    }

    // Swap audio src and play
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = mood.audioUrl
      audioRef.current.volume = isMuted ? 0 : 0.3
      audioRef.current.play().catch(() => {
        // Autoplay may be blocked; silently ignore
      })
    }
  }, [activeMoodIndex, moods]) // eslint-disable-line react-hooks/exhaustive-deps

  // When isMuted changes, update audio volume and persist to localStorage
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 0.3
    }
    localStorage.setItem('sensory-stay-muted', String(isMuted))
  }, [isMuted])

  const handleMoodSelect = (index: number) => {
    setActiveMoodIndex(index)
  }

  const handleMuteToggle = () => {
    setIsMuted((prev) => !prev)
  }

  if (!moods.length) return null

  const activeMood = moods[activeMoodIndex]

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={activeMood.videoUrl}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-10" aria-hidden="true" />

      {/* Mute/unmute toggle — top-right corner */}
      <button
        onClick={handleMuteToggle}
        className="absolute top-6 right-6 z-30 flex items-center justify-center w-11 h-11 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
        aria-label={isMuted ? 'Unmute ambient audio' : 'Mute ambient audio'}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        <span className="text-xl leading-none" aria-hidden="true">
          {isMuted ? '🔇' : '🔊'}
        </span>
      </button>

      {/* Content overlay */}
      <div className="relative z-20 flex flex-col h-full justify-end pb-16 px-6">
        <h1
          className="text-white mb-8 text-4xl sm:text-5xl lg:text-6xl"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Choose Your Mood
        </h1>

        {/* Mood cards */}
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          {moods.map((mood, index) => {
            const isActive = index === activeMoodIndex
            return (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(index)}
                aria-pressed={isActive}
                className={[
                  'flex flex-col items-start gap-2 px-5 py-4 rounded-xl text-left transition-all duration-200',
                  'bg-black/50 backdrop-blur-sm text-white',
                  'hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent',
                  'min-w-[160px] sm:min-w-[180px]',
                  isActive
                    ? 'ring-2 ring-[#C4622D] bg-black/70'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span
                  className="font-semibold text-base leading-tight"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {mood.name}
                </span>
                <span className="text-sm text-white/70 leading-snug">
                  {mood.descriptor}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
