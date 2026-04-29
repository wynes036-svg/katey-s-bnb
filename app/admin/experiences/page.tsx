'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Experience {
  id: string
  title: string
  description: string
  price: number
  moodId: string
  isActive: boolean
  availableDates: string[]
  mood?: { name: string }
}

interface Mood {
  id: string
  name: string
}

export default function AdminExperiencesPage() {
  const { status } = useSession()
  const router = useRouter()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [moods, setMoods] = useState<Mood[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    moodId: '',
    availableDates: '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchExperiences()
      fetchMoods()
    }
  }, [status])

  async function fetchExperiences() {
    try {
      const res = await fetch('/api/admin/experiences')
      if (res.ok) {
        const data = await res.json()
        setExperiences(data.experiences ?? [])
      }
    } finally {
      setLoading(false)
    }
  }

  async function fetchMoods() {
    try {
      const res = await fetch('/api/admin/moods')
      if (res.ok) {
        const data = await res.json()
        setMoods(data.moods ?? [])
      }
    } catch { /* ignore */ }
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const priceInPence = Math.round(parseFloat(form.price) * 100)
      if (isNaN(priceInPence)) {
        setError('Please enter a valid price.')
        return
      }

      const availableDates = form.availableDates
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean)

      const res = await fetch('/api/admin/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: priceInPence,
          moodId: form.moodId,
          availableDates,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Failed to save experience.')
        return
      }
      setShowForm(false)
      setForm({ title: '', description: '', price: '', moodId: '', availableDates: '' })
      fetchExperiences()
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) return <div className="text-[#78716C]">Loading…</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl text-[#1C1917]" style={{ fontFamily: 'var(--font-serif)' }}>
          Local Experiences
        </h1>
        <button
          onClick={() => { setShowForm(true); setError('') }}
          className="rounded-lg bg-[#C4622D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#A8521F] transition-colors"
        >
          + Add Experience
        </button>
      </div>

      <div className="space-y-3">
        {experiences.length === 0 && (
          <div className="rounded-xl border border-[#D6D0C8] bg-white p-8 text-center text-[#78716C]">
            No experiences yet. Add your first experience above.
          </div>
        )}
        {experiences.map((exp) => (
          <div key={exp.id} className="rounded-xl border border-[#D6D0C8] bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-[#1C1917] mb-1">{exp.title}</h2>
                <p className="text-sm text-[#78716C] mb-1">{exp.description}</p>
                <p className="text-sm font-medium text-[#C4622D]">
                  £{(exp.price / 100).toFixed(2)} per person
                </p>
                <p className="text-xs text-[#78716C] mt-1">
                  Mood: {exp.mood?.name ?? exp.moodId}
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                exp.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {exp.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl text-[#1C1917] mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              Add Experience
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="exp-title" className="block text-sm font-medium text-[#1C1917] mb-1">Title</label>
                <input id="exp-title" type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-[#D6D0C8] px-3 py-2 text-sm focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]" />
              </div>
              <div>
                <label htmlFor="exp-desc" className="block text-sm font-medium text-[#1C1917] mb-1">Description</label>
                <textarea id="exp-desc" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-[#D6D0C8] px-3 py-2 text-sm focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]" />
              </div>
              <div>
                <label htmlFor="exp-price" className="block text-sm font-medium text-[#1C1917] mb-1">Price (£)</label>
                <input id="exp-price" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full rounded-lg border border-[#D6D0C8] px-3 py-2 text-sm focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]" />
              </div>
              <div>
                <label htmlFor="exp-mood" className="block text-sm font-medium text-[#1C1917] mb-1">Mood</label>
                <select id="exp-mood" value={form.moodId} onChange={(e) => setForm({ ...form, moodId: e.target.value })} className="w-full rounded-lg border border-[#D6D0C8] px-3 py-2 text-sm focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]">
                  <option value="">Select a mood…</option>
                  {moods.map((mood) => (
                    <option key={mood.id} value={mood.id}>{mood.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="exp-dates" className="block text-sm font-medium text-[#1C1917] mb-1">
                  Available dates (comma-separated, e.g. 2025-06-01, 2025-06-02)
                </label>
                <input id="exp-dates" type="text" value={form.availableDates} onChange={(e) => setForm({ ...form, availableDates: e.target.value })} placeholder="2025-06-01, 2025-06-02" className="w-full rounded-lg border border-[#D6D0C8] px-3 py-2 text-sm focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]" />
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 rounded-xl border border-[#D6D0C8] px-4 py-2.5 text-sm font-medium text-[#78716C] hover:bg-[#E8E4DF] transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 rounded-xl bg-[#C4622D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#A8521F] transition-colors disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
