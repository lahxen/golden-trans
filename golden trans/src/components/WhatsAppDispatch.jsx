import { useState } from 'react'
import './WhatsAppDispatch.css'

function WhatsAppDispatch({ booking, route }) {
  const [copied, setCopied] = useState(false)

  const vehicleLabel = {
    sedan:   'Sedan',
    vclass:  'Mercedes V-Class',
    tourneo: 'Ford Tourneo',
    coach:   'Luxury Coach Bus',
  }[booking.vehicle] || booking.vehicle

  const date = booking.pickupDate
    ? new Date(booking.pickupDate + 'T00:00:00').toLocaleDateString('en-GB', {
        day: '2-digit', month: '2-digit', year: '2-digit',
      })
    : '—'

  const time   = booking.pickupTime || '—'
  const flight = booking.flightNumber?.trim().toUpperCase() || 'N/A'
  const routeLabel = route?.label || '—'

  const message = [
    '🟡 *GOLDEN TRANS — NEW BOOKING*',
    '━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    `🚐 Vehicle: ${vehicleLabel} (${booking.passengers} pax)`,
    `📅 Date: ${date} at *${time}*`,
    `✈️ Flight: ${flight} | Tracking Active 🛰️`,
    `🗺️ Route: ${routeLabel}`,
    `👤 Guest: ${booking.name}`,
    `💬 Language Required: *${booking.language}*`,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━',
    '⚠️ Flight is currently being tracked.',
    'If delayed, you will receive an automatic update.',
    '',
    '✅ Please confirm vehicle + driver availability',
    'within *15 minutes*.',
    '',
    'Reply: *CONFIRMED [Driver Name] [Plate #]*',
    '━━━━━━━━━━━━━━━━━━━━━━━━━',
  ].join('\n')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="dispatch-panel">
      <div className="dispatch-header">
        <h3>📤 Partner Dispatch</h3>
        <p>Send this message to your vehicle partner to secure the vehicle quickly.</p>
      </div>
      <pre className="dispatch-message">{message}</pre>
      <div className="dispatch-actions">
        <button className="btn btn-secondary" type="button" onClick={handleCopy}>
          {copied ? '✅ Copied!' : '📋 Copy Message'}
        </button>
        <button className="btn btn-primary" type="button" onClick={handleWhatsApp}>
          💬 Open WhatsApp
        </button>
      </div>
    </div>
  )
}

export default WhatsAppDispatch
