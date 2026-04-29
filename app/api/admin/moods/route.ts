import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024 // 500MB

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
    const moods = await prisma.mood.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json({ moods })
  } catch (error) {
    console.error('[/api/admin/moods GET] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch moods.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  // Check Content-Length header for file size validation before processing
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength, 10) > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'File exceeds the 500MB maximum upload size.' },
      { status: 413 }
    )
  }

  try {
    const body = await request.json()
    const { name, videoUrl, audioUrl, descriptor } = body

    if (!name || !videoUrl || !audioUrl || !descriptor) {
      return NextResponse.json(
        { error: 'Missing required fields: name, videoUrl, audioUrl, descriptor.' },
        { status: 400 }
      )
    }

    const mood = await prisma.mood.create({
      data: { name, videoUrl, audioUrl, descriptor },
    })

    return NextResponse.json({ mood }, { status: 201 })
  } catch (error) {
    console.error('[/api/admin/moods POST] Error:', error)
    return NextResponse.json({ error: 'Failed to create mood.' }, { status: 500 })
  }
}

// File upload endpoint with streaming size check
export async function PUT(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  // Check Content-Length header first
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength, 10) > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'File exceeds the 500MB maximum upload size.' },
      { status: 413 }
    )
  }

  // Stream and check size
  let bytesRead = 0
  const reader = request.body?.getReader()

  if (!reader) {
    return NextResponse.json({ error: 'No file data received.' }, { status: 400 })
  }

  const chunks: Uint8Array[] = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    bytesRead += value.byteLength
    if (bytesRead > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File exceeds the 500MB maximum upload size.' },
        { status: 413 }
      )
    }

    chunks.push(value)
  }

  // In production, upload to Cloudflare R2:
  // const r2 = new S3Client({ ... })
  // const key = `moods/${Date.now()}-${filename}`
  // await r2.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key, Body: Buffer.concat(chunks) }))
  // const url = `${process.env.R2_PUBLIC_URL}/${key}`

  // Mock response
  const mockUrl = `https://cdn.kateys-bnb.com/moods/mock-${Date.now()}.mp4`

  return NextResponse.json({ url: mockUrl, size: bytesRead })
}
