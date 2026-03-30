/**
 * ЦПМС КР — Export Utilities
 * Generates Excel (.xlsx) and print-ready HTML/PDF reports
 * fully in the browser — no server required.
 */

import {
  COMP_LEVELS,
  AGE_CATEGORIES,
  SCORE_CATEGORIES,
  COACH_GOLD_BONUS,
  calcAthleteTotal,
  calcCoachScore,
  getScoreCategory,
} from '../data/scoringData'

// ─── HELPERS ────────────────────────────────────────────────
const TODAY = () => new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })
const NOW   = () => new Date().toLocaleString('ru-RU', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })

const MEDAL_LABEL = { gold:'Золото 🥇', silver:'Серебро 🥈', bronze:'Бронза 🥉', none:'—' }

function getLevelLabel(id) { return COMP_LEVELS.find(l => l.id === id)?.label || id }
function getAgeLabel(id)   { return AGE_CATEGORIES.find(a => a.id === id)?.label || id }

// ─── EXCEL EXPORT (SheetJS via CDN) ─────────────────────────
/**
 * Load SheetJS dynamically (it's in the Artifact CDN env)
 * For Vite/React we do a dynamic script injection.
 */
async function loadXLSX() {
  if (window.XLSX) return window.XLSX
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
    s.onload  = () => resolve(window.XLSX)
    s.onerror = reject
    document.head.appendChild(s)
  })
}

/**
 * exportResultsExcel — full results table + per-athlete sheet + per-coach sheet
 */
