import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Trophy, Medal, Star, TrendingUp, Users, Upload, Plus, Edit2, Trash2,
  Download, Printer, X, Check, AlertCircle, ChevronUp, ChevronDown, Search,
  FileText, BarChart2, Settings, History, Bot, Filter, RefreshCw,
  Award, Target, Zap, Eye, ChevronLeft, ChevronRight, LogOut, Menu
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import {
  COMP_LEVELS, AGE_CATEGORIES, PLACEMENT_POINTS, MEDAL_BONUS,
  SCORE_CATEGORIES, COACH_GOLD_BONUS,
  calcResultPoints, getScoreCategory, calcAthleteTotal, calcCoachScore
} from '../data/scoringData'
import {
  exportResultsExcel,
  printAthleteRanking,
  printCoachRanking,
  printAllResults,
  printAthleteCard,
} from '../utils/exportUtils'

// ─── HELPERS ────────────────────────────────────────────────
const MEDAL_COLORS = {
  gold:   { bg:'bg-yellow-50',   border:'border-yellow-300', text:'text-yellow-700', icon:'🥇' },
  silver: { bg:'bg-slate-50',    border:'border-slate-300',  text:'text-slate-600',  icon:'🥈' },
  bronze: { bg:'bg-orange-50',   border:'border-orange-300', text:'text-orange-700', icon:'🥉' },
  none:   { bg:'bg-surf2',       border:'border-black/8',    text:'text-ink4',       icon:'—'  },
}

