# NTNU førsteårsquiz

En React/Vite-app for å øve til førsteårsfag ved NTNU Handelshøyskolen.

Appen gir deg en stor spørsmålsbank fordelt på åtte fag, med nivåvalg for **A**, **B** og **C**, løpende status underveis og tilfeldig rekkefølge på spørsmålene i hver runde.

## Fag i appen

- BØA1100 · Bedriftsøkonomisk analyse
- MET1001 · Matematikk for økonomer
- MRK1001 · Markedsføring
- ORG1100 · Organisasjon og ledelse
- BØA1200 · Finansregnskap med regnskapsanalyse
- MET1002 · Statistikk for økonomer
- SMØ1001 · Mikroøkonomi
- EXPH0500 · Examen philosophicum

Hvert fag har minst:

- 20 spørsmål på C-nivå
- 20 spørsmål på B-nivå
- 20 spørsmål på A-nivå

Det betyr minst **60 spørsmål per fag** og totalt **480 spørsmål** i banken.

## Funksjoner

- Velg ett fag eller kjør quiz på tvers av alle fag
- Velg vanskelighetsnivå: A, B eller C
- Få tilfeldig rekkefølge i hver runde
- Se forklaring direkte etter hvert svar
- Følg fremdrift, treffprosent og riktige svar underveis
- Se oppsummering per fag og nivå i aktiv runde
- Fungerer som statisk side via GitHub Pages

## Lokal utvikling

Krav:

- Node.js 20+
- npm

Installer avhengigheter:

```bash
npm ci
```

Start utviklingsserver:

```bash
npm run dev
```

Bygg produksjonsversjon:

```bash
npm run build
```

Kjør lint:

```bash
npm run lint
```

Forhåndsvis produksjonsbuild lokalt:

```bash
npm run preview
```

## Deploy til GitHub Pages

Repoet er satt opp for deploy via GitHub Actions.

- Workflow: `.github/workflows/deploy.yml`
- Vite base path: `'/ntnu-quiz/'` i `vite.config.ts`

Ved push til `main` bygges appen automatisk og deployes til GitHub Pages, så lenge Pages er satt opp til å bruke GitHub Actions som source.

Hvis repo-navnet endres, må også `base` i `vite.config.ts` oppdateres.

## Teknologi

- React 19
- TypeScript
- Vite
- Oxlint

## Struktur

- `src/App.tsx` – quizflyt og UI-logikk
- `src/data/questions/*.ts` – spørsmålsbank per fag
- `src/data/index.ts` – samlet bank og validering
- `src/data/helpers.ts` – bygging av spørsmåls-ID-er og seed-data
- `.github/workflows/deploy.yml` – GitHub Pages deploy
