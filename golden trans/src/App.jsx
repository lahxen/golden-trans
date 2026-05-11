import { useState } from 'react'
import sedanImg from '../public/images/sedan.jpg'
import suvImg from '../public/images/suv.jpg'
import fourxfourImg from '../public/images/4x4.jpg'
import vanImg from '../public/images/van.jpg'
import luxuryImg from '../public/images/luxury.jpg'
import minibusImg from '../public/images/minibus.jpg'
import chauffeurImg from '../public/images/chauffeur.jpg'
import selfdriveImg from '../public/images/selfdrive.jpg'
import { VEHICLES, LANGUAGES } from './config/routes'
import { CITIES } from './config/destinations'
import LanguageSelector from './components/LanguageSelector'
import SearchBar from './components/SearchBar'
import { saveBooking } from './services/bookingService'
import { useTranslation } from './i18n/context.jsx'
import { User, Car, MapPin, MessageCircle, Wallet, RefreshCw, Star, CheckCircle } from 'lucide-react'

const MODES = [
  { id: 'with_driver', icon: 'user' },
  { id: 'without_driver', icon: 'car' },
]

const FLEET = [
  { id: 'sedan', img: sedanImg, cap: '1-3' },
  { id: 'suv', img: suvImg, cap: '1-5' },
  { id: '4x4', img: fourxfourImg, cap: '1-5' },
  { id: 'van', img: vanImg, cap: '1-7' },
  { id: 'minibus', img: minibusImg, cap: '8-15' },
  { id: 'luxe', img: luxuryImg, cap: '1-5' },
]

const REVIEWS_DATA = [
  { nameKey: 'review1_author', textKey: 'review1_text', cityKey: 'review1_city' },
  { nameKey: 'review2_author', textKey: 'review2_text', cityKey: 'review2_city' },
  { nameKey: 'review3_author', textKey: 'review3_text', cityKey: 'review3_city' },
]

const DEFAULT = {
  mode: 'with_driver',
  name: '', phone: '', email: '',
  pickupCity: '', returnCity: '',
  pickupDate: '', pickupTime: '',
  returnDate: '', returnTime: '',
  vehicle: 'sedan', passengers: '1',
  language: 'Français', notes: '',
}