function ScoreBadge({ total, small }) {
  const cat = getScoreCategory(total)
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 border text-[9px] font-bold uppercase tracking-wide ${cat.bg} ${cat.border} ${cat.text} ${small ? '' : 'px-3 py-1 text-[10px]'}`}>
      {cat.label}
    </span>
  )
}

function MiniBar({ value, max, color = '#CC0000' }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="h-1.5 bg-black/6 overflow-hidden flex-1">
      <div className="h-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

// Simple sparkline SVG
function Sparkline({ data, color = '#CC0000' }) {
  if (!data || data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80, h = 24
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts.split(' ').pop().split(',')[0]} cy={pts.split(' ').pop().split(',')[1]} r="3" fill={color} />
    </svg>
  )
}

// ─── RESULT FORM MODAL ───────────────────────────────────────
function ResultModal({ mode, initial, athletes, onSave, onClose }) {
  const { isDuplicate } = useApp()
  const [form, setForm] = useState(initial || {
    athleteId: '', athleteName: '', sport: '', coach: '',
    competition: '', level: 'national', ageCat: 'adults',
    placement: 1, medal: 'none', year: new Date().getFullYear(), date: '',
  })
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const pts = calcResultPoints({ ...form, placement: +form.placement })
    setPreview(pts)
  }, [form])

  const handleAthleteSelect = (e) => {
    const a = athletes.find(x => String(x.id) === e.target.value)
    if (a) setForm(p => ({ ...p, athleteId: a.id, athleteName: a.name, sport: a.sport, coach: a.coach }))
  }

  const autoMedal = (place) => {
    if (+place === 1) return 'gold'
    if (+place === 2) return 'silver'
    if (+place === 3) return 'bronze'
    return 'none'
  }

  const handleSave = () => {
    setError('')
    if (!form.athleteId || !form.competition || !form.placement) {
      setError('Заполните обязательные поля: спортсмен, соревнование, место')
      return
    }
    const r = { ...form, placement: +form.placement, year: +form.year }
    if (mode === 'add' && isDuplicate(r)) {
      setError('Такой результат уже существует (дубликат)')
      return
    }
    onSave(r)
  }

  const levelData = COMP_LEVELS.find(l => l.id === form.level)
  const ageCatData = AGE_CATEGORIES.find(a => a.id === form.ageCat)

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white max-w-2xl w-full shadow-2xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-black/8">
          <div>
            <div className="font-bebas text-2xl text-ink tracking-wider">
              {mode === 'add' ? 'Добавить результат' : 'Редактировать результат'}
            </div>
            <div className="text-[10px] text-ink4 mt-0.5">Система начисления очков ЦПМС КР</div>
          </div>
          <button onClick={onClose}><X size={18} className="text-ink4" /></button>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Athlete */}
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-ink2 uppercase tracking-wide mb-1.5">
              Спортсмен <span className="text-red-400">*</span>
            </label>
            <select value={form.athleteId} onChange={handleAthleteSelect}>
              <option value="">— Выберите спортсмена —</option>
              {athletes.map(a => <option key={a.id} value={a.id}>{a.name} ({a.sport})</option>)}
            </select>
          </div>

          {/* Competition name */}
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-ink2 uppercase tracking-wide mb-1.5">
              Название соревнования <span className="text-red-400">*</span>
            </label>
            <input value={form.competition}
              onChange={e => setForm(p => ({ ...p, competition: e.target.value }))}
              placeholder="Чемпионат мира по борьбе 2024" />
          </div>

          {/* Level */}
          <div>
            <label className="block text-[10px] font-bold text-ink2 uppercase tracking-wide mb-1.5">Уровень соревнования</label>
            <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>
              {COMP_LEVELS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
            </select>
          </div>

          {/* Age cat */}
          <div>
            <label className="block text-[10px] font-bold text-ink2 uppercase tracking-wide mb-1.5">Возрастная категория</label>
            <select value={form.ageCat} onChange={e => setForm(p => ({ ...p, ageCat: e.target.value }))}>
              {AGE_CATEGORIES.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
          </div>

          {/* Placement */}
          <div>
            <label className="block text-[10px] font-bold text-ink2 uppercase tracking-wide mb-1.5">
              Занятое место <span className="text-red-400">*</span>
            </label>
            <input type="number" min="1" max="100" value={form.placement}
              onChange={e => setForm(p => ({ ...p, placement: +e.target.value, medal: autoMedal(e.target.value) }))} />
          </div>

          {/* Medal */}
          <div>
            <label className="block text-[10px] font-bold text-ink2 uppercase tracking-wide mb-1.5">Медаль</label>
            <select value={form.medal} onChange={e => setForm(p => ({ ...p, medal: e.target.value }))}>
              <option value="gold">🥇 Золото</option>
              <option value="silver">🥈 Серебро</option>
              <option value="bronze">🥉 Бронза</option>
              <option value="none">— Без медали</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-[10px] font-bold text-ink2 uppercase tracking-wide mb-1.5">Дата</label>
            <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value, year: +e.target.value.split('-')[0] || p.year }))} />
          </div>

          {/* Year */}
          <div>
            <label className="block text-[10px] font-bold text-ink2 uppercase tracking-wide mb-1.5">Год</label>
            <input type="number" min="2000" max="2030" value={form.year}
              onChange={e => setForm(p => ({ ...p, year: +e.target.value }))} />
          </div>
        </div>

        {/* Points preview */}
        {preview !== null && (
          <div className="mx-5 mb-4 bg-surf2 border border-black/8 p-4">
            <div className="text-[10px] font-bold text-ink4 uppercase tracking-widest mb-2">Расчёт очков</div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-[10px] text-ink4 mb-1">Базовые</div>
                <div className="font-bebas text-2xl text-ink">{PLACEMENT_POINTS[+form.placement] || 50}</div>
              </div>
              <div>
                <div className="text-[10px] text-ink4 mb-1">Коэф. уровня × возр.</div>
                <div className="font-bebas text-2xl text-blue-600">
                  ×{((levelData?.multiplier || 0.5) * (ageCatData?.multiplier || 1)).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-ink4 mb-1">ИТОГО ОЧКОВ</div>
                <div className="font-bebas text-3xl text-primary">{preview}</div>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-ink4 font-inter text-center">
              {levelData?.label} ({(levelData?.multiplier || 0) * 100}%) · {ageCatData?.label} ({(ageCatData?.multiplier || 0) * 100}%) · Медаль +{MEDAL_BONUS[form.medal] || 0}
            </div>
          </div>
        )}

        {error && (
          <div className="mx-5 mb-3 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 text-[11px]">
            <AlertCircle size={13} />{error}
          </div>
        )}

        <div className="p-5 pt-0 flex gap-2">
          <button onClick={handleSave}
            className="flex-1 bg-primary hover:bg-red-700 text-white py-3 text-[12px] font-bold uppercase tracking-wide transition-all">
            {mode === 'add' ? 'Добавить результат' : 'Сохранить изменения'}
          </button>
          <button onClick={onClose}
            className="px-6 border border-black/12 text-ink3 text-[12px] font-semibold hover:border-primary hover:text-primary transition-all">
            Отмена
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── AI DOCUMENT PARSER ──────────────────────────────────────
function DocumentUploader({ athletes, onImport, onClose }) {
  const [file, setFile] = useState(null)
  const [parsing, setParsing] = useState(false)
  const [parsed, setParsed] = useState(null)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState([])
  const fileRef = useRef()

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    setParsed(null)
    setError('')
    setSelected([])
  }

  const parseWithAI = async () => {
    if (!file) return
    setParsing(true)
    setError('')
    try {
      let content = ''
      const isImage = file.type.startsWith('image/')
      const isPDF   = file.type === 'application/pdf'
      const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')

      // Read as base64 for images/PDFs, text for CSV/Excel
      const base64 = await new Promise((res, rej) => {
        const reader = new FileReader()
        reader.onload = e => res(e.target.result.split(',')[1])
        reader.onerror = rej
        if (isImage || isPDF) reader.readAsDataURL(file)
        else reader.readAsDataURL(file)
      })

      const athleteNames = athletes.map(a => a.name).join(', ')

      let messages = []
      if (isImage || isPDF) {
        messages = [{
          role: 'user',
          content: [
            {
              type: isImage ? 'image' : 'document',
              source: {
                type: 'base64',
                media_type: file.type,
                data: base64,
              },
            },
            {
              type: 'text',
              text: `You are parsing a sports competition results document for Kyrgyzstan's national sports training center (ЦПМС КР).

Extract ALL athlete results from this document and return ONLY a valid JSON array (no markdown, no explanation).

Each result object must have these fields:
- athleteName: string (athlete's full name, try to match from: ${athleteNames})
- competition: string (competition/tournament name)
- level: one of [world, olympics, asian, central_asia, cis, national, republic, regional, local]
- ageCat: one of [adults, u23, u20, u17, u15]
- placement: integer (1=1st place, 2=2nd, etc.)
- medal: one of [gold, silver, bronze, none]
- date: string YYYY-MM-DD or empty
- year: integer

Return ONLY the JSON array. If you can't find data, return [].`
            }
          ]
        }]
      } else {
        // For Excel/CSV, read as text
        const text = await new Promise((res) => {
          const r = new FileReader()
          r.onload = e => res(e.target.result)
          r.readAsText(file)
        })
        messages = [{
          role: 'user',
          content: `You are parsing a sports competition results file (CSV/Excel exported as text) for Kyrgyzstan's national sports training center.

FILE CONTENT:
${text.slice(0, 8000)}

Extract ALL athlete results and return ONLY a valid JSON array. Each object must have:
- athleteName: string
- competition: string
- level: one of [world, olympics, asian, central_asia, cis, national, republic, regional, local]
- ageCat: one of [adults, u23, u20, u17, u15]
- placement: integer
- medal: one of [gold, silver, bronze, none]
- date: YYYY-MM-DD or empty
- year: integer

Return ONLY the JSON array. If no data found, return [].`
        }]
      }

      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages,
        }),
      })
      const data = await resp.json()
      const raw = data.content?.map(c => c.text || '').join('') || '[]'
      const clean = raw.replace(/```json/g, '').replace(/```/g, '').trim()
      const items = JSON.parse(clean)

      // Match athlete IDs
      const enriched = items.map((item, i) => {
        const athlete = athletes.find(a =>
          a.name.toLowerCase().includes(item.athleteName?.toLowerCase() || '') ||
          item.athleteName?.toLowerCase().includes(a.name.toLowerCase().split(' ')[0])
        )
        return {
          ...item,
          id: `tmp_${i}`,
          athleteId: athlete?.id || null,
          athleteName: athlete?.name || item.athleteName || '?',
          sport: athlete?.sport || '',
          coach: athlete?.coach || '',
          points: calcResultPoints({ ...item, placement: +item.placement || 1 }),
        }
      })

      setParsed(enriched)
      setSelected(enriched.map(r => r.id))
    } catch (e) {
      setError('Ошибка парсинга: ' + e.message)
    }
    setParsing(false)
  }

  const handleImport = () => {
    const toImport = parsed.filter(r => selected.includes(r.id))
    onImport(toImport, file.name)
  }

  const toggleAll = () => {
    if (selected.length === parsed.length) setSelected([])
    else setSelected(parsed.map(r => r.id))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white max-w-3xl w-full shadow-2xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-black/8">
          <div>
            <div className="font-bebas text-2xl text-ink tracking-wider flex items-center gap-2">
              <Bot size={20} className="text-violet-500" /> ИИ-парсинг документов
            </div>
            <div className="text-[10px] text-ink4 mt-0.5">PDF · Изображение · Excel · CSV</div>
          </div>
          <button onClick={onClose}><X size={18} className="text-ink4" /></button>
        </div>

        <div className="p-5">
          {/* Upload zone */}
          <div
            className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all mb-4 ${file ? 'border-primary bg-red-50/30' : 'border-black/15 hover:border-primary'}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}>
            <input ref={fileRef} type="file" className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv"
              onChange={e => handleFile(e.target.files[0])} />
            {file ? (
              <div>
                <div className="text-3xl mb-2">
                  {file.type.startsWith('image/') ? '🖼️' : file.name.endsWith('.pdf') ? '📄' : '📊'}
                </div>
                <div className="font-semibold text-[13px] text-ink">{file.name}</div>
                <div className="text-[11px] text-ink4 mt-1">{(file.size / 1024).toFixed(1)} КБ</div>
              </div>
            ) : (
              <div>
                <Upload size={28} className="text-ink4 mx-auto mb-3" />
                <div className="font-semibold text-[13px] text-ink">Перетащите или нажмите для загрузки</div>
                <div className="text-[11px] text-ink4 mt-1">PDF, изображение, Excel, CSV</div>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 text-[11px] mb-4">
              <AlertCircle size={13} />{error}
            </div>
          )}

          {file && !parsed && (
            <button onClick={parseWithAI} disabled={parsing}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-blue-500 hover:opacity-90 text-white py-3 text-[12px] font-bold uppercase tracking-wide transition-all disabled:opacity-60">
              {parsing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ИИ анализирует документ...
                </>
              ) : (
                <><Bot size={15} /> Распознать с помощью ИИ</>
              )}
            </button>
          )}

          {/* Parsed results */}
          {parsed && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-[13px] text-ink">
                  Найдено результатов: <span className="text-primary">{parsed.length}</span>
                </div>
                <button onClick={toggleAll} className="text-[11px] text-primary hover:underline font-semibold">
                  {selected.length === parsed.length ? 'Снять все' : 'Выбрать все'}
                </button>
              </div>

              {parsed.length === 0 ? (
                <div className="bg-surf2 border border-black/8 p-6 text-center text-ink4 text-[12px]">
                  ИИ не обнаружил таблиц с результатами в документе
                </div>
              ) : (
                <div className="border border-black/8 overflow-hidden max-h-72 overflow-y-auto">
                  {parsed.map((r, i) => {
                    const isSel = selected.includes(r.id)
                    const med = MEDAL_COLORS[r.medal] || MEDAL_COLORS.none
                    return (
                      <div key={r.id}
                        onClick={() => setSelected(s => s.includes(r.id) ? s.filter(x => x !== r.id) : [...s, r.id])}
                        className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-black/4 last:border-0 ${isSel ? 'bg-primary/4' : 'hover:bg-surf2'}`}>
                        <div className={`w-4 h-4 border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSel ? 'bg-primary border-primary' : 'border-black/20'}`}>
                          {isSel && <Check size={10} className="text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-[12px] text-ink">{r.athleteName}</span>
                            <span className="text-[9px] px-2 py-0.5 bg-surf2 border border-black/8 text-ink4">{r.competition}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-1 text-[10px] text-ink4">
                            <span>{COMP_LEVELS.find(l => l.id === r.level)?.label}</span>
                            <span>· Место {r.placement}</span>
                            <span>· {med.icon}</span>
                          </div>
                        </div>
                        <div className="font-bebas text-xl text-primary flex-shrink-0">{r.points}</div>
                        {!r.athleteId && (
                          <span className="text-[9px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 flex-shrink-0">
                            Не найден
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {parsed.length > 0 && (
                <button onClick={handleImport} disabled={selected.length === 0}
                  className="w-full mt-4 bg-primary hover:bg-red-700 text-white py-3 text-[12px] font-bold uppercase tracking-wide transition-all disabled:opacity-50">
                  Импортировать выбранные ({selected.length})
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ─── ATHLETE RANKING CARD ────────────────────────────────────
function AthleteRankCard({ athlete, rank, results, maxScore, onClick }) {
  const athleteResults = results.filter(r => r.athleteId === athlete.id)
  const total = calcAthleteTotal(athleteResults)
  const cat = getScoreCategory(total)
  const yearResults = athleteResults.filter(r => r.year === new Date().getFullYear())
  const yearTotal = calcAthleteTotal(yearResults)
  const medals = { gold: 0, silver: 0, bronze: 0 }
  athleteResults.forEach(r => { if (medals[r.medal] !== undefined) medals[r.medal]++ })

  // Monthly sparkline (last 6 months)
  const monthlyData = [1,2,3,4,5,6].map(m => {
    const mo = new Date().getMonth() - (6 - m)
    return athleteResults.filter(r => {
      const d = new Date(r.date || `${r.year}-06-01`)
      return d.getMonth() === ((mo + 12) % 12)
    }).reduce((s, r) => s + r.points, 0)
  })

  const rankColor = rank === 1 ? '#F5C518' : rank === 2 ? '#94a3b8' : rank === 3 ? '#f97316' : '#111'

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: rank * 0.04 }}
      onClick={onClick}
      className={`bg-white border p-4 cursor-pointer hover:shadow-md transition-all ${rank <= 3 ? 'border-primary/30 hover:border-primary/50' : 'border-black/8 hover:border-black/20'}`}>
      <div className="flex items-start gap-3">
        {/* Rank */}
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center font-bebas text-2xl leading-none"
          style={{ color: rankColor }}>
          {rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : `#${rank}`}
        </div>
        {/* Photo */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-surf3 border-2 border-black/8 flex-shrink-0">
          {athlete.photo ? (
            <img src={athlete.photo} alt={athlete.name} className="w-full h-full object-cover"
              onError={e => { e.target.style.display = 'none' }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bebas text-xl text-primary/40">
              {athlete.name[0]}
            </div>
          )}
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="font-bold text-[13px] text-ink truncate">{athlete.name}</span>
            <ScoreBadge total={total} small />
          </div>
          <div className="text-[10px] text-ink4 mb-2">{athlete.sport} · {athlete.region}</div>
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-2">
            <MiniBar value={total} max={maxScore} />
            <span className="font-bebas text-lg text-primary flex-shrink-0">{total}</span>
          </div>
          {/* Stats row */}
          <div className="flex flex-wrap gap-3 text-[10px] text-ink4">
            <span>🥇{medals.gold} 🥈{medals.silver} 🥉{medals.bronze}</span>
            <span>· {athleteResults.length} рез.</span>
            <span>· {yearTotal} в {new Date().getFullYear()}</span>
          </div>
        </div>
        {/* Sparkline + print btn */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="hidden sm:block">
            <Sparkline data={monthlyData} color={cat.color} />
          </div>
          <button
            onClick={e => { e.stopPropagation(); printAthleteCard({ athlete, results }) }}
            title="Печать карточки спортсмена"
            className="flex items-center gap-1 text-[9px] text-ink4 hover:text-primary border border-black/8 hover:border-primary px-2 py-1 transition-all">
            <Printer size={10} /> PDF
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── RESULTS TABLE ────────────────────────────────────────────
function ResultsTable({ results, athletes, onEdit, onDelete }) {
  const [q, setQ] = useState('')
  const [yearFilter, setYearFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortDir, setSortDir] = useState('desc')

  const years = [...new Set(results.map(r => r.year))].sort((a, b) => b - a)

  const filtered = useMemo(() => {
    let list = results.filter(r =>
      (yearFilter === 'all' || r.year === +yearFilter) &&
      (levelFilter === 'all' || r.level === levelFilter) &&
      (r.athleteName?.toLowerCase().includes(q.toLowerCase()) ||
       r.competition?.toLowerCase().includes(q.toLowerCase()))
    )
    list.sort((a, b) => {
      const v = sortDir === 'asc' ? 1 : -1
      if (sortBy === 'points') return (a.points - b.points) * v
      if (sortBy === 'placement') return (a.placement - b.placement) * v
      if (sortBy === 'date') return ((a.date || '') < (b.date || '') ? -1 : 1) * v
      return 0
    })
    return list
  }, [results, q, yearFilter, levelFilter, sortBy, sortDir])

  const SortBtn = ({ col, label }) => (
    <button onClick={() => { if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortBy(col); setSortDir('desc') } }}
      className={`flex items-center gap-1 hover:text-ink transition-colors ${sortBy === col ? 'text-primary' : 'text-ink4'}`}>
      {label}
      {sortBy === col ? (sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />) : null}
    </button>
  )

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink4" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Поиск по спортсмену или соревнованию..."
            className="!pl-8 !py-2 !text-[12px]" />
        </div>
        <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="!py-2 !text-[12px] !w-auto">
          <option value="all">Все годы</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="!py-2 !text-[12px] !w-auto">
          <option value="all">Все уровни</option>
          {COMP_LEVELS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
        </select>
      </div>

      <div className="bg-white border border-black/8 overflow-hidden">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th><SortBtn col="date" label="Дата" /></th>
                <th>Спортсмен</th>
                <th>Соревнование</th>
                <th>Уровень</th>
                <th>Катег.</th>
                <th><SortBtn col="placement" label="Место" /></th>
                <th>Медаль</th>
                <th><SortBtn col="points" label="Очки" /></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const lvl = COMP_LEVELS.find(l => l.id === r.level)
                const med = MEDAL_COLORS[r.medal] || MEDAL_COLORS.none
                const ageCat = AGE_CATEGORIES.find(a => a.id === r.ageCat)
                return (
                  <tr key={r.id}>
                    <td className="text-[11px] whitespace-nowrap">{r.date || r.year}</td>
                    <td>
                      <div className="font-semibold text-[12px] text-ink">{r.athleteName}</div>
                      <div className="text-[10px] text-ink4">{r.sport}</div>
                    </td>
                    <td>
                      <div className="text-[12px] text-ink max-w-[200px] truncate">{r.competition}</div>
                      <div className="text-[10px] text-ink4">{r.coach}</div>
                    </td>
                    <td>
                      <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-white"
                        style={{ background: lvl?.color || '#888' }}>
                        {lvl?.label}
                      </span>
                    </td>
                    <td className="text-[11px] text-ink4">{ageCat?.label}</td>
                    <td>
                      <span className={`font-bold text-[13px] ${r.placement <= 3 ? 'text-primary' : 'text-ink'}`}>
                        {r.placement}
                      </span>
                    </td>
                    <td><span className="text-[13px]">{med.icon}</span></td>
                    <td>
                      <span className="font-bebas text-xl text-primary">{r.points}</span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => onEdit(r)}
                          className="w-7 h-7 flex items-center justify-center border border-black/10 hover:border-blue-400 hover:text-blue-500 text-ink4 transition-all">
                          <Edit2 size={11} />
                        </button>
                        <button onClick={() => onDelete(r.id)}
                          className="w-7 h-7 flex items-center justify-center border border-black/10 hover:border-red-400 hover:text-red-500 text-ink4 transition-all">
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-10 text-ink4 text-[12px]">Результатов не найдено</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-black/6 text-[11px] text-ink4">
          Показано: {filtered.length} из {results.length} результатов
        </div>
      </div>
    </div>
  )
}

// ─── ATHLETE DETAIL PANEL ─────────────────────────────────────
function AthleteScoreDetail({ athlete, results, onClose }) {
  const myResults = results.filter(r => r.athleteId === athlete.id)
  const total = calcAthleteTotal(myResults)
  const cat = getScoreCategory(total)
  const medals = { gold: 0, silver: 0, bronze: 0 }
  myResults.forEach(r => { if (medals[r.medal] !== undefined) medals[r.medal]++ })

  const byYear = {}
  myResults.forEach(r => { byYear[r.year] = (byYear[r.year] || 0) + r.points })
  const years = Object.keys(byYear).sort((a, b) => +a - +b)

  return (
    <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }}
      className="bg-white border border-black/8 p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-surf3 border-2 border-primary/20 flex-shrink-0">
            {athlete.photo ? (
              <img src={athlete.photo} alt={athlete.name} className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none' }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bebas text-2xl text-primary/40">{athlete.name[0]}</div>
            )}
          </div>
          <div>
            <div className="font-bebas text-2xl text-ink tracking-wide">{athlete.name}</div>
            <div className="text-[11px] text-ink4">{athlete.sport} · {athlete.region}</div>
            <ScoreBadge total={total} />
          </div>
        </div>
        <button onClick={onClose} className="text-ink4 hover:text-ink"><X size={16} /></button>
      </div>

      {/* Score overview */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: 'Всего очков', val: total, color: cat.color },
          { label: 'Результатов', val: myResults.length, color: '#3b82f6' },
          { label: '🥇 Золото', val: medals.gold, color: '#F5C518' },
          { label: '🥈+🥉', val: medals.silver + medals.bronze, color: '#94a3b8' },
        ].map(s => (
          <div key={s.label} className="bg-surf2 border border-black/8 p-3 text-center">
            <div className="font-bebas text-2xl leading-none" style={{ color: s.color }}>{s.val}</div>
            <div className="text-[9px] text-ink4 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Year progress */}
      {years.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] font-bold text-ink4 uppercase tracking-widest mb-2">По годам</div>
          <div className="space-y-1.5">
            {years.map(y => (
              <div key={y} className="flex items-center gap-2">
                <span className="text-[10px] text-ink4 w-10 flex-shrink-0">{y}</span>
                <MiniBar value={byYear[y]} max={Math.max(...Object.values(byYear))} />
                <span className="text-[11px] font-bold text-primary w-12 text-right flex-shrink-0">{byYear[y]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results list */}
      <div className="text-[10px] font-bold text-ink4 uppercase tracking-widest mb-2">Все результаты</div>
      <div className="space-y-1.5 max-h-64 overflow-y-auto">
        {myResults.sort((a, b) => (b.date || '') > (a.date || '') ? 1 : -1).map(r => {
          const lvl = COMP_LEVELS.find(l => l.id === r.level)
          const med = MEDAL_COLORS[r.medal] || MEDAL_COLORS.none
          return (
            <div key={r.id} className="flex items-center gap-2 p-2 bg-surf2 border border-black/6">
              <span className="text-[13px]">{med.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-ink truncate">{r.competition}</div>
                <div className="text-[9px] text-ink4">{lvl?.label} · {r.date || r.year} · Место {r.placement}</div>
              </div>
              <span className="font-bebas text-lg text-primary flex-shrink-0">{r.points}</span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─── COACH RANKING ────────────────────────────────────────────
function CoachRanking({ results, coaches, athletes }) {
  const coachNames = [...new Set(results.map(r => r.coach).filter(Boolean))]
  const coachData = coachNames.map(name => {
    const { total, golds } = calcCoachScore(name, results)
    const myAthletes = athletes.filter(a => a.coach === name)
    const myResults = results.filter(r => r.coach === name)
    const coachInfo = coaches.find(c => c.name.includes(name.split(' ')[0]) || name.includes(c.name.split(' ')[0]))
    return { name, total, golds, athletes: myAthletes.length, results: myResults.length, sport: coachInfo?.sport || '' }
  }).sort((a, b) => b.total - a.total)

  const maxTotal = coachData[0]?.total || 1

  return (
    <div className="space-y-3">
      {coachData.map((c, i) => (
        <div key={c.name} className="bg-white border border-black/8 p-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="font-bebas text-2xl" style={{ color: i === 0 ? '#F5C518' : i === 1 ? '#94a3b8' : i === 2 ? '#f97316' : '#111' }}>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
            </div>
            <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center font-bebas text-lg text-primary">
              {c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-[13px] text-ink">{c.name}</div>
            <div className="text-[10px] text-ink4">{c.sport} · {c.athletes} спортсм. · {c.results} рез.</div>
            <div className="flex items-center gap-2 mt-1.5">
              <MiniBar value={c.total} max={maxTotal} />
              <span className="font-bebas text-xl text-primary flex-shrink-0">{c.total}</span>
            </div>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <div className="text-center">
              <div className="font-bebas text-2xl text-yellow-500">{c.golds}</div>
              <div className="text-[9px] text-ink4">🥇 золото</div>
            </div>
          </div>
        </div>
      ))}
      {coachData.length === 0 && (
        <div className="bg-white border border-black/8 p-8 text-center text-ink4 text-[12px]">
          Нет данных о тренерах
        </div>
      )}
    </div>
  )
}

// ─── SCORING RULES EDITOR ─────────────────────────────────────
function ScoringRulesEditor() {
  const [activeTab, setActiveTab] = useState('levels')
  const tabs = [
    { id: 'levels', label: 'Уровни соревнований' },
    { id: 'placements', label: 'За место' },
    { id: 'categories', label: 'Категории очков' },
  ]

  return (
    <div>
      <div className="flex border-b border-black/8 mb-5">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide border-b-2 transition-all ${activeTab === t.id ? 'border-primary text-primary' : 'border-transparent text-ink4 hover:text-ink'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'levels' && (
        <div className="space-y-2">
          <div className="text-[11px] text-ink4 mb-3 font-inter">Коэффициент умножается на базовые очки за место. Нельзя редактировать — обратитесь к разработчику.</div>
          {COMP_LEVELS.map(l => (
            <div key={l.id} className="flex items-center gap-4 p-3 bg-white border border-black/8">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: l.color }} />
              <div className="flex-1 text-[12px] font-semibold text-ink">{l.label}</div>
              <div className="font-bebas text-xl" style={{ color: l.color }}>×{l.multiplier}</div>
              <div className="text-[10px] text-ink4">{Math.round(l.multiplier * 100)}% от макс.</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'placements' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(PLACEMENT_POINTS).map(([place, pts]) => (
            <div key={place} className="bg-white border border-black/8 p-3 text-center">
              <div className={`font-bebas text-sm mb-1 ${+place <= 3 ? 'text-primary' : 'text-ink4'}`}>
                {+place === 1 ? '🥇' : +place === 2 ? '🥈' : +place === 3 ? '🥉' : `${place}-е место`}
              </div>
              <div className="font-bebas text-3xl text-ink">{pts}</div>
              <div className="text-[9px] text-ink4">базовых очков</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-2">
          {SCORE_CATEGORIES.map(c => (
            <div key={c.min} className={`flex items-center gap-4 p-3 border ${c.bg} ${c.border}`}>
              <div className="flex-1">
                <div className={`font-bold text-[13px] ${c.text}`}>{c.label}</div>
                <div className="text-[10px] text-ink4">{c.min === 0 ? '< 300 очков' : c.min === 1200 ? '1200+ очков' : `${c.min}–${SCORE_CATEGORIES[SCORE_CATEGORIES.indexOf(c) - 1]?.min - 1} очков`}</div>
              </div>
              <div className={`font-bebas text-2xl ${c.text}`}>{c.min}+</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── IMPORT HISTORY ───────────────────────────────────────────
function ImportHistoryPanel({ history }) {
  return (
    <div className="bg-white border border-black/8">
      <div className="p-4 border-b border-black/6 font-semibold text-[13px] text-ink">История импорта файлов</div>
      <div className="divide-y divide-black/4">
        {history.map(h => (
          <div key={h.id} className="flex items-center gap-4 p-4 hover:bg-surf2 transition-colors">
            <div className="text-2xl flex-shrink-0">
              {h.fileName.endsWith('.pdf') ? '📄' : h.fileName.endsWith('.xlsx') ? '📊' : '🖼️'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[12px] text-ink truncate">{h.fileName}</div>
              <div className="text-[10px] text-ink4 font-inter">{h.uploadedAt} · {h.rows} строк · {h.uploadedBy}</div>
            </div>
            <span className="badge badge-approved">{h.status === 'parsed' ? 'Обработан' : 'Ошибка'}</span>
          </div>
        ))}
        {history.length === 0 && (
          <div className="p-6 text-center text-ink4 text-[12px]">История пуста</div>
        )}
      </div>
    </div>
  )
}

// ─── EXPORT MENU COMPONENT ──────────────────────────────────
function ExportMenu({ onExcelAll, exporting, onPrintRanking, onPrintCoaches, onPrintResults }) {
  const [open, setOpen] = useState(false)

  const items = [
    { icon: '📊', label: 'Excel — все данные (4 листа)', action: () => { onExcelAll(); setOpen(false) }, highlight: true },
    { icon: '🖨️', label: 'PDF — рейтинг спортсменов',   action: () => { onPrintRanking(); setOpen(false) } },
    { icon: '🖨️', label: 'PDF — рейтинг тренеров',      action: () => { onPrintCoaches(); setOpen(false) } },
    { icon: '🖨️', label: 'PDF — таблица результатов',   action: () => { onPrintResults(); setOpen(false) } },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={exporting}
        className="hidden sm:flex items-center gap-1.5 border border-black/15 hover:border-primary text-ink3 hover:text-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-all disabled:opacity-50">
        {exporting ? (
          <><div className="w-3 h-3 border-2 border-black/20 border-t-primary rounded-full animate-spin" /> Экспорт...</>
        ) : (
          <><Download size={12} /> Скачать</>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 bg-white border border-black/12 shadow-xl z-50 min-w-[260px]">
              <div className="px-3 py-2 border-b border-black/6 flex items-center gap-2">
                <Download size={12} className="text-primary" />
                <span className="text-[10px] font-bold text-ink uppercase tracking-widest">Экспорт данных</span>
              </div>
              {items.map((item, i) => (
                <button key={i} onClick={item.action}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left text-[12px] hover:bg-surf2 transition-colors border-b border-black/4 last:border-0 ${item.highlight ? 'font-bold text-ink' : 'text-ink3'}`}>
                  <span className="text-[16px] flex-shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.highlight && <span className="ml-auto text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 font-bold uppercase">рекомендуем</span>}
                </button>
              ))}
              <div className="px-4 py-2 bg-surf2 border-t border-black/6">
                <div className="text-[9px] text-ink4 leading-relaxed font-inter">
                  PDF открывается в новом окне → Ctrl+P → «Сохранить как PDF»
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── MAIN SCORING PAGE ───────────────────────────────────────
const NAV = [
  { id: 'ranking',  label: 'Рейтинг',       icon: Trophy     },
  { id: 'coaches',  label: 'Тренеры',        icon: Users      },
  { id: 'results',  label: 'Результаты',     icon: FileText   },
  { id: 'rules',    label: 'Правила',        icon: Settings   },
  { id: 'history',  label: 'История',        icon: History    },
]

export default function ScoringPage() {
  const { data, results, addResult, updResult, delResult, importHistory, addImport, adminUser } = useApp()
  const nav = useNavigate()
  const [activeTab, setActiveTab] = useState('ranking')
  const [modal, setModal] = useState(null) // null | {type:'add'} | {type:'edit', result}
  const [showUploader, setShowUploader] = useState(false)
  const [selectedAthlete, setSelectedAthlete] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [exporting, setExporting] = useState(false)

  // ── Export handlers ──────────────────────────────────────
  const handleExcelExport = async () => {
    setExporting(true)
    try {
      await exportResultsExcel({ results, athletes, coaches, filename: 'ЦПМС_Рейтинг' })
    } catch(e) { alert('Ошибка экспорта: ' + e.message) }
    setExporting(false)
  }

  // Guard: must be logged in as admin
  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surf2">
        <div className="text-center">
          <div className="font-bebas text-3xl text-ink mb-3">Требуется авторизация</div>
          <button onClick={() => nav('/login')} className="bg-primary text-white px-6 py-2.5 font-bold text-[12px] uppercase tracking-wide">
            Войти как администратор
          </button>
        </div>
      </div>
    )
  }

  // Aggregate athlete scores
  const athletes = data.athletes || []
  const coaches = data.coaches || []

  const athletesWithScores = athletes.map(a => {
    const myResults = results.filter(r => r.athleteId === a.id)
    return { ...a, totalScore: calcAthleteTotal(myResults), resultCount: myResults.length }
  }).sort((a, b) => b.totalScore - a.totalScore)

  const maxScore = athletesWithScores[0]?.totalScore || 1

  const handleSaveResult = (r) => {
    if (modal?.type === 'add') addResult(r)
    else updResult(r.id, r)
    setModal(null)
  }

  const handleImport = (items, fileName) => {
    items.forEach(item => {
      const { id: _, ...rest } = item
      addResult(rest)
    })
    addImport({
      fileName,
      uploadedAt: new Date().toISOString().split('T')[0],
      rows: items.length,
      status: 'parsed',
      uploadedBy: adminUser?.name || 'admin',
    })
    setShowUploader(false)
  }

  // Stats
  const totalResults = results.length
  const currentYear = new Date().getFullYear()
  const yearResults = results.filter(r => r.year === currentYear)
  const totalPoints = results.reduce((s, r) => s + r.points, 0)
  const eliteCount = athletesWithScores.filter(a => a.totalScore >= 1200).length

  return (
    <div className="flex h-[100dvh] bg-surf2 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto w-56 bg-white border-r border-black/8 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-black/6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary flex items-center justify-center font-bebas text-white text-sm">КР</div>
              <div>
                <div className="font-bebas text-sm text-ink tracking-wide">Рейтинг</div>
                <div className="text-[9px] text-ink4">Система очков</div>
              </div>
            </div>
            <button className="lg:hidden text-ink4" onClick={() => setSidebarOpen(false)}><X size={16} /></button>
          </div>
          <div className="text-[10px] text-ink4 truncate">{adminUser?.name}</div>
        </div>

        <nav className="flex-1 py-2 px-1.5 overflow-y-auto">
          {NAV.map(item => {
            const Icon = item.icon
            const active = activeTab === item.id
            return (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 mb-0.5 text-left transition-all text-[11px] font-semibold border-l-2 ${active ? 'bg-primary/8 text-primary border-primary' : 'text-ink3 hover:bg-surf2 hover:text-ink border-transparent'}`}>
                <Icon size={14} className="flex-shrink-0" />{item.label}
              </button>
            )
          })}

          <div className="my-2 border-t border-black/6" />

          <button onClick={() => setModal({ type: 'add' })}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-[11px] font-semibold text-primary hover:bg-primary/8 border-l-2 border-transparent hover:border-primary transition-all">
            <Plus size={14} className="flex-shrink-0" /> Добавить результат
          </button>
          <button onClick={() => setShowUploader(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-[11px] font-semibold text-violet-600 hover:bg-violet-50 border-l-2 border-transparent hover:border-violet-400 transition-all">
            <Bot size={14} className="flex-shrink-0" /> ИИ-импорт файла
          </button>
        </nav>

        <div className="p-2 border-t border-black/6 space-y-1">
          <button onClick={() => nav('/admin')}
            className="w-full flex items-center gap-2 px-3 py-2 text-ink4 hover:text-ink hover:bg-surf2 text-[11px] font-semibold transition-colors">
            <ChevronLeft size={13} /> Админ-панель
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <div className="h-14 bg-white border-b border-black/8 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-ink3" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-primary" />
              <span className="font-bebas text-xl text-ink tracking-wide">
                {NAV.find(n => n.id === activeTab)?.label || 'Рейтинг'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setModal({ type: 'add' })}
              className="hidden sm:flex items-center gap-1.5 bg-primary hover:bg-red-700 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-all">
              <Plus size={12} /> Результат
            </button>
            <button onClick={() => setShowUploader(true)}
              className="hidden sm:flex items-center gap-1.5 border border-violet-300 text-violet-600 hover:bg-violet-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-all">
              <Bot size={12} /> ИИ-импорт
            </button>
            {/* Export dropdown */}
            <ExportMenu
              onExcelAll={handleExcelExport}
              exporting={exporting}
              onPrintRanking={() => printAthleteRanking({ results, athletes })}
              onPrintCoaches={() => printCoachRanking({ results, athletes, coaches })}
              onPrintResults={() => printAllResults({ results })}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

              {/* ── RANKING TAB ── */}
              {activeTab === 'ranking' && (
                <div className="space-y-4">
                  {/* Export row */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[11px] text-ink4 font-inter">
                      Рейтинг обновлён: <strong className="text-ink">{new Date().toLocaleDateString('ru-RU')}</strong>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => printAthleteRanking({ results, athletes })}
                        className="flex items-center gap-1.5 border border-black/12 hover:border-primary text-ink3 hover:text-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-all">
                        <Printer size={12} /> Печать рейтинга
                      </button>
                      <button onClick={handleExcelExport} disabled={exporting}
                        className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-all disabled:opacity-50">
                        {exporting ? '...' : <><Download size={12} /> Excel</>}
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Всего результатов', val: totalResults, color: '#CC0000', icon: '📋' },
                      { label: `Результатов ${currentYear}`, val: yearResults.length, color: '#3b82f6', icon: '📅' },
                      { label: 'Сумма очков', val: totalPoints.toLocaleString(), color: '#8b5cf6', icon: '⚡' },
                      { label: 'Элита (1200+)', val: eliteCount, color: '#F5C518', icon: '🏆' },
                    ].map(s => (
                      <div key={s.label} className="bg-white border border-black/8 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{s.icon}</span>
                        </div>
                        <div className="font-bebas text-3xl leading-none" style={{ color: s.color }}>{s.val}</div>
                        <div className="text-[11px] text-ink4 mt-1">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Score category breakdown */}
                  <div className="bg-white border border-black/8 p-4">
                    <div className="text-[11px] font-bold text-ink4 uppercase tracking-widest mb-3">Распределение по категориям</div>
                    <div className="flex flex-wrap gap-2">
                      {SCORE_CATEGORIES.map(cat => {
                        const count = athletesWithScores.filter(a => getScoreCategory(a.totalScore).label === cat.label).length
                        return (
                          <div key={cat.label} className={`flex items-center gap-2 px-3 py-2 border ${cat.bg} ${cat.border}`}>
                            <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                            <span className={`text-[11px] font-bold ${cat.text}`}>{cat.label}</span>
                            <span className={`font-bebas text-lg ${cat.text}`}>{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Two columns: ranking + detail */}
                  <div className={`grid gap-4 ${selectedAthlete ? 'lg:grid-cols-5' : 'grid-cols-1'}`}>
                    <div className={`space-y-2 ${selectedAthlete ? 'lg:col-span-3' : ''}`}>
                      {athletesWithScores.map((a, i) => (
                        <AthleteRankCard key={a.id} athlete={a} rank={i + 1} results={results}
                          maxScore={maxScore}
                          onClick={() => setSelectedAthlete(selectedAthlete?.id === a.id ? null : a)} />
                      ))}
                      {athletesWithScores.length === 0 && (
                        <div className="bg-white border border-black/8 p-8 text-center text-ink4 text-[12px]">
                          Нет данных о спортсменах
                        </div>
                      )}
                    </div>
                    {selectedAthlete && (
                      <div className="lg:col-span-2">
                        <div className="sticky top-0">
                          <AthleteScoreDetail
                            athlete={selectedAthlete}
                            results={results}
                            onClose={() => setSelectedAthlete(null)} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── COACHES TAB ── */}
              {activeTab === 'coaches' && (
                <div>
                  <div className="flex justify-end mb-4">
                    <button onClick={() => printCoachRanking({ results, athletes, coaches })}
                      className="flex items-center gap-1.5 border border-black/12 hover:border-primary text-ink3 hover:text-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-all">
                      <Printer size={12} /> Печать рейтинга тренеров
                    </button>
                  </div>
                  <CoachRanking results={results} coaches={coaches} athletes={athletes} />
                </div>
              )}

              {/* ── RESULTS TAB ── */}
              {activeTab === 'results' && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="text-[11px] text-ink4 font-inter">
                      Всего записей: <strong className="text-ink">{results.length}</strong>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => printAllResults({ results })}
                        className="flex items-center gap-1.5 border border-black/12 hover:border-primary text-ink3 hover:text-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-all">
                        <Printer size={12} /> PDF отчёт
                      </button>
                      <button onClick={handleExcelExport} disabled={exporting}
                        className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-all disabled:opacity-50">
                        <Download size={12} /> Excel (все листы)
                      </button>
                    </div>
                  </div>
                  <ResultsTable
                    results={results}
                    athletes={athletes}
                    onEdit={r => setModal({ type: 'edit', result: r })}
                    onDelete={id => delResult(id)} />
                </div>
              )}

              {/* ── RULES TAB ── */}
              {activeTab === 'rules' && (
                <div className="max-w-2xl">
                  <div className="bg-white border border-black/8 p-5 mb-4">
                    <div className="font-bebas text-2xl text-ink tracking-wide mb-1">Система начисления очков</div>
                    <p className="text-[12px] text-ink4 font-inter">
                      Очки = (Базовые за место + Бонус за медаль) × Коэф. уровня × Коэф. возраста.
                      Бонус тренера за золото: +{COACH_GOLD_BONUS} очков.
                    </p>
                  </div>
                  <ScoringRulesEditor />
                </div>
              )}

              {/* ── HISTORY TAB ── */}
              {activeTab === 'history' && (
                <ImportHistoryPanel history={importHistory} />
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <ResultModal
          mode={modal.type}
          initial={modal.result}
          athletes={athletes}
          onSave={handleSaveResult}
          onClose={() => setModal(null)} />
      )}

      {showUploader && (
        <DocumentUploader
          athletes={athletes}
          onImport={handleImport}
          onClose={() => setShowUploader(false)} />
      )}
    </div>
  )
}
