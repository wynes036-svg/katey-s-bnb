'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Mood {
  id: string
  name: string
  videoUrl: string
  audioUrl: string
  descriptor: string
}

export default function AdminMoodsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [moods, setMoods] = useState<Mood[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', videoUrl: '', audioUrl: '', descriptor: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') fetchMoods()
  }, [status])

  async function fetchMoods() {
    try {
      const res = await fetch('/api/admin/moods')
      if (res.ok) {
        const data = await res.json()
        setMoods(data.moods ?? [])
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/moods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Failed to save mood.')
        return
      }
      setShowForm(false)
      setForm({ name: '', videoUrl: '', audioUrl: '', descriptor: '' })
      fetchMoods()
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
          Moods
        </h1>
        <button
          onClick={() => { setShowForm(true); setError('') }}
          className="rounded-lg bg-[#C4622D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#A8521F] transition-colors"
        >
          + Add Mood
        </button>
      </div>

      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <strong>File uploads:</strong> To upload video/audio files, use the PUT endpoint at{' '}
        <code className="font-mono text-xs bg-amber-100 px-1 rounded">/api/admin/moods</code>.
        Files exceeding 500MB will be rejected automatically.
      </div>

      <div className="space-y-3">
        {moods.length === 0 && (
          <div className="rounded-xl border border-[#D6D0C8] bg-white p-8 text-center text-[#78716C]">
            No moods yet. Add your first mood above.
          </div>
        )}
        {moods.map((mood) => (
          <div key={mood.id} className="rounded-xl border border-[#D6D0C8] bg-white p-5">
            <h2 className="font-semibold text-[#1C1917] mb-1">{mood.name}</h2>
            <p className="text-sm text-[#78716C] mb-1">Descriptor: {mood.descriptor}</p>
            <p className="text-xs text-[#78716C] truncate">Video: {mood.videoUrl}</p>
            <p className="text-xs text-[#78716C] truncate">Audio: {mood.audioUrl}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl text-[#1C1917] mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              Add Mood
            </h2>
            <div className="space-y-4">
              {[
                { id: 'name', label: 'Mood name (e.g. "Cozy & Quiet")', key: 'name' as const },
                { id: 'videoUrl', label: 'Video URL', key: 'videoUrl' as const },
                { id: 'audioUrl', label: 'Audio URL', key: 'audioUrl' as const },
                { id: 'descriptor', label: 'Descriptor (e.g. "Quiet & Relaxing")', key: 'descriptor' as const },
              ].map(({ id, label, key }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-medium text-[#1C1917] mb-1">
                    {label}
                  </label>
                  <input
                    id={id}
                    type="text"
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full rounded-lg border border-[#D6D0C8] px-3 py-2 text-sm focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]"
                  />
                </div>
              ))}
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 rounded-xl border border-[#D6D0C8] px-4 py-2.5 text-sm font-medium text-[#78716C] hover:bg-[#E8E4DF] transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 rounded-xl bg-[#C4622D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#A8521F] transition-colors disabled:opacity-50">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
