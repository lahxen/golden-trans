import { Link } from 'react-router-dom'
import { calculatePrice } from '../services/bookingService'
import { useTranslation } from '../i18n/context.jsx'
import { CheckCircle, Clock } from 'lucide-react'

function Row({ label, value }) {
  return (
    <tr className="border-b border-gray-800">
      <td className="py-3 pr-4 text-gray-500 text-sm whitespace-nowrap w-1/3">{label}</td>
      <td className="py-3 text-white text-sm font-semibold">{value}</td>
    </tr>
  )
}

function BookingSuccess({ booking }) {
  const { t } = useTranslation()

  const STATUS_CONFIG = {
    confirmed:     { label: t.success.confirmed,        color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' },
    pay_on_arrival:{ label: t.success.payOnArrivalLabel,   color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    pending:       { label: t.success.pending,          color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  }

  const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending
  const totalPrice = calculatePrice(booking.deal, booking.tripType)
  const isRound = booking.tripType === 'round_trip'

  function handleWhatsApp() {
    const msg = [
      `${t.success.whatsappMsg}`,
      `Reference: *${booking.ref}*`,
      ``,
      `👤 ${booking.name}`,
      `🗺️ ${booking.pickup} → ${booking.dropoff}`,
      `📅 ${booking.date} at ${booking.time}`,
      `🚐 ${booking.deal.type} (${booking.deal.category})`,
      `💰 ${totalPrice.toLocaleString()} MAD`,
      `${booking.paymentMethod === 'online' ? t.success.paidOnline : t.success.payOnArrival}`,
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
        <h2 className="text-white text-3xl font-black mb-2">{t.success.title}</h2>
        <p className="text-gray-400">
          {booking.paymentMethod === 'online'
            ? t.success.onlineMsg
            : t.success.arrivalMsg}
        </p>
      </div>

      {/* Reference number */}
      <div className="bg-gray-900 border border-gold-500/40 rounded-2xl p-6 mb-6">
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">{t.success.ref}</p>
        <p className="text-gold-400 text-4xl font-black tracking-wider mb-3">{booking.ref}</p>
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold ${status.bg} ${status.color}`}>
          {booking.paymentMethod === 'online' ? <CheckCircle size={16} /> : <Clock size={16} />} {status.label}
        </div>
      </div>

      {/* Trip summary */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 text-left">
        <p className="text-gold-500 text-xs font-black uppercase tracking-[0.2em] mb-4">{t.success.tripSummary}</p>
        <table className="w-full">
          <tbody>
            <Row label={t.success.name}       value={booking.name} />
            <Row label={t.success.phone}      value={booking.phone} />
            <Row label={t.success.pickup}     value={booking.pickup} />
            <Row label={t.success.dropoff}   value={booking.dropoff} />
            <Row label={t.success.dateTime} value={`${booking.date} at ${booking.time}`} />
            <Row label={t.success.tripType}  value={isRound ? t.success.roundTrip : t.success.oneWay} />
            <Row label={t.success.passengers} value={`${booking.passengers} ${parseInt(booking.passengers) > 1 ? t.success.passengers_plural : t.success.passenger}`} />
            <Row label={t.success.vehicle}    value={`${booking.deal.type} (${booking.deal.category})`} />
            <Row label={t.success.payment}    value={booking.paymentMethod === 'online' ? t.success.paidOnline : t.success.payOnArrival} />
            <tr>
              <td className="py-3 pr-4 text-gray-500 text-sm">{t.success.total}</td>
              <td className="py-3 text-gold-400 text-xl font-black">
                {totalPrice.toLocaleString()} {t.admin.mad}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* What's next */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 mb-8 text-left">
        <p className="text-white font-bold text-sm mb-3">{t.success.whatNext}</p>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-gold-500 font-bold flex-shrink-0">1.</span>
            {t.success.step1}
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold-500 font-bold flex-shrink-0">2.</span>
            {t.success.step2}
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold-500 font-bold flex-shrink-0">3.</span>
            {t.success.step3}
          </li>
          {booking.paymentMethod === 'on_arrival' && (
            <li className="flex items-start gap-2">
              <span className="text-gold-500 font-bold flex-shrink-0">4.</span>
              {t.success.step4}
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
          {t.success.shareWhatsApp}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors border border-gray-700"
        >
          {t.success.print}
        </button>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors border border-gray-700 no-underline"
        >
          {t.success.backHome}
        </Link>
      </div>
    </div>
  )
}

export default BookingSuccess
