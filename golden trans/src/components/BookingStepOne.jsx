import { useState, useRef, useEffect } from 'react'
import { fleet } from '../data/fleet'
import DealCard from './DealCard'

const COUNTRIES = [
  'Morocco', 'Algeria', 'Tunisia', 'Egypt', 'Libya',
  'France', 'Spain', 'United Kingdom', 'Germany', 'Italy',
  'Netherlands', 'Belgium', 'Switzerland', 'Portugal', 'Sweden',
  'United States', 'Canada', 'Australia',
  'Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Jordan',
  'China', 'Japan', 'Other',
]

const INPUT = 'w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors text-sm'
const LABEL = 'block text-gray-300 text-xs font-bold mb-2 uppercase tracking-wider'
const ERROR = 'text-red-400 text-xs mt-1'

const today = new Date().toISOString().split('T')[0]

function getBestFitId(passengers, luggage) {
  const p = parseInt(passengers) || 1
  const l = parseInt(luggage) || 0
  const fit = fleet.find(v => v.maxPassengers >= p && v.maxLuggage >= l)
  return fit?.id ?? fleet[fleet.length - 1].id
}

function BookingStepOne({ onSelectDeal }) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', country: 'Morocco',
    pickup: '', dropoff: '',
    date: '', time: '',
    passengers: '2', luggage: '2',
    tripType: 'one_way',
    specialRequest: '',
  })
  const [errors, setErrors] = useState({})
  const [showDeals, setShowDeals] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)
  const dealsRef = useRef(null)

  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }))

  useEffect(() => {
    if (showDeals && dealsRef.current) {
      dealsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [showDeals])

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 8) e.phone = 'Valid phone number required'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format'
    if (!form.pickup.trim()) e.pickup = 'Pickup location is required'
    if (!form.dropoff.trim()) e.dropoff = 'Drop-off location is required'
    if (!form.date) e.date = 'Pickup date is required'
    if (!form.time) e.time = 'Pickup time is required'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      const first = document.querySelector('[data-error]')
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setErrors({})
    setSubmittedData({ ...form })
    setShowDeals(true)
  }

  const bestFitId = submittedData
    ? getBestFitId(submittedData.passengers, submittedData.luggage)
    : null

  const Field = ({ id, label, required, error, children }) => (
    <div data-error={error ? true : undefined}>
      <label htmlFor={id} className={LABEL}>
        {label} {required && <span className="text-gold-500">*</span>}
      </label>
      {children}
      {error && <p className={ERROR}>{error}</p>}
    </div>
  )

  return (
    <div>
      {/* ── FORM ── */}
      <form onSubmit={handleSubmit} noValidate>

        {/* Customer Info */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-6">
          <p className="text-gold-500 text-xs font-black uppercase tracking-[0.2em] mb-5">
            01 — Customer Information
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field id="name" label="Full Name" required error={errors.name}>
              <input
                id="name" type="text" className={INPUT}
                placeholder="Your full name"
                value={form.name} onChange={e => set('name', e.target.value)}
              />
            </Field>
            <Field id="phone" label="Phone / WhatsApp" required error={errors.phone}>
              <input
                id="phone" type="tel" className={INPUT}
                placeholder="+212 6XX XXX XXX"
                value={form.phone} onChange={e => set('phone', e.target.value)}
              />
            </Field>
            <Field id="email" label="Email" error={errors.email}>
              <input
                id="email" type="email" className={INPUT}
                placeholder="you@example.com (optional)"
                value={form.email} onChange={e => set('email', e.target.value)}
              />
            </Field>
            <Field id="country" label="Country">
              <select
                id="country" className={INPUT}
                value={form.country} onChange={e => set('country', e.target.value)}
              >
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
        </div>

        {/* Trip Info */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-6">
          <p className="text-gold-500 text-xs font-black uppercase tracking-[0.2em] mb-5">
            02 — Trip Details
          </p>
          <div className="grid grid-cols-1 gap-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field id="pickup" label="Pickup Location" required error={errors.pickup}>
                <input
                  id="pickup" type="text" className={INPUT}
                  placeholder="e.g. Casablanca Airport (CMN)"
                  value={form.pickup} onChange={e => set('pickup', e.target.value)}
                />
              </Field>
              <Field id="dropoff" label="Drop-off Location" required error={errors.dropoff}>
                <input
                  id="dropoff" type="text" className={INPUT}
                  placeholder="e.g. Marrakech City Center"
                  value={form.dropoff} onChange={e => set('dropoff', e.target.value)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field id="date" label="Pickup Date" required error={errors.date}>
                <input
                  id="date" type="date" className={INPUT} min={today}
                  value={form.date} onChange={e => set('date', e.target.value)}
                />
              </Field>
              <Field id="time" label="Pickup Time" required error={errors.time}>
                <input
                  id="time" type="time" className={INPUT}
                  value={form.time} onChange={e => set('time', e.target.value)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Field id="passengers" label="Passengers" required>
                <select id="passengers" className={INPUT} value={form.passengers} onChange={e => set('passengers', e.target.value)}>
                  {Array.from({ length: 17 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={String(n)}>{n}</option>
                  ))}
                </select>
              </Field>
              <Field id="luggage" label="Luggage Pieces" required>
                <select id="luggage" className={INPUT} value={form.luggage} onChange={e => set('luggage', e.target.value)}>
                  {Array.from({ length: 21 }, (_, i) => i).map(n => (
                    <option key={n} value={String(n)}>{n}</option>
                  ))}
                </select>
              </Field>
              <div className="col-span-2">
                <p className={LABEL}>Trip Type <span className="text-gold-500">*</span></p>
                <div className="flex gap-3 h-[46px]">
                  {[
                    { val: 'one_way', label: 'One Way' },
                    { val: 'round_trip', label: 'Round Trip' },
                  ].map(opt => (
                    <label
                      key={opt.val}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-xl border cursor-pointer text-sm font-semibold transition-all ${
                        form.tripType === opt.val
                          ? 'bg-gold-500/15 border-gold-500 text-gold-400'
                          : 'border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <input
                        type="radio" name="tripType" value={opt.val} className="sr-only"
                        checked={form.tripType === opt.val}
                        onChange={() => set('tripType', opt.val)}
                      />
                      {opt.val === 'round_trip' ? '⇄' : '→'} {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <Field id="specialRequest" label="Special Request">
              <textarea
                id="specialRequest" className={`${INPUT} resize-none`} rows={3}
                placeholder="Child seats, wheelchair access, meet & greet, specific driver language..."
                value={form.specialRequest} onChange={e => set('specialRequest', e.target.value)}
              />
            </Field>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gold-500 hover:bg-gold-400 active:bg-gold-600 text-black font-black py-4 px-6 rounded-2xl text-base uppercase tracking-widest transition-colors"
        >
          🔍 Find Available Vehicles
        </button>
      </form>

      {/* ── DEALS SECTION ── */}
      {showDeals && submittedData && (
        <div ref={dealsRef} className="mt-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gray-800" />
            <p className="text-gold-500 text-xs font-black uppercase tracking-[0.2em]">
              Available Vehicles
            </p>
            <div className="h-px flex-1 bg-gray-800" />
          </div>

          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-4 mb-6 flex items-start gap-3">
            <span className="text-2xl">🧳</span>
            <div>
              <p className="text-white font-bold text-sm">
                {submittedData.pickup} → {submittedData.dropoff}
              </p>
              <p className="text-gray-400 text-xs mt-0.5">
                {submittedData.date} at {submittedData.time} · {submittedData.passengers} passenger{submittedData.passengers > 1 ? 's' : ''} · {submittedData.luggage} bag{submittedData.luggage > 1 ? 's' : ''} · {submittedData.tripType === 'round_trip' ? 'Round Trip' : 'One Way'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDeals(false)}
              className="ml-auto text-gray-500 hover:text-gray-300 text-xs font-semibold transition-colors flex-shrink-0"
            >
              ← Edit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {fleet.map(vehicle => {
              const p = parseInt(submittedData.passengers) || 1
              const l = parseInt(submittedData.luggage) || 0
              const fits = vehicle.maxPassengers >= p && vehicle.maxLuggage >= l
              const isRecommended = vehicle.id === bestFitId && vehicle.tag !== 'vip'
              const isVipChoice = vehicle.tag === 'vip' && fits

              return (
                <DealCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  isRecommended={isRecommended}
                  isVipChoice={isVipChoice}
                  isSuitable={fits}
                  tripType={submittedData.tripType}
                  onSelect={() => onSelectDeal(submittedData, vehicle)}
                />
              )
            })}
          </div>

          <p className="text-center text-gray-600 text-xs mt-6">
            All prices are estimates. Exact fare confirmed by our team before departure.
          </p>
        </div>
      )}
    </div>
  )
}

export default BookingStepOne
