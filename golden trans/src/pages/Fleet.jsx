import { Link } from 'react-router-dom'
import FleetCard from '../components/FleetCard'
import { fleet } from '../data/fleet'
import { useTranslation } from '../i18n/context.jsx'

function Fleet() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>

      <nav className="sticky top-0 z-50 border-b border-gray-800 backdrop-blur-md" style={{ backgroundColor: 'rgba(10,10,0,0.95)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-white font-black text-xl tracking-tight no-underline">
            <span className="text-gold-500">Golden</span> Trans
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-400 hover:text-white text-sm font-medium transition-colors no-underline">{t.nav.home}</Link>
            <Link to="/fleet" className="text-gold-500 text-sm font-bold no-underline">{t.fleet.title}</Link>
            <a href="/booking" className="bg-gold-500 hover:bg-gold-400 text-black text-sm font-bold px-5 py-2 rounded-full transition-colors no-underline">{t.nav.bookNow}</a>
          </div>
        </div>
      </nav>

      <section className="py-24 px-6 text-center border-b border-gray-800">
        <p className="text-gold-500 text-xs font-black uppercase tracking-[0.25em] mb-5">
          Golden Trans · Morocco
        </p>
        <h1 className="text-white font-black mb-5" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05 }}>
          {t.fleet.title}
        </h1>
        <p className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed">
          {t.fleet.desc}
        </p>
        <div className="flex justify-center gap-10 mt-12 flex-wrap">
          {[
            { value: fleet.length.toString(), label: t.fleet.categories },
            { value: '24/7', label: t.fleet.available },
            { value: '100%', label: t.fleet.fixedRate },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-gold-500 text-3xl font-black">{s.value}</div>
              <div className="text-gray-500 text-xs uppercase tracking-widest mt-1 font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gray-800" />
          <span className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
            {t.fleet.categoriesAvailable.replace('{count}', fleet.length)}
          </span>
          <div className="h-px flex-1 bg-gray-800" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fleet.map(vehicle => (
            <FleetCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      <section className="border-t border-gray-800 py-20 px-6 text-center" style={{ backgroundColor: '#111' }}>
        <h2 className="text-white text-3xl font-black mb-3">{t.fleet.readyToBook}</h2>
        <p className="text-gray-500 mb-8 text-base">{t.fleet.readyDesc}</p>
        <a href="/booking" className="inline-block bg-gold-500 hover:bg-gold-400 active:bg-gold-600 text-black font-black px-10 py-4 rounded-full text-base transition-colors uppercase tracking-widest no-underline">
          {t.fleet.bookYourRide}
        </a>
      </section>

      <footer className="border-t border-gray-800 py-8 px-6" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <span>© {new Date().getFullYear()} <span className="text-gold-500 font-bold">Golden Trans</span> · Morocco</span>
          <div className="flex gap-6">
            <a href="/#contact" className="hover:text-gray-300 transition-colors no-underline">{t.footer.contact}</a>
            <a href="/booking" className="hover:text-gray-300 transition-colors no-underline">{t.nav.bookNow}</a>
            <Link to="/" className="hover:text-gray-300 transition-colors no-underline">{t.nav.home}</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Fleet
