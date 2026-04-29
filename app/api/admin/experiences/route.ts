import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function checkAuth() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
  return null
}

export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const experiences = await prisma.localExperience.findMany({
      include: { mood: true },
      orderBy: { title: 'asc' },
    })
    return NextResponse.json({ experiences })
  } catch (error) {
    console.error('[/api/admin/experiences GET] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch experiences.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const { title, description, price, moodId, availableDates } = body

    if (!title || !description || price === undefined || !moodId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, price, moodId.' },
        { status: 400 }
      )
    }

    const experience = await prisma.localExperience.create({
      data: {
        title,
        description,
        price: Math.round(price), // ensure integer (pence)
        moodId,
        availableDates: availableDates
          ? availableDates.map((d: string) => new Date(d))
          : [],
      },
      include: { mood: true },
    })

    return NextResponse.json({ experience }, { status: 201 })
  } catch (error) {
    console.error('[/api/admin/experiences POST] Error:', error)
    return NextResponse.json({ error: 'Failed to create experience.' }, { status: 500 })
  }
}
