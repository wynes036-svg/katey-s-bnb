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

  // Fetch active rooms with their mood from DB
  const rooms = await prisma.room.findMany({
    where: { isActive: true },
    include: { mood: true },
  })

  type RoomWithMood = (typeof rooms)[number]

  // Map quiz results to rooms by mood name
  const recommendations = quizResults
    .map((result) => {
      const room = rooms.find((r: RoomWithMood) => r.mood?.name === result.moodName) ?? null
      return {
        room,
        score: result.score,
        explanation: result.explanation,
      }
    })
    .filter((rec) => rec.room !== null)
    // Already sorted descending by scoreQuiz, but ensure order is preserved
    .sort((a, b) => b.score - a.score)

  return NextResponse.json({ recommendations })
}
