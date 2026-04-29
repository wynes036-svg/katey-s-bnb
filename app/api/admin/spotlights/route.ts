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
    const spotlights = await prisma.artistSpotlight.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ spotlights })
  } catch (error) {
    console.error('[/api/admin/spotlights GET] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch spotlights.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const { title, videoUrl, videoDuration, description, externalUrl, isPublished } = body

    if (!title || !videoUrl || !videoDuration || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: title, videoUrl, videoDuration, description.' },
        { status: 400 }
      )
    }

    if (videoDuration < 60) {
      return NextResponse.json(
        { error: 'Video duration must be at least 60 seconds.' },
        { status: 400 }
      )
    }

    const wordCount = description.trim().split(/\s+/).length
    if (wordCount < 100) {
      return NextResponse.json(
        { error: 'Description must contain at least 100 words.' },
        { status: 400 }
      )
    }

    const spotlight = await prisma.artistSpotlight.create({
      data: {
        title,
        videoUrl,
        videoDuration,
        description,
        externalUrl: externalUrl ?? null,
        isPublished: isPublished ?? false,
      },
    })

    return NextResponse.json({ spotlight }, { status: 201 })
  } catch (error) {
    console.error('[/api/admin/spotlights POST] Error:', error)
    return NextResponse.json({ error: 'Failed to create spotlight.' }, { status: 500 })
  }
}
