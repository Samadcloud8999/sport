import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { Lock, User, AlertCircle, Shield, Users, Eye, EyeOff, CheckCircle, Clock, ChevronLeft, UserPlus } from 'lucide-react'

// ── Admin Login ────────────────────────────────────────────
export function AdminLoginPage() {
  const { adminLogin } = useApp()
  const nav = useNavigate()
  const [creds, setCreds] = useState({ user: '', pass: '' })
  const [error, setError] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const submit = () => {
    if (adminLogin(creds.user, creds.pass)) nav('/admin')
    else setError(true)
  }

  return (
    <div className="min-h-screen bg-surf2 flex items-center justify-center px-4">
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary mx-auto flex items-center justify-center font-bebas text-2xl text-white mb-4 shadow-lg shadow-primary/25">КР</div>
          <div className="font-bebas text-2xl text-ink tracking-wider">ЦПМС КР</div>
          <div className="text-ink4 text-[11px] font-inter mt-1">Административная панель</div>
        </div>
        <div className="bg-white border border-black/8 p-7 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={16} className="text-primary"/>
            <span className="font-bebas text-xl text-ink tracking-wider">ВХОД В СИСТЕМУ</span>
          </div>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 text-[11px] font-semibold mb-4">
              <AlertCircle size={13}/> Неверный логин или пароль
            </div>
          )}
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-ink2 uppercase tracking-wide block mb-1.5">Логин</label>
              <div className="relative">
                <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink4"/>
                <input type="text" value={creds.user}
                  onChange={e=>{setCreds(p=>({...p,user:e.target.value}));setError(false)}}
                  placeholder="admin" className="!pl-9" autoComplete="username"/>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-ink2 uppercase tracking-wide block mb-1.5">Пароль</label>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink4"/>
                <input type={showPass ? 'text' : 'password'} value={creds.pass}
                  onChange={e=>{setCreds(p=>({...p,pass:e.target.value}));setError(false)}}
                  placeholder="••••••••" className="!pl-9 !pr-9" autoComplete="current-password"
                  onKeyDown={e=>e.key==='Enter'&&submit()}/>
                <button onClick={()=>setShowPass(p=>!p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink4 hover:text-ink">
                  {showPass ? <EyeOff size={13}/> : <Eye size={13}/>}
                </button>
              </div>
            </div>
            <motion.button whileHover={{y:-1}} whileTap={{scale:.98}} onClick={submit}
              className="w-full bg-primary hover:bg-red-700 text-white py-3 text-[12px] font-bold uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-primary/30 mt-2">
              Войти
            </motion.button>
          </div>
          <div className="mt-5 pt-4 border-t border-black/6">
            <div className="text-[10px] text-ink4 font-semibold uppercase tracking-wide mb-2">Тестовые аккаунты</div>
            {[['admin','admin123','Суперадмин'],['manager','manager123','Менеджер']].map(([u,p,r])=>(
              <button key={u} onClick={()=>setCreds({user:u,pass:p})}
                className="w-full text-left px-3 py-2 bg-surf2 border border-black/6 hover:border-primary/30 text-[10px] text-ink3 transition-all font-mono mb-1">
                {r}: <span className="text-primary">{u}</span> / <span className="text-primary">{p}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button onClick={()=>nav('/staff/login')} className="text-[10px] text-ink4 hover:text-primary transition-colors">
              Войти как сотрудник →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ── Staff Login + Register ─────────────────────────────────
export function StaffLoginPage() {
  const { data, staffLogin, staffRegister } = useApp()
  const nav = useNavigate()

  // view: 'login' | 'register' | 'success' | 'pending_notice'
  const [view, setView] = useState('login')

  // Login state
  const [creds, setCreds] = useState({ user: '', pass: '' })
  const [loginError, setLoginError] = useState('')
  const [showPass, setShowPass] = useState(false)

  // Register state
  const [regForm, setRegForm] = useState({
    name: '', login: '', pass: '', confirmPass: '',
    dept: '', role: '',
  })
  const [regError, setRegError] = useState('')
  const [regShowPass, setRegShowPass] = useState(false)

  const handleLogin = () => {
    const result = staffLogin(creds.user, creds.pass)
    if (result === true) {
      nav('/staff')
    } else if (result === 'pending') {
      setLoginError('Ваш аккаунт ожидает подтверждения администратором. Обратитесь к администратору.')
    } else {
      setLoginError('Неверный логин или пароль')
    }
  }

  const handleRegister = () => {
    setRegError('')
    if (!regForm.name || !regForm.login || !regForm.pass || !regForm.dept) {
      setRegError('Заполните все обязательные поля')
      return
    }
    if (regForm.pass !== regForm.confirmPass) {
      setRegError('Пароли не совпадают')
      return
    }
    if (regForm.pass.length < 4) {
      setRegError('Пароль должен быть не менее 4 символов')
      return
    }
    const result = staffRegister({
      name: regForm.name,
      login: regForm.login,
      pass: regForm.pass,
      dept: regForm.dept,
      role: regForm.role || 'Сотрудник',
    })
    if (result === 'login_taken') {
      setRegError('Такой логин уже занят. Выберите другой.')
      return
    }
    setView('success')
  }

  const dept = data.departments || []

  return (
    <div className="min-h-screen bg-surf2 flex items-center justify-center px-4 py-8">
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary mx-auto flex items-center justify-center font-bebas text-2xl text-white mb-4 shadow-lg shadow-primary/25">КР</div>
          <div className="font-bebas text-2xl text-ink tracking-wider">ЦПМС КР</div>
          <div className="text-ink4 text-[11px] font-inter mt-1">Портал сотрудников</div>
        </div>

        <AnimatePresence mode="wait">

          {/* ── LOGIN ── */}
          {view === 'login' && (
            <motion.div key="login" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
              className="bg-white border border-black/8 p-7 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Users size={16} className="text-primary"/>
                <span className="font-bebas text-xl text-ink tracking-wider">ВХОД ДЛЯ СОТРУДНИКОВ</span>
              </div>

              {loginError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 text-[11px] font-semibold mb-4">
                  <AlertCircle size={13} className="flex-shrink-0 mt-0.5"/>{loginError}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-ink2 uppercase tracking-wide block mb-1.5">Логин</label>
                  <div className="relative">
                    <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink4"/>
                    <input type="text" value={creds.user}
                      onChange={e=>{setCreds(p=>({...p,user:e.target.value}));setLoginError('')}}
                      placeholder="Введите логин" className="!pl-9" autoComplete="username"/>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-ink2 uppercase tracking-wide block mb-1.5">Пароль</label>
                  <div className="relative">
                    <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink4"/>
                    <input type={showPass ? 'text' : 'password'} value={creds.pass}
                      onChange={e=>{setCreds(p=>({...p,pass:e.target.value}));setLoginError('')}}
                      placeholder="••••••••" className="!pl-9 !pr-9"
                      onKeyDown={e=>e.key==='Enter'&&handleLogin()}/>
                    <button onClick={()=>setShowPass(p=>!p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink4 hover:text-ink">
                      {showPass ? <EyeOff size={13}/> : <Eye size={13}/>}
                    </button>
                  </div>
                </div>
                <motion.button whileHover={{y:-1}} whileTap={{scale:.98}} onClick={handleLogin}
                  className="w-full bg-primary hover:bg-red-700 text-white py-3 text-[12px] font-bold uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-primary/30 mt-2">
                  Войти
                </motion.button>
              </div>

              {/* Register link */}
              <div className="mt-5 pt-4 border-t border-black/6 text-center">
                <div className="text-[11px] text-ink4 mb-3">Нет аккаунта?</div>
                <button onClick={()=>setView('register')}
                  className="flex items-center justify-center gap-2 w-full border border-black/12 hover:border-primary text-ink3 hover:text-primary py-2.5 text-[11px] font-bold uppercase tracking-wide transition-all">
                  <UserPlus size={13}/> Зарегистрироваться
                </button>
              </div>

              {/* Quick accounts (existing approved) */}
              <div className="mt-4 pt-4 border-t border-black/6">
                <div className="text-[10px] text-ink4 font-semibold uppercase tracking-wide mb-2">Быстрый вход (демо)</div>
                <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {data.staffUsers.filter(u => u.approved !== false).map(u => {
                    const d = data.departments.find(x => x.id === u.dept)
                    return (
                      <button key={u.id} onClick={()=>setCreds({user:u.login,pass:u.pass})}
                        className="text-left px-2.5 py-2 bg-surf2 border border-black/6 hover:border-primary/30 transition-all">
                        <div className="text-[10px] font-bold text-ink truncate">{d?.name}</div>
                        <div className="text-[9px] text-ink4 font-mono">{u.login}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-4 text-center">
                <button onClick={()=>nav('/login')} className="text-[10px] text-ink4 hover:text-primary transition-colors">
                  Войти как администратор →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── REGISTER ── */}
          {view === 'register' && (
            <motion.div key="register" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}}
              className="bg-white border border-black/8 shadow-sm">
              {/* Header */}
              <div className="p-5 border-b border-black/6 flex items-center gap-3">
                <button onClick={()=>setView('login')} className="text-ink4 hover:text-ink transition-colors">
                  <ChevronLeft size={18}/>
                </button>
                <div>
                  <div className="font-bebas text-xl text-ink tracking-wider">РЕГИСТРАЦИЯ</div>
                  <div className="text-[10px] text-ink4 font-inter">Создать аккаунт сотрудника</div>
                </div>
              </div>

              {/* Info banner */}
              <div className="mx-5 mt-4 bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
                <Clock size={13} className="text-amber-500 flex-shrink-0 mt-0.5"/>
                <p className="text-[11px] text-amber-700 leading-relaxed font-inter">
                  После регистрации ваш аккаунт будет ожидать подтверждения администратора. Войти можно будет только после одобрения.
                </p>
              </div>

              <div className="p-5 space-y-4">
                {regError && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 text-[11px] font-semibold">
                    <AlertCircle size={13} className="flex-shrink-0 mt-0.5"/>{regError}
                  </div>
                )}

                {/* Full name */}
                <div>
                  <label className="block text-[10px] font-bold text-ink2 uppercase tracking-wide mb-1.5">
                    Полное имя <span className="text-red-400">*</span>
                  </label>
                  <input value={regForm.name}
                    onChange={e=>setRegForm(p=>({...p,name:e.target.value}))}
                    placeholder="Иванов Иван Иванович"/>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-[10px] font-bold text-ink2 uppercase tracking-wide mb-1.5">
                    Отдел <span className="text-red-400">*</span>
                  </label>
                  <select value={regForm.dept} onChange={e=>setRegForm(p=>({...p,dept:e.target.value}))}>
                    <option value="">— Выберите отдел —</option>
                    {dept.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-[10px] font-bold text-ink2 uppercase tracking-wide mb-1.5">
                    Должность
                  </label>
                  <input value={regForm.role}
                    onChange={e=>setRegForm(p=>({...p,role:e.target.value}))}
                    placeholder="Например: Бухгалтер, Специалист..."/>
                </div>

                {/* Login */}
                <div>
                  <label className="block text-[10px] font-bold text-ink2 uppercase tracking-wide mb-1.5">
                    Логин <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink4"/>
                    <input value={regForm.login}
                      onChange={e=>setRegForm(p=>({...p,login:e.target.value.toLowerCase().replace(/\s/g,'')}))}
                      placeholder="my_login" className="!pl-9"/>
                  </div>
                  <div className="text-[9px] text-ink4 mt-1 font-inter">Только латиница и цифры, без пробелов</div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[10px] font-bold text-ink2 uppercase tracking-wide mb-1.5">
                    Пароль <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink4"/>
                    <input type={regShowPass ? 'text' : 'password'} value={regForm.pass}
                      onChange={e=>setRegForm(p=>({...p,pass:e.target.value}))}
                      placeholder="Минимум 4 символа" className="!pl-9 !pr-9"/>
                    <button onClick={()=>setRegShowPass(p=>!p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink4 hover:text-ink">
                      {regShowPass ? <EyeOff size={13}/> : <Eye size={13}/>}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-[10px] font-bold text-ink2 uppercase tracking-wide mb-1.5">
                    Подтвердите пароль <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink4"/>
                    <input type={regShowPass ? 'text' : 'password'} value={regForm.confirmPass}
                      onChange={e=>setRegForm(p=>({...p,confirmPass:e.target.value}))}
                      placeholder="Повторите пароль" className="!pl-9"
                      onKeyDown={e=>e.key==='Enter'&&handleRegister()}/>
                  </div>
                  {regForm.confirmPass && regForm.pass !== regForm.confirmPass && (
                    <div className="text-[10px] text-red-500 mt-1 font-inter">Пароли не совпадают</div>
                  )}
                  {regForm.confirmPass && regForm.pass === regForm.confirmPass && regForm.pass.length >= 4 && (
                    <div className="text-[10px] text-green-500 mt-1 font-inter flex items-center gap-1"><CheckCircle size={10}/> Пароли совпадают</div>
                  )}
                </div>

                <motion.button whileHover={{y:-1}} whileTap={{scale:.98}} onClick={handleRegister}
                  className="w-full bg-primary hover:bg-red-700 text-white py-3 text-[12px] font-bold uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-primary/30">
                  Отправить заявку на регистрацию
                </motion.button>

                <button onClick={()=>setView('login')}
                  className="w-full text-center text-[11px] text-ink4 hover:text-primary transition-colors">
                  ← Назад ко входу
                </button>
              </div>
            </motion.div>
          )}

          {/* ── SUCCESS ── */}
          {view === 'success' && (
            <motion.div key="success" initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}}
              className="bg-white border border-black/8 p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500"/>
              </div>
              <div className="font-bebas text-2xl text-ink tracking-wider mb-2">ЗАЯВКА ОТПРАВЛЕНА!</div>
              <p className="text-[13px] text-ink3 font-inter leading-relaxed mb-6">
                Ваша заявка на регистрацию принята. Администратор рассмотрит её и одобрит или отклонит доступ.
                <br/><br/>
                После одобрения вы сможете войти с вашим логином и паролем.
              </p>
              <div className="bg-amber-50 border border-amber-200 p-3 mb-6 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={13} className="text-amber-500"/>
                  <span className="text-[11px] font-bold text-amber-700">Статус: Ожидает подтверждения</span>
                </div>
                <div className="text-[11px] text-amber-600 font-inter">Обратитесь к главному администратору для ускорения процесса.</div>
              </div>
              <button onClick={()=>{ setView('login'); setRegForm({name:'',login:'',pass:'',confirmPass:'',dept:'',role:''}) }}
                className="w-full bg-primary hover:bg-red-700 text-white py-3 text-[12px] font-bold uppercase tracking-wider transition-all">
                Перейти ко входу
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  )
}
