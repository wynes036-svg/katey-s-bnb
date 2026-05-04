'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Mood } from '@/types'

interface MoodSelectorProps {
  moods: Mood[]
}

// Select 5 best images for mood showcase
const MOOD_IMAGES = [
  '/images/room/main-view.jpg',      // Room overview
  '/images/room/cozy-corner.jpg',    // Cozy seating area
  '/images/room/window-view.jpg',    // Beautiful scenery
  '/images/room/bed-detail.jpg',     // Comfortable bed
  '/images/room/bathroom.jpg',       // Luxury bathroom
]

export default function MoodSelector({ moods }: MoodSelectorProps) {
  const [activeMoodIndex, setActiveMoodIndex] = useState(0)

  const handleMoodSelect = (index: number) => {
    setActiveMoodIndex(index)
  }

  if (!moods.length) return null

  const activeMood = moods[activeMoodIndex]
  const activeImage = MOOD_IMAGES[activeMoodIndex] || MOOD_IMAGES[0]

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={activeImage}
          alt={`${activeMood.name} mood showcase`}
          fill
          className="object-cover transition-opacity duration-700"
          sizes="100vw"
          priority
        />
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50 z-10" aria-hidden="true" />

      {/* Content overlay */}
      <div className="relative z-20 flex flex-col h-full justify-center items-center text-center px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-white/80 text-lg mb-4 uppercase tracking-widest font-medium">
            Welcome to Katye's BnB
          </p>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center p-3">
              <Image src="/logo.png" alt="Katye's BnB logo" width={64} height={64} className="object-contain invert" />
            </div>
          </div>
          
          <h1
            className="text-white mb-6 text-4xl sm:text-5xl lg:text-7xl leading-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Your Perfect Sanctuary Awaits
          </h1>

          <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience intimate luxury in our beautifully curated room. Every stay is personalized to create your ideal retreat.
          </p>

          {/* Primary CTA — always visible */}
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 bg-[#C4622D] hover:bg-[#A0501F] text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg mb-10"
          >
            Book Your Stay
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>

          {/* Mood cards */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap max-w-4xl mx-auto">
            {moods.map((mood, index) => {
              const isActive = index === activeMoodIndex
              return (
                <button
                  key={mood.id}
                  onClick={() => handleMoodSelect(index)}
                  aria-pressed={isActive}
                  className={[
                    'flex flex-col items-center gap-3 px-6 py-5 rounded-2xl text-center transition-all duration-300',
                    'bg-white/10 backdrop-blur-md text-white border border-white/20',
                    'hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent',
                    'min-w-[180px] sm:min-w-[200px]',
                    isActive
                      ? 'ring-2 ring-[#C4622D] bg-white/20 scale-105 border-[#C4622D]/50'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span
                    className="font-semibold text-lg leading-tight"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {mood.name}
                  </span>
                  <span className="text-sm text-white/80 leading-snug">
                    {mood.descriptor}
                  </span>
                  {isActive && (
                    <div className="w-2 h-2 bg-[#C4622D] rounded-full animate-pulse" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Image indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex gap-2">
          {MOOD_IMAGES.slice(0, moods.length).map((_, index) => (
            <button
              key={index}
              onClick={() => handleMoodSelect(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeMoodIndex
                  ? 'bg-[#C4622D] scale-125'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`View ${moods[index]?.name} mood`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
