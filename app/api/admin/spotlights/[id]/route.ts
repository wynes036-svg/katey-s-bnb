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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth()
  if (authError) return authError

  const { id } = await params

  try {
    const body = await request.json()
    const { isPublished, title, videoUrl, videoDuration, description, externalUrl } = body

    const spotlight = await prisma.artistSpotlight.update({
      where: { id },
      data: {
        ...(isPublished !== undefined && { isPublished }),
        ...(title !== undefined && { title }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(videoDuration !== undefined && { videoDuration }),
        ...(description !== undefined && { description }),
        ...(externalUrl !== undefined && { externalUrl }),
      },
    })

    return NextResponse.json({ spotlight })
  } catch (error) {
    console.error('[/api/admin/spotlights/[id] PATCH] Error:', error)
    return NextResponse.json({ error: 'Failed to update spotlight.' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth()
  if (authError) return authError

  const { id } = await params

  try {
    await prisma.artistSpotlight.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[/api/admin/spotlights/[id] DELETE] Error:', error)
    return NextResponse.json({ error: 'Failed to delete spotlight.' }, { status: 500 })
  }
}
