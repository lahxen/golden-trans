import { useState } from 'react'
import { calculatePrice } from '../services/bookingService'
import { useTranslation } from '../i18n/context.jsx'
import { CreditCard, Car, Lock, Lightbulb } from 'lucide-react'

const INPUT = 'w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors text-sm font-mono'
const LABEL = 'block text-gray-300 text-xs font-bold mb-2 uppercase tracking-wider'

function formatCardNumber(v) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
}
function formatExpiry(v) {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d
}

function SummaryRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-800 last:border-0">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className={`text-sm font-semibold text-right max-w-[60%] ${highlight ? 'text-gold-400 text-base font-black' : 'text-white'}`}>
        {value}
      </span>
    </div>
  )
}

function BookingStepTwo({ tripData, selectedDeal, onConfirm, onBack }) {
  const { t } = useTranslation()
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' })
  const [cardErrors, setCardErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)

  const totalPrice = calculatePrice(selectedDeal, tripData.tripType)
  const isRound = tripData.tripType === 'round_trip'

  function validateCard() {
    const e = {}
    if (!card.name.trim()) e.name = t.errors.cardNameRequired
    if (card.number.replace(/\s/g, '').length < 16) e.number = t.errors.cardNumberInvalid
    if (card.expiry.length < 5) e.expiry = t.errors.expiryInvalid
    if (card.cvv.length < 3) e.cvv = t.errors.cvvInvalid
    return e
  }

  async function handleConfirm() {
    if (!paymentMethod) return

    if (paymentMethod === 'online') {
      const errs = validateCard()
      if (Object.keys(errs).length) { setCardErrors(errs); return }
      setCardErrors({})
    }

    setIsProcessing(true)
    await new Promise(r => setTimeout(r, 1500))
    setIsProcessing(false)
    onConfirm(paymentMethod)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* LEFT — Summary */}
      <div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-5">
          <p className="text-gold-500 text-xs font-black uppercase tracking-[0.2em] mb-4">
            {t.booking.summary}
          </p>
          <SummaryRow label={t.booking.customer}   value={tripData.name} />
          <SummaryRow label={t.booking.phone}      value={tripData.phone} />
          <SummaryRow label={t.booking.pickup}     value={tripData.pickup} />
          <SummaryRow label={t.booking.dropoff}   value={tripData.dropoff} />
          <SummaryRow label={t.booking.date}       value={`${tripData.date} at ${tripData.time}`} />
          <SummaryRow label={t.booking.tripType}  value={isRound ? t.vehicle.roundTrip : t.vehicle.oneWay} />
          <SummaryRow label={t.booking.passengers} value={`${tripData.passengers} ${parseInt(tripData.passengers) > 1 ? t.vehicle.passengers_plural : t.vehicle.passengers}`} />
          <SummaryRow label={t.booking.luggage}    value={`${tripData.luggage} ${parseInt(tripData.luggage) > 1 ? t.vehicle.luggage_plural : t.vehicle.luggage}`} />
          {tripData.specialRequest && (
            <SummaryRow label={t.booking.specialRequest} value={tripData.specialRequest} />
          )}
        </div>

        {/* Selected vehicle */}
        <div className="bg-gray-900 rounded-2xl border border-gold-500/30 p-5">
          <p className="text-gold-500 text-xs font-black uppercase tracking-[0.2em] mb-3">{t.booking.selectedVehicle}</p>
          <div className="flex items-center gap-4">
            <div className="w-16 h-12 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src={selectedDeal.image}
                alt={selectedDeal.type}
                className="w-full h-full object-cover"
                onError={e => { e.currentTarget.style.display = 'none' }}
              />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold">{selectedDeal.type}</p>
              <p className="text-gray-500 text-xs">{selectedDeal.category} · {selectedDeal.brands[0]}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
            <span className="text-gray-400 text-sm">{t.booking.totalPrice}</span>
            <span className="text-white text-2xl font-black">
              {totalPrice.toLocaleString()} <span className="text-gold-500 text-sm">{t.admin.mad}</span>
            </span>
          </div>
          <p className="text-gray-600 text-xs mt-1 text-right">{t.booking.priceConfirmed}</p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="mt-4 text-gray-500 hover:text-gray-300 text-sm font-semibold transition-colors flex items-center gap-1"
        >
          {t.booking.changeVehicle}
        </button>
      </div>

      {/* RIGHT — Payment */}
      <div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <p className="text-gold-500 text-xs font-black uppercase tracking-[0.2em] mb-5">
            {t.booking.paymentMethod}
          </p>

          {/* Payment options */}
          <div className="space-y-3 mb-6">
            {[
              {
                id: 'online',
                icon: <CreditCard size={24} />,
                title: t.booking.payOnline,
                sub: t.booking.payOnlineDesc,
              },
              {
                id: 'on_arrival',
                icon: <Car size={24} />,
                title: t.booking.payOnArrival,
                sub: t.booking.payOnArrivalDesc,
              },
            ].map(opt => (
              <label
                key={opt.id}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === opt.id
                    ? 'border-gold-500 bg-gold-500/10'
                    : 'border-gray-700 hover:border-gray-500'
                }`}
              >
                <input
                  type="radio" name="payment" value={opt.id}
                  className="sr-only"
                  checked={paymentMethod === opt.id}
                  onChange={() => setPaymentMethod(opt.id)}
                />
                <span className="flex-shrink-0 mt-0.5">{opt.icon}</span>
                <div>
                  <p className={`font-bold text-sm ${paymentMethod === opt.id ? 'text-gold-400' : 'text-white'}`}>
                    {opt.title}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">{opt.sub}</p>
                </div>
                <div className={`ml-auto flex-shrink-0 w-4 h-4 rounded-full border-2 mt-1 ${
                  paymentMethod === opt.id ? 'border-gold-500 bg-gold-500' : 'border-gray-600'
                }`} />
              </label>
            ))}
          </div>

          {/* Card form (online only) */}
          {paymentMethod === 'online' && (
            <div className="border-t border-gray-800 pt-5 space-y-4">
              <p className="text-gray-400 text-xs flex items-center gap-1.5">
                <Lock size={14} />
                {t.booking.securePayment}
              </p>

              {/* Card number */}
              <div>
                <label className={LABEL}>{t.booking.cardNumber}</label>
                <input
                  type="text" inputMode="numeric" className={INPUT}
                  placeholder={t.booking.cardPlaceholder}
                  value={card.number}
                  onChange={e => setCard(p => ({ ...p, number: formatCardNumber(e.target.value) }))}
                />
                {cardErrors.number && <p className="text-red-400 text-xs mt-1">{cardErrors.number}</p>}
              </div>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>{t.booking.expiry}</label>
                  <input
                    type="text" inputMode="numeric" className={INPUT}
                    placeholder={t.booking.expiryPlaceholder} maxLength={5}
                    value={card.expiry}
                    onChange={e => setCard(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                  />
                  {cardErrors.expiry && <p className="text-red-400 text-xs mt-1">{cardErrors.expiry}</p>}
                </div>
                <div>
                  <label className={LABEL}>{t.booking.cvv}</label>
                  <input
                    type="password" inputMode="numeric" className={INPUT}
                    placeholder={t.booking.cvvPlaceholder} maxLength={4}
                    value={card.cvv}
                    onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                  />
                  {cardErrors.cvv && <p className="text-red-400 text-xs mt-1">{cardErrors.cvv}</p>}
                </div>
              </div>

              {/* Name on card */}
              <div>
                <label className={LABEL}>{t.booking.cardName}</label>
                <input
                  type="text" className={`${INPUT} font-sans`}
                  placeholder={t.booking.cardNamePlaceholder}
                  value={card.name}
                  onChange={e => setCard(p => ({ ...p, name: e.target.value }))}
                />
                {cardErrors.name && <p className="text-red-400 text-xs mt-1">{cardErrors.name}</p>}
              </div>

              {/* Stripe note */}
              <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                <p className="text-gray-500 text-[0.68rem] leading-relaxed">
                  <Lightbulb size={14} className="inline-block mr-1" /> <strong className="text-gray-400">Developer note:</strong> This is a demo payment form.
                  To enable real payments, add your Stripe publishable key and integrate{' '}
                  <code className="text-gold-500">@stripe/react-stripe-js</code>.
                </p>
              </div>
            </div>
          )}

          {paymentMethod === 'on_arrival' && (
            <div className="border-t border-gray-800 pt-5">
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                <p className="text-orange-300 text-sm font-semibold mb-1">{t.booking.noPaymentRequired}</p>
                <p className="text-orange-300/70 text-xs">
                  {t.booking.noPaymentDesc}
                </p>
              </div>
            </div>
          )}

          {/* Confirm button */}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!paymentMethod || isProcessing}
            className={`mt-6 w-full py-4 rounded-2xl font-black text-base uppercase tracking-widest transition-all ${
              !paymentMethod
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : isProcessing
                  ? 'bg-gold-600 text-black cursor-wait'
                  : 'bg-gold-500 hover:bg-gold-400 active:bg-gold-600 text-black'
            }`}
          >
            {isProcessing
              ? t.booking.processing
              : paymentMethod === 'online'
                ? t.booking.payNow.replace('{total}', totalPrice.toLocaleString())
                : paymentMethod === 'on_arrival'
                  ? t.booking.confirmOnArrival
                  : t.booking.selectPayment}
          </button>
        </div>
      </div>

    </div>
  )
}

export default BookingStepTwo
