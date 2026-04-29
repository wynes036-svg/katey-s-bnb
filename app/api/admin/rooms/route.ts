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
    const rooms = await prisma.room.findMany({
      include: { mood: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ rooms })
  } catch (error) {
    console.error('[/api/admin/rooms GET] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch rooms.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const { name, description, moodId, vrImageUrl, povVideoUrl } = body

    if (!name || !description || !moodId || !vrImageUrl || !povVideoUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, moodId, vrImageUrl, povVideoUrl.' },
        { status: 400 }
      )
    }

    const room = await prisma.room.create({
      data: { name, description, moodId, vrImageUrl, povVideoUrl },
      include: { mood: true },
    })

    return NextResponse.json({ room }, { status: 201 })
  } catch (error) {
    console.error('[/api/admin/rooms POST] Error:', error)
    return NextResponse.json({ error: 'Failed to create room.' }, { status: 500 })
  }
}
