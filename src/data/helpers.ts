import type { Difficulty, QuizQuestion, QuizQuestionSeed, SubjectCode } from './types'

export function mc(
  difficulty: Difficulty,
  question: string,
  options: [string, string, string, string],
  correctIndex: number,
  explanation: string,
): QuizQuestionSeed {
  return {
    difficulty,
    question,
    options,
    correctIndex,
    explanation,
  }
}

export function buildSubjectQuestions(
  subject: SubjectCode,
  slug: string,
  seeds: QuizQuestionSeed[],
): QuizQuestion[] {
  const counts: Record<Difficulty, number> = { A: 0, B: 0, C: 0 }

  return seeds.map((seed) => {
    if (seed.options.length !== 4) {
      throw new Error(`${subject} har et spørsmål uten fire svaralternativer: ${seed.question}`)
    }

    if (seed.correctIndex < 0 || seed.correctIndex >= seed.options.length) {
      throw new Error(`${subject} har ugyldig correctIndex på spørsmålet: ${seed.question}`)
    }

    counts[seed.difficulty] += 1

    return {
      id: `${slug}-${seed.difficulty.toLowerCase()}-${String(counts[seed.difficulty]).padStart(2, '0')}`,
      subject,
      ...seed,
    }
  })
}
