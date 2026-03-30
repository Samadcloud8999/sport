import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { School, Users, UserCheck, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { SectionLabel, SectionTitle } from '../ui/index'
import * as THREE from 'three'

function GlobeCanvas({ regions, onRegionClick }) {
  const canvasRef = useRef()
  const sceneRef = useRef({})

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const W = canvas.offsetWidth || 500, H = 440
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x0a0a0a, 1)
    renderer.shadowMap.enabled = true

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100)
    camera.position.set(0, 0, 3.4)

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const dl = new THREE.DirectionalLight(0xffffff, 1); dl.position.set(5,3,5); scene.add(dl)
    const dl2 = new THREE.DirectionalLight(0xff2200, 0.25); dl2.position.set(-4,-2,-4); scene.add(dl2)
    const pl = new THREE.PointLight(0xCC0000, 0.4, 5); pl.position.set(-2,2,2); scene.add(pl)

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({ color: 0x111111, emissive: 0x060606, specular: 0x333333, shininess: 40 })
    )
    scene.add(globe)

    const gridMat = new THREE.MeshBasicMaterial({ color: 0x1a1a1a, wireframe: true, transparent: true, opacity: 0.1 })
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.003, 28, 28), gridMat))

    const atmMat = new THREE.MeshPhongMaterial({ color: 0xCC0000, transparent: true, opacity: 0.06, side: THREE.BackSide })
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.09, 32, 32), atmMat))

    const sv = new Float32Array(2400)
    for (let i = 0; i < 2400; i++) sv[i] = (Math.random() - 0.5) * 80
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sv, 3))
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0x333333, size: 0.05 })))

    const ll2v = (lat, lon, r = 1.02) => {
      const phi = (90 - lat) * Math.PI / 180
      const theta = (lon + 180) * Math.PI / 180
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      )
    }

    const markers = []
    regions.forEach((r, ri) => {
      const pos = ll2v(r.lat, r.lon)
      const sz = 0.013 + r.athletes / 680 * 0.019
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(sz, 14, 14),
        new THREE.MeshBasicMaterial({ color: 0xCC0000 })
      )
      mesh.position.copy(pos)
      mesh.userData = r
      scene.add(mesh)
      markers.push(mesh)

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(sz + 0.005, sz + 0.018, 20),
        new THREE.MeshBasicMaterial({ color: 0xCC0000, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
      )
      ring.position.copy(pos)
      ring.lookAt(0, 0, 0)
      ring.userData = { isRing: true, regionIdx: ri }
      scene.add(ring)

      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.003, 0.001, 0.08, 6),
        new THREE.MeshBasicMaterial({ color: 0xCC0000, transparent: true, opacity: 0.5 })
      )
      beam.position.copy(pos.clone().multiplyScalar(1.05))
      beam.lookAt(0, 0, 0)
      scene.add(beam)
    })

    let drag = false, prev = { x: 0, y: 0 }, vel = { x: 0, y: 0 }
    const ray = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    canvas.addEventListener('mousedown', e => { drag = true; prev = { x: e.clientX, y: e.clientY }; vel = { x: 0, y: 0 } })
    canvas.addEventListener('touchstart', e => { drag = true; prev = { x: e.touches[0].clientX, y: e.touches[0].clientY } }, { passive: true })
    window.addEventListener('mouseup', () => drag = false)
    window.addEventListener('touchend', () => drag = false)
    canvas.addEventListener('mousemove', e => {
      if (drag) {
        const dx = (e.clientX - prev.x) * 0.005, dy = (e.clientY - prev.y) * 0.005
        scene.rotation.y += dx; scene.rotation.x += dy
        vel = { x: dx * 0.3, y: dy * 0.3 }
        prev = { x: e.clientX, y: e.clientY }
      }
    })
    canvas.addEventListener('touchmove', e => {
      if (drag) {
        const dx = (e.touches[0].clientX - prev.x) * 0.005, dy = (e.touches[0].clientY - prev.y) * 0.005
        scene.rotation.y += dx; scene.rotation.x += dy
        prev = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
      e.preventDefault()
    }, { passive: false })

    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      ray.setFromCamera(mouse, camera)
      const hits = ray.intersectObjects(markers)
      if (hits.length) {
        onRegionClick(hits[0].object.userData)
        hits[0].object.material.color.setHex(0xF5C518)
        setTimeout(() => hits[0].object.material.color.setHex(0xCC0000), 800)
      }
    })

    scene.rotation.y = -74.59 * Math.PI / 180
    scene.rotation.x = -42.87 * Math.PI / 180 * 0.2

    let t = 0
    const animate = () => {
      sceneRef.current.raf = requestAnimationFrame(animate)
      t += 0.016
      if (!drag) { scene.rotation.y += 0.003 + vel.x; vel.x *= 0.95 }
      markers.forEach((m, i) => m.scale.setScalar(1 + Math.sin(t * 2 + i) * 0.12))
      scene.children.filter(c => c.userData.isRing).forEach((r, i) => {
        r.scale.setScalar(1 + Math.sin(t * 3 + i * 0.6) * 0.28)
        r.material.opacity = 0.25 + Math.sin(t * 2.5 + i) * 0.15
      })
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const nW = canvas.offsetWidth
      renderer.setSize(nW, H)
      camera.aspect = nW / H
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(sceneRef.current.raf)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  return (
    <canvas ref={canvasRef} style={{ width:'100%', height:440, cursor:'grab', display:'block' }}
      className="border border-white/10" />
  )
}

