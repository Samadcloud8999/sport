import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { SectionLabel, SectionTitle } from '../ui/index'

export default function CarouselSection() {
  const { data, tr } = useApp()
  const [idx, setIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const total = data.gallery.length
  const timerRef = useRef(null)

  const go = (dir) => {
    setIdx(prev => (prev + dir + total) % total)
  }

  // Auto-scroll every 3.5s
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => go(1), 3500)
    }
    return () => clearInterval(timerRef.current)
  }, [isPaused, idx, total])

  const getSlides = () => {
    const slides = []
    for (let i = 0; i < 3; i++) slides.push(data.gallery[(idx + i) % total])
    return slides
  }

  return (
    <section className="py-20 bg-surf2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between mb-10 gap-4">
          <div>
            <SectionLabel>{tr.sections?.gallery || 'Галерея'}</SectionLabel>
            <SectionTitle>ФОТО <span className="text-primary">СОБЫТИЙ</span></SectionTitle>
            <p className="text-ink4 text-[12px] mt-1">Соревнования, сборы, достижения спортсменов</p>
          </div>
          <div className="flex gap-2">
            <motion.button whileHover={{scale:1.05}} whileTap={{scale:.95}} onClick={()=>go(-1)}
              className="w-10 h-10 bg-white border border-black/10 hover:border-primary hover:text-primary text-ink3 flex items-center justify-center transition-all">
              <ChevronLeft size={18}/>
            </motion.button>
            <motion.button whileHover={{scale:1.05}} whileTap={{scale:.95}} onClick={()=>go(1)}
              className="w-10 h-10 bg-white border border-black/10 hover:border-primary hover:text-primary text-ink3 flex items-center justify-center transition-all">
              <ChevronRight size={18}/>
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5"
          onMouseEnter={()=>setIsPaused(true)}
          onMouseLeave={()=>setIsPaused(false)}>
          <AnimatePresence mode="popLayout">
            {getSlides().map((slide,i)=>(
              <motion.div key={`${slide.id}-${idx}-${i}`}
                initial={{opacity:0, x: 40}}
                animate={{opacity:1, x:0}}
                exit={{opacity:0, x:-40}}
                transition={{duration:.55, ease:[0.25,0.46,0.45,0.94], delay:i*.06}}
                className="bg-white border border-black/8 overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer group hover-lift">
                <div className="h-56 relative overflow-hidden bg-surf3">
                  <img src={slide.img} alt={slide.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={e=>{e.target.style.display='none'}}/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                  <div className="absolute top-3 left-3 bg-primary text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-wide">{slide.cat}</div>
                </div>
                <div className="p-4">
                  <div className="text-[13px] font-bold text-ink group-hover:text-primary transition-colors leading-snug">{slide.title}</div>
                  <div className="text-[10px] text-ink4 font-inter mt-1.5">{slide.date}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {data.gallery.map((_,i)=>(
            <button key={i} onClick={()=>setIdx(i)}
              className={`transition-all duration-300 ${i===idx?'w-6 h-2 bg-primary':'w-2 h-2 bg-black/15 hover:bg-primary/50'} rounded-full`}/>
          ))}
        </div>
      </div>
    </section>
  )
}
