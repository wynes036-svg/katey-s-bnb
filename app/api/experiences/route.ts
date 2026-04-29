import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const moodId = searchParams.get('moodId')
  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')

  try {
    const where: Record<string, unknown> = { isActive: true }

    if (moodId) {
      where.moodId = moodId
    }

    const experiences = await prisma.localExperience.findMany({
      where,
      include: { mood: true },
      orderBy: { price: 'asc' },
    })

    type ExperienceWithMood = (typeof experiences)[number]

    // Filter by date overlap if dates are provided
    let filtered: ExperienceWithMood[] = experiences
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)

      filtered = experiences.filter((exp: ExperienceWithMood) => {
        // Experience must have at least one available date within the booking range
        return exp.availableDates.some((date: Date) => {
          const d = new Date(date)
          return d >= checkInDate && d <= checkOutDate
        })
      })
    }

    return NextResponse.json({ experiences: filtered })
  } catch (error) {
    console.error('[/api/experiences] Error:', error)
    return NextResponse.json(
      { error: 'Failed to load experiences.' },
      { status: 500 }
    )
  }
}
