import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const LANGS = ['ru','ky','en']

export default function Header() {
  const { lang, setLang, tr } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const nav = useNavigate()
  const loc = useLocation()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const isHome = loc.pathname === '/'

  const links = [
    { key:'home',     path:'/' },
    { key:'about',    path:'/about' },
    { key:'sports',   path:'/sports' },
    { key:'athletes', path:'/athletes' },
    { key:'events',   path:'/events' },
    { key:'regions',  path:'/regions' },
    { key:'news',     path:'/news' },
    { key:'contacts', path:'/contacts' },
  ]

  const navBg = scrolled || !isHome
    ? 'bg-white/97 backdrop-blur-md shadow-sm border-b border-black/8'
    : 'bg-transparent'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      {/* Top stripe */}
      <div className="bg-primary py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-white/80 text-xs font-inter hidden md:block">
            Государственное агентство по делам физической культуры и спорта КР
          </span>
          <div className="flex gap-1 ml-auto">
            {LANGS.map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest transition-all ${lang===l ? 'text-gold' : 'text-white/60 hover:text-white'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-9 h-9 bg-primary flex items-center justify-center font-bebas text-white text-base tracking-wider group-hover:bg-gold transition-colors">КР</div>
          <div>
            <div className="font-bebas text-ink text-lg leading-none tracking-wider">ЦПМС КР</div>
            <div className="text-ink4 text-[9px] font-inter leading-none hidden md:block">Центр подготовки молодёжных сборных</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-0.5">
          {links.map(({ key, path }) => {
            const active = loc.pathname === path || (path !== '/' && loc.pathname.startsWith(path))
            return (
              <Link key={key} to={path}
                className={`px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all relative group ${active ? 'text-primary' : 'text-ink3 hover:text-ink'}`}>
                {tr.nav[key]}
                <span className={`absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-primary transition-transform origin-left ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => nav('/apply')}
            className="hidden sm:flex items-center gap-1.5 bg-primary hover:bg-pd text-white px-4 py-2 text-[11px] font-bold uppercase tracking-wide transition-all hover:shadow-lg hover:shadow-primary/30">
            {tr.nav.apply}
          </button>
          <button onClick={() => nav('/login')}
            className="hidden sm:flex items-center gap-1.5 border border-black/15 hover:border-primary text-ink3 hover:text-primary px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all">
            {tr.nav.login}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-ink3 hover:text-ink">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-black/8 shadow-lg">
          {links.map(({ key, path }) => (
            <Link key={key} to={path} onClick={() => setMobileOpen(false)}
              className="block px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-ink3 hover:text-primary hover:bg-surf2 border-b border-black/4 transition-colors">
              {tr.nav[key]}
            </Link>
          ))}
          <div className="flex gap-2 p-4">
            <button onClick={() => { nav('/apply'); setMobileOpen(false) }}
              className="flex-1 bg-primary text-white py-2.5 text-[11px] font-bold uppercase tracking-wide">
              {tr.nav.apply}
            </button>
            <button onClick={() => { nav('/login'); setMobileOpen(false) }}
              className="flex-1 border border-black/15 text-ink3 py-2.5 text-[11px] font-semibold uppercase tracking-wide">
              {tr.nav.login}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
