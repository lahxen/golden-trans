import { useTranslation } from '../i18n/context.jsx'

function FleetCard({ vehicle }) {
  const { t } = useTranslation()
  const { category, type, brands, passengers, luggage, description, image } = vehicle

  return (
    <div className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gold-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-gold flex flex-col">

      {/* Image */}
      <div className="relative h-52 bg-gray-800 overflow-hidden">
        <img
          src={image}
          alt={`${category} — ${type}`}
          className="w-full h-full object-cover opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />

        {/* Fallback shown when no image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-20 h-20 text-gray-700" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>

        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-gold-500 text-black text-[0.68rem] font-black px-3 py-1 rounded-full uppercase tracking-widest z-10">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-white text-xl font-bold mb-1">{type}</h3>
        <p className="text-gold-400 text-sm font-semibold mb-4 tracking-wide">
          {brands.join(' · ')}
        </p>

        {/* Stats */}
        <div className="flex gap-5 mb-4">
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <svg className="w-4 h-4 text-gold-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span>{passengers} {t.vehicle.pax}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <svg className="w-4 h-4 text-gold-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd" />
            </svg>
            <span>{luggage} {t.vehicle.bags}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-4" />

        <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-6">{description}</p>

        {/* CTA button */}
        <a
          href="/booking"
          className="block text-center w-full bg-gold-500 hover:bg-gold-400 active:bg-gold-600 text-black font-bold py-3 px-4 rounded-xl transition-colors duration-200 uppercase tracking-wider text-sm no-underline"
        >
          {t.fleet.selectThis}
        </a>
      </div>
    </div>
  )
}

export default FleetCard
