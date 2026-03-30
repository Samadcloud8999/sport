/**
 * FaceScanner — reusable camera + face-api component
 * Props:
 *   mode: 'register' | 'identify'
 *   staffId: string (required for register)
 *   onRegisterSuccess(staffId)
 *   onIdentifySuccess({ staffId, distance })
 *   onError(message)
 *   onClose()
 */
import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Camera, CheckCircle, AlertCircle, Loader, RefreshCw, MapPin, ExternalLink } from 'lucide-react'
import {
  loadFaceApi,
  registerFace,
  identifyFace,
  getCurrentLocation,
  formatCoords,
  getMapsLink,
} from '../../utils/faceRecognition'

// Status types
const S = {
  LOADING_API:  'loading_api',
  STARTING_CAM: 'starting_cam',
  READY:        'ready',
  SCANNING:     'scanning',
  SUCCESS:      'success',
  ERROR:        'error',
}

export default function FaceScanner({ mode, staffId, onRegisterSuccess, onIdentifySuccess, onError, onClose, staffUsers }) {
  const videoRef   = useRef(null)
  const streamRef  = useRef(null)
  const intervalRef = useRef(null)

  const [status, setStatus]         = useState(S.LOADING_API)
  const [statusMsg, setStatusMsg]   = useState('Загружаем модели распознавания лиц...')
  const [detected, setDetected]     = useState(false)   // face box visible
  const [result, setResult]         = useState(null)    // { staffId, distance } or 'registered'
  const [location, setLocation]     = useState(null)
  const [locError, setLocError]     = useState(null)
  const [loadProgress, setProgress] = useState(0)

  // Progress animation during model load
  useEffect(() => {
    const t = setInterval(() => setProgress(p => Math.min(p + 8, 90)), 400)
    return () => clearInterval(t)
  }, [])

  // Boot: load face-api then start camera
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setStatus(S.LOADING_API)
        setStatusMsg('Загружаем модели распознавания лиц...')
        await loadFaceApi()
        if (!mounted) return
        setProgress(100)
        setStatus(S.STARTING_CAM)
        setStatusMsg('Запрашиваем доступ к камере...')
        await startCamera()
      } catch (e) {
        if (!mounted) return
        setStatus(S.ERROR)
        setStatusMsg(e.message || 'Ошибка инициализации')
      }
    })()
    return () => { mounted = false; stopAll() }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setStatus(S.READY)
      setStatusMsg(mode === 'register' ? 'Смотрите в камеру и нажмите «Сканировать»' : 'Смотрите в камеру — идёт распознавание...')

      // Auto-scan in identify mode
      if (mode === 'identify') startAutoScan()
    } catch (e) {
      setStatus(S.ERROR)
      setStatusMsg('Камера недоступна. Разрешите доступ к камере в браузере.')
    }
  }

  const stopAll = () => {
    clearInterval(intervalRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  // Auto-scan loop for identify mode
  const startAutoScan = () => {
    let attempts = 0
    intervalRef.current = setInterval(async () => {
      if (status === S.SCANNING || status === S.SUCCESS) return
      attempts++
      try {
        const video = videoRef.current
        if (!video || video.readyState < 2) return
        const fa = window.faceapi
        const opt = new fa.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 })
        const det = await fa.detectSingleFace(video, opt)
        setDetected(!!det)
        if (det && attempts % 3 === 0) {
          clearInterval(intervalRef.current)
          await doIdentify()
        }
      } catch (_) {}
    }, 600)
  }

  const doRegister = async () => {
    setStatus(S.SCANNING)
    setStatusMsg('Сканируем лицо...')
    try {
      await registerFace(staffId, videoRef.current)
      setStatus(S.SUCCESS)
      setStatusMsg('Лицо успешно зарегистрировано!')
      setResult('registered')
      stopAll()
      await fetchLocation()
      onRegisterSuccess?.(staffId)
    } catch (e) {
      setStatus(S.READY)
      setStatusMsg(e.message || 'Не удалось распознать лицо')
    }
  }

  const doIdentify = async () => {
    setStatus(S.SCANNING)
    setStatusMsg('Идентификация...')
    try {
      const match = await identifyFace(videoRef.current)
      if (!match) {
        setStatus(S.ERROR)
        setStatusMsg('Лицо не распознано. Вы не зарегистрированы в системе.')
        onError?.('Лицо не распознано')
        return
      }
      setResult(match)
      setStatus(S.SUCCESS)
      const confidence = Math.round((1 - match.distance) * 100)
      setStatusMsg(`Идентификация успешна! Точность: ${confidence}%`)
      stopAll()
      await fetchLocation()
      onIdentifySuccess?.(match)
    } catch (e) {
      setStatus(S.ERROR)
      setStatusMsg(e.message || 'Ошибка распознавания')
    }
  }

  const fetchLocation = async () => {
    try {
      const loc = await getCurrentLocation()
      setLocation(loc)
    } catch (e) {
      setLocError(e.message)
    }
  }

  const retry = () => {
    setStatus(S.STARTING_CAM)
    setStatusMsg('Перезапуск камеры...')
    setDetected(false)
    setResult(null)
    setLocation(null)
    setLocError(null)
    startCamera()
  }

  // Get identified user info
  const identifiedUser = result?.staffId
    ? staffUsers?.find(u => u.id === result.staffId)
    : null

  const isLoading = status === S.LOADING_API || status === S.STARTING_CAM || status === S.SCANNING
  const isSuccess = status === S.SUCCESS
  const isError   = status === S.ERROR

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose?.()}>
      <div className="bg-white max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-black/8 bg-ink text-white">
          <div className="flex items-center gap-2">
            <Camera size={16} />
            <div>
              <div className="font-bebas text-lg tracking-wider">
                {mode === 'register' ? 'Регистрация лица' : 'Идентификация по лицу'}
              </div>
              <div className="text-[10px] text-white/50">ЦПМС КР · Биометрическая система</div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Camera area */}
        <div className="relative bg-black" style={{ aspectRatio: '4/3' }}>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            style={{ transform: 'scaleX(-1)', display: isSuccess ? 'none' : 'block' }}
          />

          {/* Loading overlay */}
          {(status === S.LOADING_API || status === S.STARTING_CAM) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white">
              <Loader size={32} className="animate-spin mb-4 text-primary" />
              <div className="text-[13px] font-semibold mb-3">{statusMsg}</div>
              {status === S.LOADING_API && (
                <div className="w-48 h-1 bg-white/10 overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-300" style={{ width: `${loadProgress}%` }} />
                </div>
              )}
            </div>
          )}

          {/* Face detection frame */}
          {status === S.READY && (
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none`}>
              <div className={`w-48 h-56 border-2 transition-colors duration-300 ${detected ? 'border-green-400' : 'border-white/40'}`}
                style={{ borderRadius: '50% 50% 45% 45%' }}>
                {detected && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full bg-green-500 text-white text-[9px] px-2 py-0.5 font-bold whitespace-nowrap">
                    ЛИЦО ОБНАРУЖЕНО
                  </div>
                )}
              </div>
              {/* Corner guides */}
              {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-4 h-4 border-white/60`}
                  style={{
                    borderTop: i < 2 ? '2px solid' : 'none',
                    borderBottom: i >= 2 ? '2px solid' : 'none',
                    borderLeft: i % 2 === 0 ? '2px solid' : 'none',
                    borderRight: i % 2 === 1 ? '2px solid' : 'none',
                  }} />
              ))}
            </div>
          )}

          {/* Scanning animation */}
          {status === S.SCANNING && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
              <div className="w-48 h-1 bg-primary/30 overflow-hidden mb-4">
                <div className="h-full bg-primary animate-pulse" style={{ width: '100%' }} />
              </div>
              <div className="text-white text-[13px] font-semibold">Сканирование...</div>
            </div>
          )}

          {/* Success overlay */}
          {isSuccess && (
            <div className="bg-surf2 h-full flex flex-col items-center justify-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={36} className="text-green-500" />
              </div>
              {mode === 'register' ? (
                <div className="text-center">
                  <div className="font-bebas text-2xl text-ink tracking-wide mb-1">Лицо зарегистрировано!</div>
                  <div className="text-[12px] text-ink4 font-inter">Сотрудник может входить по распознаванию лица</div>
                </div>
              ) : identifiedUser ? (
                <div className="text-center w-full">
                  <div className="text-[11px] text-green-600 font-bold uppercase tracking-widest mb-2">Идентификация успешна</div>
                  <img src={identifiedUser.avatar} alt={identifiedUser.name}
                    className="w-14 h-14 rounded-full mx-auto mb-2 border-2 border-green-300 object-cover"
                    onError={e => { e.target.style.background = '#f0f0f0' }} />
                  <div className="font-bebas text-2xl text-ink tracking-wide">{identifiedUser.name}</div>
                  <div className="text-[12px] text-ink4">{identifiedUser.role}</div>
                  <div className="mt-2 text-[11px] text-green-600 font-bold">
                    Точность: {Math.round((1 - result.distance) * 100)}%
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="font-bebas text-xl text-ink">{statusMsg}</div>
                </div>
              )}

              {/* Location */}
              <div className="mt-4 w-full max-w-sm">
                {location ? (
                  <div className="bg-blue-50 border border-blue-200 p-3 flex items-start gap-2">
                    <MapPin size={13} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wide mb-0.5">Местоположение</div>
                      <div className="text-[11px] text-blue-600 font-inter font-mono">{formatCoords(location.lat, location.lon)}</div>
                      <div className="text-[10px] text-blue-500 font-inter">Точность: ±{location.accuracy}м</div>
                    </div>
                    <a href={getMapsLink(location.lat, location.lon)} target="_blank" rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 flex-shrink-0">
                      <ExternalLink size={13} />
                    </a>
                  </div>
                ) : locError ? (
                  <div className="bg-amber-50 border border-amber-200 p-2 text-[11px] text-amber-700 flex items-center gap-1.5">
                    <MapPin size={11} /> {locError}
                  </div>
                ) : (
                  <div className="bg-surf2 border border-black/8 p-2 text-[11px] text-ink4 flex items-center gap-1.5">
                    <Loader size={11} className="animate-spin" /> Определяем местоположение...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error overlay */}
          {isError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-6">
              <AlertCircle size={36} className="text-red-400 mb-3" />
              <div className="text-[13px] font-semibold text-center mb-1">{statusMsg}</div>
              <div className="text-[11px] text-white/50 font-inter text-center">Убедитесь, что смотрите прямо в камеру при хорошем освещении</div>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className={`px-4 py-2 text-[11px] font-semibold flex items-center gap-2 ${
          isSuccess ? 'bg-green-50 text-green-700' :
          isError   ? 'bg-red-50 text-red-600' :
          'bg-surf2 text-ink3'
        }`}>
          {isLoading && <Loader size={12} className="animate-spin flex-shrink-0" />}
          {isSuccess  && <CheckCircle size={12} className="flex-shrink-0" />}
          {isError    && <AlertCircle size={12} className="flex-shrink-0" />}
          {!isSuccess && !isError && !isLoading && <div className={`w-2 h-2 rounded-full flex-shrink-0 ${detected ? 'bg-green-400' : 'bg-amber-400'}`} />}
          <span className="flex-1 font-inter">{statusMsg}</span>
        </div>

        {/* Actions */}
        <div className="p-4 flex gap-2 border-t border-black/6">
          {mode === 'register' && status === S.READY && (
            <button onClick={doRegister}
              className="flex-1 bg-primary hover:bg-red-700 text-white py-3 text-[12px] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2">
              <Camera size={14} /> Сканировать и сохранить
            </button>
          )}
          {mode === 'identify' && isError && (
            <button onClick={retry}
              className="flex-1 bg-primary hover:bg-red-700 text-white py-3 text-[12px] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2">
              <RefreshCw size={14} /> Попробовать снова
            </button>
          )}
          {isSuccess && (
            <button onClick={onClose}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 text-[12px] font-bold uppercase tracking-wide transition-all">
              Готово
            </button>
          )}
          <button onClick={onClose}
            className="px-5 border border-black/12 text-ink3 text-[12px] font-semibold hover:border-primary hover:text-primary transition-all">
            {isSuccess ? 'Закрыть' : 'Отмена'}
          </button>
        </div>
      </div>
    </div>
  )
}
