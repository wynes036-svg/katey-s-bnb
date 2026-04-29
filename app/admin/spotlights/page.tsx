'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Spotlight {
  id: string
  title: string
  videoUrl: string
  videoDuration: number
  description: string
  externalUrl?: string | null
  isPublished: boolean
  createdAt: string
}

export default function AdminSpotlightsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [spotlights, setSpotlights] = useState<Spotlight[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    videoUrl: '',
    videoDuration: '',
    description: '',
    externalUrl: '',
    isPublished: false,
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') fetchSpotlights()
  }, [status])

  async function fetchSpotlights() {
    try {
      const res = await fetch('/api/admin/spotlights')
      if (res.ok) {
        const data = await res.json()
        setSpotlights(data.spotlights ?? [])
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const duration = parseInt(form.videoDuration, 10)
      if (isNaN(duration) || duration < 60) {
        setError('Video duration must be at least 60 seconds.')
        return
      }

      const res = await fetch('/api/admin/spotlights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          videoUrl: form.videoUrl,
          videoDuration: duration,
          description: form.description,
          externalUrl: form.externalUrl || null,
          isPublished: form.isPublished,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Failed to save spotlight.')
        return
      }
      setShowForm(false)
      setForm({ title: '', videoUrl: '', videoDuration: '', description: '', externalUrl: '', isPublished: false })
      fetchSpotlights()
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }

  async function togglePublish(spotlight: Spotlight) {
    await fetch(`/api/admin/spotlights/${spotlight.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !spotlight.isPublished }),
    })
    fetchSpotlights()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this spotlight? This cannot be undone.')) return
    await fetch(`/api/admin/spotlights/${id}`, { method: 'DELETE' })
    fetchSpotlights()
  }

  if (status === 'loading' || loading) return <div className="text-[#78716C]">Loading…</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl text-[#1C1917]" style={{ fontFamily: 'var(--font-serif)' }}>
          Artist Spotlights
        </h1>
        <button
          onClick={() => { setShowForm(true); setError('') }}
          className="rounded-lg bg-[#C4622D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#A8521F] transition-colors"
        >
          + Add Spotlight
        </button>
      </div>

      <div className="space-y-3">
        {spotlights.length === 0 && (
          <div className="rounded-xl border border-[#D6D0C8] bg-white p-8 text-center text-[#78716C]">
            No spotlights yet. Add your first spotlight above.
          </div>
        )}
        {spotlights.map((spotlight) => (
          <div key={spotlight.id} className="rounded-xl border border-[#D6D0C8] bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-semibold text-[#1C1917]">{spotlight.title}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    spotlight.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {spotlight.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm text-[#78716C] mb-1 line-clamp-2">{spotlight.description}</p>
                <p className="text-xs text-[#78716C]">Duration: {spotlight.videoDuration}s</p>
                {spotlight.externalUrl && (
                  <a href={spotlight.externalUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#C4622D] hover:underline">
                    External profile ↗
                  </a>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => togglePublish(spotlight)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    spotlight.isPublished
                      ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      : 'border-green-200 text-green-600 hover:bg-green-50'
                  }`}
                >
                  {spotlight.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleDelete(spotlight.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl text-[#1C1917] mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              Add Spotlight
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="sp-title" className="block text-sm font-medium text-[#1C1917] mb-1">Title</label>
                <input id="sp-title" type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-[#D6D0C8] px-3 py-2 text-sm focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]" />
              </div>
              <div>
                <label htmlFor="sp-video" className="block text-sm font-medium text-[#1C1917] mb-1">Video URL</label>
                <input id="sp-video" type="text" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} className="w-full rounded-lg border border-[#D6D0C8] px-3 py-2 text-sm focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]" />
              </div>
              <div>
                <label htmlFor="sp-duration" className="block text-sm font-medium text-[#1C1917] mb-1">Video duration (seconds, min 60)</label>
                <input id="sp-duration" type="number" min="60" value={form.videoDuration} onChange={(e) => setForm({ ...form, videoDuration: e.target.value })} className="w-full rounded-lg border border-[#D6D0C8] px-3 py-2 text-sm focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]" />
              </div>
              <div>
                <label htmlFor="sp-desc" className="block text-sm font-medium text-[#1C1917] mb-1">Description (min 100 words)</label>
                <textarea id="sp-desc" rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-[#D6D0C8] px-3 py-2 text-sm focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]" />
                <p className="text-xs text-[#78716C] mt-1">
                  {form.description.trim().split(/\s+/).filter(Boolean).length} / 100 words
                </p>
              </div>
              <div>
                <label htmlFor="sp-external" className="block text-sm font-medium text-[#1C1917] mb-1">External URL (optional)</label>
                <input id="sp-external" type="url" value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} placeholder="https://…" className="w-full rounded-lg border border-[#D6D0C8] px-3 py-2 text-sm focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="h-4 w-4 rounded border-[#D6D0C8] text-[#C4622D] focus:ring-[#C4622D]" />
                <span className="text-sm text-[#1C1917]">Publish immediately</span>
              </label>
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
