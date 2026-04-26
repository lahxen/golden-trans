import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import heroImage from '../images/image01.png'
import ChatComponent from './components/ChatComponent'
import FlightTracker from './components/FlightTracker'
import WhatsAppDispatch from './components/WhatsAppDispatch'
import { TOP_ROUTES, VEHICLES, LANGUAGES } from './config/routes'
import './App.css'

const DEFAULT_FORM = {
  name: '',
  phone: '',
  email: '',
  route: '',
  flightNumber: '',
  language: 'English',
  vehicle: 'vclass',
  passengers: '1',
  pickupDate: '',
  pickupTime: '',
  notes: '',
}

function App() {
  const [form, setForm]                     = useState(DEFAULT_FORM)
  const [confirmedBooking, setConfirmedBooking] = useState(null)
  const [showChat, setShowChat]             = useState(false)
  const [showDispatch, setShowDispatch]     = useState(false)

  // Auto-upgrade vehicle when passengers exceed current capacity
  useEffect(() => {
    setForm(prev => {
      const pax = parseInt(prev.passengers, 10)
      const current = VEHICLES.find(v => v.id === prev.vehicle)
      if (current && pax > current.maxPax) {
        const suitable = VEHICLES.find(v => pax <= v.maxPax)
        if (suitable) return { ...prev, vehicle: suitable.id }
      }
      return prev
    })
  }, [form.passengers])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const routeData = TOP_ROUTES.find(r => r.id === form.route) || null
    setConfirmedBooking({ ...form, routeData })
    setShowDispatch(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNewBooking = () => {
    setConfirmedBooking(null)
    setForm(DEFAULT_FORM)
    setShowDispatch(false)
    setTimeout(() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const selectedRoute   = TOP_ROUTES.find(r => r.id === form.route)
  const confirmedRoute  = confirmedBooking?.routeData
  const selectedVehicle = VEHICLES.find(v => v.id === (confirmedBooking?.vehicle || form.vehicle))

  return (
    <div className="page-shell">

      {/* ── NAV ── */}
      <nav className="topnav">
        <div className="brand">Golden Trans</div>
        <div className="nav-links">
          <a href="#services">Services</a>
          <Link to="/fleet">Fleet</Link>
          <a href="#booking">Booking</a>
          <a href="#contact">Contact</a>
        </div>
        <Link className="nav-cta" to="/booking">Book Now</Link>
      </nav>

      {/* ── HERO ── */}
      <header className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Luxury Chauffeur Service</span>
          <h1>Mercedes V-Class with Private Driver in Morocco</h1>
          <p>
            Travel Morocco in premium comfort with our Mercedes V-Class and English-speaking chauffeur.
            Ideal for airport transfers, city-to-city journeys, and tailored tours across Casablanca,
            Marrakech, Rabat and beyond.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#booking">Book Your Ride</a>
            <Link className="btn btn-secondary" to="/fleet">View Fleet</Link>
            <button className="btn btn-secondary" type="button" onClick={() => setShowChat(s => !s)}>
              {showChat ? 'Hide Chat' : 'Chat with Us'}
            </button>
          </div>
          <div className="hero-highlights">
            <div><strong>5 Passengers</strong></div>
            <div><strong>6 Luggage</strong></div>
            <div><strong>Private Driver</strong></div>
            <div><strong>24/7 Support</strong></div>
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Luxury Mercedes V-Class interior" />
        </div>
      </header>

      <main className="content-body">

        {/* ── SERVICES ── */}
        <section className="section intro" id="services">
          <div className="section-copy">
            <h2>Premium Comfort for Your Morocco Journey</h2>
            <p>
              Our Mercedes V-Class provides spacious leather seating, climate control, and professional
              chauffeurs with local expertise. Whether you need airport transfers, a daily city tour, or
              a multi-day private trip, Golden Trans delivers polished service with every transfer.
            </p>
          </div>
          <div className="feature-grid">
            <article>
              <h3>Impeccably Maintained</h3>
              <p>Clean, safe and modern vehicles ready for your journey.</p>
            </article>
            <article>
              <h3>Multilingual Chauffeurs</h3>
              <p>Drivers fluent in English, French and Arabic — matched to your preferred language.</p>
            </article>
            <article>
              <h3>Live Flight Tracking</h3>
              <p>We monitor your flight in real time. Your driver waits — no extra charge, ever.</p>
            </article>
            <article>
              <h3>Fixed-Rate Pricing</h3>
              <p>Transparent, no-surprise fares for our Top 5 airport transfer routes.</p>
            </article>
          </div>
        </section>

        {/* ── CHAT ── */}
        {showChat && (
          <section id="chat" className="section">
            <h2>Chat with Our Team</h2>
            <p>Ask anything about your transfer, destinations, and service details.</p>
            <ChatComponent />
          </section>
        )}

        {/* ── BOOKING ── */}
        <section id="booking" className="section booking-section">

          {confirmedBooking ? (
            /* ══ CONFIRMATION VIEW ══ */
            <div className="confirmation-layout">

              <div className="confirmation-copy">
                <span className="conf-badge">✅ Booking Received</span>
                <h2>Thank you, {confirmedBooking.name}!</h2>
                <p>Your transfer request has been recorded. Our team will confirm within 30 minutes.</p>

                <div className="summary-card">
                  {confirmedRoute && (
                    <>
                      <div className="summary-row">
                        <span>Route</span>
                        <strong>{confirmedRoute.label}</strong>
                      </div>
                      <div className="summary-row">
                        <span>Fixed Price</span>
                        <strong className="price-tag">{confirmedRoute.price} MAD</strong>
                      </div>
                      <div className="summary-row">
                        <span>Est. Duration</span>
                        <strong>~{confirmedRoute.duration}</strong>
                      </div>
                    </>
                  )}
                  <div className="summary-row">
                    <span>Vehicle</span>
                    <strong>{selectedVehicle?.label || '—'}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Passengers</span>
                    <strong>{confirmedBooking.passengers}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Language</span>
                    <strong>{confirmedBooking.language}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Date / Time</span>
                    <strong>
                      {confirmedBooking.pickupDate}
                      {confirmedBooking.pickupTime && ` at ${confirmedBooking.pickupTime}`}
                    </strong>
                  </div>
                  {confirmedBooking.flightNumber && (
                    <div className="summary-row">
                      <span>Flight</span>
                      <strong>{confirmedBooking.flightNumber.toUpperCase()}</strong>
                    </div>
                  )}
                </div>

                {confirmedBooking.flightNumber && (
                  <div className="ft-section">
                    <h4>✈️ Live Flight Status</h4>
                    <FlightTracker flightNumber={confirmedBooking.flightNumber} />
                  </div>
                )}

                <button className="btn btn-secondary btn-block" type="button" onClick={handleNewBooking}>
                  + New Booking
                </button>
              </div>

              <div className="dispatch-column">
                <div className="dispatch-intro-card">
                  <h3>🚐 Partner Dispatch</h3>
                  <p>Ready to secure the vehicle? Generate the WhatsApp dispatch message to send to your partner.</p>
                  <button
                    className="btn btn-primary btn-block"
                    type="button"
                    onClick={() => setShowDispatch(s => !s)}
                  >
                    {showDispatch ? 'Hide Dispatch' : '📤 Generate Dispatch Message'}
                  </button>
                  {showDispatch && (
                    <WhatsAppDispatch booking={confirmedBooking} route={confirmedRoute} />
                  )}
                </div>
              </div>

            </div>
          ) : (
            /* ══ BOOKING FORM ══ */
            <div className="booking-card">
              <div className="booking-copy">
                <h2>Book Your Airport Transfer</h2>
                <p>
                  Select your route for an instant fixed price. We confirm your booking within
                  30 minutes and track your flight on the day.
                </p>
                <ul>
                  <li>Fixed-rate pricing — no surprises</li>
                  <li>Flight tracking — driver waits for you</li>
                  <li>Driver matched to your preferred language</li>
                  <li>Mercedes V-Class, Tourneo, or Coach Bus</li>
                </ul>

                {selectedRoute && (
                  <div className="route-price-preview">
                    <div className="rp-route">{selectedRoute.label}</div>
                    <div className="rp-price">{selectedRoute.price} <span>MAD</span></div>
                    <div className="rp-duration">⏱ ~{selectedRoute.duration}</div>
                  </div>
                )}
              </div>

              <form className="booking-form" onSubmit={handleSubmit}>

                {/* Route */}
                <label>
                  Route <span className="required">*</span>
                  <select name="route" value={form.route} onChange={handleChange} required>
                    <option value="">— Select your destination —</option>
                    {TOP_ROUTES.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.label} — {r.price} MAD
                      </option>
                    ))}
                  </select>
                </label>

                {/* Flight Number */}
                <label>
                  Flight Number
                  <span className="field-hint"> (for airport pick-ups — driver tracks your flight)</span>
                  <input
                    name="flightNumber"
                    value={form.flightNumber}
                    onChange={handleChange}
                    placeholder="e.g. AT761"
                    maxLength={8}
                    autoComplete="off"
                  />
                </label>
                <FlightTracker flightNumber={form.flightNumber} />

                {/* Name + Phone */}
                <div className="form-row">
                  <label>
                    Full Name <span className="required">*</span>
                    <input name="name" value={form.name} onChange={handleChange} required />
                  </label>
                  <label>
                    Phone Number <span className="required">*</span>
                    <input name="phone" type="tel" value={form.phone} onChange={handleChange} required />
                  </label>
                </div>

                {/* Email */}
                <label>
                  Email <span className="required">*</span>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </label>

                {/* Date + Time */}
                <div className="form-row">
                  <label>
                    Pick-up Date <span className="required">*</span>
                    <input type="date" name="pickupDate" value={form.pickupDate} onChange={handleChange} required />
                  </label>
                  <label>
                    Pick-up Time <span className="required">*</span>
                    <input type="time" name="pickupTime" value={form.pickupTime} onChange={handleChange} required />
                  </label>
                </div>

                {/* Passengers + Language */}
                <div className="form-row">
                  <label>
                    Passengers <span className="required">*</span>
                    <select name="passengers" value={form.passengers} onChange={handleChange}>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                        <option key={n} value={String(n)}>{n}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Preferred Language
                    <select name="language" value={form.language} onChange={handleChange}>
                      {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </label>
                </div>

                {/* Vehicle */}
                <label>
                  Vehicle
                  <select name="vehicle" value={form.vehicle} onChange={handleChange}>
                    {VEHICLES.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.label} — up to {v.maxPax} passengers
                      </option>
                    ))}
                  </select>
                </label>

                {/* Notes */}
                <label>
                  Additional Notes
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Child seats, luggage details, special requests..."
                  />
                </label>

                <button className="btn btn-primary btn-block" type="submit">
                  Request Booking
                </button>
              </form>
            </div>
          )}
        </section>

        {/* ── FLEET ── */}
        <section id="fleet" className="section fleet-section">
          <h2>Our Fleet</h2>
          <div className="fleet-grid">
            <article className="fleet-card fleet-featured">
              <div className="fleet-badge">Most Popular</div>
              <h3>Mercedes V-Class</h3>
              <p>Premium luxury van with leather seats, climate control, and ample luggage space. Up to 5 passengers.</p>
              <a className="btn btn-primary" href="#booking">Book Now</a>
            </article>
            <article className="fleet-card">
              <h3>Ford Tourneo</h3>
              <p>Comfortable and spacious for families and small groups. Up to 7 passengers.</p>
              <a className="btn btn-secondary" href="#booking">Book Now</a>
            </article>
            <article className="fleet-card">
              <h3>Luxury Coach Bus</h3>
              <p>Perfect for large groups and organized Morocco tours. Capacity up to 46 passengers.</p>
              <a className="btn btn-secondary" href="#booking">Book Now</a>
            </article>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="page-footer" id="contact">
        <div>
          <h3>Golden Trans</h3>
          <p>Professional private driver service across Morocco.</p>
        </div>
        <div>
          <p><strong>Contact</strong></p>
          <p>📞 +212 6XX XXX XXX</p>
          <p>✉️ contact@goldentrans.ma</p>
          <p>💬 WhatsApp available</p>
        </div>
        <div>
          <p><strong>Top Routes</strong></p>
          {TOP_ROUTES.map(r => (
            <p key={r.id} style={{ margin: '4px 0', fontSize: '0.85rem' }}>{r.label}</p>
          ))}
        </div>
      </footer>

    </div>
  )
}

export default App
