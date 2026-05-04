'use client'

import { usePathname, useRouter } from 'next/navigation'

export default function PersistentCTA() {
  const pathname = usePathname()
  const router = useRouter()

  // Hide on all /booking/* paths
  const isBookingFlow = pathname?.startsWith('/booking')

  if (isBookingFlow) return null

  const handleClick = () => {
    router.push('/booking')
  }

  return (
    <div className="fixed bottom-6 right-6 z-40" aria-live="polite">
      <button
        onClick={handleClick}
        className="flex items-center gap-2 rounded-full bg-[#1A1A18] hover:bg-[#B85C2A] px-6 py-3.5 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#B85C2A] focus:ring-offset-2 active:scale-95"
        style={{ minWidth: '44px', minHeight: '44px' }}
        aria-label="Book your stay — start the booking flow"
      >
        <span aria-hidden="true">✦</span>
        Book Your Stay
      </button>
    </div>
  )
}
