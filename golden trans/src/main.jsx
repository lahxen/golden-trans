import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Fleet from './pages/Fleet.jsx'
import Booking from './pages/Booking.jsx'
import Admin from './pages/Admin.jsx'
import CityPage from './pages/CityPage.jsx'
import WhatsAppButton from './components/WhatsAppButton.jsx'
import { LangProvider, useTranslation } from './i18n/context.jsx'
import './index.css'

function AppRoot() {
  const { dir } = useTranslation()
  return (
    <div dir={dir}>
      <Routes>
        <Route path="/"        element={<App />} />
        <Route path="/fleet"   element={<Fleet />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/admin"   element={<Admin />} />
        <Route path="/city/:slug" element={<CityPage />} />
      </Routes>
      <WhatsAppButton />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LangProvider>
        <AppRoot />
      </LangProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
