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
    <div
      className="fixed bottom-6 right-6 z-40"
      aria-live="polite"
    >
      <button
        onClick={handleClick}
        className="flex items-center gap-2 rounded-full bg-[#C4622D] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-[#A8521F] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#C4622D] focus:ring-offset-2 active:scale-95"
        style={{ minWidth: '44px', minHeight: '44px' }}
        aria-label="Book your vibe — start the booking flow"
      >
        <span aria-hidden="true">✦</span>
        Book Your Vibe
      </button>
    </div>
  )
}
