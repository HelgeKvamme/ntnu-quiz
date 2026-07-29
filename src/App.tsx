import { useMemo, useState } from 'react'
import './App.css'
import { questionBank, questionCoverage } from './data'
import { subjectByCode, subjects } from './data/subjects'
import type { Difficulty, QuizQuestion, SubjectFilter } from './data/types'

type QuizRound = {
  subject: SubjectFilter
  difficulty: Difficulty
  questions: QuizQuestion[]
  answers: Record<string, number>
  currentIndex: number
}

const difficultyOptions: Array<{
  value: Difficulty
  label: string
  description: string
}> = [
  {
    value: 'A',
    label: 'A-kandidat',
    description: 'Avansert nivå med anvendelse, prioritering og resonnement.',
  },
  {
    value: 'B',
    label: 'B-kandidat',
    description: 'Mellomnivå med trygg begrepsforståelse og enkle beregninger.',
  },
  {
    value: 'C',
    label: 'C-kandidat',
    description: 'Grunnleggende nivå for kjernebegreper og basisforståelse.',
  },
]

function shuffleQuestions(questions: QuizQuestion[]) {
  const shuffled = [...questions]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = shuffled[index]
    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = current
  }

  return shuffled
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`
}

function App() {
  const [selectedSubject, setSelectedSubject] = useState<SubjectFilter>('ALLE')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('C')
  const [activeRound, setActiveRound] = useState<QuizRound | null>(null)

  const availableQuestions = useMemo(
    () =>
      questionBank.filter(
        (question) =>
          (selectedSubject === 'ALLE' || question.subject === selectedSubject) &&
          question.difficulty === selectedDifficulty,
      ),
    [selectedDifficulty, selectedSubject],
  )

  const currentQuestion = activeRound ? activeRound.questions[activeRound.currentIndex] ?? null : null
  const selectedAnswer = currentQuestion && activeRound ? activeRound.answers[currentQuestion.id] : undefined
  const questionAnswered = selectedAnswer !== undefined
  const answeredCount = activeRound ? Object.keys(activeRound.answers).length : 0
  const correctCount =
    activeRound?.questions.reduce((count, question) => {
      if (activeRound.answers[question.id] === question.correctIndex) {
        return count + 1
      }

      return count
    }, 0) ?? 0
  const accuracy = answeredCount === 0 ? 0 : (correctCount / answeredCount) * 100
  const isLastQuestion = activeRound ? activeRound.currentIndex === activeRound.questions.length - 1 : false
  const quizCompleted = Boolean(activeRound && questionAnswered && isLastQuestion)
  const progressPercent = activeRound ? (answeredCount / activeRound.questions.length) * 100 : 0
  const activeDifficultyMeta = difficultyOptions.find((option) => option.value === activeRound?.difficulty) ?? null
  const selectedSubjectMeta = selectedSubject === 'ALLE' ? null : subjectByCode[selectedSubject]
  const activeSubjectMeta = activeRound && activeRound.subject !== 'ALLE' ? subjectByCode[activeRound.subject] : null
  const activeAnswerIsCorrect = currentQuestion ? selectedAnswer === currentQuestion.correctIndex : false

  const roundBreakdown = useMemo(() => {
    if (!activeRound) {
      return []
    }

    const rows = new Map<
      string,
      {
        label: string
        answered: number
        correct: number
        total: number
      }
    >()

    for (const question of activeRound.questions) {
      const key = `${question.subject}-${question.difficulty}`
      const subject = subjectByCode[question.subject]
      const difficulty = difficultyOptions.find((option) => option.value === question.difficulty)
      const existing = rows.get(key)
      const isAnswered = activeRound.answers[question.id] !== undefined
      const isCorrect = activeRound.answers[question.id] === question.correctIndex

      if (!existing) {
        rows.set(key, {
          label: `${subject.code} · ${difficulty?.label ?? question.difficulty}`,
          answered: isAnswered ? 1 : 0,
          correct: isCorrect ? 1 : 0,
          total: 1,
        })
        continue
      }

      existing.total += 1

      if (isAnswered) {
        existing.answered += 1
      }

      if (isCorrect) {
        existing.correct += 1
      }
    }

    return [...rows.values()].sort((left, right) => left.label.localeCompare(right.label, 'no'))
  }, [activeRound])

  const startQuiz = (subject = selectedSubject, difficulty = selectedDifficulty) => {
    const nextQuestions = shuffleQuestions(
      questionBank.filter(
        (question) =>
          (subject === 'ALLE' || question.subject === subject) && question.difficulty === difficulty,
      ),
    )

    setActiveRound({
      subject,
      difficulty,
      questions: nextQuestions,
      answers: {},
      currentIndex: 0,
    })
  }

  const resetQuiz = () => {
    setActiveRound(null)
  }

  const answerQuestion = (optionIndex: number) => {
    if (!activeRound || !currentQuestion || questionAnswered) {
      return
    }

    setActiveRound({
      ...activeRound,
      answers: {
        ...activeRound.answers,
        [currentQuestion.id]: optionIndex,
      },
    })
  }

  const moveToNextQuestion = () => {
    if (!activeRound || !questionAnswered || isLastQuestion) {
      return
    }

    setActiveRound({
      ...activeRound,
      currentIndex: activeRound.currentIndex + 1,
    })
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Øv smart før eksamen</p>
          <h1>NTNU førsteårsquiz</h1>
          <p className="hero-copy">
            Stor spørsmålsbank for åtte fag, nivåstyrt trening og løpende status etter hvert svar.
          </p>
        </div>

        <div className="hero-stats">
          <article>
            <span>Spørsmål i banken</span>
            <strong>{questionBank.length}</strong>
          </article>
          <article>
            <span>Spørsmål i valgt quiz</span>
            <strong>{availableQuestions.length}</strong>
          </article>
          <article>
            <span>Fag dekket</span>
            <strong>{questionCoverage.length}</strong>
          </article>
        </div>
      </section>

      <section className="dashboard-grid">
        <aside className="panel control-panel">
          <h2>Velg quizoppsett</h2>

          <label className="field">
            <span>Fag</span>
            <select
              value={selectedSubject}
              onChange={(event) => setSelectedSubject(event.target.value as SubjectFilter)}
            >
              <option value="ALLE">Alle førsteårsfag</option>
              {subjects.map((subject) => (
                <option key={subject.code} value={subject.code}>
                  {subject.code} · {subject.name}
                </option>
              ))}
            </select>
          </label>

          <div className="field">
            <span>Nivå</span>
            <div className="difficulty-grid">
              {difficultyOptions.map((option) => {
                const isSelected = option.value === selectedDifficulty

                return (
                  <button
                    key={option.value}
                    type="button"
                    className={isSelected ? 'difficulty-card active' : 'difficulty-card'}
                    onClick={() => setSelectedDifficulty(option.value)}
                  >
                    <strong>{option.label}</strong>
                    <small>{option.description}</small>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="selection-preview">
            <h3>Valgt filter</h3>
            <p>{selectedSubjectMeta ? `${selectedSubjectMeta.code} · ${selectedSubjectMeta.name}` : 'Alle førsteårsfag'}</p>
            <p>{difficultyOptions.find((option) => option.value === selectedDifficulty)?.label}</p>
            <p>{availableQuestions.length} spørsmål klare for neste runde.</p>
          </div>

          <div className="actions">
            <button type="button" className="primary-button" onClick={() => startQuiz()}>
              {activeRound ? 'Start ny runde' : 'Start quiz'}
            </button>
            <button type="button" className="secondary-button" onClick={resetQuiz}>
              Nullstill økt
            </button>
          </div>

          <p className="help-text">
            Endrer du fag eller nivå underveis, brukes valget neste gang du starter en runde.
          </p>
        </aside>

        <aside className="panel summary-panel">
          <h2>Status</h2>

          <div className="score-grid">
            <article>
              <span>Spørsmål</span>
              <strong>
                {activeRound ? `${activeRound.currentIndex + 1}/${activeRound.questions.length}` : '0/0'}
              </strong>
            </article>
            <article>
              <span>Riktige svar</span>
              <strong>{correctCount}</strong>
            </article>
            <article>
              <span>Besvarte</span>
              <strong>{answeredCount}</strong>
            </article>
            <article>
              <span>Treffprosent</span>
              <strong>{formatPercent(accuracy)}</strong>
            </article>
          </div>

          <div className="session-summary">
            <h3>Aktiv runde</h3>
            {activeRound ? (
              <>
                <p>
                  <strong>Fag:</strong> {activeSubjectMeta ? `${activeSubjectMeta.code} · ${activeSubjectMeta.name}` : 'Alle førsteårsfag'}
                </p>
                <p>
                  <strong>Nivå:</strong> {activeDifficultyMeta?.label}
                </p>
                <p>
                  <strong>Fremdrift:</strong> {answeredCount} av {activeRound.questions.length} besvart
                </p>
                <div className="progress-block">
                  <div className="progress-row">
                    <span>Inkrementell status</span>
                    <strong>{formatPercent(progressPercent)}</strong>
                  </div>
                  <div className="progress-track" aria-hidden="true">
                    <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </>
            ) : (
              <p>Ingen aktiv runde ennå. Velg fag og nivå, og start når du er klar.</p>
            )}
          </div>

          <div className="session-summary">
            <h3>Status per fag og nivå</h3>
            {roundBreakdown.length > 0 ? (
              <div className="breakdown-list">
                {roundBreakdown.map((row) => {
                  const rowAccuracy = row.answered === 0 ? 0 : (row.correct / row.answered) * 100

                  return (
                    <article key={row.label} className="breakdown-card">
                      <div>
                        <strong>{row.label}</strong>
                        <span>
                          {row.answered}/{row.total} besvart · {row.correct} riktige
                        </span>
                      </div>
                      <strong>{formatPercent(rowAccuracy)}</strong>
                    </article>
                  )
                })}
              </div>
            ) : (
              <p>Status per fag og nivå vises når en runde er startet.</p>
            )}
          </div>
        </aside>
      </section>

      <section className="panel question-panel">
        {!activeRound || !currentQuestion ? (
          <div className="empty-state">
            <h2>Klar for stor spørsmålsbank</h2>
            <p>
              Velg et fag og et nivå for å starte. Velger du «Alle førsteårsfag», får du en tilfeldig rekkefølge innenfor det valgte nivået.
            </p>
            <div className="coverage-table">
              {questionCoverage.map(({ subject, summary }) => (
                <article key={subject.code} className="coverage-row">
                  <div>
                    <strong>
                      {subject.code} · {subject.name}
                    </strong>
                    <span>{subject.description}</span>
                  </div>
                  <span>
                    A {summary.byDifficulty.A} · B {summary.byDifficulty.B} · C {summary.byDifficulty.C}
                  </span>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="question-header">
              <div>
                <p className="question-meta">
                  {currentQuestion.subject} · {subjectByCode[currentQuestion.subject].name}
                </p>
                <h2>{currentQuestion.question}</h2>
              </div>
              <span className="difficulty-pill">
                {difficultyOptions.find((option) => option.value === currentQuestion.difficulty)?.label}
              </span>
            </div>

            <div className="question-status-row">
              <span>Spørsmål {activeRound.currentIndex + 1} av {activeRound.questions.length}</span>
              <span>Riktige: {correctCount}</span>
              <span>Besvarte: {answeredCount}</span>
              <span>Treffprosent: {formatPercent(accuracy)}</span>
            </div>

            <div className="options-list">
              {currentQuestion.options.map((option, optionIndex) => {
                const isSelected = selectedAnswer === optionIndex
                const isCorrectOption = optionIndex === currentQuestion.correctIndex
                const stateClass =
                  !questionAnswered ? '' : isCorrectOption ? 'correct' : isSelected ? 'incorrect' : ''

                return (
                  <button
                    key={`${currentQuestion.id}-${option}`}
                    type="button"
                    className={`option-button ${isSelected ? 'selected' : ''} ${stateClass}`.trim()}
                    onClick={() => answerQuestion(optionIndex)}
                    disabled={questionAnswered}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>
                    <span>{option}</span>
                  </button>
                )
              })}
            </div>

            {questionAnswered ? (
              <div className={activeAnswerIsCorrect ? 'feedback-card success' : 'feedback-card error'}>
                <h3>{activeAnswerIsCorrect ? 'Riktig svar' : 'Ikke helt riktig'}</h3>
                <p>{currentQuestion.explanation}</p>
                {!activeAnswerIsCorrect ? (
                  <p>
                    <strong>Fasit:</strong> {currentQuestion.options[currentQuestion.correctIndex]}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="question-footer">
              <p>
                {quizCompleted
                  ? `Ferdig! Du fikk ${correctCount} av ${answeredCount} riktige i denne runden.`
                  : 'Velg et svar for å oppdatere status og se forklaring med én gang.'}
              </p>

              <div className="footer-actions">
                {!quizCompleted ? (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={moveToNextQuestion}
                    disabled={!questionAnswered}
                  >
                    Neste spørsmål
                  </button>
                ) : (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => startQuiz(activeRound.subject, activeRound.difficulty)}
                  >
                    Spill samme oppsett på nytt
                  </button>
                )}

                <button type="button" className="secondary-button" onClick={() => startQuiz()}>
                  Ny tilfeldig runde
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  )
}

export default App
