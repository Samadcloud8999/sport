import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Upload, CheckCircle, X, Image } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { SectionLabel, SectionTitle, FormGroup, PageWrapper, RedBtn } from '../components/ui/index'

const SPORTS = ['Борьба','Бокс','Лёгкая атлетика','Плавание','Дзюдо','Гимнастика','Стрельба','Велоспорт','Тяжёлая атлетика','Таэквондо']
const RANKS  = ['2 разряд','1 разряд','КМС','МС','МСМК']

export default function ApplyPage() {
  const { tr, data, addItem } = useApp()
  const T = tr.apply
  const [form, setForm] = useState({ name:'', dob:'', region:'', sport:'', event:'', rank:'', coach:'', phone:'', email:'', note:'' })
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef()

  const set = (k, v) => { setForm(p => ({...p,[k]:v})); setErrors(p => ({...p,[k]:''})) }

  const handlePhoto = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = e => setPhotoPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Укажите полное имя'
    if (!form.region) e.region = 'Выберите регион'
    if (!form.sport) e.sport = 'Выберите вид спорта'
    if (!form.event) e.event = 'Выберите соревнование'
    if (!form.phone.trim()) e.phone = 'Укажите телефон'
    return e
  }

  const submit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    addItem('applications', { ...form, photo: photoPreview || null, date: new Date().toISOString().split('T')[0], status: 'pending' })
    setSubmitted(true)
  }

  const reset = () => {
    setForm({ name:'',dob:'',region:'',sport:'',event:'',rank:'',coach:'',phone:'',email:'',note:'' })
    setPhotoPreview(null); setPhotoFile(null); setErrors({}); setSubmitted(false)
  }

  if (submitted) return (
    <div className="min-h-screen bg-surf2 flex items-center justify-center pt-20 px-4">
      <motion.div initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }}
        className="bg-white border border-black/8 p-10 max-w-md w-full text-center shadow-sm">
        <div className="w-16 h-16 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <div className="font-bebas text-4xl text-ink tracking-wider mb-2">{T.success}</div>
        <p className="text-ink3 text-[13px] font-inter leading-relaxed mb-6">{T.successSub}</p>
        <button onClick={reset} className="border border-black/12 hover:border-primary text-ink3 hover:text-primary px-6 py-2.5 text-[11px] font-bold uppercase tracking-wide transition-all">
          Подать ещё одну заявку
        </button>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-surf2 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
          <div className="text-center mb-8">
            <SectionLabel center>{T.title}</SectionLabel>
            <SectionTitle>{T.title.toUpperCase()} <span className="text-primary">НА УЧАСТИЕ</span></SectionTitle>
            <p className="text-ink4 text-[12px] mt-1">{T.sub}</p>
          </div>

          <div className="bg-white border border-black/8 shadow-sm">
            {/* Photo upload */}
            <div className="p-6 border-b border-black/6">
              <div className="text-[11px] font-bold text-ink2 uppercase tracking-wide mb-3">{T.photo}</div>
              <div className="flex items-start gap-4">
                {photoPreview ? (
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <img src={photoPreview} alt="Фото" className="w-24 h-24 object-cover border border-black/10" />
                    <button onClick={() => { setPhotoPreview(null); setPhotoFile(null) }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center hover:bg-pd transition-colors">
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`drop-zone w-24 h-24 flex-shrink-0 flex flex-col items-center justify-center gap-1 ${dragging ? 'active' : ''}`}
                    onDragOver={e => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); handlePhoto(e.dataTransfer.files[0]) }}
                    onClick={() => fileRef.current?.click()}>
                    <Image size={20} className="text-ink4" />
                    <span className="text-[9px] text-ink4 text-center leading-tight">Нажмите или перетащите</span>
                  </div>
                )}
                <div className="text-[11px] text-ink4 font-inter leading-relaxed pt-1">
                  Загрузите фото спортсмена (JPG, PNG).<br/>Размер не более 5 МБ.
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handlePhoto(e.target.files[0])} />
              </div>
            </div>

            {/* Form fields */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <FormGroup label={T.name} required error={errors.name}>
                  <input type="text" value={form.name} onChange={e=>set('name',e.target.value)}
                    placeholder="Иванов Иван Иванович" autoComplete="name" />
                </FormGroup>
                <FormGroup label={T.dob}>
                  <input type="date" value={form.dob} onChange={e=>set('dob',e.target.value)} />
                </FormGroup>
                <FormGroup label={T.region} required error={errors.region}>
                  <select value={form.region} onChange={e=>set('region',e.target.value)}>
                    <option value="">— Выберите регион —</option>
                    {data.regions.map(r => <option key={r.id}>{r.name}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label={T.sport} required error={errors.sport}>
                  <select value={form.sport} onChange={e=>set('sport',e.target.value)}>
                    <option value="">— Выберите вид спорта —</option>
                    {SPORTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label={T.event} required error={errors.event}>
                  <select value={form.event} onChange={e=>set('event',e.target.value)}>
                    <option value="">— Выберите соревнование —</option>
                    {data.events.map(e => <option key={e.id}>{e.title}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label={T.rank}>
                  <select value={form.rank} onChange={e=>set('rank',e.target.value)}>
                    <option value="">— Выберите разряд —</option>
                    {RANKS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label={T.coach}>
                  <input type="text" value={form.coach} onChange={e=>set('coach',e.target.value)} placeholder="Имя тренера" />
                </FormGroup>
                <FormGroup label={T.phone} required error={errors.phone}>
                  <input type="tel" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+996 700 000 000" autoComplete="tel" />
                </FormGroup>
                <div className="md:col-span-2">
                  <FormGroup label={T.email}>
                    <input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="example@mail.com" autoComplete="email" />
                  </FormGroup>
                </div>
                <div className="md:col-span-2">
                  <FormGroup label={T.note}>
                    <textarea value={form.note} onChange={e=>set('note',e.target.value)} rows={3} placeholder="Укажите дополнительные сведения..." />
                  </FormGroup>
                </div>
              </div>

              <motion.button whileHover={{ y:-1 }} whileTap={{ scale:.99 }} onClick={submit}
                className="w-full mt-6 bg-primary hover:bg-pd text-white py-3.5 text-[13px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/30">
                <Send size={15} /> {T.submit}
              </motion.button>
              <p className="text-ink4 text-[10px] text-center mt-3 font-inter">
                Нажимая кнопку, вы соглашаетесь с обработкой персональных данных согласно законодательству КР
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
