'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QUIZ_QUESTIONS, scoreQuiz, QuizResult } from '@/lib/quiz'
import type { Room } from '@/types'

interface VibeCheckQuizProps {
  rooms: Room[]
}

export default function VibeCheckQuiz({ rooms }: VibeCheckQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[][]>([])
  const [results, setResults] = useState<QuizResult[] | null>(null)
  const [visible, setVisible] = useState(true)

  function handleAnswer(vector: number[]) {
    const newAnswers = [...answers, vector]

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      // Animate out, then advance
      setVisible(false)
      setTimeout(() => {
        setAnswers(newAnswers)
        setCurrentQuestion(currentQuestion + 1)
        setVisible(true)
      }, 200)
    } else {
      // Last question — score synchronously
      setVisible(false)
      setTimeout(() => {
        setAnswers(newAnswers)
        const scored = scoreQuiz(newAnswers)
        setResults(scored)
        setVisible(true)
      }, 200)
    }
  }

  function handleRetake() {
    setVisible(false)
    setTimeout(() => {
      setCurrentQuestion(0)
      setAnswers([])
      setResults(null)
      setVisible(true)
    }, 200)
  }

  // Determine which rooms to show based on tie threshold
  function getRecommendedRooms(scored: QuizResult[]): QuizResult[] {
    if (scored.length >= 2 && scored[1].score >= scored[0].score * 0.9) {
      return [scored[0], scored[1]]
    }
    return [scored[0]]
  }

  function findRoom(moodName: string): Room | undefined {
    return rooms.find((r) => r.mood?.name === moodName && r.isActive)
  }

  const question = QUIZ_QUESTIONS[currentQuestion]

  return (
    <div className="flex justify-center px-4 py-8">
      <div
        className="w-full max-w-lg rounded-2xl bg-amber-50 p-8 shadow-md"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out',
        }}
      >
        {!results ? (
          <>
            {/* Progress indicator */}
            <div className="mb-6 flex gap-2">
              {QUIZ_QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    i <= currentQuestion ? 'bg-amber-600' : 'bg-amber-200'
                  }`}
                />
              ))}
            </div>

            {/* Question */}
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-500">
              Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
            </p>
            <h2 className="mb-6 text-xl font-semibold text-stone-800">
              {question.question}
            </h2>

            {/* Answer options */}
            <div className="flex flex-col gap-3">
              {question.options.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleAnswer(option.vector)}
                  className="rounded-xl border border-amber-200 bg-white px-5 py-4 text-left text-stone-700 transition-colors duration-150 hover:border-amber-400 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Results */}
            <h2 className="mb-2 text-xl font-semibold text-stone-800">
              Your Vibe Match
            </h2>
            <p className="mb-6 text-sm text-stone-500">
              Based on your answers, here{' '}
              {getRecommendedRooms(results).length === 1 ? 'is your' : 'are your top'} recommendation
              {getRecommendedRooms(results).length > 1 ? 's' : ''}:
            </p>

            <div className="flex flex-col gap-4">
              {getRecommendedRooms(results).map((result, index) => {
                const room = findRoom(result.moodName)
                return (
                  <div
                    key={result.moodName}
                    className="rounded-xl border border-amber-200 bg-white p-5"
                  >
                    {index === 0 && (
                      <span className="mb-2 inline-block rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-700">
                        Best Match
                      </span>
                    )}
                    <h3 className="mb-1 text-lg font-semibold text-stone-800">
                      {room ? room.name : result.moodName}
                    </h3>
                    <p className="mb-4 text-sm text-stone-600">{result.explanation}</p>
                    {room && (
                      <Link
                        href={`/booking?roomId=${room.id}`}
                        className="inline-block rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      >
                        Book This Room
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>

            <button
              onClick={handleRetake}
              className="mt-6 w-full rounded-xl border border-amber-300 bg-transparent px-5 py-3 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              Retake Quiz
            </button>
          </>
        )}
      </div>
    </div>
  )
}
