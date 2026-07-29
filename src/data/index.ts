import { boa1100Questions } from './questions/boa1100'
import { boa1200Questions } from './questions/boa1200'
import { met1001Questions } from './questions/met1001'
import { met1002Questions } from './questions/met1002'
import { mrk1001Questions } from './questions/mrk1001'
import { org1100Questions } from './questions/org1100'
import { smo1001Questions } from './questions/smo1001'
import { subjectByCode, subjects } from './subjects'
import { DIFFICULTIES, SUBJECT_CODES, type Difficulty, type QuestionSummary, type QuizQuestion, type SubjectCode } from './types'

const MIN_TOTAL_PER_SUBJECT = 60
const MIN_PER_DIFFICULTY = 20

export const questionBank: QuizQuestion[] = [
  ...boa1100Questions,
  ...met1001Questions,
  ...mrk1001Questions,
  ...org1100Questions,
  ...boa1200Questions,
  ...met1002Questions,
  ...smo1001Questions,
]

export const subjectQuestionSummaries: Record<SubjectCode, QuestionSummary> = Object.fromEntries(
  SUBJECT_CODES.map((subject) => {
    const byDifficulty = Object.fromEntries(
      DIFFICULTIES.map((difficulty) => [
        difficulty,
        questionBank.filter((question) => question.subject === subject && question.difficulty === difficulty).length,
      ]),
    ) as Record<Difficulty, number>

    return [
      subject,
      {
        total: questionBank.filter((question) => question.subject === subject).length,
        byDifficulty,
      },
    ]
  }),
) as Record<SubjectCode, QuestionSummary>

export const totalQuestionCount = questionBank.length

const seenIds = new Set<string>()

for (const question of questionBank) {
  if (!subjectByCode[question.subject]) {
    throw new Error(`Ukjent fagkode i spørsmålsbanken: ${question.subject}`)
  }

  if (question.options.length !== 4) {
    throw new Error(`Spørsmålet ${question.id} må ha fire svaralternativer.`)
  }

  if (question.correctIndex < 0 || question.correctIndex >= question.options.length) {
    throw new Error(`Spørsmålet ${question.id} har ugyldig correctIndex.`)
  }

  if (seenIds.has(question.id)) {
    throw new Error(`Duplikat spørsmål-id funnet: ${question.id}`)
  }

  seenIds.add(question.id)
}

for (const subject of SUBJECT_CODES) {
  const summary = subjectQuestionSummaries[subject]

  if (summary.total < MIN_TOTAL_PER_SUBJECT) {
    throw new Error(`${subject} har ${summary.total} spørsmål. Minstekravet er ${MIN_TOTAL_PER_SUBJECT}.`)
  }

  for (const difficulty of DIFFICULTIES) {
    if (summary.byDifficulty[difficulty] < MIN_PER_DIFFICULTY) {
      throw new Error(
        `${subject} har ${summary.byDifficulty[difficulty]} spørsmål på nivå ${difficulty}. Minstekravet er ${MIN_PER_DIFFICULTY}.`,
      )
    }
  }
}

export const questionCoverage = subjects.map((subject) => ({
  subject,
  summary: subjectQuestionSummaries[subject.code],
}))
