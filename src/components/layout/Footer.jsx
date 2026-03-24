import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function Footer() {
  const { tr } = useApp()
  return (
    <footer className="bg-[#0a0a0a] text-white pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-primary flex items-center justify-center font-bebas text-xl text-white">КР</div>
              <div>
                <div className="font-bebas text-xl tracking-wider">ЦПМС КР</div>
                <div className="text-white/30 text-[10px] font-inter leading-tight">Центр подготовки<br/>молодёжных сборных</div>
              </div>
            </div>
            <p className="text-white/30 text-[11px] font-inter leading-relaxed">Государственный спортивный центр Кыргызской Республики</p>
            <div className="flex gap-2 mt-4">
              {['FB','IG','YT','TG'].map(s => (
                <a key={s} href="#" className="w-7 h-7 border border-white/10 hover:border-primary hover:bg-primary/10 flex items-center justify-center text-white/30 hover:text-white text-[10px] font-bold transition-all">{s}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="font-bebas text-base text-white tracking-wider mb-3 pb-2 border-b border-primary/40">Навигация</div>
            {[['/',tr.nav.home],['/about',tr.nav.about],['/sports',tr.nav.sports],['/athletes',tr.nav.athletes],['/events',tr.nav.events],['/news',tr.nav.news]].map(([p,l])=>(
              <Link key={p} to={p} className="block text-white/40 hover:text-gold text-[11px] font-mont py-1.5 transition-colors">→ {l}</Link>
            ))}
          </div>
          <div>
            <div className="font-bebas text-base text-white tracking-wider mb-3 pb-2 border-b border-primary/40">Сервисы</div>
            {[['/apply',tr.nav.apply],['/regions',tr.nav.regions],['/contacts',tr.nav.contacts],['/login',tr.nav.login]].map(([p,l])=>(
              <Link key={p} to={p} className="block text-white/40 hover:text-gold text-[11px] font-mont py-1.5 transition-colors">→ {l}</Link>
            ))}
          </div>
          <div>
            <div className="font-bebas text-base text-white tracking-wider mb-3 pb-2 border-b border-primary/40">Контакты</div>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2 text-white/40 text-[11px] font-inter"><MapPin size={13} className="text-primary mt-0.5 flex-shrink-0" /><span>{tr.footer.address}</span></div>
              <div className="flex items-center gap-2 text-white/40 text-[11px] font-inter"><Phone size={13} className="text-primary flex-shrink-0" /><span>{tr.footer.phone}</span></div>
              <div className="flex items-center gap-2 text-white/40 text-[11px] font-inter"><Mail size={13} className="text-primary flex-shrink-0" /><span>{tr.footer.email}</span></div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/8 pt-5 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-white/20 text-[10px] font-inter">© {new Date().getFullYear()} ЦПМС КР. {tr.footer.rights}.</p>
          <p className="text-white/15 text-[10px] font-inter">Государственное агентство по делам физической культуры и спорта КР</p>
        </div>
      </div>
    </footer>
  )
}
