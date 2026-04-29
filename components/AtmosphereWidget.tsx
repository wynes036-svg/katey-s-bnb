// AtmosphereWidget — Server Component
// Fetches weather data from /api/weather and renders current conditions

interface WeatherPayload {
  temperature?: number
  condition?: string
  descriptor?: string
  fetchedAt?: string
  isStale?: boolean
  unavailable?: boolean
  message?: string
}

async function getWeatherData(): Promise<WeatherPayload> {
  try {
    // Use absolute URL for server-side fetch in Next.js
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    const res = await fetch(`${baseUrl}/api/weather`, {
      next: { revalidate: 1800 }, // revalidate every 30 minutes
    })

    if (!res.ok) {
      return { unavailable: true, message: 'Weather data is currently unavailable.' }
    }

    return res.json()
  } catch {
    return { unavailable: true, message: 'Weather data is currently unavailable.' }
  }
}

function formatTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function getWeatherEmoji(condition: string): string {
  const lower = condition.toLowerCase()
  if (lower.includes('clear') || lower.includes('sunny')) return '☀️'
  if (lower.includes('cloud')) return '⛅'
  if (lower.includes('rain') || lower.includes('drizzle')) return '🌧️'
  if (lower.includes('thunder') || lower.includes('storm')) return '⛈️'
  if (lower.includes('snow')) return '❄️'
  if (lower.includes('mist') || lower.includes('fog')) return '🌫️'
  return '🌤️'
}

export default async function AtmosphereWidget() {
  const data = await getWeatherData()

  if (data.unavailable) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-[#E8E4DF] px-4 py-2 text-sm text-[#78716C]">
        <span aria-hidden="true">🌡️</span>
        <span>Weather data unavailable</span>
      </div>
    )
  }

  const { temperature, condition, descriptor, fetchedAt, isStale } = data

  return (
    <div
      className="inline-flex flex-wrap items-center gap-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#D6D0C8] px-5 py-3 shadow-sm"
      aria-label="Current weather at the property"
    >
      {/* Temperature */}
      <div className="flex items-center gap-1.5">
        <span className="text-xl" aria-hidden="true">
          {getWeatherEmoji(condition ?? '')}
        </span>
        <span className="text-lg font-semibold text-[#1C1917]">
          {temperature}°C
        </span>
      </div>

      {/* Divider */}
      <span className="hidden sm:block text-[#D6D0C8]" aria-hidden="true">|</span>

      {/* Condition */}
      <span className="text-sm text-[#78716C] capitalize">{condition}</span>

      {/* Divider */}
      <span className="hidden sm:block text-[#D6D0C8]" aria-hidden="true">|</span>

      {/* Mood descriptor */}
      <span className="text-sm font-medium text-[#C4622D]">{descriptor}</span>

      {/* Stale indicator */}
      {isStale && fetchedAt && (
        <span className="text-xs text-[#78716C] italic">
          (last updated {formatTime(fetchedAt)})
        </span>
      )}

      {/* Attribution — required by OpenWeatherMap terms */}
      <a
        href="https://openweathermap.org"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-[#78716C] hover:text-[#C4622D] transition-colors"
        aria-label="Weather data provided by OpenWeatherMap"
      >
        OpenWeatherMap
      </a>
    </div>
  )
}
