import type { Subject } from './types'

export const subjects: Subject[] = [
  {
    code: 'BØA1100',
    slug: 'boa1100',
    name: 'Bedriftsøkonomisk analyse',
    description: 'Kostnader, regnskap og beslutningsstøtte.',
  },
  {
    code: 'MET1001',
    slug: 'met1001',
    name: 'Matematikk for økonomer',
    description: 'Funksjoner, derivasjon og finansmatematikk.',
  },
  {
    code: 'MRK1001',
    slug: 'mrk1001',
    name: 'Markedsføring',
    description: 'Segmentering, posisjonering og markedstiltak.',
  },
  {
    code: 'ORG1100',
    slug: 'org1100',
    name: 'Organisasjon og ledelse',
    description: 'Struktur, ledelse og samspill i organisasjoner.',
  },
  {
    code: 'BØA1200',
    slug: 'boa1200',
    name: 'Finansregnskap med regnskapsanalyse',
    description: 'Årsregnskap, nøkkeltall og finansiell vurdering.',
  },
  {
    code: 'MET1002',
    slug: 'met1002',
    name: 'Statistikk for økonomer',
    description: 'Sannsynlighet, hypotesetesting og regresjon.',
  },
  {
    code: 'SMØ1001',
    slug: 'smo1001',
    name: 'Mikroøkonomi',
    description: 'Tilbud, etterspørsel, konkurranse og markedssvikt.',
  },
]

export const subjectByCode = Object.fromEntries(subjects.map((subject) => [subject.code, subject]))
