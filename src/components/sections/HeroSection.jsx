import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown, Trophy, Calendar, Globe } from 'lucide-react'
import { useApp } from '../../context/AppContext'

function useCount(target, dur = 1800) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const steps = 60
    const inc = target / steps
    const timer = setInterval(() => {
      start = Math.min(start + inc, target)
      setVal(Math.round(start))
      if (start >= target) clearInterval(timer)
    }, dur / steps)
    return () => clearInterval(timer)
  }, [target, dur])
  return val
}

export default function HeroSection() {
  const { tr, data, lang } = useApp()
  const nav = useNavigate()
  const athletes = useCount(data.stats.athletes)
  const coaches  = useCount(data.stats.coaches)
  const sports   = useCount(data.stats.sports)

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-white">
      <div className="absolute inset-0 bg-grid-light opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-red-50/40" />
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/3 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 pt-32 pb-16 flex-1 flex items-center w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ duration:.6 }}>
            <div className="inline-flex items-center gap-2 bg-primary/6 border border-primary/20 px-3 py-1.5 mb-6">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <span className="text-primary text-[10px] font-bold uppercase tracking-[2px]">{tr.hero.tag}</span>
            </div>
            {(() => {
              const heroData = (data.heroTitle && data.heroTitle[lang]) || tr.hero
              return (
                <h1 className="font-bebas leading-none tracking-wide mb-2">
                  <span className="block text-[64px] sm:text-[80px] text-ink">{heroData.t1}</span>
                  <span className="block text-[64px] sm:text-[80px] text-stroke-red">{heroData.t2}</span>
                  <span className="block text-[44px] sm:text-[56px] text-gold">{heroData.t3}</span>
                </h1>
              )
            })()}
            <div className="w-14 h-[3px] bg-primary my-5" />
            <p className="text-ink3 text-[13px] font-inter leading-relaxed max-w-md mb-8">{(data.heroTitle?.[lang])?.sub || tr.hero.sub}</p>
            <div className="flex flex-wrap gap-3">
              <motion.button whileHover={{ y:-2 }} whileTap={{ scale:.98 }}
                onClick={() => nav('/apply')}
                className="bg-primary hover:bg-pd text-white px-8 py-3.5 text-[12px] font-bold uppercase tracking-wider transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 flex items-center gap-2">
                {tr.hero.btn1}
              </motion.button>
              <motion.button whileHover={{ y:-2 }}
                onClick={() => nav('/about')}
                className="border border-black/15 hover:border-primary text-ink3 hover:text-primary px-8 py-3.5 text-[12px] font-semibold uppercase tracking-wider transition-all">
                {tr.hero.btn2}
              </motion.button>
            </div>
            <div className="flex gap-8 mt-10 pt-8 border-t border-black/8">
              {[
                { val: athletes.toLocaleString(), lbl: tr.stats.athletes, color: 'text-primary' },
                { val: coaches.toLocaleString(),  lbl: tr.stats.coaches,  color: 'text-gold' },
                { val: sports,                    lbl: tr.stats.sports,   color: 'text-ink' },
              ].map(s => (
                <div key={s.lbl}>
                  <div className={`font-bebas text-4xl leading-none ${s.color}`}>{s.val}</div>
                  <div className="text-ink4 text-[10px] font-inter mt-1">{s.lbl}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} transition={{ duration:.6, delay:.1 }}
            className="hidden lg:flex flex-col gap-3">
            <div className="bg-white border border-black/8 p-5 hover:border-primary/30 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-primary/8 flex items-center justify-center"><Trophy size={18} className="text-primary" /></div>
                <div>
                  <div className="text-[12px] font-bold text-ink">Достижения 2024</div>
                  <div className="text-[10px] text-ink4">Международные соревнования</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[['42','Золото','#F5C518'],['58','Серебро','#C0C0C0'],['56','Бронза','#CD7F32']].map(([v,l,c])=>(
                  <div key={l} className="text-center bg-surf2 border border-black/6 p-3">
                    <div className="font-bebas text-2xl leading-none" style={{color:c}}>{v}</div>
                    <div className="text-[9px] text-ink4 mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-black/8 p-4 hover:border-primary/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-primary/8 flex items-center justify-center"><Calendar size={18} className="text-primary" /></div>
                <div><div className="text-[12px] font-bold text-ink">Ближайшее событие</div><div className="text-[10px] text-ink4">Регистрация открыта</div></div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[12px] font-bold text-ink">{data.events[0]?.title}</div>
                  <div className="text-[10px] text-primary font-semibold mt-1">{data.events[0]?.date} · {data.events[0]?.location}</div>
                </div>
                <button onClick={() => nav('/apply')} className="bg-primary/8 border border-primary/20 text-primary text-[10px] font-bold uppercase px-3 py-1.5 hover:bg-primary hover:text-white transition-all">
                  Участие
                </button>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-ink4 mb-1">
                  <span>{data.events[0]?.registered}/{data.events[0]?.slots} мест</span>
                  <span className="text-primary font-bold">{Math.round((data.events[0]?.registered||0)/(data.events[0]?.slots||1)*100)}%</span>
                </div>
                <div className="h-1 bg-surf3 overflow-hidden"><div className="h-full bg-primary" style={{width:`${Math.round((data.events[0]?.registered||0)/(data.events[0]?.slots||1)*100)}%`}} /></div>
              </div>
            </div>
            <div className="bg-white border border-black/8 p-4 hover:border-primary/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-primary/8 flex items-center justify-center"><Globe size={18} className="text-primary" /></div>
                <div><div className="text-[12px] font-bold text-ink">9 регионов КР</div><div className="text-[10px] text-ink4">Программа развития</div></div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.regions.slice(0,5).map(r => (
                  <span key={r.id} className="bg-primary/6 border border-primary/15 text-primary text-[9px] font-bold px-2 py-0.5">{r.name}</span>
                ))}
                <span className="bg-surf3 border border-black/8 text-ink4 text-[9px] font-bold px-2 py-0.5">+{data.regions.length-5}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-ink4 animate-bounce">
        <span className="text-[9px] uppercase tracking-widest font-inter">Прокрутите</span>
        <ChevronDown size={14} />
      </div>
    </section>
  )
}
