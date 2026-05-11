import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBookings, updateBookingStatus, calculatePrice } from '../services/bookingService'
import { useTranslation } from '../i18n/context.jsx'
import { ClipboardList, MapPin } from 'lucide-react'

const ADMIN_PASSWORD = 'goldentrans2025'

const ALL_STATUSES = ['pending', 'confirmed', 'paid', 'pay_on_arrival', 'cancelled']

function StatusBadge({ status, t }) {
  const STATUS_CFG = {
    pending:        { dot: 'bg-yellow-500',  text: 'text-yellow-400',  badge: 'bg-yellow-500/15 border-yellow-500/30' },
    confirmed:      { dot: 'bg-blue-500',    text: 'text-blue-400',    badge: 'bg-blue-500/15 border-blue-500/30' },
    paid:           { dot: 'bg-green-500',   text: 'text-green-400',   badge: 'bg-green-500/15 border-green-500/30' },
    pay_on_arrival: { dot: 'bg-orange-500',  text: 'text-orange-400',  badge: 'bg-orange-500/15 border-orange-500/30' },
    cancelled:      { dot: 'bg-red-500',     text: 'text-red-400',     badge: 'bg-red-500/15 border-red-500/30' },
  }
  const key = status || 'pending'
  const c = STATUS_CFG[key] || STATUS_CFG.pending
  const labelKey = `status_${key}`
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${c.badge} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {t.admin[labelKey]}
    </span>
  )
}

