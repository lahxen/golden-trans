import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Fleet from './pages/Fleet.jsx'
import Booking from './pages/Booking.jsx'
import Admin from './pages/Admin.jsx'
import WhatsAppButton from './components/WhatsAppButton.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<App />} />
        <Route path="/fleet"   element={<Fleet />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/admin"   element={<Admin />} />
      </Routes>
      <WhatsAppButton />
    </BrowserRouter>
  </React.StrictMode>,
)
