import { calculatePrice } from '../services/bookingService'

const TAG_CONFIG = {
  most_popular: { label: '🔥 Most Popular', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  popular:      { label: '⭐ Popular Choice', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  vip:          { label: '✦ VIP Premium', color: 'bg-gold-500/20 text-gold-400 border-gold-500/30' },
}

function DealCard({ vehicle, isRecommended, isVipChoice, isSuitable, tripType, onSelect }) {
  const price = calculatePrice(vehicle, tripType)
  const isRound = tripType === 'round_trip'
  const tagCfg = TAG_CONFIG[vehicle.tag] || null

  return (
    <div
      className={`relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300
        ${isRecommended
          ? 'border-gold-500 shadow-gold bg-gray-900 scale-[1.02]'
          : isSuitable
            ? 'border-gray-700 hover:border-gray-500 bg-gray-900 hover:-translate-y-0.5'
            : 'border-gray-800 bg-gray-900/60 opacity-60'
        }`}
    >
      {/* Best Match banner */}
      {isRecommended && (
        <div className="bg-gold-500 text-black text-[0.7rem] font-black text-center py-1.5 uppercase tracking-[0.15em]">
          ⭐ Best Match for Your Group
        </div>
      )}
      {isVipChoice && !isRecommended && (
        <div className="bg-gray-800 border-b border-gold-500/30 text-gold-400 text-[0.7rem] font-black text-center py-1.5 uppercase tracking-[0.15em]">
          ✦ VIP Premium Upgrade
        </div>
      )}

      {/* Image */}
      <div className="relative h-44 bg-gray-800 overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.type}
          className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

        {/* Fallback icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="w-16 h-16 text-gray-700" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        </div>

        {/* Category badge */}
        <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm border border-gold-500/40 text-gold-400 text-[0.68rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {vehicle.category}
        </span>

        {/* Tag badge */}
        {tagCfg && (
          <span className={`absolute top-3 right-3 border text-[0.65rem] font-bold px-2.5 py-0.5 rounded-full ${tagCfg.color}`}>
            {tagCfg.label}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white text-lg font-bold mb-0.5">{vehicle.type}</h3>
        <p className="text-gray-500 text-xs mb-3 font-medium">{vehicle.brands.join(' · ')}</p>

        {/* Capacity */}
        <div className="flex gap-4 mb-3">
          <span className={`flex items-center gap-1.5 text-sm font-semibold ${isSuitable ? 'text-gray-300' : 'text-red-400'}`}>
            <svg className="w-4 h-4 text-gold-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            {vehicle.passengers} pax
          </span>
          <span className="flex items-center gap-1.5 text-gray-300 text-sm font-semibold">
            <svg className="w-4 h-4 text-gold-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5z" />
            </svg>
            {vehicle.luggage} bags
          </span>
        </div>

        {/* Selling message */}
        <p className="text-gray-400 text-xs leading-relaxed mb-4 flex-1">{vehicle.sellingMessage}</p>

        {/* Not suitable warning */}
        {!isSuitable && (
          <p className="text-red-400 text-xs mb-3 font-semibold">
            ⚠ Capacity may be insufficient for your group
          </p>
        )}

        {/* Price */}
        <div className="border-t border-gray-800 pt-4 mb-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-gray-500 text-[0.68rem] uppercase tracking-wider mb-0.5">
                {isRound ? 'Round trip from' : 'One way from'}
              </p>
              <p className="text-white text-2xl font-black">
                {price.toLocaleString()} <span className="text-gold-500 text-sm font-bold">MAD</span>
              </p>
            </div>
            {isRound && (
              <span className="text-gold-500/70 text-xs bg-gold-500/10 border border-gold-500/20 px-2 py-1 rounded-lg">
                Round trip
              </span>
            )}
          </div>
          <p className="text-gray-600 text-[0.65rem] mt-1">Exact price confirmed before departure</p>
        </div>

        {/* CTA */}
        <button
          onClick={onSelect}
          disabled={false}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 ${
            isRecommended
              ? 'bg-gold-500 hover:bg-gold-400 text-black'
              : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-gray-500'
          }`}
        >
          Choose This Deal →
        </button>
      </div>
    </div>
  )
}

export default DealCard
