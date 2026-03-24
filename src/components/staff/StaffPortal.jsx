import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import {
  Users, DollarSign, GraduationCap, ShieldCheck, HeartPulse,
  Trophy, Monitor, Scale, Newspaper, Globe, LogOut, Bell,
  CheckCircle, Clock, AlertCircle, Plus, Send, Paperclip,
  Download, Upload, FileText, Check, X, MoreHorizontal,
  Calculator, ChevronLeft, MessageCircle, Folder, BarChart2,
  Calendar, ArrowLeft, Delete, Percent, Divide, Minus
} from 'lucide-react'

const DEPT_ICONS = { Users, DollarSign, GraduationCap, ShieldCheck, HeartPulse, Trophy, Monitor, Scale, Newspaper, Globe }

// ── Calculator ─────────────────────────────────────────────────────────────────
function FinanceCalculator() {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState(null)
  const [op, setOp] = useState(null)
  const [fresh, setFresh] = useState(true)
  const [history, setHistory] = useState([])
  const [memory, setMemory] = useState(0)

  const push = (val) => {
    if (fresh) { setDisplay(String(val)); setFresh(false) }
    else setDisplay(p => p === '0' ? String(val) : p + val)
  }
  const pushDot = () => { if (!display.includes('.')) setDisplay(p => p + '.'); setFresh(false) }
  const setOperator = (o) => {
    setPrev(parseFloat(display))
    setOp(o)
    setFresh(true)
  }
  const compute = () => {
    if (op === null || prev === null) return
    const cur = parseFloat(display)
    let result
    if (op === '+') result = prev + cur
    else if (op === '-') result = prev - cur
    else if (op === '*') result = prev * cur
    else if (op === '/') { result = cur === 0 ? 'Ошибка' : prev / cur }
    else if (op === '%') result = prev * (cur / 100)
    else if (op === 'pow') result = Math.pow(prev, cur)
    const r = typeof result === 'number' ? parseFloat(result.toFixed(10)) : result
    setHistory(h => [`${prev} ${op} ${cur} = ${r}`, ...h.slice(0, 9)])
    setDisplay(String(r))
    setPrev(null); setOp(null); setFresh(true)
  }
  const clear = () => { setDisplay('0'); setPrev(null); setOp(null); setFresh(true) }
  const toggleSign = () => setDisplay(p => p.startsWith('-') ? p.slice(1) : '-' + p)
  const backspace = () => setDisplay(p => p.length > 1 ? p.slice(0,-1) : '0')
  const sqrt = () => { const r = Math.sqrt(parseFloat(display)); setDisplay(String(parseFloat(r.toFixed(10)))) }
  const mStore = () => setMemory(parseFloat(display))
  const mRecall = () => { setDisplay(String(memory)); setFresh(false) }
  const mClear = () => setMemory(0)

  const pct = (n) => { setDisplay(String(parseFloat((parseFloat(display) * n / 100).toFixed(2)))) }

  const rows = [
    [['MC','mClear','op'],['MR','mRecall','op'],['M+','()=>setMemory(m=>m+parseFloat(display))','op'],['M-','()=>setMemory(m=>m-parseFloat(display))','op']],
    [['C','clear','clear'],['±','toggleSign','op'],['%','()=>setOperator(\'%\')','op'],['÷','()=>setOperator(\'/\')','op']],
    [['7','()=>push(7)',''],['8','()=>push(8)',''],['9','()=>push(9)',''],['×','()=>setOperator(\'*\')','op']],
    [['4','()=>push(4)',''],['5','()=>push(5)',''],['6','()=>push(6)',''],['−','()=>setOperator(\'-\')','op']],
    [['1','()=>push(1)',''],['2','()=>push(2)',''],['3','()=>push(3)',''],['＋','()=>setOperator(\'+\')','op']],
    [['√','sqrt','op'],['0','()=>push(0)',''],['•','pushDot','op'],['=','compute','eq']],
  ]

  const handlers = { clear, toggleSign, sqrt, mClear, mRecall, compute, pushDot,
    '()=>setOperator(\'+\')': ()=>setOperator('+'),
    '()=>setOperator(\'-\')': ()=>setOperator('-'),
    '()=>setOperator(\'*\')': ()=>setOperator('*'),
    '()=>setOperator(\'/\')': ()=>setOperator('/'),
    '()=>setOperator(\'%\')': ()=>setOperator('%'),
    '()=>push(0)': ()=>push(0),'()=>push(1)':()=>push(1),'()=>push(2)':()=>push(2),
    '()=>push(3)':()=>push(3),'()=>push(4)':()=>push(4),'()=>push(5)':()=>push(5),
    '()=>push(6)':()=>push(6),'()=>push(7)':()=>push(7),'()=>push(8)':()=>push(8),
    '()=>push(9)':()=>push(9),
    '()=>setMemory(m=>m+parseFloat(display))': ()=>setMemory(m=>m+parseFloat(display)),
    '()=>setMemory(m=>m-parseFloat(display))': ()=>setMemory(m=>m-parseFloat(display)),
  }

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div>
        <div className="bg-[#0a0a0a] p-4 mb-1">
          <div className="text-white/30 text-[10px] font-mono mb-1 min-h-[16px]">
            {prev !== null ? `${prev} ${op}` : memory !== 0 ? `M: ${memory}` : ''}
          </div>
          <div className="text-white font-mono text-right text-3xl font-light overflow-hidden overflow-ellipsis whitespace-nowrap">
            {display}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-0.5 bg-black/5">
          {rows.map((row, ri) => row.map(([label, action, type]) => (
            <button key={ri+label}
              onClick={() => { const h = handlers[action]; if (h) h() }}
              className={`calc-btn ${type==='op'?'op':''} ${type==='eq'?'eq':''} ${type==='clear'?'clear':''}`}>
              {label}
            </button>
          )))}
        </div>
        <div className="flex gap-1 mt-1">
          <button onClick={()=>pct(10)} className="flex-1 calc-btn text-[11px]">10%</button>
          <button onClick={()=>pct(20)} className="flex-1 calc-btn text-[11px]">20%</button>
          <button onClick={()=>pct(50)} className="flex-1 calc-btn text-[11px]">50%</button>
          <button onClick={()=>setOperator('pow')} className="flex-1 calc-btn op text-[11px]">xⁿ</button>
          <button onClick={backspace} className="flex-1 calc-btn text-[11px] text-red-500">⌫</button>
        </div>
      </div>
      <div>
        <div className="text-[11px] font-bold text-ink uppercase tracking-wide mb-2">История вычислений</div>
        <div className="bg-surf2 border border-black/8 min-h-[240px] p-3 font-mono text-[12px] text-ink3 space-y-1.5">
          {history.length===0 ? <span className="text-ink4 text-[11px]">Вычислений пока нет</span>
            : history.map((h,i)=><div key={i} className={`${i===0?'text-ink font-bold':''}`}>{h}</div>)}
        </div>
        <button onClick={()=>setHistory([])} className="mt-2 text-[10px] text-ink4 hover:text-primary transition-colors">Очистить историю</button>
        <div className="mt-4 p-3 bg-primary/5 border border-primary/15">
          <div className="text-[10px] font-bold text-ink uppercase tracking-wide mb-2">Финансовые расчёты</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['НДС 12%', ()=>{ const v=parseFloat(display); setDisplay(String(parseFloat((v*1.12).toFixed(2)))); setHistory(h=>[`НДС 12%: ${v} → ${(v*1.12).toFixed(2)}`,...h.slice(0,9)]) }],
              ['НДС вычесть', ()=>{ const v=parseFloat(display); setDisplay(String(parseFloat((v/1.12).toFixed(2)))); setHistory(h=>[`-НДС: ${v} → ${(v/1.12).toFixed(2)}`,...h.slice(0,9)]) }],
              ['× 12 мес.', ()=>{ const v=parseFloat(display); setDisplay(String(v*12)); setHistory(h=>[`×12: ${v} → ${v*12}`,...h.slice(0,9)]) }],
              ['÷ 12 мес.', ()=>{ const v=parseFloat(display); setDisplay(String(parseFloat((v/12).toFixed(2)))); setHistory(h=>[`÷12: ${v} → ${(v/12).toFixed(2)}`,...h.slice(0,9)]) }],
            ].map(([l,fn])=>(
              <button key={l} onClick={fn} className="text-[10px] font-bold bg-white border border-black/10 hover:border-primary hover:text-primary px-2 py-2 transition-all text-left">{l}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Chat ───────────────────────────────────────────────────────────────────────
function StaffChat({ currentUser, data, addItem }) {
  const [msg, setMsg] = useState('')
  const bottomRef = useRef()

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [data.staffChat])

  const send = () => {
    if (!msg.trim()) return
    addItem('staffChat', { from: currentUser.id, to:'all', text: msg.trim(), time: new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'}), date: new Date().toISOString().split('T')[0] })
    setMsg('')
  }

  const getUser = id => data.staffUsers.find(u=>u.id===id)

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surf2">
        {data.staffChat.map(m => {
          const isMe = m.from === currentUser.id
          const user = getUser(m.from)
          return (
            <div key={m.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
              <img src={user?.avatar} alt="" className="w-7 h-7 rounded-full flex-shrink-0 border border-black/10" onError={e=>e.target.style.display='none'} />
              <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                {!isMe && <span className="text-[9px] text-ink4 font-semibold">{user?.name}</span>}
                <div className={`px-3 py-2 text-[12px] ${isMe ? 'chat-bubble-me' : 'chat-bubble-them'}`}>
                  {m.text}
                </div>
                <span className="text-[9px] text-ink4">{m.time}</span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 bg-white border-t border-black/8 flex gap-2">
        <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
          placeholder="Написать сообщение..." className="flex-1 !py-2 !text-[12px]" />
        <button onClick={send} className="bg-primary hover:bg-pd text-white px-3 py-2 transition-all flex-shrink-0">
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Tasks ─────────────────────────────────────────────────────────────────────
function Tasks({ currentUser, data, updItem, addItem, delItem }) {
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({title:'',desc:'',priority:'medium',dueDate:''})
  const myTasks = data.staffTasks.filter(t => t.assignee === currentUser.id || t.dept === currentUser.dept)

  const STATUSES = [
    { key:'todo',     label:'Не начато',  cls:'badge-todo' },
    { key:'progress', label:'В процессе', cls:'badge-progress' },
    { key:'done',     label:'Выполнено',  cls:'badge-done' },
  ]

  const save = () => {
    if (!form.title.trim()) return
    addItem('staffTasks', { ...form, dept: currentUser.dept, assignee: currentUser.id, status:'todo' })
    setForm({title:'',desc:'',priority:'medium',dueDate:''}); setModal(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-[12px] font-bold text-ink">Мои задачи</div>
        <button onClick={()=>setModal(true)} className="flex items-center gap-1 bg-primary hover:bg-pd text-white px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide transition-all"><Plus size={12}/> Задача</button>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {STATUSES.map(s => (
          <div key={s.key} className="bg-surf2 border border-black/6 p-3 min-h-[140px]">
            <div className={`badge ${s.cls} mb-3`}>{s.label}</div>
            <div className="space-y-2">
              {myTasks.filter(t=>t.status===s.key).map(t=>(
                <div key={t.id} className="bg-white border border-black/8 p-2.5 hover:border-primary/30 transition-all">
                  <div className="text-[11px] font-bold text-ink mb-1">{t.title}</div>
                  <div className="text-[9px] text-ink4 mb-2">{t.desc}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-ink4">{t.dueDate}</span>
                    <div className="flex gap-1">
                      {s.key!=='done'&&<button onClick={()=>updItem('staffTasks',t.id,{status:s.key==='todo'?'progress':'done'})} className="w-5 h-5 flex items-center justify-center bg-primary/8 hover:bg-primary hover:text-white text-primary transition-all"><Check size={9}/></button>}
                      <button onClick={()=>delItem('staffTasks',t.id)} className="w-5 h-5 flex items-center justify-center bg-black/4 hover:bg-red-50 hover:text-red-500 text-ink4 transition-all"><X size={9}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {modal&&(
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="bg-white w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-black/8"><h3 className="font-bebas text-xl text-ink tracking-wider">Новая задача</h3><button onClick={()=>setModal(false)} className="text-ink4 hover:text-ink"><X size={16}/></button></div>
            <div className="p-4 space-y-3">
              <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Название *</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/></div>
              <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Описание</label><textarea value={form.desc} onChange={e=>setForm(p=>({...p,desc:e.target.value}))} rows={2}/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Приоритет</label>
                  <select value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))}><option value="high">Высокий</option><option value="medium">Средний</option><option value="low">Низкий</option></select>
                </div>
                <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Срок</label><input type="date" value={form.dueDate} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))}/></div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-black/8">
              <button onClick={()=>setModal(false)} className="px-4 py-2 border border-black/12 text-ink3 text-[11px] font-semibold uppercase hover:border-ink transition-all">Отмена</button>
              <button onClick={save} className="px-4 py-2 bg-primary hover:bg-pd text-white text-[11px] font-bold uppercase tracking-wide transition-all">Создать</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Files ─────────────────────────────────────────────────────────────────────
function FileSharing({ currentUser, data, addItem }) {
  const fileRef = useRef()
  const [dragging, setDragging] = useState(false)

  const FILE_ICONS = { pdf:'📄', xlsx:'📊', docx:'📝', default:'📎' }

  const handleUpload = (file) => {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    addItem('sharedFiles', {
      name: file.name,
      dept: currentUser.dept,
      uploadedBy: currentUser.id,
      date: new Date().toISOString().split('T')[0],
      size: file.size > 1e6 ? `${(file.size/1e6).toFixed(1)} МБ` : `${Math.round(file.size/1024)} КБ`,
      type: ext,
    })
  }

  const getUserName = id => data.staffUsers.find(u=>u.id===id)?.name || id

  return (
    <div>
      <div className="text-[12px] font-bold text-ink mb-3">Общие файлы</div>
      <div
        className={`drop-zone p-5 flex flex-col items-center justify-center gap-2 mb-4 ${dragging?'active':''}`}
        onDragOver={e=>{e.preventDefault();setDragging(true)}}
        onDragLeave={()=>setDragging(false)}
        onDrop={e=>{e.preventDefault();setDragging(false);handleUpload(e.dataTransfer.files[0])}}
        onClick={()=>fileRef.current?.click()}>
        <Upload size={22} className="text-ink4" />
        <span className="text-[12px] text-ink3 font-semibold">Перетащите файл или нажмите для загрузки</span>
        <span className="text-[10px] text-ink4">PDF, DOCX, XLSX, изображения</span>
      </div>
      <input ref={fileRef} type="file" className="hidden" onChange={e=>handleUpload(e.target.files[0])} />
      <div className="space-y-2">
        {data.sharedFiles.map(f => {
          const icon = FILE_ICONS[f.type] || FILE_ICONS.default
          return (
            <div key={f.id} className="flex items-center gap-3 p-3 bg-white border border-black/8 hover:border-primary/30 transition-all">
              <div className="text-xl flex-shrink-0">{icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold text-ink truncate">{f.name}</div>
                <div className="text-[10px] text-ink4">{getUserName(f.uploadedBy)} · {f.date} · {f.size}</div>
              </div>
              <button className="flex items-center gap-1 bg-primary/6 border border-primary/15 text-primary hover:bg-primary hover:text-white px-2.5 py-1.5 text-[10px] font-bold transition-all flex-shrink-0">
                <Download size={11}/> Скачать
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Staff Portal ─────────────────────────────────────────────────────────
export default function StaffPortal() {
  const { data, staffUser, staffLogout, markAttendance, isCheckedIn, getCheckInTime, addItem, updItem, delItem } = useApp()
  const nav = useNavigate()
  const [activeSection, setActiveSection] = useState('dashboard')
  const dept = data.departments.find(d => d.id === staffUser?.dept)

  if (!staffUser) { nav('/staff/login'); return null }

  const Icon = DEPT_ICONS[dept?.icon] || Users
  const checkedIn = isCheckedIn(staffUser.id)
  const checkTime = getCheckInTime(staffUser.id)

  const allTasks = data.staffTasks.filter(t => t.assignee===staffUser.id || t.dept===staffUser.dept)
  const pending = allTasks.filter(t=>t.status!=='done').length

  const sections = [
    { id:'dashboard', label:'Главная',        icon:LayoutDashboard2 },
    { id:'tasks',     label:'Задачи',          icon:FileText },
    { id:'chat',      label:'Чат',             icon:MessageCircle },
    { id:'files',     label:'Файлы',           icon:Folder },
    ...(staffUser.dept === 'finance' ? [{ id:'calculator', label:'Калькулятор', icon:Calculator }] : []),
  ]

  function LayoutDashboard2({ size }) { return <BarChart2 size={size} /> }

  const MyDashboard = () => (
    <div className="space-y-5">
      {/* Attendance */}
      <div className="bg-white border border-black/8 p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-[12px] font-bold text-ink mb-1">Отметка посещаемости</div>
            <div className="text-[11px] text-ink4">{new Date().toLocaleDateString('ru-RU',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
          </div>
          {checkedIn ? (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2.5">
              <CheckCircle size={16} className="text-green-600" />
              <div>
                <div className="text-[11px] font-bold text-green-700">Вы отмечены</div>
                <div className="text-[10px] text-green-600">Время входа: {checkTime}</div>
              </div>
            </div>
          ) : (
            <motion.button whileHover={{y:-1}} onClick={() => markAttendance(staffUser.id)}
              className="bg-primary hover:bg-pd text-white px-5 py-2.5 text-[12px] font-bold uppercase tracking-wide transition-all flex items-center gap-2">
              <Clock size={14}/> Отметиться
            </motion.button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Задач всего',      val:allTasks.length,                           color:'#CC0000', bg:'rgba(204,0,0,.08)',  Icon:FileText },
          { label:'Выполнено',        val:allTasks.filter(t=>t.status==='done').length, color:'#22c55e', bg:'rgba(34,197,94,.1)',Icon:CheckCircle },
          { label:'В процессе',       val:allTasks.filter(t=>t.status==='progress').length, color:'#3b82f6', bg:'rgba(59,130,246,.1)', Icon:Clock },
          { label:'Сообщений сегодня',val:data.staffChat.filter(m=>m.date===new Date().toISOString().split('T')[0]).length, color:'#8b5cf6', bg:'rgba(139,92,246,.1)', Icon:MessageCircle },
        ].map(c => (
          <div key={c.label} className="bg-white border border-black/8 p-4 hover-lift">
            <div className="w-8 h-8 flex items-center justify-center mb-2" style={{background:c.bg}}><c.Icon size={15} style={{color:c.color}}/></div>
            <div className="font-bebas text-2xl leading-none mb-0.5" style={{color:c.color}}>{c.val}</div>
            <div className="text-[10px] text-ink4">{c.label}</div>
          </div>
        ))}
      </div>

      {/* My tasks preview */}
      <div className="bg-white border border-black/8 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[12px] font-bold text-ink">Текущие задачи</div>
          <button onClick={()=>setActiveSection('tasks')} className="text-[10px] text-primary font-bold hover:underline">Все →</button>
        </div>
        {allTasks.filter(t=>t.status!=='done').slice(0,4).map(t=>(
          <div key={t.id} className="flex items-center gap-3 py-2.5 border-b border-black/4 last:border-0">
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-bold text-ink truncate">{t.title}</div>
              <div className="text-[10px] text-ink4">Срок: {t.dueDate}</div>
            </div>
            <span className={`badge badge-${t.status}`}>{t.status==='todo'?'Не начато':'В процессе'}</span>
          </div>
        ))}
        {allTasks.filter(t=>t.status!=='done').length===0 && <p className="text-ink4 text-[11px]">Все задачи выполнены! 🎉</p>}
      </div>

      {/* Recent files */}
      <div className="bg-white border border-black/8 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[12px] font-bold text-ink">Последние файлы</div>
          <button onClick={()=>setActiveSection('files')} className="text-[10px] text-primary font-bold hover:underline">Все →</button>
        </div>
        {data.sharedFiles.slice(0,3).map(f=>(
          <div key={f.id} className="flex items-center gap-2 py-2 border-b border-black/4 last:border-0">
            <span className="text-base">{f.type==='pdf'?'📄':f.type==='xlsx'?'📊':'📝'}</span>
            <div className="flex-1 min-w-0"><div className="text-[11px] font-bold text-ink truncate">{f.name}</div><div className="text-[9px] text-ink4">{f.date} · {f.size}</div></div>
          </div>
        ))}
      </div>
    </div>
  )

  const content = {
    dashboard:  <MyDashboard />,
    tasks:      <Tasks currentUser={staffUser} data={data} updItem={updItem} addItem={addItem} delItem={delItem} />,
    chat:       <StaffChat currentUser={staffUser} data={data} addItem={addItem} />,
    files:      <FileSharing currentUser={staffUser} data={data} addItem={addItem} />,
    calculator: <FinanceCalculator />,
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surf2">
      {/* Sidebar */}
      <div className="w-52 bg-white border-r border-black/8 flex flex-col flex-shrink-0">
        <div className="p-3.5 border-b border-black/8">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-black/10 flex-shrink-0">
              <img src={staffUser.avatar} alt="" className="w-full h-full object-cover" onError={e=>e.target.style.display='none'} />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-ink truncate">{staffUser.name}</div>
              <div className="text-[9px] text-ink4 truncate">{staffUser.role}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1.5" style={{background:`${dept?.color}15`,border:`1px solid ${dept?.color}30`}}>
            <Icon size={12} style={{color:dept?.color,flexShrink:0}} />
            <span className="text-[10px] font-bold truncate" style={{color:dept?.color}}>{dept?.name}</span>
          </div>
          {checkedIn && (
            <div className="flex items-center gap-1 mt-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
              <span className="text-[9px] text-green-600 font-semibold">Отмечен в {checkTime}</span>
            </div>
          )}
        </div>

        <nav className="flex-1 py-2 px-1.5">
          {sections.map(s => {
            const SI = s.icon
            const active = activeSection === s.id
            return (
              <button key={s.id} onClick={()=>setActiveSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 mb-0.5 text-[11px] font-semibold transition-all text-left border-l-2 ${active?'bg-primary/6 text-primary border-primary':'text-ink3 hover:bg-surf2 hover:text-ink border-transparent'}`}>
                <SI size={14} className="flex-shrink-0"/>
                {s.label}
              </button>
            )
          })}
        </nav>

        <div className="p-2 border-t border-black/8 space-y-1">
          <button onClick={()=>nav('/')} className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[10px] text-ink4 hover:text-ink transition-colors">
            <ArrowLeft size={12}/> На сайт
          </button>
          <button onClick={()=>{staffLogout();nav('/staff/login')}} className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[10px] text-red-400 hover:text-red-600 transition-colors">
            <LogOut size={12}/> Выйти
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-12 bg-white border-b border-black/8 flex items-center justify-between px-5 flex-shrink-0">
          <div className="font-bebas text-xl text-ink tracking-wider">
            {sections.find(s=>s.id===activeSection)?.label || 'Портал сотрудников'}
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-ink4 hover:text-ink p-1.5">
              <Bell size={15}/>
              {pending>0 && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-primary rounded-full"/>}
            </button>
            <div className="text-[10px] text-ink4 font-inter hidden md:block">
              {new Date().toLocaleDateString('ru-RU',{day:'numeric',month:'short',year:'numeric'})}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <motion.div key={activeSection} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.2}}>
            {content[activeSection]}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
