import { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { CITIES_DATA, POPULAR_CITIES } from '../config/cities'
import { fleet } from '../data/fleet'
import { useTranslation } from '../i18n/context.jsx'
import { MapPin, Star, Shield, Phone, Navigation } from 'lucide-react'

function CityPage() {
  const { slug } = useParams()
  const { t } = useTranslation()
  const city = CITIES_DATA[slug]

  useEffect(() => {
    if (city) document.title = `Golden Trans — ${city.name} | ${t.hero.title}`
  }, [city])

  if (!city) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 backdrop-blur-md" style={{ backgroundColor: 'rgba(10,10,10,0.95)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-white font-black text-xl tracking-tight no-underline">
            <span className="text-gold-500">Golden</span> Trans
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-400 hover:text-white text-sm font-medium transition-colors no-underline">{t.nav.home}</Link>
            <Link to="/fleet" className="text-gray-400 hover:text-white text-sm font-medium transition-colors no-underline">{t.nav.fleet}</Link>
            <Link to="/booking" className="bg-gold-500 hover:bg-gold-400 text-black text-sm font-bold px-5 py-2 rounded-full transition-colors no-underline">{t.nav.bookNow}</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={city.image} alt={city.name} className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = 'none' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.4) 100%)' }} />
        </div>
        <div className="relative py-24 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-gold-500 text-xs font-black uppercase tracking-[0.25em] mb-4">Golden Trans · Morocco</p>
            <h1 className="text-white font-black mb-4" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 1.05 }}>
              {t.hero.title} {t.hero.services} {city.name}
            </h1>
            <p className="text-gray-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              {city.description}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/booking" className="bg-gold-500 hover:bg-gold-400 active:bg-gold-600 text-black font-black px-8 py-3 rounded-full text-sm transition-colors uppercase tracking-widest no-underline">
                {t.fleet.bookYourRide}
              </Link>
              <a href={`https://wa.me/212726760517?text=${encodeURIComponent(t.whatsapp.message)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-8 py-3 rounded-full text-sm font-bold transition-colors no-underline">
                <Phone size={16} /> {t.footer.whatsappLabel}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap justify-center gap-8 text-sm">
          {[
            { icon: <Shield size={18} />, text: t.hero.trust_certified },
            { icon: <Navigation size={18} />, text: city.airport },
            { icon: <MapPin size={18} />, text: city.region },
          ].map((s, i) => (
            <span key={i} className="flex items-center gap-2 text-gray-400">
              <span className="text-gold-500">{s.icon}</span> {s.text}
            </span>
          ))}
        </div>
      </div>

      {/* About */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-white text-2xl sm:text-3xl font-black mb-6">
          {t.hero.title} {t.hero.services} {city.name}
        </h2>
        <p className="text-gray-400 leading-relaxed mb-8">{city.longDescription}</p>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <h3 className="text-gold-500 text-xs font-black uppercase tracking-widest mb-4">{t.booking.tripDetails}</h3>
            <ul className="space-y-3">
              {city.popularRoutes.map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                  <MapPin size={14} className="text-gold-500 flex-shrink-0" />
                  <span><span className="text-gray-500">{r.from}</span> → <span className="text-white font-semibold">{r.to}</span></span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <h3 className="text-gold-500 text-xs font-black uppercase tracking-widest mb-4">{t.hero.fleet}</h3>
            <ul className="space-y-3">
              {fleet.slice(0, 4).map(v => (
                <li key={v.id} className="flex items-center gap-3 text-gray-300 text-sm">
                  <Star size={14} className="text-gold-500 flex-shrink-0" />
                  <span className="font-semibold text-white">{v.type}</span>
                  <span className="text-gray-500">· {v.brands[0]}</span>
                </li>
              ))}
            </ul>
            <Link to="/fleet" className="inline-block mt-4 text-gold-500 text-sm font-bold hover:text-gold-400 transition-colors no-underline">
              {t.fleet.title} →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-800 py-20 px-6 text-center" style={{ backgroundColor: '#111' }}>
        <h2 className="text-white text-3xl font-black mb-3">{t.fleet.readyToBook}</h2>
        <p className="text-gray-500 mb-8 text-base">{t.fleet.readyDesc}</p>
        <Link to="/booking" className="inline-block bg-gold-500 hover:bg-gold-400 active:bg-gold-600 text-black font-black px-10 py-4 rounded-full text-base transition-colors uppercase tracking-widest no-underline">
          {t.fleet.bookYourRide}
        </Link>
      </section>

      {/* More cities */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gray-800" />
          <span className="text-gray-500 text-xs uppercase tracking-widest font-semibold">{t.hero.services}</span>
          <div className="h-px flex-1 bg-gray-800" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {POPULAR_CITIES.filter(c => c.slug !== slug).map(c => (
            <Link key={c.slug} to={`/cities/${c.slug}`}
              className="bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl py-4 px-3 text-center transition-all no-underline">
              <p className="text-white font-bold text-sm">{c.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">{c.airport.split(' - ')[0]}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <span>© {new Date().getFullYear()} <span className="text-gold-500 font-bold">Golden Trans</span> · Morocco</span>
          <div className="flex gap-6">
            <a href="/#contact" className="hover:text-gray-300 transition-colors no-underline">{t.footer.contact}</a>
            <Link to="/booking" className="hover:text-gray-300 transition-colors no-underline">{t.nav.bookNow}</Link>
            <Link to="/" className="hover:text-gray-300 transition-colors no-underline">{t.nav.home}</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default CityPage