export default function App() {
  const { t } = useTranslation()
  const [f, setF] = useState(DEFAULT)
  const [confirmed, setConfirmed] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const h = e => setF(p => ({ ...p, [e.target.name]: e.target.value }))

  const MODES_I18N = [
    { id: 'with_driver', icon: 'user', label: t.hero.chauffeur, desc: t.hero.chauffeurDesc },
    { id: 'without_driver', icon: 'car', label: t.hero.sansChauffeur, desc: t.hero.sansChauffeurDesc },
  ]

  const FLEET_I18N = FLEET.map(car => ({
    ...car,
    label: car.id.toUpperCase(),
    desc: t.vehicle[car.id] || '',
  }))

  const REVIEWS = REVIEWS_DATA.map(r => ({
    name: t.reviews[r.nameKey],
    text: t.reviews[r.textKey],
    city: t.reviews[r.cityKey],
  }))

  const VEHICLE_DEAL = {
    sedan:  { category: t.vehicle.economy,     type: t.vehicle.sedan_label,           brands: ['Dacia Logan'] },
    vclass: { category: t.vehicle.vip,          type: t.vehicle.luxuryVan,             brands: ['Mercedes V-Class'] },
    tourneo:{ category: t.vehicle.standardVan,  type: t.vehicle.van,                   brands: ['Ford Tourneo'] },
    coach:  { category: t.vehicle.minibus_label,type: t.vehicle.luxuryCoach,           brands: ['Mercedes Sprinter'] },
  }

  const submit = async e => {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    try {
      const deal = VEHICLE_DEAL[f.vehicle] || VEHICLE_DEAL.sedan
      const result = await saveBooking({
        tripData: {
          name: f.name, phone: f.phone, email: f.email, country: 'Morocco',
          pickup: f.pickupCity, dropoff: f.returnCity,
          date: f.pickupDate, time: f.pickupTime,
          passengers: f.passengers, luggage: '0', tripType: 'one_way', specialRequest: f.notes,
        },
        deal: { id: 0, ...deal, basePrice: 300 },
        paymentMethod: 'on_arrival',
      })
      setConfirmed({ ...f, ref: result.ref, createdAt: result.createdAt || new Date().toISOString() })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setSaveError(t.booking.error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div data-theme="navy" className="min-h-screen bg-white">

      {/* ══ NAVBAR ══ */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="#hero" className="flex items-center gap-2 no-underline">
              <span className="text-2xl text-secondary font-serif font-bold">✦</span>
              <span className="text-lg font-bold tracking-tight">Golden Trans</span>
            </a>
            <div className="hidden md:flex items-center gap-5">
              {[
                [t.hero.services, '#services'], [t.hero.fleet, '#fleet'],
                [t.hero.booking, '#reservation'], [t.hero.reviews, '#avis'], [t.hero.contact, '#contact'],
              ].map(([l, h]) => (
                <a key={h} href={h} className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">{l}</a>
              ))}
              <LanguageSelector />
              <a href="#reservation" className="btn btn-primary btn-sm px-5 rounded-lg">{t.nav.bookNow}</a>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden btn btn-ghost btn-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {[
                [t.hero.services, '#services'], [t.hero.fleet, '#fleet'],
                [t.hero.booking, '#reservation'], [t.hero.reviews, '#avis'], [t.hero.contact, '#contact'],
              ].map(([l, h]) => (
                <a key={h} href={h} onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">{l}</a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section id="hero" className="relative bg-gradient-to-br from-primary to-primary/90 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12 lg:py-16 relative">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
            <div className="flex-1 max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-secondary fill-current" />)}</div>
                <span className="text-white/70 text-sm">{t.reviews.rating}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">{t.hero.title}</h1>
              <p className="mt-3 text-white/80 text-base sm:text-lg leading-relaxed">{t.hero.subtitle}</p>
              <div className="flex flex-wrap gap-3 mt-6">
                <a href="#fleet" className="btn btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white px-6 text-sm">{t.hero.fleet}</a>
                <a href="#avis" className="text-white/70 hover:text-white text-sm font-medium transition-colors flex items-center gap-1">{t.reviews.title} →</a>
              </div>
            </div>
            <div className="w-full lg:w-[540px] flex-shrink-0">
              <SearchBar onSearch={(vals) => {
                setF(p => ({ ...p,
                  pickupCity: vals.pickup,
                  returnCity: vals.dropoff,
                  pickupDate: vals.date,
                  pickupTime: vals.time,
                  passengers: vals.passengers,
                }))
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ TRUST BANNER ══ */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-4 flex flex-wrap items-center justify-center gap-6 text-sm">
          {[
            { icon: <MapPin size={16} className="text-primary" />, text: t.hero.trust_maroc },
            { icon: <MessageCircle size={16} className="text-primary" />, text: t.hero.trust_whatsapp },
            { icon: <Wallet size={16} className="text-primary" />, text: t.hero.trust_payment },
            { icon: <RefreshCw size={16} className="text-primary" />, text: t.hero.trust_cancel },
            { icon: <Star size={16} className="text-primary" />, text: t.hero.trust_certified },
          ].map((trust, i) => (
            <span key={i} className="flex items-center gap-1.5 text-gray-600 font-medium">
              {trust.icon} {trust.text}
            </span>
          ))}
        </div>
      </div>

      {/* ══ SERVICES ══ */}
      <section id="services" className="py-16 lg:py-20 px-4 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-secondary font-semibold text-sm tracking-widest uppercase">{t.why.title}</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 text-gray-900">{t.why.subtitle}</h2>
            <p className="text-gray-500 mt-3">{t.why.desc}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Car size={28} className="text-primary" />, title: t.why.choice1_title, desc: t.why.choice1_desc },
              { icon: <MapPin size={28} className="text-primary" />, title: t.why.choice2_title, desc: t.why.choice2_desc },
              { icon: <MessageCircle size={28} className="text-primary" />, title: t.why.choice3_title, desc: t.why.choice3_desc },
              { icon: <Wallet size={28} className="text-primary" />, title: t.why.choice4_title, desc: t.why.choice4_desc },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <span className="block mb-3">{s.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1.5">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FLEET ══ */}
      <section id="fleet" className="py-16 lg:py-20 px-4 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-secondary font-semibold text-sm tracking-widest uppercase">{t.fleet.title}</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 text-gray-900">{t.fleet.subtitle}</h2>
            <p className="text-gray-500 mt-3">{t.fleet.desc}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FLEET_I18N.map(car => (
              <div key={car.id} className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <div className="h-44 overflow-hidden">
                  <img src={car.img} alt={car.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-bold text-gray-900">{car.label}</h3>
                    <span className="text-xs font-semibold bg-primary/5 text-primary px-2 py-0.5 rounded-full">{car.cap} {t.vehicle.pax}</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{car.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BOOKING ══ */}
      <section id="reservation" className="py-16 lg:py-20 px-4 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-secondary font-semibold text-sm tracking-widest uppercase">{t.booking.title}</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 text-gray-900">{t.footer.bookingConfirmed}</h2>
            <p className="text-gray-500 mt-3">{t.footer.whatsappConfirm}</p>
          </div>

          {saving && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-secondary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-700 font-semibold">{t.booking.confirming}</p>
              </div>
            </div>
          )}

          {confirmed ? (
            <div className="max-w-lg mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="w-14 h-14 bg-success/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-success" />
              </div>
              <span className="inline-block px-3 py-0.5 rounded-full bg-success/5 text-success text-sm font-semibold mb-3">{t.footer.bookingConfirmed}</span>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{t.footer.thanks.replace('{name}', confirmed.name)}</h3>
              <p className="text-gray-500 text-sm mb-6">{t.footer.whatsappConfirm}</p>
              <div className="bg-gray-50 rounded-xl p-5 text-left space-y-2.5 text-sm mb-6">
                {[
                  [t.footer.ref, confirmed.ref],
                  [t.footer.mode, confirmed.mode === 'with_driver' ? t.hero.chauffeur : t.hero.sansChauffeur],
                  [t.footer.from, confirmed.pickupCity],
                  [t.footer.to, confirmed.returnCity || '—'],
                  [t.footer.dateLabel, `${confirmed.pickupDate} ${t.footer.at} ${confirmed.pickupTime}`],
                  [t.footer.vehicle, confirmed.vehicle.toUpperCase()],
                  [t.booking.passengers, confirmed.passengers],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between"><span className="text-gray-400">{l}</span><span className="font-semibold text-gray-800">{v}</span></div>
                ))}
              </div>
              <button className="btn btn-primary btn-block rounded-lg" onClick={() => { setConfirmed(null); setF(DEFAULT) }}>{t.footer.newBooking}</button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">{t.footer.bookingMode}</h3>
                  <div className="space-y-3">
                    {MODES_I18N.map(m => (
                      <button key={m.id} onClick={() => setF(p => ({ ...p, mode: m.id }))}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                          f.mode === m.id ? 'border-primary bg-primary/5' : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                        }`}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{m.icon === 'user' ? <User size={22} /> : <Car size={22} />}</span>
                          <div><div className="font-bold text-sm text-gray-900">{m.label}</div><div className="text-xs text-gray-500">{m.desc}</div></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-primary rounded-xl p-6 text-white">
                  <h4 className="font-bold text-sm mb-1">{t.footer.question}</h4>
                  <p className="text-sm text-white/80 mb-4">{t.footer.questionDesc}</p>
                  <a href="https://wa.me/212726760517" target="_blank" rel="noopener noreferrer" className="btn bg-white text-primary hover:bg-gray-100 border-0 btn-sm w-full rounded-lg font-semibold">{t.footer.writeUs}</a>
                </div>
              </div>

              <form onSubmit={submit} className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <h3 className="font-bold text-lg text-gray-900 mb-6">{t.footer.bookingInfo}</h3>

                {f.mode === 'with_driver' ? (
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div className="form-control"><label className="label"><span className="label-text font-medium text-gray-700">{t.footer.from} <span className="text-red-500">*</span></span></label>
                      <input type="text" name="pickupCity" value={f.pickupCity} onChange={h} className="input input-bordered bg-gray-50 border-gray-200 rounded-lg text-sm" placeholder={t.hero.searchPlaceholderSub} required /></div>
                    <div className="form-control"><label className="label"><span className="label-text font-medium text-gray-700">{t.footer.to} <span className="text-red-500">*</span></span></label>
                      <input type="text" name="returnCity" value={f.returnCity} onChange={h} className="input input-bordered bg-gray-50 border-gray-200 rounded-lg text-sm" placeholder={t.hero.destPlaceholderSub} required /></div>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div className="form-control"><label className="label"><span className="label-text font-medium text-gray-700">{t.footer.from} <span className="text-red-500">*</span></span></label>
                      <input type="text" name="pickupCity" value={f.pickupCity} onChange={h} className="input input-bordered bg-gray-50 border-gray-200 rounded-lg text-sm" placeholder={t.hero.searchPlaceholderSub} required /></div>
                    <div className="form-control"><label className="label"><span className="label-text font-medium text-gray-700">{t.footer.to}</span></label>
                      <input type="text" name="returnCity" value={f.returnCity} onChange={h} className="input input-bordered bg-gray-50 border-gray-200 rounded-lg text-sm" placeholder={t.footer.noCharge} /></div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="form-control"><label className="label"><span className="label-text font-medium text-gray-700">{t.hero.date} <span className="text-red-500">*</span></span></label>
                    <input type="date" name="pickupDate" value={f.pickupDate} onChange={h} className="input input-bordered bg-gray-50 border-gray-200 rounded-lg text-sm" required /></div>
                  <div className="form-control"><label className="label"><span className="label-text font-medium text-gray-700">{t.hero.hour} <span className="text-red-500">*</span></span></label>
                    <input type="time" name="pickupTime" value={f.pickupTime} onChange={h} className="input input-bordered bg-gray-50 border-gray-200 rounded-lg text-sm" required /></div>
                </div>

                {f.mode === 'without_driver' && (
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div className="form-control"><label className="label"><span className="label-text font-medium text-gray-700">{t.footer.dateLabel}</span></label>
                      <input type="date" name="returnDate" value={f.returnDate} onChange={h} className="input input-bordered bg-gray-50 border-gray-200 rounded-lg text-sm" /></div>
                    <div className="form-control"><label className="label"><span className="label-text font-medium text-gray-700">{t.hero.hour}</span></label>
                      <input type="time" name="returnTime" value={f.returnTime} onChange={h} className="input input-bordered bg-gray-50 border-gray-200 rounded-lg text-sm" /></div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="form-control"><label className="label"><span className="label-text font-medium text-gray-700">{t.footer.vehicle} <span className="text-red-500">*</span></span></label>
                    <select name="vehicle" value={f.vehicle} onChange={h} className="select select-bordered bg-gray-50 border-gray-200 rounded-lg text-sm">
                      {VEHICLES.map(v => <option key={v.id} value={v.id}>{v.label} — {v.maxPax} {t.vehicle.pax}</option>)}
                    </select></div>
                  <div className="form-control"><label className="label"><span className="label-text font-medium text-gray-700">{t.booking.passengers}</span></label>
                    <select name="passengers" value={f.passengers} onChange={h} className="select select-bordered bg-gray-50 border-gray-200 rounded-lg text-sm">
                      {Array.from({ length: 15 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
                    </select></div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="form-control"><label className="label"><span className="label-text font-medium text-gray-700">{t.booking.fullName} <span className="text-red-500">*</span></span></label>
                    <input type="text" name="name" value={f.name} onChange={h} className="input input-bordered bg-gray-50 border-gray-200 rounded-lg text-sm" required /></div>
                  <div className="form-control"><label className="label"><span className="label-text font-medium text-gray-700">{t.booking.phone} <span className="text-red-500">*</span></span></label>
                    <input type="tel" name="phone" value={f.phone} onChange={h} className="input input-bordered bg-gray-50 border-gray-200 rounded-lg text-sm" placeholder={t.booking.phonePlaceholder} required /></div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="form-control"><label className="label"><span className="label-text font-medium text-gray-700">{t.booking.email}</span></label>
                    <input type="email" name="email" value={f.email} onChange={h} className="input input-bordered bg-gray-50 border-gray-200 rounded-lg text-sm" /></div>
                  <div className="form-control"><label className="label"><span className="label-text font-medium text-gray-700">{t.booking.country}</span></label>
                    <select name="language" value={f.language} onChange={h} className="select select-bordered bg-gray-50 border-gray-200 rounded-lg text-sm">
                      {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                    </select></div>
                </div>

                <div className="form-control mb-5">
                  <label className="label"><span className="label-text font-medium text-gray-700">{t.footer.notes}</span></label>
                  <textarea name="notes" value={f.notes} onChange={h} className="textarea textarea-bordered bg-gray-50 border-gray-200 rounded-lg text-sm" rows="2" placeholder={t.footer.notesPlaceholder} />
                </div>

                {saveError && <p className="text-red-500 text-sm text-center mb-3">{saveError}</p>}
                <button type="submit" disabled={saving} className={`btn btn-block rounded-lg ${saving ? 'btn-disabled' : 'btn-primary'}`}>
                  {saving ? t.footer.sending : t.footer.confirm}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* ══ REVIEWS ══ */}
      <section id="avis" className="py-16 lg:py-20 px-4 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-secondary font-semibold text-sm tracking-widest uppercase">{t.reviews.title}</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 text-gray-900">{t.reviews.subtitle}</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex gap-1 mb-3">{Array(5).fill(0).map((_, j) => (
                  <Star key={j} size={18} className="text-secondary fill-current" />
                ))}</div>
                <p className="text-gray-600 text-sm leading-relaxed italic mb-4">« {r.text} »</p>
                <div><div className="font-semibold text-sm text-gray-900">{r.name}</div><div className="text-xs text-gray-400">{r.city}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-12 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="flex items-center gap-2 text-white font-bold mb-3"><span className="text-secondary">✦</span> Golden Trans</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{t.footer.tagline}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">{t.footer.contact}</h4>
              <div className="space-y-1.5 text-sm text-gray-400">
                <p>{t.footer.phoneLabel}</p>
                <p>{t.footer.emailLabel}</p>
                <a href="https://wa.me/212726760517" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">{t.footer.whatsappLabel}</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">{t.footer.destinations}</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                {['marrakech', 'casablanca', 'rabat', 'fes', 'tangier', 'agadir', 'chefchaouen', 'essaouira', 'meknes', 'ouarzazate', 'tetouan', 'asilah'].map(c => (
                  <a key={c} href={`/city/${c}`} className="text-gray-400 hover:text-gold-400 transition-colors no-underline capitalize">{c}</a>
                ))}
              </div>
              <p className="text-sm text-secondary font-semibold mt-3">{t.footer.citiesServed.replace('{count}', CITIES.length)}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">{t.footer.hours}</h4>
              <p className="text-sm text-gray-400">{t.footer.hoursValue}</p>
              <p className="text-sm text-gray-400">{t.footer.airport}</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} {t.footer.copyright}
          </div>
        </div>
      </footer>

    </div>
  )
}
