import { Link } from 'react-router-dom'
import { calculatePrice } from '../services/bookingService'

const STATUS_CONFIG = {
  confirmed:     { label: 'Confirmed',        color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' },
  pay_on_arrival:{ label: 'Pay on Arrival',   color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  pending:       { label: 'Pending',          color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
}

function Row({ label, value }) {
  return (
    <tr className="border-b border-gray-800">
      <td className="py-3 pr-4 text-gray-500 text-sm whitespace-nowrap w-1/3">{label}</td>
      <td className="py-3 text-white text-sm font-semibold">{value}</td>
    </tr>
  )
}

function BookingSuccess({ booking }) {
  const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending
  const totalPrice = calculatePrice(booking.deal, booking.tripType)
  const isRound = booking.tripType === 'round_trip'

  function handleWhatsApp() {
    const msg = [
      `✅ *GOLDEN TRANS — Booking Confirmed*`,
      `Reference: *${booking.ref}*`,
      ``,
      `👤 ${booking.name}`,
      `🗺️ ${booking.pickup} → ${booking.dropoff}`,
      `📅 ${booking.date} at ${booking.time}`,
      `🚐 ${booking.deal.type} (${booking.deal.category})`,
      `💰 ${totalPrice.toLocaleString()} MAD`,
      `💳 ${booking.paymentMethod === 'online' ? 'Paid Online' : 'Pay on Arrival'}`,
    ].join('\n')
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="max-w-2xl mx-auto text-center">

      {/* Success icon */}
      <div className="mb-8">
        <div className="w-20 h-20 rounded-full bg-gold-500/15 border-2 border-gold-500/40 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg className="w-10 h-10 text-gold-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-white text-3xl font-black mb-2">Booking Received!</h2>
        <p className="text-gray-400">
          {booking.paymentMethod === 'online'
            ? 'Your payment was processed and your transfer is confirmed.'
            : 'Your reservation is confirmed. Our team will contact you within 30 minutes.'}
        </p>
      </div>

      {/* Reference number */}
      <div className="bg-gray-900 border border-gold-500/40 rounded-2xl p-6 mb-6">
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Reservation Reference</p>
        <p className="text-gold-400 text-4xl font-black tracking-wider mb-3">{booking.ref}</p>
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold ${status.bg} ${status.color}`}>
          {booking.paymentMethod === 'online' ? '✅' : '⏳'} {status.label}
        </div>
      </div>

      {/* Trip summary */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 text-left">
        <p className="text-gold-500 text-xs font-black uppercase tracking-[0.2em] mb-4">Trip Summary</p>
        <table className="w-full">
          <tbody>
            <Row label="Name"       value={booking.name} />
            <Row label="Phone"      value={booking.phone} />
            <Row label="Pickup"     value={booking.pickup} />
            <Row label="Drop-off"   value={booking.dropoff} />
            <Row label="Date & Time" value={`${booking.date} at ${booking.time}`} />
            <Row label="Trip Type"  value={isRound ? 'Round Trip' : 'One Way'} />
            <Row label="Passengers" value={`${booking.passengers} passenger${booking.passengers > 1 ? 's' : ''}`} />
            <Row label="Vehicle"    value={`${booking.deal.type} (${booking.deal.category})`} />
            <Row label="Payment"    value={booking.paymentMethod === 'online' ? '💳 Paid online' : '🚗 Pay on arrival'} />
            <tr>
              <td className="py-3 pr-4 text-gray-500 text-sm">Total</td>
              <td className="py-3 text-gold-400 text-xl font-black">
                {totalPrice.toLocaleString()} MAD
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* What's next */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 mb-8 text-left">
        <p className="text-white font-bold text-sm mb-3">📋 What happens next?</p>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-gold-500 font-bold flex-shrink-0">1.</span>
            Our team reviews your booking and confirms within 30 minutes.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold-500 font-bold flex-shrink-0">2.</span>
            You receive your driver's name, vehicle plate, and WhatsApp contact.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold-500 font-bold flex-shrink-0">3.</span>
            Your driver will be at the pickup location on time with a name sign.
          </li>
          {booking.paymentMethod === 'on_arrival' && (
            <li className="flex items-start gap-2">
              <span className="text-gold-500 font-bold flex-shrink-0">4.</span>
              Payment accepted on arrival — cash or card.
            </li>
          )}
        </ul>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={handleWhatsApp}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-xl transition-colors"
        >
          <span>💬</span> Share via WhatsApp
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors border border-gray-700"
        >
          <span>🖨️</span> Print
        </button>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors border border-gray-700 no-underline"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}

export default BookingSuccess
