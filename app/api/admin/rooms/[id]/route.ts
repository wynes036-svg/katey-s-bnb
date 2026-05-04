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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth()
  if (authError) return authError

  const { id } = await params

  try {
    const room = await prisma.room.findUnique({
      where: { id },
      include: { photos: { include: { hotspots: true } } },
    })
    if (!room) return NextResponse.json({ error: 'Room not found.' }, { status: 404 })
    return NextResponse.json({ room })
  } catch (error) {
    console.error('[/api/admin/rooms/[id] GET] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch room.' }, { status: 500 })
  }
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
    const { name, description, vrImageUrl, povVideoUrl, isActive } = body

    const room = await prisma.room.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(vrImageUrl !== undefined && { vrImageUrl }),
        ...(povVideoUrl !== undefined && { povVideoUrl }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json({ room })
  } catch (error) {
    console.error('[/api/admin/rooms/[id] PATCH] Error:', error)
    return NextResponse.json({ error: 'Failed to update room.' }, { status: 500 })
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
    await prisma.room.update({
      where: { id },
      data: { isActive: false },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[/api/admin/rooms/[id] DELETE] Error:', error)
    return NextResponse.json({ error: 'Failed to deactivate room.' }, { status: 500 })
  }
}
