import { createContext, useContext, useState } from 'react'
import { initialData } from '../data/appData'
import { t as translations } from '../data/translations'

const Ctx = createContext()

export function AppProvider({ children }) {
  const [lang, setLang] = useState('ru')
  const [data, setData] = useState(initialData)
  const [adminUser, setAdminUser] = useState(null)
  const [staffUser, setStaffUser] = useState(null)

  const tr = translations[lang]

  // Data mutations
  const upd = (key, val) => setData(p => ({ ...p, [key]: val }))
  const addItem = (key, item) => setData(p => ({ ...p, [key]: [...(p[key] || []), { ...item, id: Date.now() }] }))
  const updItem = (key, id, patch) => setData(p => ({ ...p, [key]: p[key].map(x => x.id === id ? { ...x, ...patch } : x) }))
  const delItem = (key, id) => setData(p => ({ ...p, [key]: p[key].filter(x => x.id !== id) }))
  const updNested = (key, subKey, val) => setData(p => ({ ...p, [key]: { ...p[key], [subKey]: val } }))

  // Auth
  const adminLogin = (user, pass) => {
    if (user === 'admin' && pass === 'admin123') { setAdminUser({ name: 'Суперадмин', role: 'super_admin' }); return true }
    if (user === 'manager' && pass === 'manager123') { setAdminUser({ name: 'Менеджер', role: 'content_manager' }); return true }
    return false
  }
  const adminLogout = () => setAdminUser(null)

  const staffLogin = (user, pass) => {
    const found = data.staffUsers.find(u => u.login === user && u.pass === pass)
    if (found) {
      if (found.approved === false) return 'pending'
      setStaffUser(found); return true
    }
    return false
  }

  // Register new staff user (pending approval)
  const staffRegister = (userData) => {
    const loginExists = data.staffUsers.find(u => u.login === userData.login)
    if (loginExists) return 'login_taken'
    addItem('staffUsers', {
      ...userData,
      approved: false,
      avatar: `https://i.pravatar.cc/40?u=${userData.login}`,
    })
    return 'ok'
  }

  // Approve or reject pending user (admin action)
  const approveStaff = (userId) => updItem('staffUsers', userId, { approved: true })
  const rejectStaff  = (userId) => delItem('staffUsers', userId)
  const staffLogout = () => setStaffUser(null)

  // Attendance
  const markAttendance = (userId) => {
    const key = `${userId}_${new Date().toISOString().split('T')[0]}`
    setData(p => ({ ...p, attendance: { ...p.attendance, [key]: new Date().toLocaleTimeString('ru-RU', {hour:'2-digit',minute:'2-digit'}) } }))
  }
  const isCheckedIn = (userId) => {
    const key = `${userId}_${new Date().toISOString().split('T')[0]}`
    return !!data.attendance[key]
  }
  const getCheckInTime = (userId) => {
    const key = `${userId}_${new Date().toISOString().split('T')[0]}`
    return data.attendance[key] || null
  }

  // Export CSV
  const exportCSV = (items, filename) => {
    if (!items?.length) return
    const headers = Object.keys(items[0]).filter(k => k !== 'photo' && k !== 'pass').join(',')
    const rows = items.map(i => Object.entries(i).filter(([k]) => k !== 'photo' && k !== 'pass').map(([,v]) => `"${v ?? ''}"`).join(','))
    const csv = '\uFEFF' + [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = filename + '.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Ctx.Provider value={{ lang, setLang, tr, data, upd, addItem, updItem, delItem, updNested, adminUser, adminLogin, adminLogout, staffUser, staffLogin, staffLogout, staffRegister, approveStaff, rejectStaff, markAttendance, isCheckedIn, getCheckInTime, exportCSV }}>
      {children}
    </Ctx.Provider>
  )
}

export const useApp = () => useContext(Ctx)
