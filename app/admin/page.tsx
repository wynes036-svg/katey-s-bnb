import { requireAdminSession } from '@/lib/admin-auth'
import Link from 'next/link'

export default async function AdminDashboard() {
  await requireAdminSession()

  const sections = [
    {
      href: '/admin/rooms',
      title: 'Rooms',
      description: 'Create, edit, and deactivate room listings.',
      icon: '🛏️',
    },
    {
      href: '/admin/moods',
      title: 'Moods',
      description: 'Upload and manage mood videos, audio, and metadata.',
      icon: '🎨',
    },
    {
      href: '/admin/experiences',
      title: 'Experiences',
      description: 'Manage local experience listings and availability.',
      icon: '🗺️',
    },
    {
      href: '/admin/spotlights',
      title: 'Artist Spotlights',
      description: 'Publish and unpublish artist spotlight content.',
      icon: '🎬',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-3xl text-[#1C1917] mb-2"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Dashboard
        </h1>
        <p className="text-[#78716C]">Manage your Katey&apos;s BNB content.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-2xl border border-[#D6D0C8] bg-white p-6 hover:border-[#C4622D] hover:shadow-sm transition-all group"
          >
            <div className="text-3xl mb-3">{section.icon}</div>
            <h2
              className="text-xl text-[#1C1917] mb-1 group-hover:text-[#C4622D] transition-colors"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {section.title}
            </h2>
            <p className="text-sm text-[#78716C]">{section.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-[#D6D0C8] bg-amber-50 p-4">
        <p className="text-sm text-amber-800">
          <strong>Development mode:</strong> Using mock data. Connect a PostgreSQL database
          via <code className="font-mono text-xs bg-amber-100 px-1 py-0.5 rounded">DATABASE_URL</code> to
          enable full functionality.
        </p>
      </div>
    </div>
  )
}