export async function exportResultsExcel({ results, athletes, coaches, filename = 'ЦПМС_Результаты' }) {
  const XLSX = await loadXLSX()
  const wb = XLSX.utils.book_new()
  wb.Props = {
    Title:   'Рейтинговые результаты ЦПМС КР',
    Author:  'ЦПМС КР',
    Company: 'Центр подготовки молодёжных сборных КР',
    CreatedDate: new Date(),
  }

  // ── Sheet 1: All results ──────────────────────────────────
  const resHeaders = [
    'Дата', 'Спортсмен', 'Вид спорта', 'Тренер',
    'Соревнование', 'Уровень', 'Возр. категория',
    'Место', 'Медаль', 'Очки', 'Год',
  ]
  const resRows = results
    .slice()
    .sort((a, b) => b.points - a.points)
    .map(r => [
      r.date || String(r.year),
      r.athleteName,
      r.sport,
      r.coach || '—',
      r.competition,
      getLevelLabel(r.level),
      getAgeLabel(r.ageCat),
      r.placement,
      MEDAL_LABEL[r.medal] || '—',
      r.points,
      r.year,
    ])

  const wsResults = XLSX.utils.aoa_to_sheet([resHeaders, ...resRows])

  // Column widths
  wsResults['!cols'] = [12, 24, 18, 18, 38, 22, 16, 8, 16, 10, 8]
    .map(w => ({ wch: w }))

  // Style header row bold (SheetJS CE doesn't support styles natively; use cell format workaround)
  resHeaders.forEach((_, i) => {
    const cell = XLSX.utils.encode_cell({ r: 0, c: i })
    if (wsResults[cell]) {
      wsResults[cell].s = { font: { bold: true }, fill: { fgColor: { rgb: 'CC0000' } }, alignment: { horizontal: 'center' } }
    }
  })

  XLSX.utils.book_append_sheet(wb, wsResults, 'Все результаты')

  // ── Sheet 2: Athlete ranking ──────────────────────────────
  const rankHeaders = ['#', 'Спортсмен', 'Вид спорта', 'Регион', 'Тренер', 'Всего очков', 'Категория', 'Результатов', '🥇', '🥈', '🥉']
  const athletesRanked = athletes.map(a => {
    const myRes = results.filter(r => r.athleteId === a.id)
    const total = calcAthleteTotal(myRes)
    const cat   = getScoreCategory(total)
    const medals = { gold: 0, silver: 0, bronze: 0 }
    myRes.forEach(r => { if (medals[r.medal] !== undefined) medals[r.medal]++ })
    return { ...a, total, cat, medals, count: myRes.length }
  }).sort((a, b) => b.total - a.total)

  const rankRows = athletesRanked.map((a, i) => [
    i + 1, a.name, a.sport, a.region, a.coach || '—',
    a.total, a.cat.label, a.count,
    a.medals.gold, a.medals.silver, a.medals.bronze,
  ])

  const wsRank = XLSX.utils.aoa_to_sheet([rankHeaders, ...rankRows])
  wsRank['!cols'] = [4, 24, 18, 14, 18, 12, 16, 12, 6, 6, 6].map(w => ({ wch: w }))
  XLSX.utils.book_append_sheet(wb, wsRank, 'Рейтинг спортсменов')

  // ── Sheet 3: Coach ranking ────────────────────────────────
  const coachHeaders = ['#', 'Тренер', 'Вид спорта', 'Очки команды', 'Бонусы за золото', 'Итого', 'Спортсменов', 'Результатов']
  const coachNames = [...new Set(results.map(r => r.coach).filter(Boolean))]
  const coachRanked = coachNames.map(name => {
    const { total, golds } = calcCoachScore(name, results)
    const myAthletes = athletes.filter(a => a.coach === name)
    const myResults  = results.filter(r => r.coach === name)
    const info = coaches.find(c => c.name.includes(name.split(' ')[0]))
    const baseScore = myResults.reduce((s, r) => s + r.points, 0)
    const goldBonus = golds * COACH_GOLD_BONUS
    return { name, sport: info?.sport || '—', baseScore, goldBonus, total, athletes: myAthletes.length, results: myResults.length }
  }).sort((a, b) => b.total - a.total)

  const coachRows = coachRanked.map((c, i) => [
    i + 1, c.name, c.sport, c.baseScore, c.goldBonus, c.total, c.athletes, c.results,
  ])

  const wsCoach = XLSX.utils.aoa_to_sheet([coachHeaders, ...coachRows])
  wsCoach['!cols'] = [4, 24, 18, 14, 16, 12, 14, 12].map(w => ({ wch: w }))
  XLSX.utils.book_append_sheet(wb, wsCoach, 'Рейтинг тренеров')

  // ── Sheet 4: Scoring rules ────────────────────────────────
  const rulesData = [
    ['ПРАВИЛА НАЧИСЛЕНИЯ ОЧКОВ — ЦПМС КР'],
    [],
    ['Уровень соревнования', 'Коэффициент', '% от максимума'],
    ...COMP_LEVELS.map(l => [l.label, l.multiplier, `${Math.round(l.multiplier * 100)}%`]),
    [],
    ['Возрастная категория', 'Коэффициент', ''],
    ...AGE_CATEGORIES.map(a => [a.label, a.multiplier, `${Math.round(a.multiplier * 100)}%`]),
    [],
    ['Место', 'Базовые очки', ''],
    ...[[1,1000],[2,800],[3,650],[4,500],[5,400],[6,300],[7,200],[8,150],[9,100],[10,80]].map(([p,pts]) => [p, pts, '']),
    [],
    ['Категория', 'Минимум очков', ''],
    ...SCORE_CATEGORIES.map(c => [c.label, `${c.min}+`, '']),
  ]
  const wsRules = XLSX.utils.aoa_to_sheet(rulesData)
  wsRules['!cols'] = [30, 16, 16].map(w => ({ wch: w }))
  XLSX.utils.book_append_sheet(wb, wsRules, 'Правила')

  // Write & download
  const fname = `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, fname)
}

// ─── PDF / PRINT EXPORT ──────────────────────────────────────
/**
 * Opens a professional print-ready HTML page in a new window.
 * Works in all browsers — user does Ctrl+P → Save as PDF.
 * The HTML is fully styled and looks like an official government document.
 */
export function printAthleteRanking({ results, athletes, title = 'Рейтинг спортсменов' }) {
  const athletesRanked = athletes.map(a => {
    const myRes = results.filter(r => r.athleteId === a.id)
    const total = calcAthleteTotal(myRes)
    const cat   = getScoreCategory(total)
    const medals = { gold: 0, silver: 0, bronze: 0 }
    myRes.forEach(r => { if (medals[r.medal] !== undefined) medals[r.medal]++ })
    return { ...a, total, cat, medals, count: myRes.length }
  }).sort((a, b) => b.total - a.total)

  const rows = athletesRanked.map((a, i) => {
    const rankBg = i === 0 ? '#fff3cd' : i === 1 ? '#f0f0f0' : i === 2 ? '#fde8d8' : 'transparent'
    const rankLabel = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}`
    const catStyle = `color:${a.cat.color};font-weight:700;font-size:10px;`
    return `
      <tr style="background:${rankBg}">
        <td style="text-align:center;font-weight:700;font-size:14px;">${rankLabel}</td>
        <td style="font-weight:600;">${a.name}</td>
        <td>${a.sport}</td>
        <td>${a.region}</td>
        <td>${a.coach || '—'}</td>
        <td style="text-align:center;font-weight:700;color:#CC0000;font-size:16px;">${a.total}</td>
        <td style="text-align:center"><span style="${catStyle}">${a.cat.label}</span></td>
        <td style="text-align:center">${a.count}</td>
        <td style="text-align:center">🥇${a.medals.gold} 🥈${a.medals.silver} 🥉${a.medals.bronze}</td>
      </tr>`
  }).join('')

  openPrintWindow({
    title,
    subtitle: `Центр подготовки молодёжных сборных Кыргызской Республики`,
    date: TODAY(),
    content: `
      <table>
        <thead>
          <tr>
            <th style="width:50px">Место</th>
            <th>Спортсмен</th>
            <th>Вид спорта</th>
            <th>Регион</th>
            <th>Тренер</th>
            <th style="width:80px">Очки</th>
            <th style="width:110px">Категория</th>
            <th style="width:60px">Рез.</th>
            <th style="width:120px">Медали</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`,
    footer: `Сформировано: ${NOW()} · ЦПМС КР · Официальный рейтинговый отчёт`,
  })
}

