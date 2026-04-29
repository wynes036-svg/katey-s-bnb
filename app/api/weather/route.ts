import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes

// Mock weather data for when the API is not configured
const MOCK_WEATHER = {
  temperature: 14,
  condition: 'Partly Cloudy',
  descriptor: 'Quiet & Relaxing',
}

export async function GET() {
  try {
    // Check if we have a recent cache entry
    const cached = await prisma.weatherCache.findUnique({
      where: { id: 'singleton' },
    })

    const now = new Date()

    if (cached) {
      const ageMs = now.getTime() - cached.fetchedAt.getTime()
      if (ageMs < CACHE_TTL_MS) {
        // Cache is fresh — return it
        return NextResponse.json({
          temperature: cached.temperature,
          condition: cached.condition,
          descriptor: cached.descriptor,
          fetchedAt: cached.fetchedAt.toISOString(),
          isStale: false,
        })
      }
    }

    // Cache is stale or missing — try to fetch fresh data
    const apiKey = process.env.OPENWEATHERMAP_API_KEY
    const lat = process.env.PROPERTY_LAT ?? '51.5074'
    const lon = process.env.PROPERTY_LON ?? '-0.1278'

    let weatherData = MOCK_WEATHER

    if (apiKey) {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
          { next: { revalidate: 0 } }
        )
        if (res.ok) {
          const data = await res.json()
          weatherData = {
            temperature: Math.round(data.main.temp),
            condition: data.weather[0]?.description ?? 'Clear',
            descriptor: getDescriptor(data.weather[0]?.main ?? 'Clear'),
          }
        }
      } catch {
        // Fall through to use mock/cached data
      }
    }

    // Upsert the cache
    const updated = await prisma.weatherCache.upsert({
      where: { id: 'singleton' },
      update: {
        temperature: weatherData.temperature,
        condition: weatherData.condition,
        descriptor: weatherData.descriptor,
        fetchedAt: now,
      },
      create: {
        id: 'singleton',
        temperature: weatherData.temperature,
        condition: weatherData.condition,
        descriptor: weatherData.descriptor,
        fetchedAt: now,
      },
    })

    return NextResponse.json({
      temperature: updated.temperature,
      condition: updated.condition,
      descriptor: updated.descriptor,
      fetchedAt: updated.fetchedAt.toISOString(),
      isStale: false,
    })
  } catch (error) {
    console.error('[/api/weather] Error:', error)

    // Try to return stale cache if available
    try {
      const stale = await prisma.weatherCache.findUnique({
        where: { id: 'singleton' },
      })
      if (stale) {
        return NextResponse.json({
          temperature: stale.temperature,
          condition: stale.condition,
          descriptor: stale.descriptor,
          fetchedAt: stale.fetchedAt.toISOString(),
          isStale: true,
        })
      }
    } catch {
      // Database also unavailable
    }

    // No cache at all — return unavailable state
    return NextResponse.json(
      { unavailable: true, message: 'Weather data is currently unavailable.' },
      { status: 503 }
    )
  }
}

function getDescriptor(condition: string): string {
  const map: Record<string, string> = {
    Clear: 'Bright & Inviting',
    Clouds: 'Cosy & Atmospheric',
    Rain: 'Quiet & Reflective',
    Drizzle: 'Gentle & Peaceful',
    Thunderstorm: 'Wild & Dramatic',
    Snow: 'Magical & Still',
    Mist: 'Mysterious & Calm',
    Fog: 'Dreamy & Soft',
  }
  return map[condition] ?? 'Quiet & Relaxing'
}
