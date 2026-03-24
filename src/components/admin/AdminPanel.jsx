import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import {
  LayoutDashboard, Users, UserCheck, Calendar, FileText,
  Newspaper, DollarSign, Map, Settings, LogOut, Bell, X,
  ChevronRight, Download, Plus, Edit2, Trash2, Check, XCircle,
  BarChart2, Shield
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'

const COLORS = ['#CC0000','#F5C518','#555','#333','#222']

function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const { tr, adminUser, adminLogout, data } = useApp()
  const nav = useNavigate()
  const pendingApps = data.applications.filter(a => a.status === 'pending').length

  const items = [
    { id:'dashboard',    label:'Дашборд',       icon:LayoutDashboard },
    { id:'athletes',     label:'Спортсмены',     icon:Users },
    { id:'coaches',      label:'Тренеры',        icon:UserCheck },
    { id:'events',       label:'Соревнования',   icon:Calendar },
    { id:'applications', label:'Заявки',         icon:FileText, badge:pendingApps },
    { id:'news',         label:'Новости',        icon:Newspaper },
    { id:'finances',     label:'Финансы',        icon:DollarSign },
    { id:'regions',      label:'Регионы',        icon:Map },
    { id:'reports',      label:'Отчёты',         icon:BarChart2 },
    { id:'settings',     label:'Настройки',      icon:Settings },
  ]

  return (
    <div className={`flex flex-col bg-white border-r border-black/8 h-full transition-all duration-300 ${collapsed ? 'w-14' : 'w-56'}`}>
      <div className="flex items-center justify-between p-3 border-b border-black/8 min-h-[56px]">
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 bg-primary flex items-center justify-center font-bebas text-white text-sm flex-shrink-0">КР</div>
            <div className="min-w-0">
              <div className="font-bebas text-sm text-ink tracking-wider truncate">ЦПМС КР</div>
              <div className="text-[9px] text-ink4 font-inter truncate">Администратор</div>
            </div>
          </div>
        )}
        {collapsed && <div className="w-7 h-7 bg-primary flex items-center justify-center font-bebas text-white text-sm mx-auto">КР</div>}
        <button onClick={() => setCollapsed(!collapsed)} className="text-ink4 hover:text-ink transition-colors p-0.5 flex-shrink-0 ml-1">
          <ChevronRight size={14} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {!collapsed && (
        <div className="px-3 py-2.5 border-b border-black/6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bebas text-sm flex-shrink-0">
              {adminUser?.name?.[0] || 'A'}
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-ink truncate">{adminUser?.name}</div>
              <div className="text-[9px] text-ink4 capitalize truncate">{adminUser?.role?.replace('_',' ')}</div>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-2 px-1.5">
        {items.map(item => {
          const Icon = item.icon
          const active = activeTab === item.id
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : ''}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 mb-0.5 text-[11px] font-semibold transition-all relative text-left ${active ? 'bg-primary/6 text-primary border-l-2 border-primary' : 'text-ink3 hover:bg-surf2 hover:text-ink border-l-2 border-transparent'}`}>
              <Icon size={15} className="flex-shrink-0" />
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge > 0 && (
                <span className="bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 ml-auto">{item.badge}</span>
              )}
              {collapsed && item.badge > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              )}
            </button>
          )
        })}
      </nav>

      <div className="p-2 border-t border-black/8">
        <button onClick={() => { adminLogout(); nav('/') }}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-[11px] font-semibold text-red-400 hover:bg-red-50 transition-all ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Выйти' : ''}>
          <LogOut size={15} className="flex-shrink-0" />
          {!collapsed && 'Выйти'}
        </button>
      </div>
    </div>
  )
}

function Dashboard({ setTab }) {
  const { data, exportCSV } = useApp()
  const ti = data.finances.income.reduce((s,x)=>s+x.v,0)
  const te = data.finances.expenses.reduce((s,x)=>s+x.v,0)
  const chartData = data.finances.income.map((inc,i)=>({ month:inc.month, income:inc.v, expenses:data.finances.expenses[i]?.v||0 }))

  const cards = [
    { label:'Спортсменов',   val:data.stats.athletes, color:'#CC0000', bg:'rgba(204,0,0,.08)', Icon:Users },
    { label:'Тренеров',      val:data.stats.coaches,  color:'#F5C518', bg:'rgba(245,197,24,.12)',Icon:UserCheck },
    { label:'Новых заявок',  val:data.applications.filter(a=>a.status==='pending').length, color:'#3b82f6',bg:'rgba(59,130,246,.1)',Icon:FileText },
    { label:'Событий',       val:data.events.length,  color:'#22c55e', bg:'rgba(34,197,94,.1)', Icon:Calendar },
  ]

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bebas text-3xl text-ink tracking-wider">Дашборд</h1>
          <p className="text-ink4 text-[11px] font-inter mt-0.5">Обзор системы · {new Date().toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})}</p>
        </div>
        <button onClick={() => exportCSV(data.athletes,'athletes-report')}
          className="flex items-center gap-1.5 border border-black/12 hover:border-primary text-ink3 hover:text-primary px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all">
          <Download size={13} /> Скачать отчёт
        </button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-white border border-black/8 p-4 hover:border-primary/20 transition-all hover-lift">
            <div className="w-8 h-8 flex items-center justify-center mb-3" style={{background:c.bg}}>
              <c.Icon size={16} style={{color:c.color}} />
            </div>
            <div className="font-bebas text-3xl leading-none mb-1" style={{color:c.color}}>{c.val.toLocaleString()}</div>
            <div className="text-[11px] text-ink4">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-black/8 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[12px] font-bold text-ink">Финансовый обзор</div>
            <div className="flex gap-3 text-[10px] text-ink4">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary inline-block" />Доходы</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-surf3 inline-block border" />Расходы</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gi" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#CC0000" stopOpacity={.2}/><stop offset="95%" stopColor="#CC0000" stopOpacity={0}/></linearGradient>
                <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#888" stopOpacity={.15}/><stop offset="95%" stopColor="#888" stopOpacity={0}/></linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{fill:'#888',fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#888',fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1e6).toFixed(1)}M`}/>
              <Tooltip contentStyle={{background:'#fff',border:'1px solid #eee',fontSize:11,fontFamily:'Inter'}} formatter={v=>`${v.toLocaleString()} сом`}/>
              <Area type="monotone" dataKey="income" stroke="#CC0000" strokeWidth={2} fill="url(#gi)"/>
              <Area type="monotone" dataKey="expenses" stroke="#888" strokeWidth={1.5} fill="url(#ge)"/>
            </AreaChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-black/6">
            <div><div className="text-[10px] text-ink4">Доходы</div><div className="font-bebas text-xl text-primary">{(ti/1e6).toFixed(1)}M сом</div></div>
            <div><div className="text-[10px] text-ink4">Расходы</div><div className="font-bebas text-xl text-gold">{(te/1e6).toFixed(1)}M сом</div></div>
            <div><div className="text-[10px] text-ink4">Баланс</div><div className="font-bebas text-xl text-green-600">{((ti-te)/1e6).toFixed(1)}M сом</div></div>
          </div>
        </div>

        <div className="bg-white border border-black/8 p-5">
          <div className="text-[12px] font-bold text-ink mb-1">Последние заявки</div>
          <div className="text-[10px] text-ink4 mb-3">Требуют рассмотрения</div>
          <div className="space-y-2">
            {data.applications.slice(0,5).map(a => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-black/4 last:border-0">
                <div>
                  <div className="text-[11px] font-bold text-ink">{a.name}</div>
                  <div className="text-[9px] text-ink4">{a.sport}</div>
                </div>
                <span className={`badge badge-${a.status}`}>{a.status==='pending'?'Ожидает':a.status==='approved'?'Одобр.':'Откл.'}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setTab('applications')} className="w-full mt-3 text-[10px] text-primary font-bold uppercase tracking-wide hover:underline">
            Все заявки →
          </button>
        </div>
      </div>

      <div className="bg-white border border-black/8 p-5">
        <div className="text-[12px] font-bold text-ink mb-4">Расходы по категориям</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {data.finances.categories.map((c,i) => (
            <div key={c.name} className="text-center p-3 bg-surf2 border border-black/6">
              <div className="font-bebas text-2xl" style={{color:COLORS[i]}}>{c.pct}%</div>
              <div className="text-[10px] text-ink4 mt-1">{c.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Athletes() {
  const { data, addItem, updItem, delItem, exportCSV } = useApp()
  const [q, setQ] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const sf = v => setForm(p=>({...p,...v}))

  const filtered = data.athletes.filter(a => a.name.toLowerCase().includes(q.toLowerCase()) || a.sport.toLowerCase().includes(q.toLowerCase()))

  const openAdd = () => { setForm({ name:'',sport:'',region:'',dob:'',rank:'',coach:'',medals:0,status:'active',photo:'' }); setModal('add') }
  const openEdit = a => { setForm({...a}); setModal('edit') }
  const save = () => {
    if (!form.name?.trim()) return
    if (modal==='add') addItem('athletes', form)
    else updItem('athletes', form.id, form)
    setModal(null)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div><h2 className="font-bebas text-2xl text-ink tracking-wider">Спортсмены</h2><p className="text-ink4 text-[11px]">{data.athletes.length} записей</p></div>
        <div className="flex gap-2 flex-wrap">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Поиск..." className="!w-44 !text-[12px] !py-2" />
          <button onClick={() => exportCSV(data.athletes,'athletes')} className="flex items-center gap-1.5 border border-black/12 text-ink3 hover:border-primary hover:text-primary px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all"><Download size={13}/> CSV</button>
          <button onClick={openAdd} className="flex items-center gap-1.5 bg-primary hover:bg-pd text-white px-3 py-2 text-[11px] font-bold uppercase tracking-wide transition-all"><Plus size={13}/> Добавить</button>
        </div>
      </div>
      <div className="bg-white border border-black/8 overflow-hidden overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Фото</th><th>Имя</th><th>Спорт</th><th>Регион</th><th>Разряд</th><th>Тренер</th><th>Медали</th><th>Статус</th><th></th></tr></thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td><div className="w-8 h-8 bg-surf3 border border-black/8 overflow-hidden flex-shrink-0">{a.photo?<img src={a.photo} alt="" className="w-full h-full object-cover" onError={e=>e.target.style.display='none'}/>:<div className="w-full h-full flex items-center justify-center text-ink4 text-[10px] font-bold">{a.name?.[0]}</div>}</div></td>
                <td><span className="font-bold text-ink">{a.name}</span></td>
                <td>{a.sport}</td><td>{a.region}</td><td>{a.rank}</td><td>{a.coach}</td>
                <td><span className="font-bold text-primary">{a.medals}</span></td>
                <td><span className={`badge badge-${a.status}`}>{a.status==='active'?'Активен':'Резерв'}</span></td>
                <td><div className="flex gap-1">
                  <button onClick={()=>openEdit(a)} className="w-7 h-7 flex items-center justify-center border border-black/8 hover:border-primary hover:text-primary text-ink4 transition-all"><Edit2 size={11}/></button>
                  <button onClick={()=>delItem('athletes',a.id)} className="w-7 h-7 flex items-center justify-center border border-black/8 hover:border-red-400 hover:text-red-500 text-ink4 transition-all"><Trash2 size={11}/></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="bg-white w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-black/8"><h3 className="font-bebas text-xl text-ink tracking-wider">{modal==='add'?'Добавить спортсмена':'Редактировать'}</h3><button onClick={()=>setModal(null)} className="text-ink4 hover:text-ink"><X size={16}/></button></div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Имя *</label><input value={form.name||''} onChange={e=>sf({name:e.target.value})} placeholder="Полное имя"/></div>
              <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Вид спорта</label><input value={form.sport||''} onChange={e=>sf({sport:e.target.value})}/></div>
              <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Регион</label><input value={form.region||''} onChange={e=>sf({region:e.target.value})}/></div>
              <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Разряд</label><select value={form.rank||''} onChange={e=>sf({rank:e.target.value})}><option value="">—</option><option>2 разряд</option><option>1 разряд</option><option>КМС</option><option>МС</option><option>МСМК</option></select></div>
              <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Тренер</label><input value={form.coach||''} onChange={e=>sf({coach:e.target.value})}/></div>
              <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Дата рождения</label><input type="date" value={form.dob||''} onChange={e=>sf({dob:e.target.value})}/></div>
              <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Статус</label><select value={form.status||'active'} onChange={e=>sf({status:e.target.value})}><option value="active">Активен</option><option value="reserve">Резерв</option></select></div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-black/8">
              <button onClick={()=>setModal(null)} className="px-4 py-2 border border-black/12 text-ink3 text-[11px] font-semibold uppercase hover:border-ink transition-all">Отмена</button>
              <button onClick={save} className="px-4 py-2 bg-primary hover:bg-pd text-white text-[11px] font-bold uppercase tracking-wide transition-all">Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Applications() {
  const { data, updItem, delItem, exportCSV } = useApp()
  const [filter, setFilter] = useState('all')

  const filtered = filter==='all' ? data.applications : data.applications.filter(a=>a.status===filter)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div><h2 className="font-bebas text-2xl text-ink tracking-wider">Заявки</h2></div>
        <button onClick={() => exportCSV(data.applications,'applications')} className="flex items-center gap-1.5 border border-black/12 text-ink3 hover:border-primary hover:text-primary px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all"><Download size={13}/> Экспорт CSV</button>
      </div>
      <div className="flex gap-0 border-b border-black/8 mb-4">
        {['all','pending','approved','rejected'].map(s => (
          <button key={s} onClick={()=>setFilter(s)}
            className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide transition-all border-b-2 ${filter===s?'text-primary border-primary':'text-ink4 border-transparent hover:text-ink'}`}>
            {s==='all'?'Все':s==='pending'?'Ожидают':s==='approved'?'Одобрены':'Отклонены'}
            {s!=='all'&&<span className="ml-1.5 text-[9px]">({data.applications.filter(a=>a.status===s).length})</span>}
          </button>
        ))}
      </div>
      <div className="bg-white border border-black/8 overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Фото</th><th>Имя</th><th>Спорт</th><th>Соревнование</th><th>Регион</th><th>Дата</th><th>Телефон</th><th>Статус</th><th></th></tr></thead>
          <tbody>
            {filtered.map(a=>(
              <tr key={a.id}>
                <td>{a.photo?<img src={a.photo} alt="" className="w-8 h-8 object-cover border border-black/8"/>:<div className="w-8 h-8 bg-surf3 border border-black/8 flex items-center justify-center text-ink4 text-[10px] font-bold">{a.name?.[0]}</div>}</td>
                <td><span className="font-bold">{a.name}</span></td>
                <td>{a.sport}</td><td className="max-w-[160px] truncate">{a.event}</td><td>{a.region}</td><td>{a.date}</td><td>{a.phone}</td>
                <td><span className={`badge badge-${a.status}`}>{a.status==='pending'?'Ожидает':a.status==='approved'?'Одобрено':'Отклонено'}</span></td>
                <td><div className="flex gap-1">
                  {a.status==='pending'&&<><button onClick={()=>updItem('applications',a.id,{status:'approved'})} className="w-7 h-7 flex items-center justify-center border border-black/8 hover:border-green-500 hover:text-green-600 text-ink4 transition-all"><Check size={11}/></button><button onClick={()=>updItem('applications',a.id,{status:'rejected'})} className="w-7 h-7 flex items-center justify-center border border-black/8 hover:border-red-400 hover:text-red-500 text-ink4 transition-all"><XCircle size={11}/></button></>}
                  <button onClick={()=>delItem('applications',a.id)} className="w-7 h-7 flex items-center justify-center border border-black/8 hover:border-red-400 hover:text-red-500 text-ink4 transition-all"><Trash2 size={11}/></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Events() {
  const { data, addItem, updItem, delItem } = useApp()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const sf = v => setForm(p=>({...p,...v}))

  const save = () => {
    if (!form.title?.trim()) return
    if (modal==='add') addItem('events',form)
    else updItem('events',form.id,form)
    setModal(null)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-bebas text-2xl text-ink tracking-wider">Соревнования</h2>
        <button onClick={()=>{setForm({title:'',date:'',location:'',sport:'',slots:100,registered:0});setModal('add')}} className="flex items-center gap-1.5 bg-primary hover:bg-pd text-white px-3 py-2 text-[11px] font-bold uppercase tracking-wide transition-all"><Plus size={13}/> Добавить</button>
      </div>
      <div className="bg-white border border-black/8 overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Название</th><th>Дата</th><th>Место</th><th>Спорт</th><th>Мест</th><th>Зарег.</th><th></th></tr></thead>
          <tbody>
            {data.events.map(e=>(
              <tr key={e.id}>
                <td><span className="font-bold">{e.title}</span></td><td>{e.date}</td><td>{e.location}</td><td>{e.sport}</td>
                <td>{e.slots}</td><td><span className="font-bold text-primary">{e.registered}</span></td>
                <td><div className="flex gap-1">
                  <button onClick={()=>{setForm({...e});setModal('edit')}} className="w-7 h-7 flex items-center justify-center border border-black/8 hover:border-primary hover:text-primary text-ink4 transition-all"><Edit2 size={11}/></button>
                  <button onClick={()=>delItem('events',e.id)} className="w-7 h-7 flex items-center justify-center border border-black/8 hover:border-red-400 hover:text-red-500 text-ink4 transition-all"><Trash2 size={11}/></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal&&(
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="bg-white w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-black/8"><h3 className="font-bebas text-xl text-ink tracking-wider">{modal==='add'?'Добавить событие':'Редактировать'}</h3><button onClick={()=>setModal(null)} className="text-ink4 hover:text-ink"><X size={16}/></button></div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Название *</label><input value={form.title||''} onChange={e=>sf({title:e.target.value})}/></div>
              <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Дата</label><input type="date" value={form.date||''} onChange={e=>sf({date:e.target.value})}/></div>
              <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Место</label><input value={form.location||''} onChange={e=>sf({location:e.target.value})}/></div>
              <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Вид спорта</label><input value={form.sport||''} onChange={e=>sf({sport:e.target.value})}/></div>
              <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Мест</label><input type="number" value={form.slots||100} onChange={e=>sf({slots:+e.target.value})}/></div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-black/8">
              <button onClick={()=>setModal(null)} className="px-4 py-2 border border-black/12 text-ink3 text-[11px] font-semibold uppercase hover:border-ink transition-all">Отмена</button>
              <button onClick={save} className="px-4 py-2 bg-primary hover:bg-pd text-white text-[11px] font-bold uppercase tracking-wide transition-all">Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function News() {
  const { data, addItem, delItem } = useApp()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({title:'',category:'Новости',text:'',img:''})

  const CATS = ['Новости','Соревнования','Подготовка','Отбор']
  const save = () => {
    if (!form.title.trim()) return
    addItem('news',{...form, date: new Date().toISOString().split('T')[0]})
    setForm({title:'',category:'Новости',text:'',img:''})
    setModal(false)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-bebas text-2xl text-ink tracking-wider">Новости</h2>
        <button onClick={()=>setModal(true)} className="flex items-center gap-1.5 bg-primary hover:bg-pd text-white px-3 py-2 text-[11px] font-bold uppercase tracking-wide transition-all"><Plus size={13}/> Добавить</button>
      </div>
      <div className="bg-white border border-black/8 overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Заголовок</th><th>Категория</th><th>Дата</th><th></th></tr></thead>
          <tbody>
            {data.news.map(n=>(
              <tr key={n.id}>
                <td><span className="font-bold">{n.title}</span></td>
                <td><span className="badge badge-progress">{n.category}</span></td>
                <td>{n.date}</td>
                <td><button onClick={()=>delItem('news',n.id)} className="w-7 h-7 flex items-center justify-center border border-black/8 hover:border-red-400 hover:text-red-500 text-ink4 transition-all"><Trash2 size={11}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal&&(
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="bg-white w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-black/8"><h3 className="font-bebas text-xl text-ink tracking-wider">Добавить новость</h3><button onClick={()=>setModal(false)} className="text-ink4 hover:text-ink"><X size={16}/></button></div>
            <div className="p-4 space-y-3">
              <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Заголовок *</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/></div>
              <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Категория</label><select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
              <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">URL фото</label><input value={form.img} onChange={e=>setForm(p=>({...p,img:e.target.value})) } placeholder="https://..."/></div>
              <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Текст</label><textarea value={form.text} onChange={e=>setForm(p=>({...p,text:e.target.value}))} rows={4}/></div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-black/8">
              <button onClick={()=>setModal(false)} className="px-4 py-2 border border-black/12 text-ink3 text-[11px] font-semibold uppercase hover:border-ink transition-all">Отмена</button>
              <button onClick={save} className="px-4 py-2 bg-primary hover:bg-pd text-white text-[11px] font-bold uppercase tracking-wide transition-all">Опубликовать</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Finances() {
  const { data, exportCSV } = useApp()
  const ti = data.finances.income.reduce((s,x)=>s+x.v,0)
  const te = data.finances.expenses.reduce((s,x)=>s+x.v,0)

  const tableData = data.finances.income.map((inc,i)=>({
    month:inc.month, income:inc.v, expenses:data.finances.expenses[i]?.v||0, balance:inc.v-(data.finances.expenses[i]?.v||0)
  }))

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-bebas text-2xl text-ink tracking-wider">Финансы</h2>
        <button onClick={() => exportCSV(tableData,'finances')} className="flex items-center gap-1.5 border border-black/12 text-ink3 hover:border-primary hover:text-primary px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all"><Download size={13}/> Экспорт</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[['Доходы',(ti/1e6).toFixed(1)+'M сом','text-green-600'],['Расходы',(te/1e6).toFixed(1)+'M сом','text-primary'],['Баланс',((ti-te)/1e6).toFixed(1)+'M сом','text-ink']].map(([l,v,c])=>(
          <div key={l} className="bg-white border border-black/8 p-4"><div className="text-[10px] text-ink4 uppercase font-bold tracking-wide mb-1">{l}</div><div className={`font-bebas text-2xl ${c}`}>{v}</div></div>
        ))}
      </div>
      <div className="bg-white border border-black/8 overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Месяц</th><th>Доходы</th><th>Расходы</th><th>Баланс</th></tr></thead>
          <tbody>
            {tableData.map(row=>(
              <tr key={row.month}>
                <td className="font-bold">{row.month}</td>
                <td className="text-green-600 font-bold">{row.income.toLocaleString()} сом</td>
                <td className="text-primary font-bold">{row.expenses.toLocaleString()} сом</td>
                <td className={`font-bold ${row.balance>=0?'text-green-600':'text-red-500'}`}>{row.balance.toLocaleString()} сом</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminSettings() {
  const { data, upd } = useApp()
  const [saved, setSaved] = useState(false)
  const [stats, setStats] = useState({...data.stats})

  const save = () => {
    upd('stats', stats)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-6 space-y-5">
      <h2 className="font-bebas text-2xl text-ink tracking-wider">Настройки</h2>
      <div className="bg-white border border-black/8 p-5">
        <div className="text-[12px] font-bold text-ink mb-4 pb-3 border-b border-black/6">Статистика на главной странице</div>
        <div className="grid grid-cols-2 gap-4">
          {[['athletes','Спортсменов'],['coaches','Тренеров'],['sports','Видов спорта'],['medals','Медалей 2024']].map(([k,l])=>(
            <div key={k}>
              <label className="text-[10px] font-bold text-ink2 uppercase mb-1.5 block">{l}</label>
              <input type="number" value={stats[k]} onChange={e=>setStats(p=>({...p,[k]:+e.target.value}))} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button onClick={save} className="bg-primary hover:bg-pd text-white px-5 py-2 text-[11px] font-bold uppercase tracking-wide transition-all">Сохранить</button>
          {saved && <span className="text-green-600 text-[11px] font-bold">✓ Сохранено</span>}
        </div>
      </div>
      <div className="bg-white border border-black/8 p-5">
        <div className="text-[12px] font-bold text-ink mb-4 pb-3 border-b border-black/6">Контактная информация</div>
        <div className="grid grid-cols-2 gap-4">
          {[['Адрес','Бишкек, просп. Чуй, 106'],['Телефон','+996 (312) 66-16-17'],['Email','info@sports.gov.kg'],['Рабочие часы','09:00 – 18:00']].map(([l,v])=>(
            <div key={l}><label className="text-[10px] font-bold text-ink2 uppercase mb-1.5 block">{l}</label><input defaultValue={v}/></div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Coaches() {
  const { data, addItem, delItem } = useApp()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({name:'',sport:'',region:'',exp:5,rank:'МС КР',athletes:0})

  const save = () => {
    if (!form.name.trim()) return
    addItem('coaches', form)
    setForm({name:'',sport:'',region:'',exp:5,rank:'МС КР',athletes:0})
    setModal(false)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-bebas text-2xl text-ink tracking-wider">Тренеры</h2>
        <button onClick={()=>setModal(true)} className="flex items-center gap-1.5 bg-primary hover:bg-pd text-white px-3 py-2 text-[11px] font-bold uppercase tracking-wide transition-all"><Plus size={13}/> Добавить</button>
      </div>
      <div className="bg-white border border-black/8 overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Имя</th><th>Спорт</th><th>Регион</th><th>Стаж</th><th>Звание</th><th>Спортсменов</th><th></th></tr></thead>
          <tbody>
            {data.coaches.map(c=>(
              <tr key={c.id}>
                <td><span className="font-bold">{c.name}</span></td>
                <td>{c.sport}</td><td>{c.region}</td><td>{c.exp} лет</td><td>{c.rank}</td><td>{c.athletes}</td>
                <td><button onClick={()=>delItem('coaches',c.id)} className="w-7 h-7 flex items-center justify-center border border-black/8 hover:border-red-400 hover:text-red-500 text-ink4 transition-all"><Trash2 size={11}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal&&(
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="bg-white w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-black/8"><h3 className="font-bebas text-xl text-ink tracking-wider">Добавить тренера</h3><button onClick={()=>setModal(false)} className="text-ink4 hover:text-ink"><X size={16}/></button></div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Имя *</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
              <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Спорт</label><input value={form.sport} onChange={e=>setForm(p=>({...p,sport:e.target.value}))}/></div>
              <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Регион</label><input value={form.region} onChange={e=>setForm(p=>({...p,region:e.target.value}))}/></div>
              <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Стаж (лет)</label><input type="number" value={form.exp} onChange={e=>setForm(p=>({...p,exp:+e.target.value}))}/></div>
              <div><label className="text-[10px] font-bold text-ink2 uppercase mb-1 block">Звание</label><input value={form.rank} onChange={e=>setForm(p=>({...p,rank:e.target.value}))}/></div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-black/8">
              <button onClick={()=>setModal(false)} className="px-4 py-2 border border-black/12 text-ink3 text-[11px] font-semibold uppercase hover:border-ink transition-all">Отмена</button>
              <button onClick={save} className="px-4 py-2 bg-primary hover:bg-pd text-white text-[11px] font-bold uppercase tracking-wide transition-all">Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminPanel() {
  const { adminUser } = useApp()
  const nav = useNavigate()
  const [tab, setTab] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)

  if (!adminUser) { nav('/login'); return null }

  const content = {
    dashboard:    <Dashboard setTab={setTab} />,
    athletes:     <Athletes />,
    coaches:      <Coaches />,
    events:       <Events />,
    applications: <Applications />,
    news:         <News />,
    finances:     <Finances />,
    reports:      <Finances />,
    settings:     <AdminSettings />,
    regions:      <div className="p-6"><h2 className="font-bebas text-2xl text-ink tracking-wider mb-4">Регионы</h2><p className="text-ink4 text-sm">Управление региональными данными</p></div>,
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surf2">
      <Sidebar activeTab={tab} setActiveTab={setTab} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-12 bg-white border-b border-black/8 flex items-center justify-between px-5 flex-shrink-0">
          <div className="text-ink4 text-[11px] font-inter hidden md:block">
            {new Date().toLocaleDateString('ru-RU',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-ink4 hover:text-ink p-1.5 transition-colors">
              <Bell size={15}/>
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-primary rounded-full"/>
            </button>
            <Link to="/" className="text-ink4 hover:text-primary text-[11px] font-semibold uppercase tracking-wide transition-colors">← На сайт</Link>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <motion.div key={tab} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.25}}>
            {content[tab] || <div className="p-6"><h2 className="font-bebas text-2xl">Раздел в разработке</h2></div>}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