function Admin() {
  const { t } = useTranslation()
  const [authed, setAuthed]       = useState(() => sessionStorage.getItem('gt_admin') === '1')
  const [password, setPassword]   = useState('')
  const [authError, setAuthError] = useState('')
  const [bookings, setBookings]   = useState([])
  const [filter, setFilter]       = useState('all')
  const [expanded, setExpanded]   = useState(null)
  const [copied, setCopied]       = useState(null)

  useEffect(() => {
    if (authed) setBookings(getBookings())
  }, [authed])

  function handleLogin(e) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('gt_admin', '1')
      setAuthed(true)
    } else {
      setAuthError(t.admin.incorrect)
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('gt_admin')
    setAuthed(false)
  }

  function handleStatusChange(ref, newStatus) {
    const updated = updateBookingStatus(ref, {
      status: newStatus,
      paymentStatus: newStatus === 'paid' ? 'paid' : undefined,
    })
    if (updated) setBookings(prev => prev.map(b => b.ref === ref ? updated : b))
  }

  function copyRef(ref) {
    navigator.clipboard.writeText(ref)
    setCopied(ref)
    setTimeout(() => setCopied(null), 1500)
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const stats = {
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed' || b.status === 'paid').length,
    arrival:   bookings.filter(b => b.status === 'pay_on_arrival').length,
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="text-gold-500 text-xs font-black uppercase tracking-widest mb-2">{t.admin.title}</p>
            <h1 className="text-white text-2xl font-black">Golden Trans</h1>
          </div>
          <form onSubmit={handleLogin} className="bg-gray-900 border border-gray-800 rounded-2xl p-7 space-y-4">
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{t.admin.password}</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500 text-sm"
                placeholder={t.admin.passwordPlaceholder} autoFocus />
              {authError && <p className="text-red-400 text-xs mt-2">{authError}</p>}
            </div>
            <button type="submit" className="w-full bg-gold-500 hover:bg-gold-400 text-black font-black py-3 rounded-xl uppercase tracking-wider text-sm">{t.admin.signIn}</button>
          </form>
          <p className="text-center text-gray-700 text-xs mt-4">{t.admin.defaultPwd}</p>
          <div className="text-center mt-3">
            <Link to="/" className="text-gray-600 hover:text-gray-400 text-xs no-underline">{t.admin.backToSite}</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <nav className="sticky top-0 z-50 border-b border-gray-800 backdrop-blur-md" style={{ backgroundColor: 'rgba(10,10,10,0.95)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white font-black text-lg"><span className="text-gold-500">Golden</span> Trans</span>
            <span className="bg-gold-500/15 border border-gold-500/30 text-gold-400 text-[0.65rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{t.admin.title}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-400 hover:text-white text-sm no-underline">{t.nav.home}</Link>
            <button onClick={handleLogout} className="text-gray-500 hover:text-gray-300 text-sm font-semibold">{t.admin.signOut}</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: t.admin.total,  value: stats.total,     color: 'text-white' },
            { label: t.admin.pending,  value: stats.pending,   color: 'text-yellow-400' },
            { label: t.admin.confirmed,  value: stats.confirmed, color: 'text-green-400' },
            { label: t.admin.payOnArrival,  value: stats.arrival,   color: 'text-orange-400' },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{s.label}</p>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', ...ALL_STATUSES].map(s => {
            const count = s === 'all' ? bookings.length : bookings.filter(b => b.status === s).length
            const label = s === 'all' ? t.admin.all : t.admin[`status_${s}`]
            return (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  filter === s ? 'bg-gold-500 border-gold-500 text-black' : 'border-gray-700 text-gray-400 hover:border-gray-500'
                }`}>
                {label} ({count})
              </button>
            )
          })}
          <button onClick={() => setBookings(getBookings())}
            className="ml-auto px-4 py-1.5 rounded-full text-xs font-bold border border-gray-700 text-gray-400 hover:border-gray-500">{t.admin.refresh}</button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <ClipboardList size={48} className="mx-auto mb-3 text-gray-500" />
            <p className="font-semibold">{t.admin.noBookings}</p>
            {bookings.length === 0 && <p className="text-xs mt-2">{t.admin.noBookingsDesc}</p>}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(b => {
              const isOpen = expanded === b.ref
              const price = calculatePrice(b.deal || {}, b.tripType)
              return (
                <div key={b.ref} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-800/30 transition-colors"
                    onClick={() => setExpanded(isOpen ? null : b.ref)}>
                    <div className="flex-shrink-0 min-w-[130px]">
                      <button onClick={e => { e.stopPropagation(); copyRef(b.ref) }}
                        className="text-gold-400 font-mono text-xs font-bold hover:text-gold-300 transition-colors" title={t.admin.clickToCopy}>
                        {copied === b.ref ? t.admin.copied : b.ref}
                      </button>
                      <p className="text-gray-600 text-[0.65rem] mt-0.5">{new Date(b.createdAt).toLocaleDateString('en-GB')}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate">{b.name}</p>
                      <p className="text-gray-500 text-xs truncate">{b.phone}</p>
                    </div>
                    <div className="flex-1 min-w-0 hidden md:block">
                      <p className="text-gray-300 text-xs truncate">{b.pickup}</p>
                      <p className="text-gray-500 text-xs truncate">→ {b.dropoff}</p>
                    </div>
                    <div className="flex-shrink-0 hidden lg:block">
                      <p className="text-gray-300 text-xs font-semibold">{b.deal?.type || '—'}</p>
                      <p className="text-gray-600 text-xs">{b.deal?.category}</p>
                    </div>
                    <div className="flex-shrink-0 text-right hidden sm:block">
                      <p className="text-gold-400 font-bold text-sm">{price.toLocaleString()} {t.admin.mad}</p>
                      <p className="text-gray-600 text-xs capitalize">{b.paymentMethod === 'online' ? t.admin.online : t.admin.onArrival}</p>
                    </div>
                    <div className="flex-shrink-0"><StatusBadge status={b.status} t={t} /></div>
                    <span className={`text-gray-500 text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                  </div>

                  {isOpen && (
                    <div className="border-t border-gray-800 p-5 bg-gray-800/20">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-gold-500 text-[0.65rem] uppercase font-black tracking-wider mb-2">{t.admin.customer}</p>
                          <p className="text-white text-sm font-bold">{b.name}</p>
                          <p className="text-gray-400 text-xs">{b.phone}</p>
                          {b.email && <p className="text-gray-400 text-xs">{b.email}</p>}
                          <p className="text-gray-500 text-xs">{b.country}</p>
                        </div>
                        <div>
                          <p className="text-gold-500 text-[0.65rem] uppercase font-black tracking-wider mb-2">{t.admin.trip}</p>
                          <p className="text-gray-300 text-xs flex items-center gap-1"><MapPin size={12} /> {b.pickup}</p>
                          <p className="text-gray-300 text-xs mt-1">→ {b.dropoff}</p>
                          <p className="text-gray-400 text-xs mt-1">{b.date} {t.footer.at} {b.time}</p>
                          <p className="text-gray-500 text-xs">{b.passengers} {t.admin.pax} · {b.luggage} {t.admin.bags} · {b.tripType === 'round_trip' ? t.admin.round : t.admin.oneWay}</p>
                        </div>
                        <div>
                          <p className="text-gold-500 text-[0.65rem] uppercase font-black tracking-wider mb-2">{t.admin.actions}</p>
                          <div className="mb-3">
                            <p className="text-gray-500 text-xs mb-1">{t.admin.updateStatus}</p>
                            <select value={b.status} onChange={e => handleStatusChange(b.ref, e.target.value)}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-gold-500">
                              {ALL_STATUSES.map(s => <option key={s} value={s}>{t.admin[`status_${s}`]}</option>)}
                            </select>
                          </div>
                          {b.specialRequest && (
                            <div className="bg-gray-800 rounded-lg p-3">
                              <p className="text-gray-500 text-[0.65rem] uppercase font-bold mb-1">{t.admin.specialRequest}</p>
                              <p className="text-gray-300 text-xs">{b.specialRequest}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
