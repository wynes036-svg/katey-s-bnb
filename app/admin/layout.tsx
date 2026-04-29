import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { ReactNode } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession(authOptions)

  // Allow login page without session
  // (Next.js will render the login page before this layout for /admin/login)

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {session && (
        <nav className="border-b border-[#D6D0C8] bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-6">
                <Link
                  href="/admin"
                  className="text-lg font-semibold text-[#1C1917]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Katey&apos;s BNB Admin
                </Link>
                <div className="hidden sm:flex items-center gap-4">
                  <Link
                    href="/admin/rooms"
                    className="text-sm text-[#78716C] hover:text-[#C4622D] transition-colors"
                  >
                    Rooms
                  </Link>
                  <Link
                    href="/admin/moods"
                    className="text-sm text-[#78716C] hover:text-[#C4622D] transition-colors"
                  >
                    Moods
                  </Link>
                  <Link
                    href="/admin/experiences"
                    className="text-sm text-[#78716C] hover:text-[#C4622D] transition-colors"
                  >
                    Experiences
                  </Link>
                  <Link
                    href="/admin/spotlights"
                    className="text-sm text-[#78716C] hover:text-[#C4622D] transition-colors"
                  >
                    Spotlights
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#78716C]">{session.user?.name}</span>
                <Link
                  href="/api/auth/signout"
                  className="text-sm text-[#C4622D] hover:underline"
                >
                  Sign out
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
