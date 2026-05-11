import { useState } from 'react'
import AutocompleteInput from './AutocompleteInput'
import { ALL_DESTINATIONS, AIRPORTS } from '../config/destinations'
import { useTranslation } from '../i18n/context.jsx'
import { Navigation, Calendar, Clock, User, MapPin } from 'lucide-react'

const SEARCH_ITEMS = [...AIRPORTS, ...ALL_DESTINATIONS]

export default function SearchBar({ onSearch }) {
  const { t } = useTranslation()
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [passengers, setPassengers] = useState('2')

  const today = new Date().toISOString().split('T')[0]

  function handleSubmit(e) {
    e.preventDefault()
    if (onSearch) onSearch({ pickup, dropoff, date, time, passengers })
    const target = document.getElementById('reservation')
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-md rounded-2xl shadow-gold border border-secondary/20 p-5 sm:p-6 lg:p-7 w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-3.5">
        <div className="lg:col-span-2 sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{t.hero.searchPlaceholder}</label>
          <AutocompleteInput
            items={SEARCH_ITEMS}
            placeholder={t.hero.searchPlaceholderSub}
             icon={<Navigation size={18} className="text-gray-400" />}
            value={pickup}
            onSelect={setPickup}
            onChange={setPickup}
          />
        </div>

        <div className="lg:col-span-2 sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{t.hero.destPlaceholder}</label>
          <AutocompleteInput
            items={SEARCH_ITEMS}
            placeholder={t.hero.destPlaceholderSub}
             icon={<MapPin size={18} className="text-gray-400" />}
            value={dropoff}
            onSelect={setDropoff}
            onChange={setDropoff}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{t.hero.date}</label>
          <div className="relative">
            <Calendar size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={date}
              min={today}
              onChange={e => setDate(e.target.value)}
              required
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 pl-10 text-sm text-gray-900 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{t.hero.hour}</label>
          <div className="relative">
            <Clock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              required
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 pl-10 text-sm text-gray-900 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{t.hero.passengers}</label>
          <div className="relative">
            <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={passengers}
              onChange={e => setPassengers(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 pl-10 text-sm text-gray-900 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all appearance-none"
            >
              {Array.from({ length: 17 }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>{n} {n > 1 ? t.hero.passengers_plural : t.hero.passenger}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-1">
        <button
          type="submit"
          className="flex-1 sm:flex-none bg-secondary hover:bg-secondary/90 text-secondary-content font-bold py-3.5 px-8 rounded-xl transition-all duration-200 text-sm uppercase tracking-wider shadow-lg shadow-secondary/20"
        >
          {t.hero.search}
        </button>
        <p className="text-xs text-gray-400 hidden sm:block">{t.hero.priceGuaranteed}</p>
      </div>
    </form>
  )
}
