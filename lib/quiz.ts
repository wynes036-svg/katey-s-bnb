// Quiz scoring logic using cosine similarity
// Each answer maps to a weighted vector across mood dimensions
// Mood dimensions: [cozy, culinary, adventurous]

export const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'What does your ideal morning look like?',
    options: [
      { label: 'Slow coffee by the fire', vector: [1, 0.2, 0] },
      { label: 'A lavish farm-to-table breakfast', vector: [0.3, 1, 0.2] },
      { label: 'Sunrise hike before anyone else is up', vector: [0, 0.1, 1] },
    ],
  },
  {
    id: 'q2',
    question: 'What draws you to a place?',
    options: [
      { label: 'Warmth, quiet, and a good book', vector: [1, 0.1, 0] },
      { label: 'Local flavours and artisan stories', vector: [0.2, 1, 0.3] },
      { label: 'Dramatic landscapes and open air', vector: [0, 0.2, 1] },
    ],
  },
  {
    id: 'q3',
    question: 'Your perfect evening ends with…',
    options: [
      { label: 'Candlelight and a crackling fire', vector: [1, 0.3, 0] },
      { label: 'A wine tasting with the host', vector: [0.2, 1, 0.2] },
      { label: 'Stargazing from a hilltop', vector: [0, 0.1, 1] },
    ],
  },
]

// Mood vectors (must match order of QUIZ_QUESTIONS dimensions)
export const MOOD_VECTORS: Record<string, number[]> = {
  'Cozy & Quiet': [1, 0.2, 0],
  'Culinary Adventure': [0.2, 1, 0.2],
  'Wild & Adventurous': [0, 0.2, 1],
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0)
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0))
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0))
  if (magA === 0 || magB === 0) return 0
  return dot / (magA * magB)
}

export function sumVectors(vectors: number[][]): number[] {
  if (vectors.length === 0) return []
  const len = vectors[0].length
  return vectors.reduce(
    (acc, v) => acc.map((val, i) => val + v[i]),
    new Array(len).fill(0)
  )
}

export interface QuizResult {
  moodName: string
  score: number
  explanation: string
}

export function scoreQuiz(answers: number[][]): QuizResult[] {
  // answers is an array of 3 vectors (one per question, the selected option's vector)
  const answerVector = sumVectors(answers)

  const results: QuizResult[] = Object.entries(MOOD_VECTORS).map(([moodName, moodVector]) => {
    const score = cosineSimilarity(answerVector, moodVector)
    const explanation = generateExplanation(moodName, score)
    return { moodName, score, explanation }
  })

  // Sort descending by score
  return results.sort((a, b) => b.score - a.score)
}

function generateExplanation(moodName: string, score: number): string {
  const pct = Math.round(score * 100)
  const explanations: Record<string, string> = {
    'Cozy & Quiet': `Your answers suggest you crave warmth, stillness, and intimate comfort — a ${pct}% match for our Cozy & Quiet rooms.`,
    'Culinary Adventure': `Your love of flavour, craft, and local stories makes you a ${pct}% match for our Culinary Adventure experience.`,
    'Wild & Adventurous': `Your spirit craves open skies and dramatic landscapes — a ${pct}% match for our Wild & Adventurous rooms.`,
  }
  return explanations[moodName] ?? `A ${pct}% match for ${moodName}.`
}
