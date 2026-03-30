// ─── SCORING RULES ──────────────────────────────────────────
export const COMP_LEVELS = [
  { id: 'world',       label: 'Чемпионат мира',        labelEn: 'World Championship',     multiplier: 1.0,  color: '#CC0000' },
  { id: 'olympics',    label: 'Олимпийские игры',       labelEn: 'Olympic Games',          multiplier: 1.2,  color: '#F5C518' },
  { id: 'asian',       label: 'Чемпионат Азии',         labelEn: 'Asian Championship',     multiplier: 0.8,  color: '#f97316' },
  { id: 'central_asia',label: 'Чемпионат ЦА',           labelEn: 'Central Asia Champ.',    multiplier: 0.65, color: '#8b5cf6' },
  { id: 'cis',         label: 'Чемпионат СНГ',          labelEn: 'CIS Championship',       multiplier: 0.6,  color: '#06b6d4' },
  { id: 'national',    label: 'Чемпионат КР',           labelEn: 'National Championship',  multiplier: 0.5,  color: '#22c55e' },
  { id: 'republic',    label: 'Первенство КР',          labelEn: 'Republic Championship',  multiplier: 0.4,  color: '#84cc16' },
  { id: 'regional',    label: 'Региональные соревн.',   labelEn: 'Regional Competition',   multiplier: 0.25, color: '#64748b' },
  { id: 'local',       label: 'Местные соревнования',   labelEn: 'Local Competition',      multiplier: 0.15, color: '#94a3b8' },
]

export const AGE_CATEGORIES = [
  { id: 'adults', label: 'Взрослые',  labelEn: 'Adults',  multiplier: 1.0 },
  { id: 'u23',    label: 'U23',       labelEn: 'U23',     multiplier: 0.85 },
  { id: 'u20',    label: 'U20',       labelEn: 'U20',     multiplier: 0.75 },
  { id: 'u17',    label: 'U17',       labelEn: 'U17',     multiplier: 0.65 },
  { id: 'u15',    label: 'U15',       labelEn: 'U15',     multiplier: 0.55 },
]

// Base points per placement
export const PLACEMENT_POINTS = {
  1: 1000,
  2: 800,
  3: 650,
  4: 500,
  5: 400,
  6: 300,
  7: 200,
  8: 150,
  9: 100,
  10: 80,
}

// Medal bonus
export const MEDAL_BONUS = {
  gold:   50,
  silver: 30,
  bronze: 20,
  none:   0,
}

// Coach bonus per gold medal from their athlete
export const COACH_GOLD_BONUS = 75

// Score category thresholds
export const SCORE_CATEGORIES = [
  { min: 1200, label: 'Элита',           labelEn: 'Elite',        color: '#CC0000',  bg: 'bg-red-50',     border: 'border-red-300',     text: 'text-red-700'     },
  { min: 900,  label: 'Высокий уровень', labelEn: 'High Level',   color: '#f97316',  bg: 'bg-orange-50',  border: 'border-orange-300',  text: 'text-orange-700'  },
  { min: 600,  label: 'Средний уровень', labelEn: 'Medium Level', color: '#F5C518',  bg: 'bg-yellow-50',  border: 'border-yellow-300',  text: 'text-yellow-700'  },
  { min: 300,  label: 'Низкий уровень',  labelEn: 'Low Level',    color: '#22c55e',  bg: 'bg-green-50',   border: 'border-green-300',   text: 'text-green-700'   },
  { min: 0,    label: 'Начинающий',      labelEn: 'Beginner',     color: '#94a3b8',  bg: 'bg-slate-50',   border: 'border-slate-300',   text: 'text-slate-600'   },
]

// ─── SCORING ENGINE ──────────────────────────────────────────
export function calcResultPoints(result) {
  const level    = COMP_LEVELS.find(l => l.id === result.level)    || COMP_LEVELS[5]
  const ageCat   = AGE_CATEGORIES.find(a => a.id === result.ageCat) || AGE_CATEGORIES[0]
  const base     = PLACEMENT_POINTS[result.placement] || (result.placement <= 20 ? 50 : 20)
  const medalB   = MEDAL_BONUS[result.medal] || 0
  const points   = Math.round((base + medalB) * level.multiplier * ageCat.multiplier)
  return points
}

export function getScoreCategory(total) {
  return SCORE_CATEGORIES.find(c => total >= c.min) || SCORE_CATEGORIES[SCORE_CATEGORIES.length - 1]
}

export function calcAthleteTotal(results) {
  return results.reduce((sum, r) => sum + (r.points || 0), 0)
}

