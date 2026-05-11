import { useState } from 'react'
import { Link } from 'react-router-dom'
import BookingStepOne from '../components/BookingStepOne'
import BookingStepTwo from '../components/BookingStepTwo'
import BookingSuccess from '../components/BookingSuccess'
import { saveBooking } from '../services/bookingService'
import { useTranslation } from '../i18n/context.jsx'
import { Check } from 'lucide-react'

function StepIndicator({ current, t }) {
  const STEPS = [
    { n: 1, label: t.booking.tripInfo },
    { n: 2, label: t.booking.payment },
  ]
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
            current === s.n
              ? 'bg-gold-500 text-black'
              : current > s.n
                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                : 'bg-gray-800 text-gray-500 border border-gray-700'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center ${
              current > s.n ? 'bg-gold-500 text-black' : ''
            }`}>
              {current > s.n ? <Check size={14} className="text-black" /> : <span className="text-xs font-black">{s.n}</span>}
            </span>
            {s.label}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-12 h-0.5 ${current > 1 ? 'bg-gold-500/50' : 'bg-gray-700'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function Booking() {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)             // 1 | 2 | 'success'
  const [tripData, setTripData] = useState(null)
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [booking, setBooking] = useState(null)
  const [saving, setSaving] = useState(false)

  // Step 1 → Step 2
  function handleSelectDeal(data, deal) {
    setTripData(data)
    setSelectedDeal(deal)
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Step 2 → Success
  async function handleConfirm(paymentMethod) {
    setSaving(true)
    try {
      const saved = await saveBooking({ tripData, deal: selectedDeal, paymentMethod })
      setBooking(saved)
      setStep('success')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      alert(t.booking.error)
    } finally {
      setSaving(false)
    }
  }

  function handleBack() {
    setStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isSuccess = step === 'success'

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 backdrop-blur-md" style={{ backgroundColor: 'rgba(10,10,10,0.95)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-white font-black text-xl tracking-tight no-underline">
            <span className="text-gold-500">Golden</span> Trans
          </Link>
          <div className="flex items-center gap-5">
            <Link to="/"      className="text-gray-400 hover:text-white text-sm font-medium transition-colors no-underline">{t.nav.home}</Link>
            <Link to="/fleet" className="text-gray-400 hover:text-white text-sm font-medium transition-colors no-underline">{t.nav.fleet}</Link>
            <Link to="/booking" className="text-gold-500 text-sm font-bold no-underline">{t.nav.bookNow}</Link>
          </div>
        </div>
      </nav>

      {/* ── HEADER ── */}
      {!isSuccess && (
        <div className="border-b border-gray-800 py-10 px-6 text-center">
          <p className="text-gold-500 text-xs font-black uppercase tracking-[0.25em] mb-3">
            Golden Trans · Morocco
          </p>
          <h1 className="text-white font-black mb-2" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
            {t.booking.reserveTitle}
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {t.booking.reserveDesc}
          </p>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {isSuccess ? (
          <BookingSuccess booking={booking} />
        ) : (
          <>
            <StepIndicator current={step} t={t} />

            {step === 1 && (
              <BookingStepOne onSelectDeal={handleSelectDeal} />
            )}

            {step === 2 && (
              <>
                {saving && (
                  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-gold-500/30 rounded-2xl p-8 text-center">
                      <div className="w-12 h-12 border-4 border-gray-700 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-white font-bold">{t.booking.confirming}</p>
                    </div>
                  </div>
                )}
                <BookingStepTwo
                  tripData={tripData}
                  selectedDeal={selectedDeal}
                  onConfirm={handleConfirm}
                  onBack={handleBack}
                />
              </>
            )}
          </>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-800 py-8 px-6 mt-10" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-gray-600 text-sm">
          <span>© {new Date().getFullYear()} <span className="text-gold-500 font-bold">Golden Trans</span> · Morocco</span>
          <span>{t.footer.phoneLabel} · {t.footer.emailLabel}</span>
        </div>
      </footer>

    </div>
  )
}

export default Booking
