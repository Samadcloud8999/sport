import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Trophy, Zap, Map, Users } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { SectionLabel, SectionTitle } from '../components/ui/index'
import HeroSection from '../components/sections/HeroSection'
import CarouselSection from '../components/sections/CarouselSection'
import PartnersBanner from '../components/sections/PartnersBanner'
import MapSection from '../components/sections/MapSection'

// Programs section
function ProgramsSection() {
  const { data, tr } = useApp()
  const programs = [
    { title:'Олимпийский резерв',     desc:'Отбор и подготовка перспективных спортсменов для Олимпийских игр',           count:'245 человек',  icon:Trophy },
    { title:'Молодёжные сборные',     desc:'Подготовка сборных по всем олимпийским видам спорта',                        count:'480 человек',  icon:Users  },
    { title:'Тренировочные сборы',    desc:'Регулярные сборы в спортивных базах Кыргызстана и за рубежом',               count:'32 в год',     icon:Zap    },
    { title:'Региональные программы', desc:'Развитие спортивной инфраструктуры во всех регионах республики',             count:'9 регионов',   icon:Map    },
  ]
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <SectionLabel center>Деятельность</SectionLabel>
          <SectionTitle>ПРОГРАММЫ <span className="text-primary">ПОДГОТОВКИ</span></SectionTitle>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {programs.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div key={p.title}
                initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.08}}
                className="bg-white border border-black/8 p-6 hover:border-primary/35 hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden hover-lift">
                <div className="absolute top-4 right-4 font-bebas text-7xl text-black/3 group-hover:text-primary/5 transition-colors leading-none">0{i+1}</div>
                <div className="w-10 h-10 bg-primary/8 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-primary"/>
                </div>
                <div className="text-[13px] font-bold text-ink mb-2 group-hover:text-primary transition-colors leading-snug">{p.title}</div>
                <p className="text-[11px] text-ink4 leading-relaxed mb-4 font-inter">{p.desc}</p>
                <div className="text-[11px] font-bold text-primary">{p.count}</div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"/>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Events section
function EventsSection() {
  const { data, tr } = useApp()
  const nav = useNavigate()
  const months = ['','Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек']

  return (
    <section className="py-20 bg-surf2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <SectionLabel>Календарь</SectionLabel>
            <SectionTitle>БЛИЖАЙШИЕ <span className="text-primary">СОБЫТИЯ</span></SectionTitle>
          </div>
          <button onClick={()=>nav('/events')} className="hidden md:flex items-center gap-2 text-ink4 hover:text-primary text-[11px] font-bold uppercase tracking-wide transition-colors">
            Все события <ArrowRight size={13}/>
          </button>
        </div>
        <div className="space-y-3">
          {data.events.slice(0,3).map((ev,i) => {
            const [,m,d] = ev.date.split('-')
            const pct = Math.round(ev.registered/ev.slots*100)
            return (
              <motion.div key={ev.id}
                initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.07}}
                className="bg-white border border-black/8 p-5 flex flex-wrap items-center gap-5 hover:border-primary/30 hover:shadow-sm transition-all relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top"/>
                <div className="bg-surf2 border border-black/8 p-3 text-center min-w-[62px] flex-shrink-0">
                  <div className="font-bebas text-3xl text-primary leading-none">{d}</div>
                  <div className="text-[9px] font-bold text-ink4 uppercase">{months[+m]}</div>
                </div>
                <div className="flex-1 min-w-[160px]">
                  <div className="text-[14px] font-bold text-ink">{ev.title}</div>
                  <div className="text-[11px] text-ink4 mt-1">{ev.location} · {ev.sport}</div>
                </div>
                <div className="min-w-[120px]">
                  <div className="flex justify-between text-[10px] mb-1"><span className="text-ink4">{ev.registered}/{ev.slots}</span><span className="text-primary font-bold">{pct}%</span></div>
                  <div className="h-1 bg-surf3 overflow-hidden"><div className="h-full bg-primary" style={{width:`${pct}%`}}/></div>
                </div>
                <button onClick={()=>nav('/apply')} className="bg-primary hover:bg-pd text-white px-5 py-2 text-[11px] font-bold uppercase tracking-wide transition-all hover:shadow-md hover:shadow-primary/25 flex-shrink-0">
                  Участие
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// News section
function NewsSection() {
  const { data } = useApp()
  const nav = useNavigate()
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <SectionLabel>Пресс-центр</SectionLabel>
            <SectionTitle>ПОСЛЕДНИЕ <span className="text-gold">НОВОСТИ</span></SectionTitle>
          </div>
          <button onClick={()=>nav('/news')} className="hidden md:flex items-center gap-2 text-ink4 hover:text-primary text-[11px] font-bold uppercase tracking-wide transition-colors">
            Все новости <ArrowRight size={13}/>
          </button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.news.map((n,i)=>(
            <motion.div key={n.id} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.07}}
              className={`bg-white border border-black/8 overflow-hidden hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer hover-lift ${i===0?'lg:col-span-2':''}`}>
              <div className={`relative overflow-hidden bg-surf3 ${i===0?'h-52':'h-36'}`}>
                {n.img&&<img src={n.img} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e=>e.target.style.display='none'}/>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"/>
                <div className="absolute top-3 left-3 bg-primary text-white text-[9px] font-bold px-2.5 py-1 uppercase">{n.category}</div>
              </div>
              <div className="p-4">
                <div className={`font-bold text-ink group-hover:text-primary transition-colors leading-snug mb-1 ${i===0?'text-[14px]':'text-[12px]'}`}>{n.title}</div>
                {i===0&&<p className="text-[11px] text-ink4 font-inter leading-relaxed mb-2 line-clamp-2">{n.text}</p>}
                <div className="text-[10px] text-ink4 font-inter">{n.date}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div>
      <HeroSection/>
      <CarouselSection/>
      <ProgramsSection/>
      <EventsSection/>
      <MapSection/>
      <NewsSection/>
      <PartnersBanner/>
    </div>
  )
}