export function calcCoachScore(coachName, allResults) {
  let total = 0
  let golds = 0
  allResults.forEach(r => {
    if (r.coach === coachName) {
      total += r.points || 0
      if (r.medal === 'gold') { total += COACH_GOLD_BONUS; golds++ }
    }
  })
  return { total, golds }
}

// ─── INITIAL RESULTS DATA ───────────────────────────────────
export const initialResults = [
  { id:1,  athleteId:1, athleteName:'Айбек Мамытов',       sport:'Борьба',          coach:'Иванов А.',   competition:'Чемпионат мира 2024',      level:'world',       ageCat:'adults', placement:3, medal:'bronze', year:2024, points:0, date:'2024-09-15' },
  { id:2,  athleteId:1, athleteName:'Айбек Мамытов',       sport:'Борьба',          coach:'Иванов А.',   competition:'Чемпионат КР 2024',         level:'national',    ageCat:'adults', placement:1, medal:'gold',   year:2024, points:0, date:'2024-05-10' },
  { id:3,  athleteId:1, athleteName:'Айбек Мамытов',       sport:'Борьба',          coach:'Иванов А.',   competition:'Чемпионат Азии 2024',       level:'asian',       ageCat:'adults', placement:2, medal:'silver', year:2024, points:0, date:'2024-07-22' },
  { id:4,  athleteId:2, athleteName:'Жанара Асанова',      sport:'Лёгкая атлетика', coach:'Петрова М.',  competition:'Первенство КР 2024',        level:'republic',    ageCat:'u20',   placement:1, medal:'gold',   year:2024, points:0, date:'2024-06-05' },
  { id:5,  athleteId:2, athleteName:'Жанара Асанова',      sport:'Лёгкая атлетика', coach:'Петрова М.',  competition:'Чемпионат ЦА 2024',         level:'central_asia',ageCat:'u20',   placement:4, medal:'none',   year:2024, points:0, date:'2024-08-18' },
  { id:6,  athleteId:3, athleteName:'Темир Бакытов',       sport:'Бокс',            coach:'Дуйшеев К.',  competition:'Чемпионат мира U22 2023',   level:'world',       ageCat:'u23',   placement:5, medal:'none',   year:2023, points:0, date:'2023-11-03' },
  { id:7,  athleteId:3, athleteName:'Темир Бакытов',       sport:'Бокс',            coach:'Дуйшеев К.',  competition:'Кубок Азии 2023',           level:'asian',       ageCat:'adults', placement:2, medal:'silver', year:2023, points:0, date:'2023-08-14' },
  { id:8,  athleteId:3, athleteName:'Темир Бакытов',       sport:'Бокс',            coach:'Дуйшеев К.',  competition:'Чемпионат КР 2024',         level:'national',    ageCat:'adults', placement:1, medal:'gold',   year:2024, points:0, date:'2024-04-20' },
  { id:9,  athleteId:4, athleteName:'Айгуль Токтосунова',  sport:'Плавание',        coach:'Сидорова Е.', competition:'Первенство КР 2024 (100м)', level:'republic',    ageCat:'u17',   placement:1, medal:'gold',   year:2024, points:0, date:'2024-03-12' },
  { id:10, athleteId:4, athleteName:'Айгуль Токтосунова',  sport:'Плавание',        coach:'Сидорова Е.', competition:'Открытый ЧК 2024',          level:'regional',    ageCat:'u17',   placement:2, medal:'silver', year:2024, points:0, date:'2024-05-30' },
  { id:11, athleteId:5, athleteName:'Нурлан Эшматов',      sport:'Дзюдо',           coach:'Осмонов Б.',  competition:'Кубок КР 2024',             level:'national',    ageCat:'adults', placement:1, medal:'gold',   year:2024, points:0, date:'2024-06-15' },
  { id:12, athleteId:5, athleteName:'Нурлан Эшматов',      sport:'Дзюдо',           coach:'Осмонов Б.',  competition:'Первенство ЦА 2024',        level:'central_asia',ageCat:'adults', placement:2, medal:'silver', year:2024, points:0, date:'2024-09-01' },
].map(r => ({ ...r, points: calcResultPoints(r) }))

// ─── IMPORT HISTORY ─────────────────────────────────────────
export const initialImportHistory = [
  { id:1, fileName:'results_world_2024.pdf',   uploadedAt:'2024-10-01', rows:12, status:'parsed', uploadedBy:'admin' },
  { id:2, fileName:'national_champ_2024.xlsx', uploadedAt:'2024-08-15', rows:48, status:'parsed', uploadedBy:'admin' },
]
