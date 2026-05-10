import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBookings, updateBookingStatus, calculatePrice } from '../services/bookingService'

const ADMIN_PASSWORD = 'goldentrans2025'

const STATUS_CFG = {
  pending:        { label: 'Pending',          dot: 'bg-yellow-500',  text: 'text-yellow-400',  badge: 'bg-yellow-500/15 border-yellow-500/30' },
  confirmed:      { label: 'Confirmed',         dot: 'bg-blue-500',    text: 'text-blue-400',    badge: 'bg-blue-500/15 border-blue-500/30' },
  paid:           { label: 'Paid',              dot: 'bg-green-500',   text: 'text-green-400',   badge: 'bg-green-500/15 border-green-500/30' },
  pay_on_arrival: { label: 'Pay on Arrival',    dot: 'bg-orange-500',  text: 'text-orange-400',  badge: 'bg-orange-500/15 border-orange-500/30' },
  cancelled:      { label: 'Cancelled',         dot: 'bg-red-500',     text: 'text-red-400',     badge: 'bg-red-500/15 border-red-500/30' },
}
const ALL_STATUSES = Object.keys(STATUS_CFG)

function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${c.badge} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}

function Admin() {
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
      setAuthError('Incorrect password.')
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

  /* ── LOGIN SCREEN ── */
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="text-gold-500 text-xs font-black uppercase tracking-widest mb-2">Admin Access</p>
            <h1 className="text-white text-2xl font-black">Golden Trans</h1>
          </div>
          <form onSubmit={handleLogin} className="bg-gray-900 border border-gray-800 rounded-2xl p-7 space-y-4">
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500 text-sm"
                placeholder="Enter admin password"
                autoFocus
              />
              {authError && <p className="text-red-400 text-xs mt-2">{authError}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-gold-500 hover:bg-gold-400 text-black font-black py-3 rounded-xl uppercase tracking-wider text-sm"
            >
              Sign In
            </button>
          </form>
          <p className="text-center text-gray-700 text-xs mt-4">
            Default password: <code className="text-gray-500">goldentrans2025</code>
          </p>
          <div className="text-center mt-3">
            <Link to="/" className="text-gray-600 hover:text-gray-400 text-xs no-underline">← Back to website</Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── DASHBOARD ── */
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <nav className="sticky top-0 z-50 border-b border-gray-800 backdrop-blur-md" style={{ backgroundColor: 'rgba(10,10,10,0.95)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white font-black text-lg">
              <span className="text-gold-500">Golden</span> Trans
            </span>
            <span className="bg-gold-500/15 border border-gold-500/30 text-gold-400 text-[0.65rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-400 hover:text-white text-sm no-underline">Website</Link>
            <button onClick={handleLogout} className="text-gray-500 hover:text-gray-300 text-sm font-semibold">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings',  value: stats.total,     color: 'text-white' },
            { label: 'Pending Review',  value: stats.pending,   color: 'text-yellow-400' },
            { label: 'Confirmed / Paid',value: stats.confirmed, color: 'text-green-400' },
            { label: 'Pay on Arrival',  value: stats.arrival,   color: 'text-orange-400' },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{s.label}</p>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', ...ALL_STATUSES].map(s => {
            const cfg = s === 'all' ? null : STATUS_CFG[s]
            const count = s === 'all' ? bookings.length : bookings.filter(b => b.status === s).length
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  filter === s
                    ? 'bg-gold-500 border-gold-500 text-black'
                    : 'border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {cfg ? cfg.label : 'All'} ({count})
              </button>
            )
          })}
          <button
            onClick={() => setBookings(getBookings())}
            className="ml-auto px-4 py-1.5 rounded-full text-xs font-bold border border-gray-700 text-gray-400 hover:border-gray-500"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Bookings list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-semibold">No bookings found</p>
            {bookings.length === 0 && (
              <p className="text-xs mt-2">Bookings will appear here after customers complete the reservation flow.</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(b => {
              const isOpen = expanded === b.ref
              const price = calculatePrice(b.deal || {}, b.tripType)

              return (
                <div key={b.ref} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  {/* Row */}
                  <div
                    className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-800/30 transition-colors"
                    onClick={() => setExpanded(isOpen ? null : b.ref)}
                  >
                    {/* Ref */}
                    <div className="flex-shrink-0 min-w-[130px]">
                      <button
                        onClick={e => { e.stopPropagation(); copyRef(b.ref) }}
                        className="text-gold-400 font-mono text-xs font-bold hover:text-gold-300 transition-colors"
                        title="Click to copy"
                      >
                        {copied === b.ref ? '✓ Copied' : b.ref}
                      </button>
                      <p className="text-gray-600 text-[0.65rem] mt-0.5">
                        {new Date(b.createdAt).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    {/* Customer */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate">{b.name}</p>
                      <p className="text-gray-500 text-xs truncate">{b.phone}</p>
                    </div>
                    {/* Route */}
                    <div className="flex-1 min-w-0 hidden md:block">
                      <p className="text-gray-300 text-xs truncate">{b.pickup}</p>
                      <p className="text-gray-500 text-xs truncate">→ {b.dropoff}</p>
                    </div>
                    {/* Vehicle */}
                    <div className="flex-shrink-0 hidden lg:block">
                      <p className="text-gray-300 text-xs font-semibold">{b.deal?.type || '—'}</p>
                      <p className="text-gray-600 text-xs">{b.deal?.category}</p>
                    </div>
                    {/* Price */}
                    <div className="flex-shrink-0 text-right hidden sm:block">
                      <p className="text-gold-400 font-bold text-sm">{price.toLocaleString()} MAD</p>
                      <p className="text-gray-600 text-xs capitalize">
                        {b.paymentMethod === 'online' ? '💳 Online' : '🚗 On arrival'}
                      </p>
                    </div>
                    {/* Status */}
                    <div className="flex-shrink-0">
                      <StatusBadge status={b.status} />
                    </div>
                    {/* Chevron */}
                    <span className={`text-gray-500 text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="border-t border-gray-800 p-5 bg-gray-800/20">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {/* Customer info */}
                        <div>
                          <p className="text-gold-500 text-[0.65rem] uppercase font-black tracking-wider mb-2">Customer</p>
                          <p className="text-white text-sm font-bold">{b.name}</p>
                          <p className="text-gray-400 text-xs">{b.phone}</p>
                          {b.email && <p className="text-gray-400 text-xs">{b.email}</p>}
                          <p className="text-gray-500 text-xs">{b.country}</p>
                        </div>
                        {/* Trip */}
                        <div>
                          <p className="text-gold-500 text-[0.65rem] uppercase font-black tracking-wider mb-2">Trip</p>
                          <p className="text-gray-300 text-xs">📍 {b.pickup}</p>
                          <p className="text-gray-300 text-xs mt-1">→ {b.dropoff}</p>
                          <p className="text-gray-400 text-xs mt-1">{b.date} at {b.time}</p>
                          <p className="text-gray-500 text-xs">{b.passengers} pax · {b.luggage} bags · {b.tripType === 'round_trip' ? 'Round' : 'One way'}</p>
                        </div>
                        {/* Payment + Actions */}
                        <div>
                          <p className="text-gold-500 text-[0.65rem] uppercase font-black tracking-wider mb-2">Actions</p>
                          <div className="mb-3">
                            <p className="text-gray-500 text-xs mb-1">Update Status</p>
                            <select
                              value={b.status}
                              onChange={e => handleStatusChange(b.ref, e.target.value)}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-gold-500"
                            >
                              {ALL_STATUSES.map(s => (
                                <option key={s} value={s}>{STATUS_CFG[s].label}</option>
                              ))}
                            </select>
                          </div>
                          {b.specialRequest && (
                            <div className="bg-gray-800 rounded-lg p-3">
                              <p className="text-gray-500 text-[0.65rem] uppercase font-bold mb-1">Special Request</p>
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
