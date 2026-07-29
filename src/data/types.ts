export const DIFFICULTIES = ['A', 'B', 'C'] as const

export type Difficulty = (typeof DIFFICULTIES)[number]

export const SUBJECT_CODES = [
  'BØA1100',
  'MET1001',
  'MRK1001',
  'ORG1100',
  'BØA1200',
  'MET1002',
  'SMØ1001',
  'EXPH0500'
] as const

export type SubjectCode = (typeof SUBJECT_CODES)[number]
export type SubjectFilter = SubjectCode | 'ALLE'

export type Subject = {
  code: SubjectCode
  slug: string
  name: string
  description: string
}

export type QuizQuestion = {
  id: string
  subject: SubjectCode
  difficulty: Difficulty
  question: string
  options: [string, string, string, string]
  correctIndex: number
  explanation: string
}

export type QuizQuestionSeed = Omit<QuizQuestion, 'id' | 'subject'>

export type QuestionSummary = {
  total: number
  byDifficulty: Record<Difficulty, number>
}
