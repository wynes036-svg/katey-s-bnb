'use client'

import { useEffect, useState } from 'react'
import type { LocalExperience } from '@/types'

interface LocalExperienceSelectorProps {
  moodId?: string
  checkIn?: Date | null
  checkOut?: Date | null
  selectedExperiences: LocalExperience[]
  onAdd: (experience: LocalExperience) => void
  onRemove: (experienceId: string) => void
}

export default function LocalExperienceSelector({
  moodId,
  checkIn,
  checkOut,
  selectedExperiences,
  onAdd,
  onRemove,
}: LocalExperienceSelectorProps) {
  const [experiences, setExperiences] = useState<LocalExperience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unavailableIds, setUnavailableIds] = useState<string[]>([])

  useEffect(() => {
    async function fetchExperiences() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (moodId) params.set('moodId', moodId)
        if (checkIn) params.set('checkIn', checkIn.toISOString())
        if (checkOut) params.set('checkOut', checkOut.toISOString())

        const res = await fetch(`/api/experiences?${params.toString()}`)
        if (!res.ok) throw new Error('Failed to load experiences')
        const data = await res.json()
        setExperiences(data.experiences ?? [])
      } catch {
        setError('Unable to load local experiences. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [moodId, checkIn, checkOut])

  // Check if any selected experiences have become unavailable
  useEffect(() => {
    if (!experiences.length || !selectedExperiences.length) return

    const availableIds = new Set(experiences.map((e) => e.id))
    const nowUnavailable = selectedExperiences
      .filter((e) => !availableIds.has(e.id))
      .map((e) => e.id)

    if (nowUnavailable.length > 0) {
      setUnavailableIds(nowUnavailable)
      // Auto-remove unavailable experiences
      nowUnavailable.forEach((id) => onRemove(id))
    }
  }, [experiences, selectedExperiences, onRemove])

  function isSelected(id: string) {
    return selectedExperiences.some((e) => e.id === id)
  }

  function formatPrice(pence: number) {
    return `£${(pence / 100).toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-[#E8E4DF] animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-2xl text-[#1C1917] mb-2"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Local Experiences
        </h2>
        <p className="text-[#78716C] text-sm">
          Enhance your stay with curated local activities. Add as many as you like.
        </p>
      </div>

      {/* Unavailability notification */}
      {unavailableIds.length > 0 && (
        <div
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
        >
          <strong>Heads up:</strong> One or more experiences you selected are no longer
          available and have been removed from your booking.
        </div>
      )}

      {experiences.length === 0 ? (
        <div className="rounded-xl border border-[#D6D0C8] bg-[#FAF8F5] p-8 text-center">
          <p className="text-[#78716C]">
            No local experiences available for your selected dates and mood.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((experience) => {
            const selected = isSelected(experience.id)
            return (
              <div
                key={experience.id}
                className={`rounded-xl border p-5 transition-colors ${
                  selected
                    ? 'border-[#C4622D] bg-[#FDF5F0]'
                    : 'border-[#D6D0C8] bg-white hover:border-[#C4622D]/50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1C1917] mb-1">
                      {experience.title}
                    </h3>
                    <p className="text-sm text-[#78716C] leading-relaxed">
                      {experience.description}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#C4622D]">
                      {formatPrice(experience.price)} per person
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      selected ? onRemove(experience.id) : onAdd(experience)
                    }
                    className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#C4622D] focus:ring-offset-1 ${
                      selected
                        ? 'bg-[#C4622D] text-white hover:bg-[#A8521F]'
                        : 'bg-[#E8E4DF] text-[#78716C] hover:bg-[#D6D0C8]'
                    }`}
                    aria-pressed={selected}
                    aria-label={`${selected ? 'Remove' : 'Add'} ${experience.title}`}
                  >
                    {selected ? 'Remove' : 'Add'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
