'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid username or password.')
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1
            className="text-3xl text-[#1C1917] mb-2"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Katey&apos;s BNB
          </h1>
          <p className="text-sm text-[#78716C]">Admin Dashboard</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#D6D0C8] bg-white p-8 shadow-sm"
        >
          <h2
            className="text-xl text-[#1C1917] mb-6"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Sign In
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[#1C1917] mb-1.5"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full rounded-lg border border-[#D6D0C8] px-3 py-2.5 text-sm text-[#1C1917] focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#1C1917] mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-[#D6D0C8] px-3 py-2.5 text-sm text-[#1C1917] focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-[#C4622D] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#A8521F] focus:outline-none focus:ring-2 focus:ring-[#C4622D] focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
