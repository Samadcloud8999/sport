import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Users, DollarSign, GraduationCap, ShieldCheck, Heart,
  Trophy, Monitor, Scale, Newspaper, Globe,
  CheckSquare, MessageCircle, FileText, Calculator as CalcIcon,
  Clock, LogOut, Plus, Send, Upload, Download, Check, X,
  Paperclip, Trash2, Lock, Key, Bot, Image as ImageIcon,
  Menu, Home, Eye, EyeOff, RefreshCw, AlertCircle
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import FaceScanner from '../components/ui/FaceScanner'
import { deleteFaceDescriptor, hasFaceDescriptor } from '../utils/faceRecognition'

const DEPT_ICONS = { Users, DollarSign, GraduationCap, ShieldCheck, Heart, Trophy, Monitor, Scale, Newspaper, Globe }

// ── AI Assistant ───────────────────────────────────────────
function AIAssistant({ user, dept }) {
  const [messages, setMessages] = useState([
    { role:'assistant', text:`Привет, ${user.name.split(' ')[0]}! Я ваш ИИ-помощник ЦПМС КР. Помогу с документами, отчётами и рабочими вопросами. Чем могу помочь?` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role:'user', text:userMsg }])
    setLoading(true)
    try {
      const history = messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.text }))
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `Ты корпоративный ИИ-помощник ЦПМС КР (Центр подготовки молодёжных сборных Кыргызской Республики). Сотрудник: ${user.name}, отдел: ${dept?.name}, должность: ${user.role}. Отвечай кратко и по делу на русском языке. Помогай с рабочими задачами, документами, отчётами.`,
          messages: [...history, { role:'user', content:userMsg }]
        })
      })
      const data = await res.json()
      const text = data.content?.map(c => c.text || '').join('') || 'Не удалось получить ответ.'
      setMessages(prev => [...prev, { role:'assistant', text }])
    } catch {
      setMessages(prev => [...prev, { role:'assistant', text:'Ошибка соединения. Попробуйте ещё раз.' }])
    }
    setLoading(false)
  }

  return (
    <div className="staff-card flex flex-col" style={{height:500}}>
      <div className="flex items-center gap-2 p-4 border-b border-black/6 flex-shrink-0">
        <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
          <Bot size={14} className="text-white"/>
        </div>
        <div>
          <span className="font-bold text-[13px] text-ink">ИИ-помощник</span>
          <div className="text-[10px] text-green-500 font-semibold">● онлайн</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m,i) => (
          <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'} gap-2`}>
            {m.role==='assistant' && (
              <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={12} className="text-white"/>
              </div>
            )}
            <div className={`max-w-[80%] px-3 py-2 text-[12px] leading-relaxed whitespace-pre-wrap ${m.role==='user'?'chat-bubble-me':'bg-violet-50 border border-violet-100 text-ink rounded-lg'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <Bot size={12} className="text-white"/>
            </div>
            <div className="bg-violet-50 border border-violet-100 px-4 py-3 rounded-lg">
              <div className="flex gap-1.5">
                {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
      <div className="p-3 border-t border-black/6 flex gap-2 flex-shrink-0">
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send()}
          placeholder="Задайте вопрос ИИ-помощнику..."
          className="flex-1 !py-2 !text-[12px]"/>
        <button onClick={send} disabled={loading}
          className="w-9 h-9 bg-gradient-to-br from-violet-500 to-blue-500 hover:opacity-90 flex items-center justify-center text-white transition-all flex-shrink-0 disabled:opacity-50">
          <Send size={14}/>
        </button>
      </div>
    </div>
  )
}

// ── Calculator ─────────────────────────────────────────────
function AdvancedCalculator() {
  const [display, setDisplay] = useState('0')
  const [expr, setExpr] = useState('')
  const [memory, setMemory] = useState(0)
  const [history, setHistory] = useState([])
  const [mode, setMode] = useState('standard')
  const [amount, setAmount] = useState('')
  const [fromCur, setFromCur] = useState('USD')
  const [toCur, setToCur] = useState('KGS')
  const RATES = { USD:1, KGS:87.5, RUB:92.3, EUR:0.92, CNY:7.24, KZT:449 }

  const btn = (val) => {
    if (val==='C'){setDisplay('0');setExpr('');return}
    if (val==='CE'){setDisplay('0');return}
    if (val==='±'){setDisplay(d=>String(-parseFloat(d)));return}
    if (val==='%'){setDisplay(d=>String(parseFloat(d)/100));return}
    if (val==='='){
      try{
        const full=expr+display
        const sanitized=full.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-')
        // eslint-disable-next-line no-new-func
        const result=new Function('return '+sanitized)()
        const rounded=Math.round(result*1e10)/1e10
        setHistory(h=>[{expr:full,result:rounded},...h.slice(0,9)])
        setDisplay(String(rounded));setExpr('')
      }catch{setDisplay('Ошибка');setExpr('')}
      return
    }
    if (val==='M+'){setMemory(m=>m+(parseFloat(display)||0));return}
    if (val==='M-'){setMemory(m=>m-(parseFloat(display)||0));return}
    if (val==='MR'){setDisplay(String(memory));return}
    if (val==='MC'){setMemory(0);return}
    if (val==='√'){setDisplay(d=>String(Math.sqrt(parseFloat(d))));return}
    if (val==='x²'){setDisplay(d=>String(Math.pow(parseFloat(d),2)));return}
    if (val==='x³'){setDisplay(d=>String(Math.pow(parseFloat(d),3)));return}
    if (val==='1/x'){setDisplay(d=>String(1/parseFloat(d)));return}
    if (val==='log'){setDisplay(d=>String(Math.round(Math.log10(parseFloat(d))*1e8)/1e8));return}
    if (val==='ln'){setDisplay(d=>String(Math.round(Math.log(parseFloat(d))*1e8)/1e8));return}
    if (val==='sin'){setDisplay(d=>String(Math.round(Math.sin(parseFloat(d)*Math.PI/180)*1e8)/1e8));return}
    if (val==='cos'){setDisplay(d=>String(Math.round(Math.cos(parseFloat(d)*Math.PI/180)*1e8)/1e8));return}
    if (val==='tan'){setDisplay(d=>String(Math.round(Math.tan(parseFloat(d)*Math.PI/180)*1e8)/1e8));return}
    if (val==='π'){setDisplay(String(Math.PI));return}
    if (val==='e'){setDisplay(String(Math.E));return}
    if (val==='⌫'){setDisplay(d=>d.length>1?d.slice(0,-1):'0');return}
    if (['+','-','×','÷'].includes(val)){setExpr(expr+display+val);setDisplay('0');return}
    if (val==='.'){setDisplay(d=>d.includes('.')?d:d+'.');return}
    setDisplay(d=>d==='0'?val:d+val)
  }

  const standardRows=[['MC','MR','M+','M-'],['C','CE','⌫','÷'],['7','8','9','×'],['4','5','6','-'],['1','2','3','+'],[' ±','0','.','=']]
  const sciRows=[['sin','cos','tan','π'],['√','x²','x³','e'],['log','ln','1/x','%'],['MC','MR','M+','M-'],['C','CE','⌫','÷'],['7','8','9','×'],['4','5','6','-'],['1','2','3','+'],[' ±','0','.','=']]
  const rows=mode==='scientific'?sciRows:standardRows

  const opStyle=(v)=>{
    const t=v.trim()
    if(t==='=') return 'calc-btn eq'
    if(['+','-','×','÷'].includes(t)) return 'calc-btn op'
    if(['C','CE','⌫'].includes(t)) return 'calc-btn clear'
    if(['MC','MR','M+','M-'].includes(t)) return 'calc-btn !text-blue-600 !text-[10px]'
    if(['sin','cos','tan','log','ln','√','x²','x³','1/x','π','e'].includes(t)) return 'calc-btn !text-purple-600 !text-[11px]'
    return 'calc-btn'
  }

  const converted = amount?((parseFloat(amount)/RATES[fromCur])*RATES[toCur]).toFixed(2):''

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex border border-black/10 mb-3">
        {['standard','scientific','currency'].map(m=>(
          <button key={m} onClick={()=>setMode(m)}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wide transition-all ${mode===m?'bg-primary text-white':'text-ink3 hover:bg-surf2'}`}>
            {m==='standard'?'Стандарт':m==='scientific'?'Научный':'Валюта'}
          </button>
        ))}
      </div>
      {mode==='currency'?(
        <div className="bg-white border border-black/8 p-5 space-y-4">
          <div className="text-[12px] font-bold text-ink mb-2">Конвертер валют</div>
          <input value={amount} onChange={e=>setAmount(e.target.value)} type="number" placeholder="Введите сумму"/>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-ink4 uppercase tracking-wide mb-1">Из</label>
              <select value={fromCur} onChange={e=>setFromCur(e.target.value)}>{Object.keys(RATES).map(c=><option key={c} value={c}>{c}</option>)}</select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink4 uppercase tracking-wide mb-1">В</label>
              <select value={toCur} onChange={e=>setToCur(e.target.value)}>{Object.keys(RATES).map(c=><option key={c} value={c}>{c}</option>)}</select>
            </div>
          </div>
          {converted&&(
            <div className="bg-primary/6 border border-primary/20 p-4 text-center">
              <div className="text-[11px] text-ink4 mb-1">{amount} {fromCur} =</div>
              <div className="font-bebas text-4xl text-primary tracking-wide">{converted}</div>
              <div className="text-[11px] text-ink4 mt-1">{toCur}</div>
            </div>
          )}
          <div className="text-[10px] text-ink4">* Приблизительный курс. 1 USD ≈ 87.5 KGS</div>
        </div>
      ):(
        <div className="bg-white border border-black/8">
          <div className="p-4 bg-ink border-b border-black/8">
            <div className="text-white/40 text-[11px] font-mono mb-1 h-4 truncate text-right">{expr||'\u00A0'}</div>
            <div className="text-white font-inter text-3xl font-light text-right truncate">{display}</div>
            {memory!==0&&<div className="text-red-400 text-[10px] font-mono text-right mt-0.5">M: {memory}</div>}
          </div>
          <div className="p-3 grid grid-cols-4 gap-1.5">
            {rows.flat().map((v,i)=>(
              <button key={i} onClick={()=>btn(v.trim())} className={opStyle(v)}>{v.trim()}</button>
            ))}
          </div>
          {history.length>0&&(
            <div className="border-t border-black/6 p-3">
              <div className="text-[10px] font-bold text-ink4 uppercase tracking-wide mb-2">История</div>
              <div className="space-y-1 max-h-28 overflow-y-auto">
                {history.map((h,i)=>(
                  <div key={i} className="flex justify-between text-[11px] font-inter">
                    <span className="text-ink4 truncate">{h.expr} =</span>
                    <span className="text-ink font-semibold ml-2">{h.result}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Attendance with Face ID ───────────────────────────────
function AttendancePanel({ user }) {
  const { markAttendance, isCheckedIn, getCheckInTime, data } = useApp()
  const checked = isCheckedIn(user.id)
  const checkTime = getCheckInTime(user.id)
  const today = new Date().toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'})
  const days = ['Пн','Вт','Ср','Чт','Пт']
  const week = days.map((d,i)=>({day:d,present:i<3||checked}))
  const [showFace, setShowFace] = useState(false)
  const [faceError, setFaceError] = useState('')
  const [lastLocation, setLastLocation] = useState(null)
  const [useFaceMode, setUseFaceMode] = useState(true)

  const handleFaceSuccess = ({ staffId, distance }) => {
    if (staffId !== user.id) {
      setFaceError('Ошибка: обнаружено чужое лицо! Доступ запрещён.')
      setShowFace(false)
      return
    }
    markAttendance(user.id)
    setShowFace(false)
    setFaceError('')
  }

  const handleFaceError = (msg) => {
    setFaceError(msg)
    setShowFace(false)
  }

  return (
    <div className="staff-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-primary"/>
        <span className="font-bold text-[13px] text-ink">Посещаемость</span>
      </div>
      <p className="text-[11px] text-ink4 font-inter mb-4 capitalize">{today}</p>

      {faceError && (
        <div className="bg-red-50 border border-red-300 p-3 mb-4 flex items-start gap-2">
          <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5"/>
          <div>
            <div className="text-[12px] font-bold text-red-700">Ошибка идентификации</div>
            <div className="text-[11px] text-red-600 font-inter">{faceError}</div>
          </div>
        </div>
      )}

      {checked ? (
        <div className="bg-green-50 border border-green-200 p-4 mb-4 text-center">
          <Check size={20} className="text-green-500 mx-auto mb-1"/>
          <div className="text-[12px] font-bold text-green-700">Отмечено в {checkTime}</div>
          <div className="text-[10px] text-green-500 mt-1 font-inter flex items-center justify-center gap-1">
            ✓ Идентификация по лицу подтверждена
          </div>
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          <button onClick={() => { setFaceError(''); setShowFace(true) }}
            className="w-full bg-primary hover:bg-red-700 text-white py-3 text-[12px] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2">
            <Camera size={14}/> Отметиться через Face ID
          </button>
          <button onClick={() => markAttendance(user.id)}
            className="w-full border border-black/12 hover:border-primary text-ink3 hover:text-primary py-2 text-[11px] font-semibold uppercase tracking-wide transition-all flex items-center justify-center gap-2">
            <Clock size={13}/> Отметиться вручную
          </button>
        </div>
      )}

      <div className="text-[10px] font-bold text-ink4 uppercase tracking-wide mb-2">Эта неделя</div>
      <div className="flex gap-2">
        {week.map(w=>(
          <div key={w.day} className={`flex-1 text-center py-2 border text-[10px] font-bold ${w.present?'bg-green-50 border-green-200 text-green-700':'bg-surf2 border-black/8 text-ink4'}`}>
            {w.day}
            <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${w.present?'bg-green-500':'bg-gray-300'}`}/>
          </div>
        ))}
      </div>

      {showFace && (
        <FaceScanner
          mode="identify"
          staffUsers={data.staffUsers}
          onIdentifySuccess={handleFaceSuccess}
          onError={handleFaceError}
          onClose={() => setShowFace(false)}/>
      )}
    </div>
  )
}

// ── Tasks ──────────────────────────────────────────────────
function TasksPanel({ user }) {
  const { data, updItem, addItem, delItem } = useApp()
  const [modal, setModal] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({title:'',desc:'',priority:'medium',dueDate:''})

  const myTasks = data.staffTasks.filter(t=>t.dept===user.dept)
  const filtered = filter==='all'?myTasks:myTasks.filter(t=>t.status===filter)
  const statusCycle = {todo:'progress',progress:'done',done:'todo'}

  const counts = {
    all:myTasks.length,
    todo:myTasks.filter(t=>t.status==='todo').length,
    progress:myTasks.filter(t=>t.status==='progress').length,
    done:myTasks.filter(t=>t.status==='done').length
  }

  const save = () => {
    if (!form.title) return
    addItem('staffTasks',{...form,dept:user.dept,assignee:user.id,status:'todo'})
    setModal(false)
    setForm({title:'',desc:'',priority:'medium',dueDate:''})
  }

  return (
    <div className="staff-card">
      <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-b border-black/6">
        <div className="flex items-center gap-2">
          <CheckSquare size={15} className="text-primary"/>
          <span className="font-bold text-[13px] text-ink">Задачи отдела</span>
        </div>
        <button onClick={()=>setModal(true)}
          className="flex items-center gap-1 bg-primary/8 border border-primary/20 text-primary text-[10px] font-bold px-2.5 py-1.5 hover:bg-primary hover:text-white transition-all">
          <Plus size={11}/> Добавить
        </button>
      </div>
      <div className="flex border-b border-black/6 overflow-x-auto">
        {[['all','Все'],['todo','Ждёт'],['progress','Идёт'],['done','Готово']].map(([f,l])=>(
          <button key={f} onClick={()=>setFilter(f)}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wide transition-all border-b-2 whitespace-nowrap px-2 ${filter===f?'border-primary text-primary':'border-transparent text-ink4 hover:text-ink'}`}>
            {l} ({counts[f]})
          </button>
        ))}
      </div>
      <div className="divide-y divide-black/4 max-h-96 overflow-y-auto">
        {filtered.map(t=>(
          <div key={t.id} className="p-4 hover:bg-surf2 transition-colors">
            <div className="flex items-start gap-3">
              <button onClick={()=>updItem('staffTasks',t.id,{status:statusCycle[t.status]})} className="mt-0.5 flex-shrink-0">
                <div className={`w-4 h-4 border-2 flex items-center justify-center transition-all ${t.status==='done'?'bg-green-500 border-green-500':t.status==='progress'?'border-blue-400':'border-black/25 hover:border-primary'}`}>
                  {t.status==='done'&&<Check size={9} className="text-white"/>}
                  {t.status==='progress'&&<div className="w-1.5 h-1.5 bg-blue-400"/>}
                </div>
              </button>
              <div className="flex-1 min-w-0">
                <div className={`text-[12px] font-semibold ${t.status==='done'?'line-through text-ink4':'text-ink'}`}>{t.title}</div>
                {t.desc&&<div className="text-[10px] text-ink4 font-inter mt-0.5 leading-relaxed">{t.desc}</div>}
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className={`badge badge-${t.status}`}>{t.status==='todo'?'Не начато':t.status==='progress'?'В процессе':'Выполнено'}</span>
                  <span className={`badge ${t.priority==='high'?'badge-rejected':t.priority==='medium'?'badge-progress':'badge-todo'}`}>
                    {t.priority==='high'?'Высокий':t.priority==='medium'?'Средний':'Низкий'}
                  </span>
                  {t.dueDate&&<span className="text-[9px] text-ink4 font-inter">до {t.dueDate}</span>}
                </div>
              </div>
              <button onClick={()=>delItem('staffTasks',t.id)} className="text-ink4 hover:text-red-500 transition-colors flex-shrink-0 ml-2">
                <Trash2 size={12}/>
              </button>
            </div>
          </div>
        ))}
        {filtered.length===0&&<div className="p-6 text-center text-ink4 text-[12px]">Задач нет</div>}
      </div>

      {modal&&(
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="bg-white max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-black/8">
              <h3 className="font-bebas text-xl text-ink tracking-wider">Новая задача</h3>
              <button onClick={()=>setModal(false)}><X size={16} className="text-ink4"/></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="block text-[11px] font-bold text-ink2 uppercase tracking-wide mb-1.5">Название *</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Описание задачи"/></div>
              <div><label className="block text-[11px] font-bold text-ink2 uppercase tracking-wide mb-1.5">Описание</label><textarea value={form.desc} onChange={e=>setForm(p=>({...p,desc:e.target.value}))} rows={2} placeholder="Подробности..."/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[11px] font-bold text-ink2 uppercase tracking-wide mb-1.5">Приоритет</label>
                  <select value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))}>
                    <option value="high">Высокий</option><option value="medium">Средний</option><option value="low">Низкий</option>
                  </select>
                </div>
                <div><label className="block text-[11px] font-bold text-ink2 uppercase tracking-wide mb-1.5">Срок</label><input type="date" value={form.dueDate} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))}/></div>
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-2">
              <button onClick={save} className="flex-1 bg-primary hover:bg-red-700 text-white py-2.5 text-[12px] font-bold uppercase tracking-wide transition-all">Добавить</button>
              <button onClick={()=>setModal(false)} className="px-5 border border-black/12 text-ink3 text-[12px] font-semibold hover:border-primary hover:text-primary transition-all">Отмена</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// ── Files with Password ────────────────────────────────────
function FilesPanel({ user }) {
  const { data, addItem } = useApp()
  const [dragging, setDragging] = useState(false)
  const [filePasswords, setFilePasswords] = useState({})
  const [passwordModal, setPasswordModal] = useState(null)
  const [downloadModal, setDownloadModal] = useState(null)
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [enteredPassword, setEnteredPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [downloadError, setDownloadError] = useState('')
  const [filterDept, setFilterDept] = useState('all')
  const fileRef = useRef()

  const FILE_ICONS = {pdf:'📄',xlsx:'📊',docx:'📝',png:'🖼️',jpg:'🖼️',jpeg:'🖼️',zip:'📦',default:'📁'}
  const files = filterDept==='all' ? data.sharedFiles : data.sharedFiles.filter(f=>f.dept===filterDept)

  const handleUpload = (fileList) => {
    const file = fileList[0]
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    addItem('sharedFiles',{
      name:file.name, dept:user.dept, uploadedBy:user.id,
      date:new Date().toISOString().split('T')[0],
      size:file.size>1024*1024?`${(file.size/1024/1024).toFixed(1)} МБ`:`${Math.round(file.size/1024)} КБ`,
      type:ext
    })
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let p = ''
    for(let i=0;i<8;i++) p += chars[Math.floor(Math.random()*chars.length)]
    setGeneratedPassword(p)
  }

  const savePassword = (file) => {
    if (!generatedPassword) return
    setFilePasswords(prev=>({...prev,[file.id]:generatedPassword}))
    setPasswordModal(null)
    setGeneratedPassword('')
  }

  const tryDownload = (file) => {
    if (filePasswords[file.id] && file.uploadedBy!==user.id) {
      setDownloadModal(file)
      setEnteredPassword('')
      setDownloadError('')
    } else {
      mockDownload(file)
    }
  }

  const confirmDownload = () => {
    if (enteredPassword.toUpperCase()===filePasswords[downloadModal.id]) {
      mockDownload(downloadModal)
      setDownloadModal(null)
    } else {
      setDownloadError('Неверный пароль. Запросите пароль у владельца файла.')
    }
  }

  const mockDownload = (f) => {
    const blob = new Blob([`Файл: ${f.name}\nОтдел: ${f.dept}\nДата: ${f.date}`],{type:'text/plain'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download=f.name; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="staff-card">
      <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-b border-black/6">
        <div className="flex items-center gap-2">
          <Paperclip size={15} className="text-primary"/>
          <span className="font-bold text-[13px] text-ink">Общие файлы</span>
        </div>
        <select value={filterDept} onChange={e=>setFilterDept(e.target.value)} className="!py-1 !text-[11px] !w-auto">
          <option value="all">Все отделы</option>
          {data.departments.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      <div className="p-4 border-b border-black/6">
        <div className={`drop-zone p-4 text-center ${dragging?'active':''}`}
          onDragOver={e=>{e.preventDefault();setDragging(true)}}
          onDragLeave={()=>setDragging(false)}
          onDrop={e=>{e.preventDefault();setDragging(false);handleUpload(e.dataTransfer.files)}}
          onClick={()=>fileRef.current?.click()}>
          <Upload size={18} className="text-ink4 mx-auto mb-1.5"/>
          <div className="text-[12px] font-semibold text-ink3">Перетащите файл или нажмите</div>
          <div className="text-[10px] text-ink4 mt-0.5">PDF, DOCX, XLSX, PNG, JPG</div>
        </div>
        <input ref={fileRef} type="file" className="hidden" onChange={e=>handleUpload(e.target.files)}/>
      </div>

      <div className="divide-y divide-black/4 max-h-96 overflow-y-auto">
        {files.map(f=>{
          const dept = data.departments.find(d=>d.id===f.dept)
          const uploader = data.staffUsers.find(u=>u.id===f.uploadedBy)
          const isProtected = !!filePasswords[f.id]
          const isOwner = f.uploadedBy===user.id
          return (
            <div key={f.id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3.5 hover:bg-surf2 transition-colors">
              <div className="text-xl flex-shrink-0">{FILE_ICONS[f.type]||FILE_ICONS.default}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-[12px] font-semibold text-ink truncate">{f.name}</div>
                  {isProtected&&<Lock size={11} className="text-amber-500"/>}
                </div>
                <div className="text-[10px] text-ink4 font-inter">{dept?.name} · {uploader?.name||'—'} · {f.date} · {f.size}</div>
              </div>
              <div className="flex gap-1.5 flex-shrink-0 ml-auto">
                {isOwner&&(
                  <button onClick={()=>{setPasswordModal(f);setGeneratedPassword('')}}
                    title={isProtected?'Изменить пароль':'Защитить паролем'}
                    className={`w-7 h-7 flex items-center justify-center border transition-all ${isProtected?'border-amber-300 text-amber-500 bg-amber-50':'border-black/10 text-ink4 hover:border-amber-400 hover:text-amber-500'}`}>
                    <Key size={11}/>
                  </button>
                )}
                <button onClick={()=>tryDownload(f)}
                  className="w-7 h-7 flex items-center justify-center border border-black/10 hover:border-primary hover:text-primary text-ink4 transition-all">
                  <Download size={11}/>
                </button>
              </div>
            </div>
          )
        })}
        {files.length===0&&<div className="p-6 text-center text-ink4 text-[12px]">Файлов нет</div>}
      </div>

      {/* Password generation modal */}
      {passwordModal&&(
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&setPasswordModal(null)}>
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="bg-white max-w-sm w-full shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bebas text-xl text-ink tracking-wider">Защита файла паролем</h3>
              <button onClick={()=>setPasswordModal(null)}><X size={16} className="text-ink4"/></button>
            </div>
            <div className="text-[12px] text-ink3 mb-4 bg-amber-50 border border-amber-200 p-3">
              <strong>Файл:</strong> {passwordModal.name}
            </div>
            <p className="text-[12px] text-ink3 mb-4">Сгенерируйте пароль и передайте его коллеге. Без пароля скачать файл будет невозможно.</p>
            <div className="flex gap-2 mb-4">
              <input value={generatedPassword} readOnly placeholder="Нажмите «Сгенерировать»"
                className="flex-1 !bg-surf2 !border-black/10 font-mono text-[14px] font-bold tracking-widest text-center"/>
              <button onClick={generatePassword}
                className="w-9 h-9 bg-amber-500 hover:bg-amber-600 flex items-center justify-center text-white transition-all flex-shrink-0">
                <RefreshCw size={14}/>
              </button>
            </div>
            {generatedPassword&&(
              <div className="bg-green-50 border border-green-200 p-3 mb-4 text-center">
                <div className="text-[10px] text-green-600 font-bold uppercase tracking-wide mb-1">Пароль готов</div>
                <div className="font-mono text-xl font-bold text-green-700 tracking-widest">{generatedPassword}</div>
                <div className="text-[10px] text-green-500 mt-1">Запишите и передайте коллеге устно или в чате</div>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={()=>savePassword(passwordModal)} disabled={!generatedPassword}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white py-2.5 text-[12px] font-bold uppercase tracking-wide transition-all">
                Сохранить
              </button>
              <button onClick={()=>setPasswordModal(null)}
                className="px-4 border border-black/12 text-ink3 text-[12px] font-semibold hover:border-primary hover:text-primary transition-all">
                Отмена
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Download with password modal */}
      {downloadModal&&(
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&setDownloadModal(null)}>
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="bg-white max-w-sm w-full shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-amber-500"/>
                <h3 className="font-bebas text-xl text-ink tracking-wider">Файл защищён</h3>
              </div>
              <button onClick={()=>setDownloadModal(null)}><X size={16} className="text-ink4"/></button>
            </div>
            <div className="text-[12px] text-ink3 mb-4">Введите пароль для скачивания: <strong>{downloadModal.name}</strong></div>
            <div className="relative mb-4">
              <input type={showPass?'text':'password'} value={enteredPassword}
                onChange={e=>setEnteredPassword(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&confirmDownload()}
                placeholder="Введите пароль..." className="font-mono tracking-widest pr-10"/>
              <button onClick={()=>setShowPass(p=>!p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink4">
                {showPass?<EyeOff size={14}/>:<Eye size={14}/>}
              </button>
            </div>
            {downloadError&&(
              <div className="bg-red-50 border border-red-200 text-red-600 text-[11px] p-3 mb-4 flex items-center gap-2">
                <AlertCircle size={13}/>{downloadError}
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={confirmDownload}
                className="flex-1 bg-primary hover:bg-red-700 text-white py-2.5 text-[12px] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2">
                <Download size={13}/> Скачать
              </button>
              <button onClick={()=>setDownloadModal(null)}
                className="px-4 border border-black/12 text-ink3 text-[12px] font-semibold hover:border-primary hover:text-primary transition-all">
                Отмена
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// ── Chat with photos ───────────────────────────────────────
function ChatPanel({ user }) {
  const { data, addItem } = useApp()
  const [msg, setMsg] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [imageData, setImageData] = useState(null)
  const [activeChannel, setActiveChannel] = useState('all')
  const bottomRef = useRef()
  const imgRef = useRef()

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) },[data.staffChat,activeChannel])

  const channels = [
    {id:'all',label:'Общий',icon:'💬'},
    {id:'hr',label:'Кадры',icon:'👥'},
    {id:'finance',label:'Бухг.',icon:'💰'},
    {id:'sport',label:'Спорт',icon:'🏆'},
    {id:'medical',label:'Медицина',icon:'🏥'},
    {id:'antidope',label:'Антидопинг',icon:'🛡️'},
  ]

  const messages = data.staffChat.filter(m=>m.to===activeChannel)

  const handleImage = (files) => {
    const file = files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => { setImagePreview(e.target.result); setImageData(e.target.result) }
    reader.readAsDataURL(file)
  }

  const send = () => {
    if (!msg.trim()&&!imageData) return
    addItem('staffChat',{
      from:user.id, to:activeChannel,
      text:msg.trim(), image:imageData||null,
      time:new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'}),
      date:new Date().toISOString().split('T')[0],
    })
    setMsg(''); setImagePreview(null); setImageData(null)
  }

  const getUser = (id) => data.staffUsers.find(u=>u.id===id)

  return (
    <div className="staff-card flex flex-col" style={{height:520}}>
      <div className="flex border-b border-black/6 overflow-x-auto flex-shrink-0">
        {channels.map(ch=>(
          <button key={ch.id} onClick={()=>setActiveChannel(ch.id)}
            className={`flex items-center gap-1 px-3 py-2.5 text-[10px] font-bold whitespace-nowrap transition-all border-b-2 ${activeChannel===ch.id?'border-primary text-primary':'border-transparent text-ink4 hover:text-ink'}`}>
            <span>{ch.icon}</span> {ch.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(m=>{
          const sender = getUser(m.from)
          const isMe = m.from===user.id
          return (
            <div key={m.id} className={`flex ${isMe?'justify-end':'justify-start'} gap-2`}>
              {!isMe&&<img src={sender?.avatar} alt="" className="w-7 h-7 rounded-full flex-shrink-0 mt-0.5 object-cover" onError={e=>{e.target.style.display='none'}}/>}
              <div className={`max-w-[75%] ${isMe?'items-end':'items-start'} flex flex-col gap-0.5`}>
                {!isMe&&<span className="text-[10px] text-ink4 font-semibold px-1">{sender?.name}</span>}
                {m.image&&<img src={m.image} alt="фото" className="max-w-full rounded-lg max-h-48 object-cover border border-black/8"/>}
                {m.text&&<div className={`px-3 py-2 text-[12px] leading-relaxed ${isMe?'chat-bubble-me':'chat-bubble-them'}`}>{m.text}</div>}
                <span className="text-[9px] text-ink4 px-1">{m.time}</span>
              </div>
            </div>
          )
        })}
        {messages.length===0&&<div className="text-center text-ink4 text-[12px] mt-8">Нет сообщений в этом канале</div>}
        <div ref={bottomRef}/>
      </div>

      {imagePreview&&(
        <div className="p-2 border-t border-black/6 bg-surf2 flex items-center gap-2 flex-shrink-0">
          <img src={imagePreview} alt="" className="h-12 rounded object-cover border border-black/10"/>
          <div className="flex-1 text-[11px] text-ink3">Фото готово к отправке</div>
          <button onClick={()=>{setImagePreview(null);setImageData(null)}} className="text-ink4 hover:text-red-500"><X size={14}/></button>
        </div>
      )}

      <div className="p-3 border-t border-black/6 flex gap-2 flex-shrink-0">
        <button onClick={()=>imgRef.current?.click()}
          className="w-9 h-9 border border-black/10 flex items-center justify-center text-ink4 hover:border-primary hover:text-primary transition-all flex-shrink-0">
          <ImageIcon size={14}/>
        </button>
        <input type="file" accept="image/*" ref={imgRef} className="hidden" onChange={e=>handleImage(e.target.files)}/>
        <input value={msg} onChange={e=>setMsg(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send()}
          placeholder="Написать сообщение..." className="flex-1 !py-2 !text-[12px]"/>
        <button onClick={send}
          className="w-9 h-9 bg-primary hover:bg-red-700 flex items-center justify-center text-white transition-all flex-shrink-0">
          <Send size={14}/>
        </button>
      </div>
    </div>
  )
}

// ── Department Page ────────────────────────────────────────
function DepartmentPage({ deptId, currentUser }) {
  const { data } = useApp()
  const dept = data.departments.find(d=>d.id===deptId)
  const members = data.staffUsers.filter(u=>u.dept===deptId)
  const tasks = data.staffTasks.filter(t=>t.dept===deptId)
  const files = data.sharedFiles.filter(f=>f.dept===deptId)
  const DeptIcon = DEPT_ICONS[dept?.icon]||Users

  const descriptions = {
    hr:'Управление кадровой документацией, трудовые договоры, личные дела спортсменов.',
    finance:'Бухгалтерский учёт, финансовые отчёты, расчёт зарплат, бюджетирование.',
    edu:'Разработка учебных программ, методические материалы, образовательные стандарты.',
    antidope:'Антидопинговый контроль, тестирование, семинары, соответствие ВАДА.',
    medical:'Медицинское обеспечение, допуски к соревнованиям, плановые осмотры.',
    sport:'Спортивная подготовка, планирование соревнований, мониторинг результатов.',
    it:'IT-инфраструктура, техподдержка, цифровые технологии, кибербезопасность.',
    legal:'Юридическое сопровождение, договоры, нормативная документация.',
    press:'Пресс-релизы, медиа-коммуникации, социальные сети, PR.',
    intl:'Международные соглашения, координация зарубежных соревнований.',
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-black/8 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-14 h-14 flex items-center justify-center flex-shrink-0" style={{background:`${dept?.color}18`}}>
            <DeptIcon size={24} style={{color:dept?.color}}/>
          </div>
          <div>
            <h2 className="font-bebas text-2xl text-ink tracking-wide">{dept?.name}</h2>
            <p className="text-[12px] text-ink3 mt-1">{descriptions[deptId]||'Отдел ЦПМС КР'}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[{label:'Сотрудников',val:members.length,color:dept?.color},{label:'Задач',val:tasks.length,color:'#3b82f6'},{label:'Файлов',val:files.length,color:'#8b5cf6'}].map(s=>(
          <div key={s.label} className="bg-white border border-black/8 p-4 text-center">
            <div className="font-bebas text-3xl" style={{color:s.color}}>{s.val}</div>
            <div className="text-[11px] text-ink4">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white border border-black/8">
        <div className="p-4 border-b border-black/6 font-semibold text-[13px] text-ink">Сотрудники</div>
        <div className="divide-y divide-black/4">
          {members.map(m=>(
            <div key={m.id} className="flex items-center gap-3 p-4">
              <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full object-cover border border-black/8 flex-shrink-0" onError={e=>{e.target.style.background='#eee'}}/>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-ink">{m.name}</div>
                <div className="text-[10px] text-ink4">{m.role}</div>
              </div>
              {m.id===currentUser.id&&<span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 font-bold">Вы</span>}
            </div>
          ))}
          {members.length===0&&<div className="p-4 text-center text-ink4 text-[12px]">Нет сотрудников</div>}
        </div>
      </div>
      {tasks.length>0&&(
        <div className="bg-white border border-black/8">
          <div className="p-4 border-b border-black/6 font-semibold text-[13px] text-ink">Задачи</div>
          {tasks.slice(0,5).map(t=>(
            <div key={t.id} className="flex items-center gap-3 p-3.5 border-b border-black/4 last:border-0">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.status==='done'?'bg-green-400':t.status==='progress'?'bg-blue-400':'bg-gray-300'}`}/>
              <span className="flex-1 text-[12px] text-ink truncate">{t.title}</span>
              <span className={`badge badge-${t.status}`}>{t.status==='done'?'Готово':t.status==='progress'?'Идёт':'Ждёт'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Dashboard ──────────────────────────────────────────────
function Dashboard({ user, dept, DeptIcon, setActiveSection }) {
  const { data, isCheckedIn, getCheckInTime, markAttendance } = useApp()
  const checked = isCheckedIn(user.id)
  const checkTime = getCheckInTime(user.id)
  const myTasks = data.staffTasks.filter(t=>t.dept===user.dept)

  return (
    <div className="space-y-4">
      <div className="bg-white border border-black/8 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <img src={user.avatar} alt="" className="w-14 h-14 rounded-full border-2 border-primary/20 object-cover flex-shrink-0" onError={e=>{e.target.style.background='#f0f0f0'}}/>
          <div className="flex-1 min-w-0">
            <div className="font-bebas text-2xl text-ink tracking-wide">Добрый день, {user.name.split(' ')[0]}!</div>
            <div className="text-[12px] text-ink3 mt-0.5">{user.role}</div>
            <div className="flex items-center gap-1.5 mt-1"><div className="w-2.5 h-2.5 flex-shrink-0" style={{color:dept?.color}}><DeptIcon size={11}/></div><span className="text-[10px] text-ink4">{dept?.name}</span></div>
          </div>
          {!checked?(
            <button onClick={()=>markAttendance(user.id)}
              className="bg-primary hover:bg-red-700 text-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide transition-all flex items-center gap-2 flex-shrink-0">
              <Clock size={13}/> Отметиться
            </button>
          ):(
            <div className="bg-green-50 border border-green-200 px-4 py-2.5 flex-shrink-0">
              <div className="flex items-center gap-1.5 text-green-700"><Check size={13}/><span className="text-[11px] font-bold">Отмечено в {checkTime}</span></div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {label:'Задач',val:myTasks.length,color:'#CC0000',s:'tasks'},
          {label:'В процессе',val:myTasks.filter(t=>t.status==='progress').length,color:'#3b82f6',s:'tasks'},
          {label:'Выполнено',val:myTasks.filter(t=>t.status==='done').length,color:'#22c55e',s:'tasks'},
          {label:'Файлов',val:data.sharedFiles.length,color:'#8b5cf6',s:'files'},
        ].map(s=>(
          <button key={s.label} onClick={()=>setActiveSection(s.s)}
            className="bg-white border border-black/8 p-4 text-left hover:border-black/20 transition-all">
            <div className="font-bebas text-3xl" style={{color:s.color}}>{s.val}</div>
            <div className="text-[11px] text-ink4 mt-0.5">{s.label}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {label:'Задачи',icon:CheckSquare,id:'tasks',color:'#CC0000'},
          {label:'Файлы',icon:FileText,id:'files',color:'#8b5cf6'},
          {label:'Чат',icon:MessageCircle,id:'chat',color:'#3b82f6'},
          {label:'ИИ-помощник',icon:Bot,id:'ai',color:'#6d28d9'},
        ].map(a=>{
          const Icon = a.icon
          return (
            <button key={a.id} onClick={()=>setActiveSection(a.id)}
              className="bg-white border border-black/8 p-4 text-center hover:border-black/20 transition-all hover-lift">
              <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center" style={{background:`${a.color}12`}}>
                <Icon size={18} style={{color:a.color}}/>
              </div>
              <div className="text-[11px] font-semibold text-ink">{a.label}</div>
            </button>
          )
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/8">
          <div className="p-4 border-b border-black/6 flex items-center justify-between">
            <span className="font-semibold text-[13px] text-ink">Мои задачи</span>
            <button onClick={()=>setActiveSection('tasks')} className="text-[10px] text-primary hover:underline">Все →</button>
          </div>
          {myTasks.slice(0,5).map(t=>(
            <div key={t.id} className="p-3 border-b border-black/4 last:border-0 flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.status==='done'?'bg-green-400':t.status==='progress'?'bg-blue-400':'bg-gray-300'}`}/>
              <span className="flex-1 text-[12px] text-ink truncate">{t.title}</span>
              <span className={`badge badge-${t.status}`}>{t.status==='done'?'Готово':t.status==='progress'?'Идёт':'Ждёт'}</span>
            </div>
          ))}
          {myTasks.length===0&&<div className="p-4 text-center text-ink4 text-[12px]">Задач нет</div>}
        </div>

        <div className="bg-white border border-black/8">
          <div className="p-4 border-b border-black/6 font-semibold text-[13px] text-ink">Все сотрудники</div>
          {data.staffUsers.slice(0,6).map(u=>{
            const d=data.departments.find(x=>x.id===u.dept)
            return (
              <div key={u.id} className="p-3 border-b border-black/4 last:border-0 flex items-center gap-2.5">
                <img src={u.avatar} alt="" className="w-7 h-7 rounded-full flex-shrink-0 object-cover" onError={e=>{e.target.style.background='#eee'}}/>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-ink truncate">{u.name}</div>
                  <div className="text-[10px] text-ink4 truncate">{d?.name}</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"/>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white border border-black/8">
        <div className="p-4 border-b border-black/6 flex items-center justify-between">
          <div className="flex items-center gap-2"><MessageCircle size={14} className="text-primary"/><span className="font-semibold text-[13px] text-ink">Последние сообщения</span></div>
          <button onClick={()=>setActiveSection('chat')} className="text-[10px] text-primary hover:underline">Открыть →</button>
        </div>
        {data.staffChat.filter(m=>m.to==='all').slice(-3).reverse().map(m=>{
          const sender=data.staffUsers.find(u=>u.id===m.from)
          return (
            <div key={m.id} className="flex items-start gap-3 p-3.5 border-b border-black/4 last:border-0">
              <img src={sender?.avatar} alt="" className="w-7 h-7 rounded-full flex-shrink-0 object-cover" onError={e=>{e.target.style.background='#eee'}}/>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-ink">{sender?.name}</div>
                <div className="text-[11px] text-ink3 truncate">{m.text||'📷 Фото'}</div>
              </div>
              <span className="text-[9px] text-ink4 flex-shrink-0">{m.time}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Portal ────────────────────────────────────────────
export default function StaffPortalPage() {
  const { staffUser, staffLogout, data, tr } = useApp()
  const nav = useNavigate()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const T = tr.staff

  if (!staffUser) { nav('/staff/login'); return null }

  const dept = data.departments.find(d=>d.id===staffUser.dept)
  const DeptIcon = DEPT_ICONS[dept?.icon]||Users

  const navItems = [
    {id:'dashboard',label:'Дашборд',icon:Home},
    {id:'attendance',label:T.attendance||'Посещаемость',icon:Clock},
    {id:'tasks',label:T.tasks||'Задачи',icon:CheckSquare},
    {id:'files',label:T.files||'Файлы',icon:FileText},
    {id:'chat',label:T.chat||'Чат',icon:MessageCircle},
    {id:'ai',label:'ИИ-помощник',icon:Bot},
    {id:'mydept',label:'Мой отдел',icon:DeptIcon},
    ...(staffUser.dept==='finance'?[{id:'calculator',label:T.calculator||'Калькулятор',icon:CalcIcon}]:[]),
  ]

  const renderSection = () => {
    if (activeSection.startsWith('dept_')) return <DepartmentPage deptId={activeSection.replace('dept_','')} currentUser={staffUser}/>
    switch(activeSection){
      case 'attendance': return <AttendancePanel user={staffUser}/>
      case 'tasks': return <TasksPanel user={staffUser}/>
      case 'files': return <FilesPanel user={staffUser}/>
      case 'chat': return <ChatPanel user={staffUser}/>
      case 'ai': return <AIAssistant user={staffUser} dept={dept}/>
      case 'calculator': return <AdvancedCalculator/>
      case 'mydept': return <DepartmentPage deptId={staffUser.dept} currentUser={staffUser}/>
      default: return <Dashboard user={staffUser} dept={dept} DeptIcon={DeptIcon} setActiveSection={setActiveSection}/>
    }
  }

  const sectionTitle = navItems.find(n=>n.id===activeSection)?.label || 'Дашборд'

  return (
    <div className="flex h-[100dvh] bg-surf2 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen&&<div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={()=>setSidebarOpen(false)}/>}

      {/* Sidebar */}
      <div className={`fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto w-56 bg-white border-r border-black/8 flex flex-col transform transition-transform duration-300 ${sidebarOpen?'translate-x-0':'-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-black/6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary flex items-center justify-center font-bebas text-white text-xs">КР</div>
              <div><div className="font-bebas text-sm text-ink tracking-wide">Портал</div><div className="text-[9px] text-ink4">Сотрудники</div></div>
            </div>
            <button className="lg:hidden text-ink4" onClick={()=>setSidebarOpen(false)}><X size={16}/></button>
          </div>
          <div className="flex items-center gap-2">
            <img src={staffUser.avatar} alt="" className="w-8 h-8 rounded-full flex-shrink-0 object-cover border border-black/8" onError={e=>{e.target.style.background='#eee'}}/>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-ink truncate">{staffUser.name}</div>
              <div className="text-[9px] text-ink4 truncate">{dept?.name}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-2 px-1.5 overflow-y-auto">
          {navItems.map(item=>{
            const Icon=item.icon; const active=activeSection===item.id
            return (
              <button key={item.id} onClick={()=>{setActiveSection(item.id);setSidebarOpen(false)}}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 mb-0.5 text-left transition-all text-[11px] font-semibold border-l-2 ${active?'bg-primary/8 text-primary border-primary':'text-ink3 hover:bg-surf2 hover:text-ink border-transparent'}`}>
                <Icon size={14} className="flex-shrink-0"/>{item.label}
              </button>
            )
          })}

          <div className="mt-3 mb-2 px-3 text-[9px] font-bold text-ink4 uppercase tracking-widest">Отделы</div>
          {data.departments.map(d=>{
            const Icon=DEPT_ICONS[d.icon]||Users
            const isActive=activeSection===`dept_${d.id}`
            return (
              <button key={d.id} onClick={()=>{setActiveSection(`dept_${d.id}`);setSidebarOpen(false)}}
                className={`w-full flex items-center gap-2 px-3 py-2 mb-0.5 text-left transition-all text-[10px] font-semibold border-l-2 ${isActive?'bg-primary/8 text-primary border-primary':'text-ink3 hover:bg-surf2 hover:text-ink border-transparent'}`}>
                <Icon size={12} className="flex-shrink-0" style={{color:isActive?undefined:d.color}}/>
                <span className="truncate">{d.name}</span>
                {d.id===staffUser.dept&&<div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 ml-auto"/>}
              </button>
            )
          })}
        </nav>

        <div className="p-2 border-t border-black/6">
          <button onClick={()=>{staffLogout();nav('/staff/login')}}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors text-[11px] font-semibold">
            <LogOut size={14}/>Выйти
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="h-14 bg-white border-b border-black/8 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-ink3 hover:text-ink" onClick={()=>setSidebarOpen(true)}><Menu size={20}/></button>
            <div className="flex items-center gap-2">
              <DeptIcon size={13} style={{color:dept?.color}}/>
              <span className="font-semibold text-[13px] text-ink">{sectionTitle}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[11px] text-ink4 hidden sm:block">
              {new Date().toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})}
            </div>
            <div className="w-7 h-7 bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
              {staffUser.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.2}}>
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
