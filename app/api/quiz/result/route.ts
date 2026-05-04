import { NextRequest, NextResponse } from 'next/server'
import { scoreQuiz } from '@/lib/quiz'
import { prisma } from '@/lib/prisma'

interface QuizResultBody {
  answers: number[][]
}

export async function POST(request: NextRequest) {
  let body: QuizResultBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 }
    )
  }

  const { answers } = body

  // Validate: must have exactly 3 arrays, each of length 3
  if (
    !Array.isArray(answers) ||
    answers.length !== 3 ||
    !answers.every(
      (a) => Array.isArray(a) && a.length === 3 && a.every((v) => typeof v === 'number')
    )
  ) {
    return NextResponse.json(
      {
        error:
          'Invalid answers. Expected exactly 3 arrays, each containing 3 numbers.',
      },
      { status: 400 }
    )
  }

  // Score the quiz
  const quizResults = scoreQuiz(answers)

  // Fetch active rooms from DB
  const rooms = await prisma.room.findMany({
    where: { isActive: true },
  })

  // Map quiz results to rooms (no mood relation, just return first room)
  const room = rooms[0] ?? null
  const recommendations = quizResults.map((result) => ({
    room,
    score: result.score,
    explanation: result.explanation,
  })).filter((rec) => rec.room !== null)

  return NextResponse.json({ recommendations })
}
