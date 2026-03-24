import { useRef, useEffect } from 'react'
import { useApp } from '../../context/AppContext'

export default function PartnersBanner() {
  const { data } = useApp()
  const partners = data.partners || []
  const trackRef = useRef(null)

  // Duplicate for infinite loop
  const doubled = [...partners, ...partners]

  return (
    <div className="bg-[#0a0a0a] border-t border-white/5 py-4 overflow-hidden relative">
      <div className="flex items-center gap-4 mb-1 px-6">
        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest whitespace-nowrap flex-shrink-0">Партнёры</span>
        <div className="h-px bg-white/8 flex-1"/>
      </div>
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none"/>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none"/>
        <div className="partners-track flex items-center gap-10 py-2">
          {doubled.map((p,i)=>(
            <a key={i} href={p.url||'#'} target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 text-white/25 hover:text-white/60 transition-colors duration-300 text-[12px] font-semibold whitespace-nowrap">
              {p.logo
                ? <img src={p.logo} alt={p.name} className="h-6 object-contain opacity-30 hover:opacity-70 transition-opacity" onError={e=>e.target.style.display='none'}/>
                : p.name
              }
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .partners-track {
          animation: scroll-partners 35s linear infinite;
          width: max-content;
        }
        .partners-track:hover {
          animation-play-state: paused;
        }
        @keyframes scroll-partners {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
