import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  LayoutDashboard, Users, UserCheck, Calendar, FileText, UserPlus,
  Newspaper, DollarSign, Map, Settings, LogOut, Bell,
  BarChart2, X, ChevronRight, Download, Plus, Edit2, Trash2,
  Check, XCircle, Search
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'

const COLORS = ['#CC0000','#F5C518','#555','#333','#222']

// ── Sidebar ──────────────────────────────────────────────
function Sidebar({ activeTab, setTab, collapsed, setCollapsed }) {
  const { tr, adminUser, adminLogout, data } = useApp()
  const nav = useNavigate()
  const T = tr.admin
  const pendingCount = data.applications.filter(a => a.status === 'pending').length
  const pendingStaffCount = (data.staffUsers || []).filter(u => u.approved === false).length

  const items = [
    { id:'dashboard',    label:T.dashboard,     icon:LayoutDashboard },
    { id:'athletes',     label:T.athletes,      icon:Users },
    { id:'coaches',      label:T.coaches,       icon:UserCheck },
    { id:'events',       label:T.events,        icon:Calendar },
    { id:'applications', label:T.applications,  icon:FileText, badge:pendingCount },
    { id:'news',         label:T.news,          icon:Newspaper },
    { id:'finances',     label:T.finances,      icon:DollarSign },
    { id:'regions',      label:T.regions,       icon:Map },
    { id:'reports',      label:T.reports,       icon:BarChart2 },
    { id:'staff_reg',    label:'Заявки сотруд.', icon:UserPlus, badge:pendingStaffCount },
    { id:'settings',     label:T.settings,      icon:Settings },
  ]

  return (
    <div className={`flex flex-col h-full bg-white border-r border-black/8 transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}>
      {/* Header */}
      <div className="p-4 border-b border-black/6 flex items-center justify-between min-h-[60px]">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary flex items-center justify-center font-bebas text-white text-sm">КР</div>
            <div>
              <div className="font-bebas text-base text-ink tracking-wider">ЦПМС КР</div>
              <div className="text-[9px] text-ink4">Админ панель</div>
            </div>
          </div>
        )}
        {collapsed && <div className="w-8 h-8 bg-primary flex items-center justify-center font-bebas text-white text-sm mx-auto">КР</div>}
        <button onClick={() => setCollapsed(!collapsed)} className="text-ink4 hover:text-ink transition-colors p-1 flex-shrink-0">
          {collapsed ? <ChevronRight size={14} /> : <X size={14} />}
        </button>
      </div>

      {/* User */}
      {!collapsed && (
        <div className="p-3 border-b border-black/6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center font-bebas text-primary text-sm flex-shrink-0">
              {adminUser?.name?.[0] || 'A'}
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-ink truncate">{adminUser?.name}</div>
              <div className="text-[10px] text-ink4">{adminUser?.role}</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-2 px-1.5 overflow-y-auto">
        {items.map(item => {
          const Icon = item.icon
          const active = activeTab === item.id
          return (
            <button key={item.id} onClick={() => setTab(item.id)} title={collapsed ? item.label : ''}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 mb-0.5 text-left transition-all relative ${active ? 'bg-primary/8 text-primary border-l-2 border-primary' : 'text-ink3 hover:bg-surf2 hover:text-ink border-l-2 border-transparent'}`}>
              <Icon size={15} className="flex-shrink-0" />
              {!collapsed && <span className="text-[11px] font-semibold flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge > 0 && (
                <span className="bg-primary text-white text-[9px] font-bold px-1.5 py-0.5">{item.badge}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-black/6">
        <Link to="/" className={`flex items-center gap-2.5 px-3 py-2 text-ink4 hover:text-primary transition-colors text-[11px] font-semibold`}>
          <ChevronRight size={14} className="flex-shrink-0 rotate-180" />
          {!collapsed && 'На сайт'}
        </Link>
        <button onClick={() => { adminLogout(); nav('/login') }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors`}>
          <LogOut size={15} className="flex-shrink-0" />
          {!collapsed && <span className="text-[11px] font-semibold">{tr.admin.logout}</span>}
        </button>
      </div>
    </div>
  )
}

// ── Dashboard ────────────────────────────────────────────
function Dashboard() {
  const { data, tr, exportCSV } = useApp()
  const T = tr.admin

  const totalInc = data.finances.income.reduce((s,x) => s+x.v, 0)
  const totalExp = data.finances.expenses.reduce((s,x) => s+x.v, 0)
  const chartData = data.finances.income.map((x,i) => ({ month:x.month, income:x.v, expense:data.finances.expenses[i]?.v||0 }))

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bebas text-3xl text-ink tracking-wider">{T.dashboard}</h1>
          <p className="text-ink4 text-[11px] font-inter mt-0.5">{new Date().toLocaleDateString('ru-RU',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
        </div>
        <button onClick={() => exportCSV(data.athletes,'athletes-report')}
          className="flex items-center gap-2 border border-black/10 hover:border-primary text-ink3 hover:text-primary px-4 py-2 text-[11px] font-bold uppercase tracking-wide transition-all">
          <Download size={13} /> {T.export}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:T.athletes,      val:data.stats.athletes, color:'#CC0000', bg:'rgba(204,0,0,0.08)' },
          { label:T.coaches,       val:data.stats.coaches,  color:'#F5C518', bg:'rgba(245,197,24,0.12)' },
          { label:T.applications,  val:data.applications.filter(a=>a.status==='pending').length, color:'#f59e0b', bg:'rgba(245,158,11,0.08)' },
          { label:T.events,        val:data.events.length,  color:'#3b82f6', bg:'rgba(59,130,246,0.08)' },
        ].map(c => (
          <div key={c.label} className="bg-white border border-black/8 p-5 hover:border-primary/25 transition-all">
            <div className="w-8 h-8 flex items-center justify-center mb-3" style={{background:c.bg}}>
              <div className="w-3 h-3 rounded-full" style={{background:c.color}} />
            </div>
            <div className="font-bebas text-3xl leading-none mb-1" style={{color:c.color}}>{c.val.toLocaleString()}</div>
            <div className="text-[11px] text-ink4">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Finance chart */}
        <div className="lg:col-span-2 bg-white border border-black/8 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold text-[13px] text-ink">Финансовый обзор</div>
            <div className="flex gap-3 text-[10px] text-ink4">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary inline-block" />Доходы</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-gold inline-block" />Расходы</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gi" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#CC0000" stopOpacity={.25}/><stop offset="95%" stopColor="#CC0000" stopOpacity={0}/></linearGradient>
                <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F5C518" stopOpacity={.25}/><stop offset="95%" stopColor="#F5C518" stopOpacity={0}/></linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{fontSize:10,fill:'#888'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:'#888'}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1e6).toFixed(1)}M`}/>
              <Tooltip contentStyle={{background:'#fff',border:'1px solid #eee',fontSize:11}}/>
              <Area type="monotone" dataKey="income" stroke="#CC0000" strokeWidth={2} fill="url(#gi)"/>
              <Area type="monotone" dataKey="expense" stroke="#F5C518" strokeWidth={2} fill="url(#ge)"/>
            </AreaChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-black/6">
            <div><div className="text-[10px] text-ink4">Доходы</div><div className="font-bebas text-xl text-primary">{(totalInc/1e6).toFixed(1)}M сом</div></div>
            <div><div className="text-[10px] text-ink4">Расходы</div><div className="font-bebas text-xl text-gold">{(totalExp/1e6).toFixed(1)}M сом</div></div>
            <div><div className="text-[10px] text-ink4">Баланс</div><div className="font-bebas text-xl text-green-500">{((totalInc-totalExp)/1e6).toFixed(1)}M сом</div></div>
          </div>
        </div>

        {/* Recent apps */}
        <div className="bg-white border border-black/8 p-5">
          <div className="font-semibold text-[13px] text-ink mb-4">Последние заявки</div>
          <div className="space-y-2">
            {data.applications.slice(0,5).map(a => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-black/4 last:border-0">
                <div>
                  <div className="text-[12px] font-bold text-ink">{a.name}</div>
                  <div className="text-[10px] text-ink4">{a.sport}</div>
                </div>
                <span className={`badge badge-${a.status}`}>{a.status==='pending'?'Ожидает':a.status==='approved'?'Одобрено':'Отклонено'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Athletes tab ─────────────────────────────────────────
function AthletesTab() {
  const { data, tr, addItem, updItem, delItem, exportCSV } = useApp()
  const [q, setQ] = useState('')
  const [modal, setModal] = useState(null) // null | {mode:'add'|'edit', data?}
  const [form, setForm] = useState({})
  const T = tr.admin

  const filtered = data.athletes.filter(a =>
    Object.values(a).join(' ').toLowerCase().includes(q.toLowerCase())
  )

  const openAdd = () => { setForm({name:'',sport:'',region:'',rank:'',coach:'',firstCoach:'',medals:0,status:'active',dob:'',bio:'',photo:'',competitions:[]}); setModal({mode:'add'}) }
  const openEdit = a => { setForm({...a}); setModal({mode:'edit',data:a}) }
  const save = () => {
    if (!form.name) return
    if (modal.mode === 'add') addItem('athletes', form)
    else updItem('athletes', form.id, form)
    setModal(null)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bebas text-3xl text-ink tracking-wider">{T.athletes}</h1>
        <div className="flex gap-2">
          <button onClick={() => exportCSV(data.athletes,'athletes')} className="flex items-center gap-1.5 border border-black/10 hover:border-primary text-ink3 hover:text-primary px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all">
            <Download size={13}/>{T.export}
          </button>
          <button onClick={openAdd} className="flex items-center gap-1.5 bg-primary hover:bg-pd text-white px-4 py-2 text-[11px] font-bold uppercase tracking-wide transition-all">
            <Plus size={13}/>{T.add}
          </button>
        </div>
      </div>

      <div className="bg-white border border-black/8">
        <div className="p-4 border-b border-black/6 flex items-center justify-between gap-3">
          <span className="text-[13px] font-bold text-ink">Реестр спортсменов</span>
          <div className="relative"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink4"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder={T.search} className="!pl-8 !w-52 !text-[12px] !py-2"/></div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Фото</th><th>Имя</th><th>Спорт</th><th>Регион</th><th>Разряд</th><th>Тренер</th><th>Медали</th><th>Статус</th><th>Действия</th></tr></thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td><div className="w-8 h-8 overflow-hidden bg-surf3">{a.photo?<img src={a.photo} alt={a.name} className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-ink4 font-bebas text-base">{a.name[0]}</div>}</div></td>
                  <td><strong>{a.name}</strong></td>
                  <td>{a.sport}</td><td>{a.region}</td><td>{a.rank}</td><td>{a.coach}</td>
                  <td><strong className="text-primary">{a.medals}</strong></td>
                  <td><span className={`badge badge-${a.status}`}>{a.status==='active'?'Активен':'Резерв'}</span></td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={()=>openEdit(a)} className="w-7 h-7 flex items-center justify-center border border-black/10 hover:border-blue-400 hover:text-blue-500 text-ink4 transition-all"><Edit2 size={11}/></button>
                      <button onClick={()=>delItem('athletes',a.id)} className="w-7 h-7 flex items-center justify-center border border-black/10 hover:border-red-400 hover:text-red-500 text-ink4 transition-all"><Trash2 size={11}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && <tr><td colSpan={9} className="text-center text-ink4 py-8 text-sm">Нет данных</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="bg-white max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-black/8">
              <h3 className="font-bebas text-2xl text-ink tracking-wider">{modal.mode==='add'?'Добавить спортсмена':'Редактировать'}</h3>
              <button onClick={()=>setModal(null)} className="text-ink4 hover:text-ink"><X size={16}/></button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              {[['name','Имя','text'],['sport','Вид спорта','text'],['region','Регион','text'],['rank','Разряд','text'],['firstCoach','Первый тренер','text'],['coach','Тренер на соревн.','text'],['dob','Дата рождения','date'],['medals','Медали','number'],['photo','Фото URL','text']].map(([k,l,t])=>(
                <div key={k} className={k==='name'||k==='photo'?'col-span-2':''}>
                  <label className="block text-[11px] font-bold text-ink2 uppercase tracking-wide mb-1.5">{l}</label>
                  <input type={t} value={form[k]||''} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-ink2 uppercase tracking-wide mb-1.5">Биография</label>
                <textarea value={form.bio||''} onChange={e=>setForm(p=>({...p,bio:e.target.value}))} rows={3} placeholder="Краткая биография..."/>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-ink2 uppercase tracking-wide mb-1.5">Статус</label>
                <select value={form.status||'active'} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>
                  <option value="active">Активен</option><option value="reserve">Резерв</option>
                </select>
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-2">
              <button onClick={save} className="flex-1 bg-primary hover:bg-pd text-white py-2.5 text-[12px] font-bold uppercase tracking-wide transition-all">Сохранить</button>
              <button onClick={()=>setModal(null)} className="px-5 border border-black/12 text-ink3 text-[12px] font-semibold uppercase tracking-wide hover:border-primary hover:text-primary transition-all">Отмена</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// ── Applications tab ──────────────────────────────────────
function ApplicationsTab() {
  const { data, tr, updItem, delItem, exportCSV } = useApp()
  const [filter, setFilter] = useState('all')
  const T = tr.admin

  const filtered = filter==='all' ? data.applications : data.applications.filter(a=>a.status===filter)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bebas text-3xl text-ink tracking-wider">{T.applications}</h1>
        <button onClick={()=>exportCSV(data.applications,'applications')} className="flex items-center gap-1.5 border border-black/10 hover:border-primary text-ink3 hover:text-primary px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all">
          <Download size={13}/>{T.export}
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-black/8 mb-5">
        {[['all','Все'],['pending','Ожидают'],['approved','Одобрены'],['rejected','Отклонены']].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)}
            className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide border-b-2 transition-all ${filter===v?'text-primary border-primary':'text-ink4 border-transparent hover:text-ink'}`}>
            {l} {v!=='all'&&<span className="ml-1 text-[9px]">({data.applications.filter(a=>a.status===v).length})</span>}
          </button>
        ))}
      </div>

      <div className="bg-white border border-black/8 overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Фото</th><th>Имя</th><th>Спорт</th><th>Соревнование</th><th>Регион</th><th>Дата</th><th>Телефон</th><th>Статус</th><th>Действия</th></tr></thead>
          <tbody>
            {filtered.map(a=>(
              <tr key={a.id}>
                <td>{a.photo?<img src={a.photo} alt={a.name} className="w-8 h-8 object-cover"/>:<div className="w-8 h-8 bg-surf3 flex items-center justify-center text-ink4 font-bebas">{a.name[0]}</div>}</td>
                <td><strong>{a.name}</strong></td>
                <td>{a.sport}</td><td className="max-w-[140px] truncate">{a.event}</td>
                <td>{a.region}</td><td>{a.date}</td><td>{a.phone}</td>
                <td><span className={`badge badge-${a.status}`}>{a.status==='pending'?'Ожидает':a.status==='approved'?'Одобрено':'Отклонено'}</span></td>
                <td>
                  <div className="flex gap-1">
                    {a.status==='pending'&&<>
                      <button onClick={()=>updItem('applications',a.id,{status:'approved'})} className="w-7 h-7 flex items-center justify-center border border-black/10 hover:border-green-400 hover:text-green-500 text-ink4 transition-all" title="Одобрить"><Check size={11}/></button>
                      <button onClick={()=>updItem('applications',a.id,{status:'rejected'})} className="w-7 h-7 flex items-center justify-center border border-black/10 hover:border-red-400 hover:text-red-500 text-ink4 transition-all" title="Отклонить"><XCircle size={11}/></button>
                    </>}
                    <button onClick={()=>delItem('applications',a.id)} className="w-7 h-7 flex items-center justify-center border border-black/10 hover:border-red-400 hover:text-red-500 text-ink4 transition-all"><Trash2 size={11}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length===0&&<tr><td colSpan={9} className="text-center py-8 text-ink4 text-sm">Нет заявок</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Finances tab ──────────────────────────────────────────
function FinancesTab() {
  const { data, exportCSV } = useApp()
  const totalInc = data.finances.income.reduce((s,x)=>s+x.v,0)
  const totalExp = data.finances.expenses.reduce((s,x)=>s+x.v,0)
  const tableData = data.finances.income.map((x,i)=>({month:x.month,income:x.v,expenses:data.finances.expenses[i]?.v||0,balance:x.v-(data.finances.expenses[i]?.v||0)}))

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bebas text-3xl text-ink tracking-wider">Финансы</h1>
        <button onClick={()=>exportCSV(tableData,'finances')} className="flex items-center gap-1.5 border border-black/10 hover:border-primary text-ink3 hover:text-primary px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all">
          <Download size={13}/>Экспорт
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        {[['Доходы',(totalInc/1e6).toFixed(1)+'M сом','text-green-500'],['Расходы',(totalExp/1e6).toFixed(1)+'M сом','text-primary'],['Баланс',((totalInc-totalExp)/1e6).toFixed(1)+'M сом','text-ink']].map(([l,v,c])=>(
          <div key={l} className="bg-white border border-black/8 p-5">
            <div className="text-[11px] text-ink4 font-semibold uppercase tracking-wide mb-2">{l}</div>
            <div className={`font-bebas text-3xl ${c}`}>{v}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-black/8 p-5 mb-4">
        <div className="font-semibold text-[13px] text-ink mb-4">Доходы и расходы по месяцам</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={tableData}>
            <XAxis dataKey="month" tick={{fontSize:10,fill:'#888'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:10,fill:'#888'}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1e6).toFixed(1)}M`}/>
            <Tooltip contentStyle={{background:'#fff',border:'1px solid #eee',fontSize:11}} formatter={v=>`${v.toLocaleString()} сом`}/>
            <Bar dataKey="income" fill="#CC0000" name="Доходы" radius={[2,2,0,0]}/>
            <Bar dataKey="expenses" fill="#e5e5e5" name="Расходы" radius={[2,2,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-black/8 overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Месяц</th><th>Доходы</th><th>Расходы</th><th>Баланс</th></tr></thead>
          <tbody>
            {tableData.map(r=>(
              <tr key={r.month}>
                <td><strong>{r.month}</strong></td>
                <td className="text-green-600 font-semibold">{r.income.toLocaleString()} сом</td>
                <td className="text-primary font-semibold">{r.expenses.toLocaleString()} сом</td>
                <td className={`font-bold ${r.balance>=0?'text-green-600':'text-red-500'}`}>{r.balance.toLocaleString()} сом</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Events tab ────────────────────────────────────────────
function EventsTab() {
  const { data, tr, addItem, delItem } = useApp()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({title:'',date:'',location:'',sport:'',slots:100,registered:0})

  const save = () => {
    if (!form.title) return
    addItem('events', {...form, slots:+form.slots, registered:0})
    setModal(false)
    setForm({title:'',date:'',location:'',sport:'',slots:100,registered:0})
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bebas text-3xl text-ink tracking-wider">Соревнования</h1>
        <button onClick={()=>setModal(true)} className="flex items-center gap-1.5 bg-primary hover:bg-pd text-white px-4 py-2 text-[11px] font-bold uppercase tracking-wide transition-all"><Plus size={13}/>Добавить</button>
      </div>
      <div className="bg-white border border-black/8 overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Название</th><th>Дата</th><th>Место</th><th>Спорт</th><th>Мест</th><th>Зарег.</th><th>Заполн.</th><th></th></tr></thead>
          <tbody>
            {data.events.map(e=>(
              <tr key={e.id}>
                <td><strong>{e.title}</strong></td><td>{e.date}</td><td>{e.location}</td><td>{e.sport}</td><td>{e.slots}</td>
                <td><strong className="text-primary">{e.registered}</strong></td>
                <td>
                  <div className="w-20 h-1.5 bg-surf3 overflow-hidden"><div className="h-full bg-primary" style={{width:`${Math.round(e.registered/e.slots*100)}%`}}/></div>
                  <div className="text-[9px] text-ink4 mt-0.5">{Math.round(e.registered/e.slots*100)}%</div>
                </td>
                <td><button onClick={()=>delItem('events',e.id)} className="w-7 h-7 flex items-center justify-center border border-black/10 hover:border-red-400 hover:text-red-500 text-ink4 transition-all"><Trash2 size={11}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="bg-white max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-black/8">
              <h3 className="font-bebas text-2xl text-ink tracking-wider">Добавить соревнование</h3>
              <button onClick={()=>setModal(false)}><X size={16} className="text-ink4 hover:text-ink"/></button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              {[['title','Название','text'],['date','Дата','date'],['location','Место','text'],['sport','Вид спорта','text'],['slots','Мест','number']].map(([k,l,t])=>(
                <div key={k} className={k==='title'?'col-span-2':''}>
                  <label className="block text-[11px] font-bold text-ink2 uppercase tracking-wide mb-1.5">{l}</label>
                  <input type={t} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/>
                </div>
              ))}
            </div>
            <div className="p-5 pt-0 flex gap-2">
              <button onClick={save} className="flex-1 bg-primary hover:bg-pd text-white py-2.5 text-[12px] font-bold uppercase tracking-wide transition-all">Сохранить</button>
              <button onClick={()=>setModal(false)} className="px-5 border border-black/12 text-ink3 text-[12px] font-semibold hover:border-primary hover:text-primary transition-all">Отмена</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// ── News tab ──────────────────────────────────────────────
function NewsTab() {
  const { data, addItem, updItem, delItem } = useApp()
  const [modal, setModal] = useState(null) // null | {mode:'add'|'edit', data?}
  const [form, setForm] = useState({title:'',category:'Новости',text:'',img:''})

  const openAdd = () => { setForm({title:'',category:'Новости',text:'',img:''}); setModal({mode:'add'}) }
  const openEdit = n => { setForm({...n}); setModal({mode:'edit', data:n}) }

  const save = () => {
    if (!form.title) return
    if (modal.mode==='add') addItem('news', {...form, date: new Date().toISOString().split('T')[0]})
    else updItem('news', form.id, form)
    setModal(null)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bebas text-3xl text-ink tracking-wider">Новости</h1>
        <button onClick={openAdd} className="flex items-center gap-1.5 bg-primary hover:bg-pd text-white px-4 py-2 text-[11px] font-bold uppercase tracking-wide transition-all"><Plus size={13}/>Добавить</button>
      </div>
      <div className="bg-white border border-black/8">
        <div className="divide-y divide-black/4">
          {data.news.map(n=>(
            <div key={n.id} className="flex items-start gap-4 p-4 hover:bg-surf2 transition-colors">
              {n.img && <img src={n.img} alt={n.title} className="w-16 h-12 object-cover flex-shrink-0 border border-black/8" onError={e=>e.target.style.display="none"}/>}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <strong className="text-[13px] text-ink truncate">{n.title}</strong>
                  <span className="badge badge-pending text-[9px]">{n.category}</span>
                </div>
                <div className="text-[11px] text-ink4 font-inter line-clamp-1">{n.text}</div>
                <div className="text-[10px] text-ink4 mt-1">{n.date}</div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={()=>openEdit(n)} className="w-7 h-7 flex items-center justify-center border border-black/10 hover:border-blue-400 hover:text-blue-500 text-ink4 transition-all"><Edit2 size={11}/></button>
                <button onClick={()=>delItem('news',n.id)} className="w-7 h-7 flex items-center justify-center border border-black/10 hover:border-red-400 hover:text-red-500 text-ink4 transition-all"><Trash2 size={11}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="bg-white max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-black/8">
              <h3 className="font-bebas text-2xl text-ink tracking-wider">{modal.mode==='add'?'Добавить новость':'Редактировать'}</h3>
              <button onClick={()=>setModal(null)}><X size={16} className="text-ink4"/></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="block text-[11px] font-bold text-ink2 uppercase tracking-wide mb-1.5">Заголовок *</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/></div>
              <div><label className="block text-[11px] font-bold text-ink2 uppercase tracking-wide mb-1.5">Категория</label>
                <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                  {["Новости","Соревнования","Подготовка","Отбор","Достижения","Инфраструктура"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="block text-[11px] font-bold text-ink2 uppercase tracking-wide mb-1.5">Текст статьи *</label><textarea value={form.text} onChange={e=>setForm(p=>({...p,text:e.target.value}))} rows={5} placeholder="Полный текст новости..."/></div>
              <div><label className="block text-[11px] font-bold text-ink2 uppercase tracking-wide mb-1.5">URL фото</label><input value={form.img||""} onChange={e=>setForm(p=>({...p,img:e.target.value}))} placeholder="https://images.unsplash.com/..."/>
                {form.img && <img src={form.img} alt="" className="mt-2 h-24 object-cover w-full border border-black/8" onError={e=>e.target.style.display="none"}/>}
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-2">
              <button onClick={save} className="flex-1 bg-primary hover:bg-pd text-white py-2.5 text-[12px] font-bold uppercase tracking-wide transition-all">{modal.mode==='add'?'Добавить':'Сохранить'}</button>
              <button onClick={()=>setModal(null)} className="px-5 border border-black/12 text-ink3 text-[12px] font-semibold hover:border-primary hover:text-primary transition-all">Отмена</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// ── Staff Registrations Tab ───────────────────────────────
function StaffRegistrationsTab() {
  const { data, approveStaff, rejectStaff } = useApp()
  const pending  = (data.staffUsers || []).filter(u => u.approved === false)
  const approved = (data.staffUsers || []).filter(u => u.approved !== false)

  const getDept = (id) => (data.departments || []).find(d => d.id === id)

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="font-bebas text-3xl text-ink tracking-wider">Заявки на регистрацию</h1>
        {pending.length > 0 && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            {pending.length} новых
          </span>
        )}
      </div>

      {/* Pending section */}
      <div className="mb-8">
        <div className="text-[11px] font-bold text-ink2 uppercase tracking-widest mb-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400"/>
          Ожидают подтверждения ({pending.length})
        </div>

        {pending.length === 0 ? (
          <div className="bg-white border border-black/8 p-8 text-center text-ink4 text-[12px]">
            Нет новых заявок на регистрацию
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(u => {
              const dept = getDept(u.dept)
              return (
                <div key={u.id} className="bg-white border border-amber-200 p-5 flex flex-wrap items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src={u.avatar} alt={u.name} className="w-full h-full object-cover"
                      onError={e => {
                        e.target.style.display = 'none'
                        e.target.parentElement.innerHTML = `<span class="font-bebas text-xl text-amber-600">${u.name?.[0]}</span>`
                      }}/>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-[14px] text-ink">{u.name}</span>
                      <span className="badge badge-pending">Ожидает</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-[11px] text-ink4">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background: dept?.color || '#888'}}/>
                        {dept?.name || u.dept}
                      </span>
                      {u.role && <span>· {u.role}</span>}
                      <span className="font-mono">@{u.login}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => approveStaff(u.id)}
                      className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-[11px] font-bold uppercase tracking-wide transition-all">
                      <Check size={13}/> Одобрить
                    </button>
                    <button onClick={() => rejectStaff(u.id)}
                      className="flex items-center gap-1.5 border border-red-300 hover:bg-red-50 text-red-500 hover:text-red-600 px-4 py-2 text-[11px] font-bold uppercase tracking-wide transition-all">
                      <X size={13}/> Отклонить
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Approved section */}
      <div>
        <div className="text-[11px] font-bold text-ink2 uppercase tracking-widest mb-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400"/>
          Активные сотрудники ({approved.length})
        </div>
        <div className="bg-white border border-black/8">
          <div className="divide-y divide-black/4">
            {approved.map(u => {
              const dept = getDept(u.dept)
              return (
                <div key={u.id} className="flex items-center gap-4 p-4 hover:bg-surf2 transition-colors">
                  <img src={u.avatar} alt={u.name}
                    className="w-9 h-9 rounded-full object-cover border border-black/8 flex-shrink-0"
                    onError={e => { e.target.style.background = '#eee' }}/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[12px] text-ink">{u.name}</span>
                      <span className="badge badge-approved">Активен</span>
                    </div>
                    <div className="text-[10px] text-ink4 font-inter mt-0.5">
                      {dept?.name} · {u.role} · <span className="font-mono">@{u.login}</span>
                    </div>
                  </div>
                  <button onClick={() => rejectStaff(u.id)}
                    className="w-7 h-7 flex items-center justify-center border border-black/10 hover:border-red-400 hover:text-red-500 text-ink4 transition-all flex-shrink-0"
                    title="Удалить сотрудника">
                    <Trash2 size={11}/>
                  </button>
                </div>
              )
            })}
            {approved.length === 0 && (
              <div className="p-6 text-center text-ink4 text-[12px]">Нет активных сотрудников</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Settings tab ──────────────────────────────────────────
function SettingsTab() {
  const { data, upd, addItem, delItem } = useApp()
  const [saved, setSaved] = useState(false)
  const [stats, setStats] = useState({...data.stats})
  const [heroRu, setHeroRu] = useState({...(data.heroTitle?.ru || {t1:'ЦЕНТР ПОДГОТОВКИ',t2:'МОЛОДЁЖНЫХ СБОРНЫХ',t3:'КЫРГЫЗСКОЙ РЕСПУБЛИКИ',sub:''})})
  const [heroKy, setHeroKy] = useState({...(data.heroTitle?.ky || {t1:'',t2:'',t3:'',sub:''})})
  const [heroEn, setHeroEn] = useState({...(data.heroTitle?.en || {t1:'',t2:'',t3:'',sub:''})})
  const [partnerForm, setPartnerForm] = useState({name:'',url:'',logo:''})
  const [tab, setTab] = useState('stats')

  const saveStats = () => {
    upd('stats', {...stats, athletes:+stats.athletes, coaches:+stats.coaches, sports:+stats.sports, medals:+stats.medals})
    setSaved(true); setTimeout(()=>setSaved(false), 3000)
  }

  const saveHero = () => {
    upd('heroTitle', {ru:heroRu, ky:heroKy, en:heroEn})
    setSaved(true); setTimeout(()=>setSaved(false), 3000)
  }

  const addPartner = () => {
    if (!partnerForm.name) return
    addItem('partners', {...partnerForm})
    setPartnerForm({name:'',url:'',logo:''})
  }

  const tabs = [
    {id:'stats', label:'Статистика'},
    {id:'hero', label:'Заголовок сайта'},
    {id:'partners', label:'Партнёры'},
  ]

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="font-bebas text-3xl text-ink tracking-wider mb-6">Настройки сайта</h1>

      {/* Tabs */}
      <div className="flex border-b border-black/8 mb-6">
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            className={`px-5 py-2.5 text-[12px] font-semibold border-b-2 transition-all ${tab===t.id?'border-primary text-primary':'border-transparent text-ink4 hover:text-ink'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {saved && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 text-[11px] font-semibold">✓ Изменения сохранены</div>}

      {tab==='stats'&&(
        <div className="bg-white border border-black/8 p-6">
          <div className="font-semibold text-[13px] text-ink mb-4 pb-3 border-b border-black/6">Статистика на главной странице</div>
          <div className="grid grid-cols-2 gap-4">
            {[['athletes','Спортсменов'],['coaches','Тренеров'],['sports','Видов спорта'],['medals','Медалей 2024']].map(([k,l])=>(
              <div key={k}>
                <label className="block text-[11px] font-bold text-ink2 uppercase tracking-wide mb-1.5">{l}</label>
                <input type="number" value={stats[k]} onChange={e=>setStats(p=>({...p,[k]:e.target.value}))}/>
              </div>
            ))}
          </div>
          <button onClick={saveStats} className="mt-4 bg-primary hover:bg-pd text-white px-6 py-2.5 text-[12px] font-bold uppercase tracking-wide transition-all">Сохранить</button>
        </div>
      )}

      {tab==='hero'&&(
        <div className="space-y-4">
          {[['ru','Русский (RU)',heroRu,setHeroRu],['ky','Кыргызский (KY)',heroKy,setHeroKy],['en','English (EN)',heroEn,setHeroEn]].map(([lang,label,hero,setHero])=>(
            <div key={lang} className="bg-white border border-black/8 p-5">
              <div className="font-semibold text-[13px] text-ink mb-4 pb-2 border-b border-black/6">{label}</div>
              <div className="space-y-3">
                {[['t1','Строка 1'],['t2','Строка 2 (красная)'],['t3','Строка 3 (золотая)'],['sub','Подзаголовок']].map(([k,l])=>(
                  <div key={k}>
                    <label className="block text-[10px] font-bold text-ink4 uppercase tracking-wide mb-1">{l}</label>
                    <input value={hero[k]||''} onChange={e=>setHero(p=>({...p,[k]:e.target.value}))} placeholder={l}/>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button onClick={saveHero} className="bg-primary hover:bg-pd text-white px-6 py-2.5 text-[12px] font-bold uppercase tracking-wide transition-all">Сохранить заголовки</button>
        </div>
      )}

      {tab==='partners'&&(
        <div className="space-y-4">
          <div className="bg-white border border-black/8 p-5">
            <div className="font-semibold text-[13px] text-ink mb-4 pb-2 border-b border-black/6">Добавить партнёра</div>
            <div className="grid sm:grid-cols-3 gap-3 mb-3">
              <div><label className="block text-[10px] font-bold text-ink4 uppercase tracking-wide mb-1">Название *</label><input value={partnerForm.name} onChange={e=>setPartnerForm(p=>({...p,name:e.target.value}))} placeholder="Название компании"/></div>
              <div><label className="block text-[10px] font-bold text-ink4 uppercase tracking-wide mb-1">URL</label><input value={partnerForm.url} onChange={e=>setPartnerForm(p=>({...p,url:e.target.value}))} placeholder="https://..."/></div>
              <div><label className="block text-[10px] font-bold text-ink4 uppercase tracking-wide mb-1">Лого URL</label><input value={partnerForm.logo} onChange={e=>setPartnerForm(p=>({...p,logo:e.target.value}))} placeholder="https://..."/></div>
            </div>
            <button onClick={addPartner} className="bg-primary hover:bg-pd text-white px-5 py-2 text-[11px] font-bold uppercase tracking-wide transition-all">Добавить</button>
          </div>
          <div className="bg-white border border-black/8">
            <div className="p-4 border-b border-black/6 font-semibold text-[13px] text-ink">Список партнёров</div>
            {(data.partners||[]).map(p=>(
              <div key={p.id} className="flex items-center gap-3 p-3.5 border-b border-black/4 last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-ink truncate">{p.name}</div>
                  <div className="text-[10px] text-ink4 truncate">{p.url}</div>
                </div>
                <button onClick={()=>delItem('partners',p.id)} className="w-7 h-7 flex items-center justify-center border border-black/10 hover:border-red-400 hover:text-red-500 text-ink4 transition-all flex-shrink-0"><Trash2 size={11}/></button>
              </div>
            ))}
            {!(data.partners?.length) && <div className="p-4 text-center text-ink4 text-[12px]">Партнёров нет</div>}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Coaches tab ───────────────────────────────────────────
function CoachesTab() {
  const { data, addItem, delItem } = useApp()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({name:'',sport:'',region:'',exp:'',rank:'МС КР',athletes:0})

  const save = () => {
    if (!form.name) return
    addItem('coaches', {...form, exp:+form.exp, athletes:+form.athletes})
    setModal(false)
    setForm({name:'',sport:'',region:'',exp:'',rank:'МС КР',athletes:0})
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bebas text-3xl text-ink tracking-wider">Тренеры</h1>
        <button onClick={()=>setModal(true)} className="flex items-center gap-1.5 bg-primary hover:bg-pd text-white px-4 py-2 text-[11px] font-bold uppercase tracking-wide transition-all"><Plus size={13}/>Добавить</button>
      </div>
      <div className="bg-white border border-black/8 overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Имя</th><th>Вид спорта</th><th>Регион</th><th>Стаж</th><th>Звание</th><th>Спортсменов</th><th></th></tr></thead>
          <tbody>
            {data.coaches.map(c=>(
              <tr key={c.id}>
                <td><strong>{c.name}</strong></td><td>{c.sport}</td><td>{c.region}</td>
                <td>{c.exp} лет</td><td>{c.rank}</td><td>{c.athletes}</td>
                <td><button onClick={()=>delItem('coaches',c.id)} className="w-7 h-7 flex items-center justify-center border border-black/10 hover:border-red-400 hover:text-red-500 text-ink4 transition-all"><Trash2 size={11}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="bg-white max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-black/8">
              <h3 className="font-bebas text-2xl text-ink tracking-wider">Добавить тренера</h3>
              <button onClick={()=>setModal(false)}><X size={16} className="text-ink4"/></button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              {[['name','Имя'],['sport','Вид спорта'],['region','Регион'],['exp','Стаж (лет)'],['rank','Звание'],['athletes','Спортсменов']].map(([k,l])=>(
                <div key={k} className={k==='name'?'col-span-2':''}>
                  <label className="block text-[11px] font-bold text-ink2 uppercase tracking-wide mb-1.5">{l}</label>
                  <input type={['exp','athletes'].includes(k)?'number':'text'} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/>
                </div>
              ))}
            </div>
            <div className="p-5 pt-0 flex gap-2">
              <button onClick={save} className="flex-1 bg-primary hover:bg-pd text-white py-2.5 text-[12px] font-bold uppercase tracking-wide transition-all">Сохранить</button>
              <button onClick={()=>setModal(false)} className="px-5 border border-black/12 text-ink3 text-[12px] font-semibold hover:border-primary hover:text-primary transition-all">Отмена</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// ── Reports tab ───────────────────────────────────────────
function ReportsTab() {
  const { data, exportCSV } = useApp()
  const reports = [
    { title:'Отчёт по спортсменам', desc:'Полный реестр спортсменов центра', action:()=>exportCSV(data.athletes,'athletes-full'), count:data.athletes.length },
    { title:'Отчёт по тренерам', desc:'Список тренерского состава', action:()=>exportCSV(data.coaches,'coaches-full'), count:data.coaches.length },
    { title:'Отчёт по заявкам', desc:'Все поданные заявки на участие', action:()=>exportCSV(data.applications,'applications-full'), count:data.applications.length },
    { title:'Финансовый отчёт', desc:'Доходы и расходы по месяцам', action:()=>exportCSV(data.finances.income.map((x,i)=>({month:x.month,income:x.v,expenses:data.finances.expenses[i]?.v||0,balance:x.v-(data.finances.expenses[i]?.v||0)})),'finances'), count:data.finances.income.length },
    { title:'Отчёт по соревнованиям', desc:'Список соревнований и заполняемость', action:()=>exportCSV(data.events,'events-full'), count:data.events.length },
    { title:'Отчёт по регионам', desc:'Статистика по регионам КР', action:()=>exportCSV(data.regions,'regions-full'), count:data.regions.length },
  ]

  return (
    <div className="p-6">
      <h1 className="font-bebas text-3xl text-ink tracking-wider mb-6">Отчёты</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map(r=>(
          <div key={r.title} className="bg-white border border-black/8 p-5 hover:border-primary/30 hover:shadow-sm transition-all">
            <div className="text-[13px] font-bold text-ink mb-1">{r.title}</div>
            <div className="text-[11px] text-ink4 mb-4 font-inter">{r.desc}</div>
            <div className="flex items-center justify-between">
              <span className="font-bebas text-2xl text-primary">{r.count}</span>
              <button onClick={r.action} className="flex items-center gap-1.5 bg-primary/8 border border-primary/20 text-primary text-[10px] font-bold uppercase px-3 py-1.5 hover:bg-primary hover:text-white transition-all">
                <Download size={11}/>CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Regions tab ───────────────────────────────────────────
function RegionsTab() {
  const { data } = useApp()
  return (
    <div className="p-6">
      <h1 className="font-bebas text-3xl text-ink tracking-wider mb-5">Регионы</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.regions.map(r=>(
          <div key={r.id} className="bg-white border border-black/8 p-5 hover:border-primary/30 transition-all">
            <div className="font-bebas text-xl text-ink tracking-wide mb-3">{r.name}</div>
            <div className="grid grid-cols-3 gap-2">
              {[['Школ',r.schools,'text-primary'],['Спортсм.',r.athletes,'text-gold'],['Тренеров',r.coaches,'text-ink']].map(([l,v,c])=>(
                <div key={l} className="text-center bg-surf2 border border-black/6 p-2">
                  <div className={`font-bebas text-xl ${c}`}>{v}</div>
                  <div className="text-[9px] text-ink4">{l}</div>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[10px] mb-1"><span className="text-ink4">Доля спортсменов</span><span className="text-primary font-bold">{Math.round(r.athletes/data.stats.athletes*100)}%</span></div>
              <div className="h-1 bg-surf3 overflow-hidden"><div className="h-full bg-primary" style={{width:`${Math.round(r.athletes/data.stats.athletes*100)}%`}}/></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Admin Page ───────────────────────────────────────
export default function AdminPage() {
  const { adminUser } = useApp()
  const nav = useNavigate()
  const [tab, setTab] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)

  if (!adminUser) { nav('/login'); return null }

  const TABS = {
    dashboard: <Dashboard/>,
    athletes: <AthletesTab/>,
    coaches: <CoachesTab/>,
    events: <EventsTab/>,
    applications: <ApplicationsTab/>,
    news: <NewsTab/>,
    finances: <FinancesTab/>,
    regions: <RegionsTab/>,
    reports: <ReportsTab/>,
    staff_reg: <StaffRegistrationsTab/>,
    settings: <SettingsTab/>,
  }

  return (
    <div className="flex h-screen bg-surf2 overflow-hidden">
      <Sidebar activeTab={tab} setTab={setTab} collapsed={collapsed} setCollapsed={setCollapsed}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="h-14 bg-white border-b border-black/8 flex items-center justify-between px-5 flex-shrink-0">
          <div className="text-ink4 text-[11px] font-inter hidden md:block">
            {new Date().toLocaleDateString('ru-RU',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative text-ink4 hover:text-ink transition-colors p-1.5">
              <Bell size={16}/>
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full"/>
            </button>
            <div className="w-7 h-7 bg-primary/10 flex items-center justify-center font-bebas text-primary text-sm">{adminUser?.name?.[0]}</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <motion.div key={tab} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25}}>
            {TABS[tab] || <Dashboard/>}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
