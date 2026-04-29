'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Room {
  id: string
  name: string
  description: string
  moodId: string
  vrImageUrl: string
  povVideoUrl: string
  isActive: boolean
  mood?: { name: string }
}

interface Mood {
  id: string
  name: string
}

export default function AdminRoomsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [moods, setMoods] = useState<Mood[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    moodId: '',
    vrImageUrl: '',
    povVideoUrl: '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchRooms()
      fetchMoods()
    }
  }, [status])

  async function fetchRooms() {
    try {
      const res = await fetch('/api/admin/rooms')
      if (res.ok) {
        const data = await res.json()
        setRooms(data.rooms ?? [])
      }
    } catch {
      // ignore
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
    } catch {
      // ignore
    }
  }

  function openCreate() {
    setEditingRoom(null)
    setForm({ name: '', description: '', moodId: '', vrImageUrl: '', povVideoUrl: '' })
    setError('')
    setShowForm(true)
  }

  function openEdit(room: Room) {
    setEditingRoom(room)
    setForm({
      name: room.name,
      description: room.description,
      moodId: room.moodId,
      vrImageUrl: room.vrImageUrl,
      povVideoUrl: room.povVideoUrl,
    })
    setError('')
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const url = editingRoom ? `/api/admin/rooms/${editingRoom.id}` : '/api/admin/rooms'
      const method = editingRoom ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Failed to save room.')
        return
      }
      setShowForm(false)
      fetchRooms()
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeactivate(id: string) {
    if (!confirm('Deactivate this room? It will be hidden from guests.')) return
    await fetch(`/api/admin/rooms/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: false }),
    })
    fetchRooms()
  }

  async function handleActivate(id: string) {
    await fetch(`/api/admin/rooms/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: true }),
    })
    fetchRooms()
  }

  if (status === 'loading' || loading) {
    return <div className="text-[#78716C]">Loading…</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl text-[#1C1917]"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Rooms
        </h1>
        <button
          onClick={openCreate}
          className="rounded-lg bg-[#C4622D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#A8521F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C4622D]"
        >
          + Add Room
        </button>
      </div>

      {/* Room list */}
      <div className="space-y-3">
        {rooms.length === 0 && (
          <div className="rounded-xl border border-[#D6D0C8] bg-white p-8 text-center text-[#78716C]">
            No rooms yet. Add your first room above.
          </div>
        )}
        {rooms.map((room) => (
          <div
            key={room.id}
            className="rounded-xl border border-[#D6D0C8] bg-white p-5 flex items-start justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-semibold text-[#1C1917]">{room.name}</h2>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    room.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {room.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-[#78716C] mb-1">{room.description}</p>
              <p className="text-xs text-[#78716C]">Mood: {room.mood?.name ?? room.moodId}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => openEdit(room)}
                className="rounded-lg border border-[#D6D0C8] px-3 py-1.5 text-xs font-medium text-[#78716C] hover:bg-[#E8E4DF] transition-colors"
              >
                Edit
              </button>
              {room.isActive ? (
                <button
                  onClick={() => handleDeactivate(room.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Deactivate
                </button>
              ) : (
                <button
                  onClick={() => handleActivate(room.id)}
                  className="rounded-lg border border-green-200 px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50 transition-colors"
                >
                  Activate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2
              className="text-xl text-[#1C1917] mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {editingRoom ? 'Edit Room' : 'Add Room'}
            </h2>

            <div className="space-y-4">
              {[
                { id: 'name', label: 'Room name', key: 'name' as const },
                { id: 'description', label: 'Description', key: 'description' as const },
                { id: 'vrImageUrl', label: 'VR Image URL', key: 'vrImageUrl' as const },
                { id: 'povVideoUrl', label: 'POV Video URL', key: 'povVideoUrl' as const },
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

              <div>
                <label htmlFor="moodId" className="block text-sm font-medium text-[#1C1917] mb-1">
                  Mood
                </label>
                <select
                  id="moodId"
                  value={form.moodId}
                  onChange={(e) => setForm({ ...form, moodId: e.target.value })}
                  className="w-full rounded-lg border border-[#D6D0C8] px-3 py-2 text-sm focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]"
                >
                  <option value="">Select a mood…</option>
                  {moods.map((mood) => (
                    <option key={mood.id} value={mood.id}>
                      {mood.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl border border-[#D6D0C8] px-4 py-2.5 text-sm font-medium text-[#78716C] hover:bg-[#E8E4DF] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-xl bg-[#C4622D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#A8521F] transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