export function printCoachRanking({ results, athletes, coaches }) {
  const coachNames = [...new Set(results.map(r => r.coach).filter(Boolean))]
  const coachRanked = coachNames.map(name => {
    const { total, golds } = calcCoachScore(name, results)
    const myAthletes = athletes.filter(a => a.coach === name)
    const myResults  = results.filter(r => r.coach === name)
    const info = coaches.find(c => c.name.includes(name.split(' ')[0]))
    const baseScore = myResults.reduce((s, r) => s + r.points, 0)
    return { name, sport: info?.sport || '—', baseScore, goldBonus: golds * COACH_GOLD_BONUS, total, athletes: myAthletes.length, results: myResults.length, golds }
  }).sort((a, b) => b.total - a.total)

  const rows = coachRanked.map((c, i) => {
    const rankBg = i === 0 ? '#fff3cd' : i === 1 ? '#f0f0f0' : i === 2 ? '#fde8d8' : 'transparent'
    const rankLabel = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}`
    return `
      <tr style="background:${rankBg}">
        <td style="text-align:center;font-weight:700;font-size:14px;">${rankLabel}</td>
        <td style="font-weight:600;">${c.name}</td>
        <td>${c.sport}</td>
        <td style="text-align:center">${c.athletes}</td>
        <td style="text-align:center">${c.results}</td>
        <td style="text-align:center">${c.golds} 🥇</td>
        <td style="text-align:center;color:#666">${c.goldBonus > 0 ? '+' + c.goldBonus : '—'}</td>
        <td style="text-align:center;font-weight:700;color:#CC0000;font-size:16px;">${c.total}</td>
      </tr>`
  }).join('')

  openPrintWindow({
    title: 'Рейтинг тренеров',
    subtitle: 'Центр подготовки молодёжных сборных Кыргызской Республики',
    date: TODAY(),
    content: `
      <table>
        <thead>
          <tr>
            <th style="width:50px">Место</th>
            <th>Тренер</th>
            <th>Вид спорта</th>
            <th style="width:80px">Спортсм.</th>
            <th style="width:70px">Рез.</th>
            <th style="width:80px">Золото</th>
            <th style="width:90px">Бонус</th>
            <th style="width:90px">Итого очков</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`,
    footer: `Сформировано: ${NOW()} · ЦПМС КР · Официальный рейтинговый отчёт`,
  })
}

export function printAllResults({ results, filters = {} }) {
  const year  = filters.year  || 'all'
  const level = filters.level || 'all'

  let filtered = results.slice()
  if (year  !== 'all') filtered = filtered.filter(r => r.year  === +year)
  if (level !== 'all') filtered = filtered.filter(r => r.level === level)
  filtered.sort((a, b) => b.points - a.points)

  const rows = filtered.map((r, i) => {
    const med = { gold:'🥇 Золото', silver:'🥈 Серебро', bronze:'🥉 Бронза', none:'—' }[r.medal] || '—'
    const rowBg = i % 2 === 0 ? 'transparent' : '#fafafa'
    return `
      <tr style="background:${rowBg}">
        <td>${r.date || r.year}</td>
        <td style="font-weight:600">${r.athleteName}</td>
        <td>${r.sport}</td>
        <td>${r.coach || '—'}</td>
        <td>${r.competition}</td>
        <td>${getLevelLabel(r.level)}</td>
        <td>${getAgeLabel(r.ageCat)}</td>
        <td style="text-align:center;font-weight:700">${r.placement}</td>
        <td>${med}</td>
        <td style="text-align:center;font-weight:700;color:#CC0000">${r.points}</td>
      </tr>`
  }).join('')

  const filterDesc = [
    year  !== 'all' ? `Год: ${year}` : null,
    level !== 'all' ? `Уровень: ${getLevelLabel(level)}` : null,
  ].filter(Boolean).join(' · ') || 'Все результаты'

  openPrintWindow({
    title: 'Таблица результатов',
    subtitle: `${filterDesc} · ЦПМС КР`,
    date: TODAY(),
    content: `
      <p style="margin-bottom:12px;font-size:11px;color:#666">Всего записей: <strong>${filtered.length}</strong></p>
      <table>
        <thead>
          <tr>
            <th style="width:80px">Дата</th>
            <th>Спортсмен</th>
            <th>Спорт</th>
            <th>Тренер</th>
            <th>Соревнование</th>
            <th>Уровень</th>
            <th style="width:70px">Категория</th>
            <th style="width:55px">Место</th>
            <th style="width:90px">Медаль</th>
            <th style="width:65px">Очки</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`,
    footer: `Сформировано: ${NOW()} · ЦПМС КР`,
  })
}

export function printAthleteCard({ athlete, results }) {
  const myResults = results.filter(r => r.athleteId === athlete.id)
  const total = calcAthleteTotal(myResults)
  const cat   = getScoreCategory(total)
  const medals = { gold: 0, silver: 0, bronze: 0 }
  myResults.forEach(r => { if (medals[r.medal] !== undefined) medals[r.medal]++ })

  const byYear = {}
  myResults.forEach(r => { byYear[r.year] = (byYear[r.year] || 0) + r.points })

  const yearRows = Object.entries(byYear).sort(([a],[b]) => +b - +a)
    .map(([y, pts]) => `<tr><td>${y}</td><td style="font-weight:700;color:#CC0000">${pts}</td></tr>`).join('')

  const resultRows = myResults.slice().sort((a,b) => b.points - a.points).map(r => {
    const med = { gold:'🥇', silver:'🥈', bronze:'🥉', none:'—' }[r.medal]
    return `
      <tr>
        <td>${r.date || r.year}</td>
        <td>${r.competition}</td>
        <td>${getLevelLabel(r.level)}</td>
        <td>${getAgeLabel(r.ageCat)}</td>
        <td style="text-align:center">${r.placement}</td>
        <td style="text-align:center">${med}</td>
        <td style="text-align:center;font-weight:700;color:#CC0000">${r.points}</td>
      </tr>`
  }).join('')

  const year = new Date().getFullYear()
  const dob = athlete.dob || '—'
  const age = athlete.dob ? new Date().getFullYear() - parseInt(athlete.dob) : '—'

  openPrintWindow({
    title: `Карточка спортсмена`,
    subtitle: athlete.name,
    date: TODAY(),
    landscape: false,
    content: `
      <!-- Info block -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;border:1px solid #e0e0e0;padding:16px">
        <div>
          <table style="width:100%;border:none">
            <tr><td style="color:#888;width:140px;border:none;padding:4px 0">ФИО:</td><td style="font-weight:700;border:none;padding:4px 0">${athlete.name}</td></tr>
            <tr><td style="color:#888;border:none;padding:4px 0">Вид спорта:</td><td style="border:none;padding:4px 0">${athlete.sport}</td></tr>
            <tr><td style="color:#888;border:none;padding:4px 0">Регион:</td><td style="border:none;padding:4px 0">${athlete.region}</td></tr>
            <tr><td style="color:#888;border:none;padding:4px 0">Дата рождения:</td><td style="border:none;padding:4px 0">${dob} ${age !== '—' ? `(${age} лет)` : ''}</td></tr>
            <tr><td style="color:#888;border:none;padding:4px 0">Разряд:</td><td style="border:none;padding:4px 0">${athlete.rank || '—'}</td></tr>
            <tr><td style="color:#888;border:none;padding:4px 0">Тренер:</td><td style="border:none;padding:4px 0">${athlete.coach || '—'}</td></tr>
            <tr><td style="color:#888;border:none;padding:4px 0">Первый тренер:</td><td style="border:none;padding:4px 0">${athlete.firstCoach || '—'}</td></tr>
          </table>
        </div>
        <div>
          <div style="background:#CC0000;color:white;padding:12px;text-align:center;margin-bottom:8px">
            <div style="font-size:11px;opacity:0.8;margin-bottom:4px">ИТОГОВЫЙ РЕЙТИНГ</div>
            <div style="font-size:36px;font-weight:900;line-height:1">${total}</div>
            <div style="font-size:13px;font-weight:700;margin-top:4px">${cat.label.toUpperCase()}</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;text-align:center">
            <div style="background:#fff3cd;padding:8px;border:1px solid #ffc107"><div style="font-size:18px">🥇</div><div style="font-weight:700;font-size:16px">${medals.gold}</div></div>
            <div style="background:#f0f0f0;padding:8px;border:1px solid #ccc"><div style="font-size:18px">🥈</div><div style="font-weight:700;font-size:16px">${medals.silver}</div></div>
            <div style="background:#fde8d8;padding:8px;border:1px solid #f97316"><div style="font-size:18px">🥉</div><div style="font-weight:700;font-size:16px">${medals.bronze}</div></div>
          </div>
        </div>
      </div>

      <!-- Points by year -->
      <h3 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#888;margin:0 0 8px 0">Очки по годам</h3>
      <table style="width:300px;margin-bottom:20px">
        <thead><tr><th>Год</th><th>Очки</th></tr></thead>
        <tbody>${yearRows}</tbody>
      </table>

      <!-- Results table -->
      <h3 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#888;margin:0 0 8px 0">Все результаты (${myResults.length})</h3>
      <table>
        <thead>
          <tr>
            <th style="width:80px">Дата</th>
            <th>Соревнование</th>
            <th>Уровень</th>
            <th style="width:70px">Возраст</th>
            <th style="width:55px">Место</th>
            <th style="width:55px">Медаль</th>
            <th style="width:65px">Очки</th>
          </tr>
        </thead>
        <tbody>${resultRows}</tbody>
      </table>`,
    footer: `Сформировано: ${NOW()} · Государственное агентство физической культуры и спорта КР`,
  })
}

// ─── CORE PRINT WINDOW RENDERER ─────────────────────────────
function openPrintWindow({ title, subtitle, date, content, footer, landscape = true }) {
  const orientation = landscape ? 'landscape' : 'portrait'

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — ЦПМС КР</title>
  <style>
    /* ── Page setup ── */
    @page {
      size: A4 ${orientation};
      margin: 18mm 15mm 18mm 15mm;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      thead { display: table-header-group; }
      tr { page-break-inside: avoid; }
    }

    /* ── Reset ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Typography ── */
    body {
      font-family: 'Segoe UI', Arial, 'DejaVu Sans', sans-serif;
      font-size: 11px;
      color: #111;
      line-height: 1.5;
      background: #fff;
    }

    /* ── Header ── */
    .doc-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-bottom: 14px;
      border-bottom: 3px solid #CC0000;
      margin-bottom: 16px;
    }
    .doc-logo {
      width: 52px;
      height: 52px;
      background: #CC0000;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 1px;
      flex-shrink: 0;
    }
    .doc-header-text { flex: 1; }
    .doc-org {
      font-size: 9px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 2px;
    }
    .doc-title {
      font-size: 20px;
      font-weight: 900;
      color: #111;
      text-transform: uppercase;
      letter-spacing: 1px;
      line-height: 1.1;
    }
    .doc-subtitle {
      font-size: 11px;
      color: #CC0000;
      font-weight: 600;
      margin-top: 2px;
    }
    .doc-date {
      font-size: 10px;
      color: #888;
      text-align: right;
      flex-shrink: 0;
    }

    /* ── Table ── */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5px;
    }
    thead tr {
      background: #CC0000;
      color: #fff;
    }
    th {
      padding: 7px 8px;
      text-align: left;
      font-weight: 700;
      font-size: 9.5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
    td {
      padding: 6px 8px;
      border-bottom: 1px solid #f0f0f0;
      vertical-align: middle;
    }
    tr:last-child td { border-bottom: none; }
    tbody tr:hover { background: #fafafa; }

    /* ── Footer ── */
    .doc-footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #e0e0e0;
      font-size: 9px;
      color: #999;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .doc-stamp {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .doc-stamp-dot {
      width: 6px;
      height: 6px;
      background: #CC0000;
      border-radius: 50%;
    }

    /* ── Print button ── */
    .print-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #CC0000;
      color: white;
      border: none;
      padding: 12px 24px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      border-radius: 4px;
      box-shadow: 0 4px 16px rgba(204,0,0,0.4);
      z-index: 999;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .print-btn:hover { background: #990000; }
    .save-btn {
      position: fixed;
      bottom: 24px;
      right: 180px;
      background: #fff;
      color: #CC0000;
      border: 2px solid #CC0000;
      padding: 12px 20px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      border-radius: 4px;
      z-index: 999;
    }
  </style>
</head>
<body>

  <!-- Print / Close buttons -->
  <button class="print-btn no-print" onclick="window.print()">
    🖨️ Печать / Сохранить PDF
  </button>
  <button class="save-btn no-print" onclick="window.close()">
    ✕ Закрыть
  </button>

  <!-- Document header -->
  <div class="doc-header">
    <div class="doc-logo">КР</div>
    <div class="doc-header-text">
      <div class="doc-org">Кыргызская Республика · Государственное агентство физической культуры и спорта</div>
      <div class="doc-title">${title}</div>
      <div class="doc-subtitle">${subtitle}</div>
    </div>
    <div class="doc-date">
      <div style="font-weight:700;font-size:11px;color:#111">${date}</div>
      <div style="margin-top:4px;color:#CC0000;font-weight:600;font-size:9px;">ОФИЦИАЛЬНЫЙ ДОКУМЕНТ</div>
    </div>
  </div>

  <!-- Main content -->
  ${content}

  <!-- Footer -->
  <div class="doc-footer">
    <div class="doc-stamp">
      <div class="doc-stamp-dot"></div>
      <span>${footer}</span>
    </div>
    <div>ЦПМС КР — Система автоматического рейтинга</div>
  </div>

</body>
</html>`

  const win = window.open('', '_blank', 'width=1100,height=800')
  if (!win) { alert('Разрешите всплывающие окна для этого сайта'); return }
  win.document.open()
  win.document.write(html)
  win.document.close()
  // Auto-trigger print dialog after short delay for render
  setTimeout(() => { try { win.focus() } catch(e) {} }, 400)
}
