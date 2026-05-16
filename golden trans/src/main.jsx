import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LangProvider } from './i18n/context.jsx'
import App from './App.jsx'
import Fleet from './pages/Fleet.jsx'
import Booking from './pages/Booking.jsx'
import Admin from './pages/Admin.jsx'
import CityPage from './pages/CityPage.jsx'
import NotFound from './pages/NotFound.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LangProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"        element={<App />} />
          <Route path="/fleet"   element={<Fleet />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/admin"   element={<Admin />} />
          <Route path="/cities/:slug" element={<CityPage />} />
          <Route path="*"        element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </LangProvider>
  </React.StrictMode>,
)
