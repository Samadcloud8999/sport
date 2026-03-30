import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Calendar, MapPin, Users, Clock, Trophy, Star, ArrowRight, ChevronLeft, Mail, Phone, User, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { SectionLabel, SectionTitle, PageWrapper } from '../components/ui/index'

const fade = { initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, transition:{duration:.45} }

// ── ABOUT ──────────────────────────────────────────────────
export function AboutPage() {
  const { data, tr, lang } = useApp()
  return (
    <PageWrapper>
      <div className="pt-24 pb-16">
        {/* Hero banner */}
        <div className="relative h-64 sm:h-80 overflow-hidden mb-12">
          <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1400&q=80"
            alt="ЦПМС" className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"/>
          <div className="absolute inset-0 flex items-center px-8 md:px-16">
            <motion.div {...fade}>
              <SectionLabel light>О нас</SectionLabel>
              <div className="font-bebas text-4xl sm:text-5xl text-white tracking-wider leading-tight mt-2">
                О <span className="text-primary">ЦЕНТРЕ</span>
              </div>
              <p className="text-white/60 text-[13px] mt-3 max-w-md font-inter">Государственное учреждение по подготовке молодёжных сборных</p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          {/* Mission */}
          <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
            <motion.div {...fade} transition={{delay:.1}}>
              <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3">Миссия</div>
              <h2 className="font-bebas text-3xl text-ink tracking-wide mb-5">РАЗВИТИЕ СПОРТА <span className="text-primary">КЫРГЫЗСТАНА</span></h2>
              <p className="text-ink3 text-[13px] leading-relaxed mb-4 font-inter">Центр подготовки молодёжных сборных команд является государственным учреждением, осуществляющим координацию и организацию подготовки спортсменов Кыргызской Республики к международным соревнованиям.</p>
              <p className="text-ink3 text-[13px] leading-relaxed mb-6 font-inter">Центр работает под руководством Государственного агентства по делам физической культуры и спорта при Кабинете Министров КР и охватывает все 9 регионов республики.</p>
              <div className="grid grid-cols-2 gap-3">
                {[['2847','Спортсменов','#CC0000'],['312','Тренеров','#F5C518'],['28','Видов спорта','#111'],['156','Медалей 2024','#111']].map(([v,l,c])=>(
                  <div key={l} className="bg-surf2 border border-black/8 p-4 hover:border-primary/30 transition-all">
                    <div className="font-bebas text-3xl leading-none" style={{color:c}}>{v}</div>
                    <div className="text-[11px] text-ink4 mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fade} transition={{delay:.15}}>
              <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=700&q=80"
                alt="Тренировки" className="w-full h-80 object-cover border border-black/8"/>
            </motion.div>
          </div>

          {/* Values */}
          <motion.div {...fade} transition={{delay:.2}} className="mb-16">
            <div className="text-center mb-10">
              <SectionLabel>Ценности</SectionLabel>
              <SectionTitle>НАШИ <span className="text-primary">ПРИНЦИПЫ</span></SectionTitle>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon:'🏆', title:'Победный дух', desc:'Мы воспитываем чемпионов не только на спортивной площадке, но и в жизни. Целеустремлённость и воля к победе — наши главные ценности.' },
                { icon:'🤝', title:'Командная работа', desc:'Успех достигается совместными усилиями спортсменов, тренеров и специалистов. Мы единая команда, нацеленная на результат.' },
                { icon:'⭐', title:'Профессионализм', desc:'Высочайший уровень подготовки, современные методики и научный подход обеспечивают максимальный результат каждому спортсмену.' },
              ].map(v=>(
                <div key={v.title} className="bg-surf2 border border-black/8 p-6 hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="text-4xl mb-4">{v.icon}</div>
                  <div className="font-bold text-[14px] text-ink mb-2">{v.title}</div>
                  <p className="text-ink3 text-[12px] leading-relaxed font-inter">{v.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Infrastructure */}
          <motion.div {...fade} transition={{delay:.25}} className="mb-16">
            <div className="text-center mb-10">
              <SectionLabel>Инфраструктура</SectionLabel>
              <SectionTitle>НАШИ <span className="text-primary">ОБЪЕКТЫ</span></SectionTitle>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { img:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=70', title:'Спортивные залы', desc:'12 специализированных залов' },
                { img:'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=70', title:'Бассейн', desc:'Олимпийский 50-метровый' },
                { img:'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&q=70', title:'Тренажёрный зал', desc:'Современное оборудование' },
                { img:'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=70', title:'Медцентр', desc:'Полное медобеспечение' },
              ].map(obj=>(
                <div key={obj.title} className="group overflow-hidden border border-black/8 hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="h-48 overflow-hidden">
                    <img src={obj.img} alt={obj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e=>e.target.style.background='#f0f0f0'}/>
                  </div>
                  <div className="p-4">
                    <div className="font-bold text-[13px] text-ink mb-1">{obj.title}</div>
                    <div className="text-[11px] text-ink4 font-inter">{obj.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Leadership */}
          <motion.div {...fade} transition={{delay:.3}}>
            <div className="text-center mb-10">
              <SectionLabel>Команда</SectionLabel>
              <SectionTitle>РУКОВОДСТВО</SectionTitle>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name:'Эрлан Бекбоев', role:'Директор центра', img:'https://i.pravatar.cc/200?img=33', bio:'Заслуженный тренер КР, мастер спорта по борьбе' },
                { name:'Айнур Джумаева', role:'Заместитель директора', img:'https://i.pravatar.cc/200?img=49', bio:'Кандидат педагогических наук, 20 лет в спорте' },
                { name:'Болот Осмонбеков', role:'Научный руководитель', img:'https://i.pravatar.cc/200?img=56', bio:'Доктор наук в области спортивной медицины' },
              ].map(l=>(
                <div key={l.name} className="bg-surf2 border border-black/8 p-5 text-center hover:border-primary/30 transition-all">
                  <img src={l.img} alt={l.name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-primary/20" onError={e=>e.target.style.background='#eee'}/>
                  <div className="font-bold text-[14px] text-ink">{l.name}</div>
                  <div className="text-[11px] text-primary font-semibold mt-1">{l.role}</div>
                  <p className="text-[11px] text-ink4 mt-2 font-inter">{l.bio}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}

// ── EVENTS ────────────────────────────────────────────────
export function EventsPage() {
  const { data, tr } = useApp()
  const nav = useNavigate()
  const months = ['','Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек']
  return (
    <PageWrapper>
      <div className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fade}>
            <SectionLabel>Календарь</SectionLabel>
            <SectionTitle>СОРЕВНОВАНИЯ</SectionTitle>
            <p className="text-ink4 text-[12px] mb-8">Все предстоящие соревнования и турниры</p>
          </motion.div>
          <div className="space-y-3">
            {data.events.map((ev,i)=>{
              const [,m,d]=ev.date.split('-')
              const pct=Math.round(ev.registered/ev.slots*100)
              return (
                <motion.div key={ev.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*.06}}
                  className="bg-white border border-black/8 p-5 hover:border-primary/35 hover:shadow-md transition-all flex flex-wrap items-center gap-5 relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top"/>
                  <div className="bg-surf2 border border-black/8 p-3 text-center min-w-[64px] flex-shrink-0">
                    <div className="font-bebas text-3xl text-primary leading-none">{d}</div>
                    <div className="text-[9px] font-bold text-ink4 uppercase tracking-wide">{months[+m]}</div>
                  </div>
                  <div className="flex-1 min-w-[160px]">
                    <div className="text-[14px] font-bold text-ink group-hover:text-primary transition-colors">{ev.title}</div>
                    <div className="flex flex-wrap gap-3 mt-1.5 text-[11px] text-ink4">
                      <span className="flex items-center gap-1"><MapPin size={11} className="text-primary"/>{ev.location}</span>
                      <span className="flex items-center gap-1"><Users size={11}/>{ev.registered}/{ev.slots}</span>
                    </div>
                  </div>
                  <div className="min-w-[120px]">
                    <div className="flex justify-between text-[10px] text-ink4 mb-1"><span>Мест занято</span><span className="text-primary font-bold">{pct}%</span></div>
                    <div className="h-1 bg-surf3 overflow-hidden"><div className="h-full bg-primary transition-all" style={{width:`${pct}%`}}/></div>
                  </div>
                  <span className="bg-primary/8 border border-primary/15 text-primary text-[9px] font-bold px-2.5 py-1 uppercase">{ev.sport}</span>
                  <button onClick={()=>nav('/apply')} className="bg-primary hover:bg-red-700 text-white px-5 py-2 text-[11px] font-bold uppercase tracking-wide transition-all flex-shrink-0">Участие</button>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

// ── NEWS ──────────────────────────────────────────────────
export function NewsPage() {
  const { data } = useApp()
  const [selected, setSelected] = useState(null)
  return (
    <PageWrapper>
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div {...fade}>
            <SectionLabel>Пресс-центр</SectionLabel>
            <SectionTitle>НОВОСТИ</SectionTitle>
            <p className="text-ink4 text-[12px] mb-8">Последние события и достижения</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.news.map((n,i)=>(
              <motion.div key={n.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*.07}}
                onClick={()=>setSelected(n)}
                className="bg-white border border-black/8 overflow-hidden hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group hover-lift">
                <div className="h-48 relative overflow-hidden bg-surf3">
                  {n.img&&<img src={n.img} alt={n.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={e=>e.target.style.display='none'}/>}
                  <div className="absolute top-3 left-3 bg-primary text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-wide">{n.category}</div>
                </div>
                <div className="p-4">
                  <div className="text-[13px] font-bold text-ink group-hover:text-primary transition-colors leading-snug mb-2">{n.title}</div>
                  <div className="text-[11px] text-ink4 leading-relaxed line-clamp-2 font-inter mb-3">{n.text}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-ink4 text-[10px] font-inter"><Clock size={10}/>{n.date}</div>
                    <span className="text-primary text-[10px] font-bold flex items-center gap-1">Читать <ArrowRight size={10}/></span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* News modal */}
      <AnimatePresence>
        {selected&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
            <motion.div initial={{opacity:0,y:24,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:24}}
              className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="relative h-56 sm:h-72 overflow-hidden bg-surf3">
                {selected.img&&<img src={selected.img} alt={selected.title} className="w-full h-full object-cover" onError={e=>e.target.style.display='none'}/>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                <button onClick={()=>setSelected(null)} className="absolute top-4 right-4 w-8 h-8 bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all"><X size={16}/></button>
                <div className="absolute bottom-4 left-5">
                  <span className="bg-primary text-white text-[9px] font-bold px-2.5 py-1 uppercase">{selected.category}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-ink4 text-[11px] font-inter mb-3"><Clock size={12}/>{selected.date}</div>
                <h2 className="font-bebas text-3xl text-ink tracking-wide mb-4">{selected.title}</h2>
                <p className="text-ink3 text-[13px] leading-relaxed font-inter">{selected.text}</p>
                <button onClick={()=>setSelected(null)} className="mt-6 border border-black/12 text-ink3 text-[12px] font-semibold px-5 py-2.5 hover:border-primary hover:text-primary transition-all">Закрыть</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}

// ── ATHLETE DETAIL PAGE ───────────────────────────────────
export function AthleteDetailPage() {
  const { id } = useParams()
  const { data } = useApp()
  const nav = useNavigate()
  const athlete = data.athletes.find(a=>String(a.id)===String(id))
  if (!athlete) return <PageWrapper><div className="pt-32 text-center text-ink4">Спортсмен не найден</div></PageWrapper>
  const year = athlete.dob ? new Date().getFullYear() - parseInt(athlete.dob) : null
  return (
    <PageWrapper>
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <button onClick={()=>nav(-1)} className="flex items-center gap-2 text-ink4 hover:text-primary text-[12px] font-semibold mb-6 transition-colors">
            <ChevronLeft size={16}/> Назад к спортсменам
          </button>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Photo */}
            <motion.div {...fade}>
              <div className="relative overflow-hidden border border-black/8">
                <img src={athlete.photo} alt={athlete.name} className="w-full h-96 object-cover"
                  onError={e=>{e.target.style.background='#f0f0f0'}}/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="font-bebas text-3xl text-white tracking-wide">{athlete.name}</div>
                  <div className="text-white/70 text-[12px] font-inter mt-1">{athlete.sport}</div>
                </div>
                <div className={`absolute top-4 right-4 px-3 py-1 text-[10px] font-bold uppercase border ${athlete.status==='active'?'bg-green-500/90 text-white border-transparent':'bg-white/20 text-white border-white/30'}`}>
                  {athlete.status==='active'?'Активен':'Резерв'}
                </div>
              </div>
            </motion.div>
            {/* Info */}
            <motion.div {...fade} transition={{delay:.1}} className="space-y-4">
              <div>
                <div className="font-bebas text-3xl text-ink tracking-wide">{athlete.name}</div>
                <div className="text-primary font-semibold text-[13px] mt-1">{athlete.sport}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Дата рождения',athlete.dob||'—'],
                  ['Возраст', year?`${year} лет`:'—'],
                  ['Разряд',athlete.rank],
                  ['Регион',athlete.region],
                  ['Первый тренер',athlete.firstCoach||'—'],
                  ['Тренер на соревн.',athlete.coach],
                ].map(([l,v])=>(
                  <div key={l} className="bg-surf2 border border-black/8 p-3">
                    <div className="text-[9px] text-ink4 uppercase tracking-wide font-bold mb-0.5">{l}</div>
                    <div className="text-[12px] font-semibold text-ink">{v}</div>
                  </div>
                ))}
              </div>
              <div className="bg-surf2 border border-black/8 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy size={14} className="text-primary"/>
                  <span className="font-bold text-[12px] text-ink">Медали: <span className="text-primary font-bebas text-xl">{athlete.medals}</span></span>
                </div>
              </div>
              {athlete.bio&&(
                <div className="bg-surf2 border border-black/8 p-4">
                  <div className="text-[10px] font-bold text-ink4 uppercase tracking-wide mb-2">Биография</div>
                  <p className="text-[12px] text-ink3 leading-relaxed font-inter">{athlete.bio}</p>
                </div>
              )}
              {athlete.competitions?.length>0&&(
                <div className="bg-surf2 border border-black/8 p-4">
                  <div className="text-[10px] font-bold text-ink4 uppercase tracking-wide mb-3">Достижения на соревнованиях</div>
                  <div className="space-y-2">
                    {athlete.competitions.map((c,i)=>(
                      <div key={i} className="flex items-center gap-2.5 text-[12px] text-ink3 font-inter">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"/>
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

// ── ATHLETES ──────────────────────────────────────────────
export function AthletesPage() {
  const { data } = useApp()
  const nav = useNavigate()
  const [search, setSearch] = useState('')
  const [sportFilter, setSportFilter] = useState('all')
  const sports = [...new Set(data.athletes.map(a=>a.sport))]
  const filtered = data.athletes.filter(a=>
    (sportFilter==='all'||a.sport===sportFilter)&&
    (a.name.toLowerCase().includes(search.toLowerCase())||a.sport.toLowerCase().includes(search.toLowerCase()))
  )
  return (
    <PageWrapper>
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div {...fade}>
            <SectionLabel>Реестр</SectionLabel>
            <SectionTitle>СПОРТСМЕНЫ</SectionTitle>
            <p className="text-ink4 text-[12px] mb-6">Реестр спортсменов центра подготовки</p>
          </motion.div>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Поиск..." className="!w-auto flex-1 min-w-48 !py-2 !text-[12px]"/>
            <select value={sportFilter} onChange={e=>setSportFilter(e.target.value)} className="!py-2 !text-[12px] !w-auto">
              <option value="all">Все виды спорта</option>
              {sports.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {/* Cards — large photo style */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((a,i)=>(
              <motion.div key={a.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*.07}}
                className="bg-white border border-black/8 overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all group cursor-pointer"
                onClick={()=>nav(`/athletes/${a.id}`)}>
                {/* Large photo */}
                <div className="h-64 relative overflow-hidden bg-surf3">
                  {a.photo?(
                    <img src={a.photo} alt={a.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={e=>{e.target.style.display='none'}}/>
                  ):(
                    <div className="w-full h-full flex items-center justify-center font-bebas text-6xl text-primary/30">{a.name[0]}</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"/>
                  {/* Overlay info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="font-bebas text-xl text-white tracking-wide">{a.name}</div>
                    <div className="text-white/70 text-[11px] font-inter">{a.sport} · {a.region}</div>
                  </div>
                  {/* Status badge */}
                  <div className={`absolute top-3 left-3 px-2 py-0.5 text-[9px] font-bold uppercase ${a.status==='active'?'bg-green-500 text-white':'bg-white/20 text-white border border-white/30'}`}>
                    {a.status==='active'?'Активен':'Резерв'}
                  </div>
                  {/* Medals */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 px-2 py-0.5">
                    <Trophy size={10} className="text-yellow-400"/>
                    <span className="text-white text-[10px] font-bold">{a.medals}</span>
                  </div>
                </div>
                {/* Card info */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                    <div className="bg-surf2 border border-black/6 p-2">
                      <div className="text-ink4 text-[9px] uppercase tracking-wide">Разряд</div>
                      <div className="font-semibold text-ink">{a.rank}</div>
                    </div>
                    <div className="bg-surf2 border border-black/6 p-2">
                      <div className="text-ink4 text-[9px] uppercase tracking-wide">Тренер</div>
                      <div className="font-semibold text-ink truncate">{a.coach}</div>
                    </div>
                  </div>
                  <button className="w-full bg-surf2 hover:bg-primary hover:text-white text-ink3 py-2 text-[11px] font-bold uppercase tracking-wide transition-all border border-black/6 hover:border-primary flex items-center justify-center gap-2">
                    Подробнее <ArrowRight size={12}/>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          {filtered.length===0&&<div className="text-center py-16 text-ink4">Ничего не найдено</div>}
        </div>
      </div>
    </PageWrapper>
  )
}

// ── SPORTS ────────────────────────────────────────────────
export function SportsPage() {
  const { data, lang } = useApp()
  const sports = data.sports || []
  const [selected, setSelected] = useState(null)
  const getName = (s) => lang==='ky'?s.nameKy:lang==='en'?s.nameEn:s.name

  return (
    <PageWrapper>
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div {...fade}>
            <SectionLabel>Дисциплины</SectionLabel>
            <SectionTitle>ВИДЫ <span className="text-primary">СПОРТА</span></SectionTitle>
            <p className="text-ink4 text-[12px] mb-8">Олимпийские виды спорта в программе центра</p>
          </motion.div>
          {/* 3 per row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sports.map((s,i)=>(
              <motion.div key={s.id} initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{delay:i*.05}}
                onClick={()=>setSelected(s)}
                className="bg-white border border-black/8 overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all group cursor-pointer hover-lift">
                {/* Big photo */}
                <div className="h-52 relative overflow-hidden bg-surf3">
                  {s.img&&(
                    <img src={s.img} alt={getName(s)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e=>e.target.style.display='none'}/>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                  <div className="absolute bottom-3 left-4 text-3xl">{s.icon}</div>
                  <div className="absolute bottom-3 right-4">
                    <span className="font-bebas text-2xl text-primary">{s.athletes}</span>
                    <span className="text-white/60 text-[10px] ml-1">спортсм.</span>
                  </div>
                </div>
                {/* Info */}
                <div className="p-4">
                  <div className="font-bold text-[15px] text-ink group-hover:text-primary transition-colors mb-2">{getName(s)}</div>
                  <p className="text-[12px] text-ink4 leading-relaxed font-inter line-clamp-2">{s.desc}</p>
                  <button className="mt-3 text-primary text-[11px] font-bold flex items-center gap-1 hover:gap-2 transition-all">
                    Подробнее <ArrowRight size={11}/>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Sport detail modal */}
      <AnimatePresence>
        {selected&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
            <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:24}}
              className="bg-white max-w-lg w-full shadow-2xl overflow-hidden">
              <div className="h-52 relative overflow-hidden bg-surf3">
                {selected.img&&<img src={selected.img} alt={getName(selected)} className="w-full h-full object-cover" onError={e=>e.target.style.display='none'}/>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
                <button onClick={()=>setSelected(null)} className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 text-white flex items-center justify-center"><X size={16}/></button>
                <div className="absolute bottom-4 left-5 flex items-center gap-3">
                  <span className="text-4xl">{selected.icon}</span>
                  <div>
                    <div className="font-bebas text-2xl text-white tracking-wide">{getName(selected)}</div>
                    <div className="text-white/60 text-[11px]">{selected.athletes} спортсменов</div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-ink3 text-[13px] leading-relaxed font-inter">{selected.desc}</p>
                <button onClick={()=>setSelected(null)} className="mt-5 border border-black/12 text-ink3 text-[12px] font-semibold px-5 py-2.5 hover:border-primary hover:text-primary transition-all">Закрыть</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}

// ── REGIONS ───────────────────────────────────────────────
export function RegionsPage() {
  const { data } = useApp()
  const [selected, setSelected] = useState(null)
  return (
    <PageWrapper>
      <div className="pt-24 pb-16 bg-[#0a0a0a] min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div {...fade}>
            <SectionLabel light>Охват</SectionLabel>
            <SectionTitle light>РЕГИОНЫ <span className="text-primary">КР</span></SectionTitle>
            <p className="text-white/30 text-[12px] mb-8">Статистика по всем регионам Кыргызстана</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.regions.map((r,i)=>(
              <motion.div key={r.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*.07}}
                onClick={()=>setSelected(r)}
                className="bg-[#111] border border-white/8 overflow-hidden hover:border-primary/40 transition-all group cursor-pointer">
                {r.img&&(
                  <div className="h-40 overflow-hidden">
                    <img src={r.img} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-90"
                      onError={e=>e.target.style.display='none'}/>
                  </div>
                )}
                <div className="p-5">
                  <div className="font-bebas text-2xl text-white tracking-wide mb-1 group-hover:text-primary transition-colors">{r.name}</div>
                  <div className="text-white/30 text-[11px] font-inter mb-4">{r.desc}</div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[['Школ',r.schools,'text-primary'],['Спортсм.',r.athletes,'text-yellow-400'],['Тренеров',r.coaches,'text-white']].map(([l,v,c])=>(
                      <div key={l} className="bg-[#1a1a1a] border border-white/6 p-2.5 text-center">
                        <div className={`font-bebas text-xl ${c}`}>{v}</div>
                        <div className="text-[9px] text-white/30">{l}</div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] mb-1"><span className="text-white/30">Доля спортсменов</span><span className="text-primary font-bold">{Math.round(r.athletes/data.stats.athletes*100)}%</span></div>
                    <div className="h-1 bg-white/5 overflow-hidden"><div className="h-full bg-primary transition-all" style={{width:`${Math.round(r.athletes/data.stats.athletes*100)}%`}}/></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {selected&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
            <motion.div initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} exit={{opacity:0}} className="bg-[#111] border border-white/15 max-w-md w-full shadow-2xl overflow-hidden">
              {selected.img&&<img src={selected.img} alt={selected.name} className="w-full h-48 object-cover opacity-80" onError={e=>e.target.style.display='none'}/>}
              <div className="p-6">
                <div className="font-bebas text-3xl text-white tracking-wide mb-2">{selected.name}</div>
                <p className="text-white/50 text-[12px] font-inter mb-4">{selected.desc}</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[['Школ',selected.schools,'#CC0000'],['Спортсменов',selected.athletes,'#F5C518'],['Тренеров',selected.coaches,'#fff']].map(([l,v,c])=>(
                    <div key={l} className="bg-white/5 p-3 text-center">
                      <div className="font-bebas text-2xl" style={{color:c}}>{v}</div>
                      <div className="text-[10px] text-white/30">{l}</div>
                    </div>
                  ))}
                </div>
                <button onClick={()=>setSelected(null)} className="border border-white/15 text-white/50 text-[12px] px-5 py-2.5 hover:border-primary hover:text-primary transition-all">Закрыть</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}

// ── CONTACTS ──────────────────────────────────────────────
export function ContactsPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({name:'',email:'',subject:'',message:''})
  const handleSubmit = () => { if(form.name&&form.email&&form.message){setSent(true)} }

  return (
    <PageWrapper>
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div {...fade}>
            <SectionLabel>Связь</SectionLabel>
            <SectionTitle>КОНТАКТЫ</SectionTitle>
            <p className="text-ink4 text-[12px] mb-8">Мы всегда рады ответить на ваши вопросы</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact info */}
            <motion.div {...fade} transition={{delay:.1}} className="space-y-4">
              {[
                { icon:'📍', title:'Адрес', val:'г. Бишкек, проспект Чуй, 106\nКыргызская Республика, 720001' },
                { icon:'📞', title:'Телефон', val:'+996 (312) 66-16-17\n+996 (312) 66-16-18' },
                { icon:'✉️', title:'Email', val:'info@sports.gov.kg\npress@sports.gov.kg' },
                { icon:'🕐', title:'Режим работы', val:'Пн–Пт: 09:00–18:00\nСб: 09:00–13:00\nВс: выходной' },
              ].map(c=>(
                <div key={c.title} className="bg-surf2 border border-black/8 p-4 flex gap-3 hover:border-primary/30 transition-all">
                  <span className="text-2xl flex-shrink-0">{c.icon}</span>
                  <div>
                    <div className="text-[10px] font-bold text-ink4 uppercase tracking-wide mb-1">{c.title}</div>
                    <p className="text-[13px] text-ink3 font-inter leading-relaxed whitespace-pre-line">{c.val}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Map + form */}
            <motion.div {...fade} transition={{delay:.15}} className="lg:col-span-2 space-y-5">
              {/* Real OpenStreetMap embed for CAGS Bishkek */}
              <div className="border border-black/8 overflow-hidden" style={{height:280}}>
                <iframe
                  title="ЦПМС КР на карте"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=74.57,42.86,74.61,42.88&layer=mapnik&marker=42.87,74.59"
                  style={{width:'100%',height:'100%',border:'none'}}
                  loading="lazy"
                />
              </div>
              <div className="text-[10px] text-ink4 text-center font-inter">
                г. Бишкек, просп. Чуй, 106 ·{' '}
                <a href="https://www.openstreetmap.org/?mlat=42.87&mlon=74.59" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Открыть в картах</a>
              </div>

              {/* Contact form */}
              {sent?(
                <div className="bg-green-50 border border-green-200 p-6 text-center">
                  <div className="text-3xl mb-3">✅</div>
                  <div className="font-bold text-green-700 mb-1">Сообщение отправлено!</div>
                  <div className="text-[12px] text-green-600 font-inter">Мы свяжемся с вами в течение 1–2 рабочих дней.</div>
                  <button onClick={()=>{setSent(false);setForm({name:'',email:'',subject:'',message:''})}} className="mt-4 text-primary text-[12px] font-bold hover:underline">Отправить ещё</button>
                </div>
              ):(
                <div className="bg-surf2 border border-black/8 p-5 space-y-4">
                  <div className="font-semibold text-[14px] text-ink">Написать нам</div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className="block text-[10px] font-bold text-ink4 uppercase tracking-wide mb-1.5">Ваше имя *</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Введите имя"/></div>
                    <div><label className="block text-[10px] font-bold text-ink4 uppercase tracking-wide mb-1.5">Email *</label><input type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="email@example.com"/></div>
                  </div>
                  <div><label className="block text-[10px] font-bold text-ink4 uppercase tracking-wide mb-1.5">Тема</label><input value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))} placeholder="Тема обращения"/></div>
                  <div><label className="block text-[10px] font-bold text-ink4 uppercase tracking-wide mb-1.5">Сообщение *</label><textarea value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} rows={4} placeholder="Ваше сообщение..."/></div>
                  <button onClick={handleSubmit} className="w-full bg-primary hover:bg-red-700 text-white py-3 text-[12px] font-bold uppercase tracking-wide transition-all">Отправить сообщение</button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