export default function MapSection() {
  const { data, tr } = useApp()
  const [selected, setSelected] = useState(null)
  const totalAthletes = data.stats.athletes

  return (
    <section className="py-20 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <SectionLabel center light>{tr.sections.regions}</SectionLabel>
          <SectionTitle light>РЕГИОНЫ <span className="text-primary">КЫРГЫЗСТАНА</span></SectionTitle>
          <p className="text-white/30 text-[12px] font-inter mt-2">Вращайте 3D глобус — нажмите на маркер региона</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <GlobeCanvas regions={data.regions} onRegionClick={setSelected} />

          <div>
            {selected ? (
              <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                className="bg-[#111] border border-white/10 p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="text-white/40 text-[10px] font-inter uppercase tracking-wider mb-1">Регион</div>
                    <div className="font-bebas text-4xl text-white tracking-wider">{selected.name}</div>
                    <div className="bg-primary text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-wide inline-block mt-2">Кыргызстан</div>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white transition-colors mt-1"><X size={16} /></button>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { icon: School,     val: selected.schools,  label: 'Школ',        color: 'text-primary' },
                    { icon: Users,      val: selected.athletes, label: 'Спортсменов', color: 'text-gold' },
                    { icon: UserCheck,  val: selected.coaches,  label: 'Тренеров',    color: 'text-white' },
                  ].map(s => {
                    const Icon = s.icon
                    return (
                      <div key={s.label} className="bg-[#1a1a1a] border border-white/8 p-4 text-center">
                        <Icon size={16} className={`${s.color} mx-auto mb-2`} />
                        <div className={`font-bebas text-2xl ${s.color}`}>{s.val}</div>
                        <div className="text-white/30 text-[9px] font-inter mt-1">{s.label}</div>
                      </div>
                    )
                  })}
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-white/40 font-inter">Доля спортсменов</span>
                    <span className="text-primary font-bold">{Math.round(selected.athletes/totalAthletes*100)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 overflow-hidden">
                    <motion.div initial={{ width:0 }} animate={{ width:`${Math.round(selected.athletes/totalAthletes*100)}%` }}
                      transition={{ duration:.8, ease:'easeOut' }} className="h-full bg-primary" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <div>
                <div className="text-white/40 text-[12px] font-inter mb-4">Нажмите на маркер для статистики</div>
                <div className="space-y-2">
                  {data.regions.map(r => (
                    <button key={r.id} onClick={() => setSelected(r)}
                      className="w-full flex items-center justify-between p-3 bg-[#111] border border-white/6 hover:border-primary/40 hover:bg-primary/5 transition-all text-left">
                      <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                        <span className="text-white/60 hover:text-white text-[12px] font-mont transition-colors">{r.name}</span>
                      </div>
                      <div className="flex gap-4 text-[10px] font-inter">
                        <span className="text-white/25">{r.athletes} сп.</span>
                        <span className="text-gold/50">{r.coaches} тр.</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
