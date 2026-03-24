// Shared small UI components
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export function SectionLabel({ children, center = false, light = false }) {
  return (
    <div className={`section-label-row ${center ? 'justify-center' : ''} ${light ? '!text-gold [&::before]:!bg-gold [&::after]:!bg-gold' : ''}`}>
      {children}
    </div>
  )
}

export function SectionTitle({ children, light = false }) {
  return (
    <h2 className={`font-bebas text-5xl leading-none tracking-wide mb-2 ${light ? 'text-white' : 'text-ink'}`}>
      {children}
    </h2>
  )
}

export function RedBtn({ children, onClick, className = '', type = 'button', disabled = false }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`bg-primary hover:bg-pd disabled:bg-gray-300 text-white px-6 py-2.5 text-[12px] font-bold uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 ${className}`}>
      {children}
    </button>
  )
}

export function OutlineBtn({ children, onClick, className = '' }) {
  return (
    <button onClick={onClick}
      className={`border border-black/15 hover:border-primary text-ink3 hover:text-primary px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${className}`}>
      {children}
    </button>
  )
}

export function IconBtn({ children, onClick, title = '', variant = 'default' }) {
  const cls = {
    default: 'border border-black/10 hover:border-primary hover:text-primary text-ink4',
    danger:  'border border-black/10 hover:border-red-400 hover:text-red-500 text-ink4',
    success: 'border border-black/10 hover:border-green-500 hover:text-green-600 text-ink4',
  }[variant]
  return (
    <button onClick={onClick} title={title}
      className={`w-7 h-7 flex items-center justify-center transition-all ${cls}`}>
      {children}
    </button>
  )
}

export function Badge({ status }) {
  const map = {
    pending:  ['badge badge-pending',  'Ожидает'],
    approved: ['badge badge-approved', 'Одобрено'],
    rejected: ['badge badge-rejected', 'Отклонено'],
    active:   ['badge badge-approved', 'Активен'],
    reserve:  ['badge badge-pending',  'Резерв'],
    done:     ['badge badge-done',     'Выполнено'],
    progress: ['badge badge-progress', 'В процессе'],
    todo:     ['badge badge-todo',     'Не начато'],
    high:     ['badge',                'Высокий'],
    medium:   ['badge badge-progress', 'Средний'],
    low:      ['badge badge-todo',     'Низкий'],
  }
  const [cls, label] = map[status] || ['badge badge-todo', status]
  return <span className={cls}>{label}</span>
}

export function Modal({ open, onClose, title, children, maxW = 'max-w-lg' }) {
  const ref = useRef()
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50" onClick={e => e.target===e.currentTarget && onClose()}>
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:16 }}
        className={`bg-white w-full ${maxW} max-h-[90vh] overflow-y-auto shadow-2xl`}>
        <div className="flex items-center justify-between p-5 border-b border-black/8">
          <h3 className="font-bebas text-2xl text-ink tracking-wider">{title}</h3>
          <button onClick={onClose} className="text-ink4 hover:text-ink transition-colors p-1"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </div>
  )
}

export function FormGroup({ label, required, children, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-ink2 uppercase tracking-wide">
        {label}{required && <span className="text-primary ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[10px] text-primary font-semibold">{error}</p>}
    </div>
  )
}

export function DataTable({ headers, rows, emptyMsg = 'Нет данных' }) {
  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead><tr>{headers.map((h,i) => <th key={i}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={headers.length} className="text-center text-ink4 py-8 text-sm">{emptyMsg}</td></tr>
            : rows
          }
        </tbody>
      </table>
    </div>
  )
}

export function SearchInput({ value, onChange, placeholder = 'Поиск...' }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="!w-52 !text-[12px] !py-2 !px-3"
    />
  )
}

export function StatCard({ label, value, icon: Icon, color = '#CC0000', bg = 'rgba(204,0,0,0.08)', delta }) {
  return (
    <div className="bg-white border border-black/8 p-5 hover:border-primary/30 transition-all hover-lift">
      <div className="w-9 h-9 flex items-center justify-center mb-3" style={{ background: bg }}>
        <Icon size={17} style={{ color }} />
      </div>
      <div className="font-bebas text-3xl text-ink leading-none mb-1" style={{ color }}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className="text-[11px] text-ink4 font-inter">{label}</div>
      {delta && <div className="text-[10px] text-green-500 font-bold mt-1.5 flex items-center gap-1">↑ {delta}</div>}
    </div>
  )
}

export function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  )
}
