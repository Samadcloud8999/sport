import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useApp } from './context/AppContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import ApplyPage from './pages/ApplyPage'
import AdminPage from './pages/AdminPage'
import ScoringPage from './pages/ScoringPage'
import StaffPortalPage from './pages/StaffPortalPage'
import { AdminLoginPage, StaffLoginPage } from './pages/LoginPages'
import {
  AboutPage, EventsPage, NewsPage, AthletesPage,
  SportsPage, RegionsPage, ContactsPage, AthleteDetailPage
} from './pages/PublicPages'

const FULLSCREEN = ['/admin', '/staff', '/login', '/staff/login', '/scoring']

function Layout({ children }) {
  const loc = useLocation()
  const isFullscreen = FULLSCREEN.some(p => loc.pathname.startsWith(p))
  if (isFullscreen) return <>{children}</>
  return (
    <>
      <Header/>
      <main className="pt-0">{children}</main>
      <Footer/>
    </>
  )
}

export default function App() {
  const loc = useLocation()
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={loc} key={loc.pathname}>
          <Route path="/"              element={<HomePage/>}/>
          <Route path="/about"         element={<AboutPage/>}/>
          <Route path="/sports"        element={<SportsPage/>}/>
          <Route path="/athletes"      element={<AthletesPage/>}/>
          <Route path="/athletes/:id"  element={<AthleteDetailPage/>}/>
          <Route path="/events"        element={<EventsPage/>}/>
          <Route path="/news"          element={<NewsPage/>}/>
          <Route path="/regions"       element={<RegionsPage/>}/>
          <Route path="/contacts"      element={<ContactsPage/>}/>
          <Route path="/apply"         element={<ApplyPage/>}/>
          <Route path="/login"         element={<AdminLoginPage/>}/>
          <Route path="/admin"         element={<AdminPage/>}/>
          <Route path="/admin/*"       element={<AdminPage/>}/>
          <Route path="/scoring"       element={<ScoringPage/>}/>
          <Route path="/scoring/*"     element={<ScoringPage/>}/>
          <Route path="/staff/login"   element={<StaffLoginPage/>}/>
          <Route path="/staff"         element={<StaffPortalPage/>}/>
          <Route path="/staff/*"       element={<StaffPortalPage/>}/>
          <Route path="*"              element={<Navigate to="/" replace/>}/>
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}
