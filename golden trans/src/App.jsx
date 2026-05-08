import { useState } from 'react'
import heroImage from '../public/images/sedan.jpg'
import suvPic from '../public/images/suv.jpg'
import fourxfourPic from '../public/images/4x4.jpg'
import vanPic from '../public/images/van.jpg'
import luxuryPic from '../public/images/luxury.jpg'
import minibusPic from '../public/images/minibus.jpg'
import { TOP_ROUTES, VEHICLES, LANGUAGES } from './config/routes'
import { CITIES, TOURIST_DESTINATIONS, AIRPORTS } from './config/destinations'
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

const FLEET = [
  { id: 'sedan', label: 'SEDAN', desc: 'Confortable berline pour trajets urbains et interurbains.', img: heroImage, capacity: '1-3 pers.' },
  { id: 'suv', label: 'SUV', desc: 'Véhicule spacieux et polyvalent pour routes et autoroutes.', img: suvPic, capacity: '1-5 pers.' },
  { id: '4x4', label: '4x4', desc: 'Parfait pour les pistes et l\'aventure vers le désert et les montagnes.', img: fourxfourPic, capacity: '1-5 pers.' },
  { id: 'van', label: 'VAN', desc: 'Idéal pour les groupes et familles avec bagages.', img: vanPic, capacity: '1-7 pers.' },
  { id: 'minibus', label: 'MINIBUS', desc: 'Transport de groupe jusqu\'à 15 personnes.', img: minibusPic, capacity: '8-15 pers.' },
  { id: 'luxury', label: 'LUXE', desc: 'Véhicule haut de gamme pour un voyage prestige.', img: luxuryPic, capacity: '1-5 pers.' },
]

const REVIEWS = [
  { name: 'Sophie Martin', text: 'Service impeccable, chauffeur ponctuel et véhicule très propre. Je recommande !', rating: 5 },
  { name: 'Karim Benali', text: 'Excellent trajet Casablanca-Marrakech. Conduite sécurisée, prix transparent.', rating: 5 },
  { name: 'Emma Watson', text: 'Perfect airport transfer. Driver was waiting for us despite flight delay.', rating: 5 },
]

function App() {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [confirmedBooking, setConfirmedBooking] = useState(null)
  const [showFleet, setShowFleet] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const routeData = TOP_ROUTES.find(r => r.id === form.route) || null
    setConfirmedBooking({ ...form, routeData })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNewBooking = () => {
    setConfirmedBooking(null)
    setForm(DEFAULT_FORM)
    setTimeout(() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const selectedRoute = TOP_ROUTES.find(r => r.id === form.route)
  const confirmedRoute = confirmedBooking?.routeData
  const selectedVehicle = VEHICLES.find(v => v.id === (confirmedBooking?.vehicle || form.vehicle))

  return (
    <div className="page-shell">

      {/* ── NAV ── */}
      <nav className="topnav">
        <div className="brand">
          <span className="brand-icon">✦</span> Golden Trans
        </div>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#fleet" onClick={() => setShowFleet(true)}>Flotte</a>
          <a href="#booking">Réservation</a>
          <a href="#contact">Contact</a>
          <a href="#reviews">Avis</a>
        </div>
        <a className="nav-cta" href="#booking">Réserver</a>
      </nav>

      {/* ── HERO ── */}
      <header className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Location & Transfert de Véhicules au Maroc</span>
          <h1>Voyagez en Toute Liberté avec Golden Trans</h1>
          <p>
            Berlines, SUV, 4x4, Vans, Minibus ou véhicules de luxe — choisissez le véhicule
            parfait pour vos déplacements au Maroc. Avec ou sans chauffeur, réservez en
            quelques clics.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#booking">Réserver maintenant</a>
            <a className="btn btn-secondary" href="#fleet">Découvrir la flotte</a>
          </div>
          <div className="hero-highlights">
            <div>📍 Tout le Maroc</div>
            <div>💬 WhatsApp 5min</div>
            <div>💰 Paiement à la livraison</div>
            <div>⭐ 4.9/5 — 120+ avis</div>
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Golden Trans - Berline" />
        </div>
      </header>

      <main className="content-body">

        {/* ── ABOUT ── */}
        <section className="section intro" id="services">
          <div className="section-copy">
            <h2>Golden Trans — Votre Transport au Maroc</h2>
            <p>
              Basés à Casablanca, nous proposons des services de location de véhicules
              avec ou sans chauffeur dans tout le Maroc. Notre flotte variée répond à tous
              vos besoins : transferts aéroport, déplacements professionnels, voyages
              touristiques ou évènements spéciaux.
            </p>
          </div>
          <div className="feature-grid">
            <article>
              <h3>🚗 Large choix de véhicules</h3>
              <p>Berlines, SUV, 4x4, vans, minibus et luxe — du économique au prestige.</p>
            </article>
            <article>
              <h3>🌍 Tout le Maroc</h3>
              <p>De Tanger à Dakhla, nous couvrons toutes les villes et destinations touristiques.</p>
            </article>
            <article>
              <h3>💬 Réponse sous 5 min sur WhatsApp</h3>
              <p>Réservez et recevez votre confirmation instantanément par WhatsApp.</p>
            </article>
            <article>
              <h3>💰 Paiement flexible</h3>
              <p>Paiement à la livraison ou en ligne — choisissez ce qui vous arrange.</p>
            </article>
          </div>
        </section>

        {/* ── FLEET ── */}
        <section id="fleet" className="section fleet-section">
          <h2>Notre Flotte</h2>
          <p className="fleet-intro">6 catégories de véhicules pour tous vos déplacements</p>
          <div className="fleet-grid">
            {FLEET.map(car => (
              <article key={car.id} className="fleet-card">
                <div className="fleet-img-wrap">
                  <img src={car.img} alt={car.label} />
                </div>
                <div className="fleet-info">
                  <h3>{car.label}</h3>
                  <p>{car.desc}</p>
                  <span className="fleet-capacity">{car.capacity}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section id="reviews" className="section reviews-section">
          <h2>Ce que disent nos clients</h2>
          <div className="reviews-grid">
            {REVIEWS.map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                <p>"{r.text}"</p>
                <strong>— {r.name}</strong>
              </div>
            ))}
          </div>
        </section>

        {/* ── BOOKING ── */}
        <section id="booking" className="section booking-section">
          <h2>Réserver votre véhicule</h2>
          <p>Choisissez votre trajet et recevez une confirmation instantanée</p>

          <div className="booking-card">
            <div className="booking-sidebar">
              <div className="sidebar-info">
                <h3>Pourquoi réserver chez nous ?</h3>
                <ul>
                  <li>✅ Prix fixes et transparents</li>
                  <li>✅ Paiement à l'arrivée possible</li>
                  <li>✅ Chauffeur multilingue (FR/EN/AR)</li>
                  <li>✅ Suivi de vol pour aéroports</li>
                  <li>✅ Annulation gratuite 24h avant</li>
                </ul>
                <div className="sidebar-cta">
                  <strong>💬 Questions ?</strong>
                  <p>Contactez-nous sur WhatsApp</p>
                  <a className="btn btn-secondary btn-block" href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer">
                    Nous écrire
                  </a>
                </div>
              </div>
            </div>

            <form className="booking-form" onSubmit={handleSubmit}>
              <label>
                Trajet <span className="required">*</span>
                <select name="route" value={form.route} onChange={handleChange} required>
                  <option value="">— Choisissez votre trajet —</option>
                  {TOP_ROUTES.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.label} — {r.price} MAD
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Vol (optionnel — pour les prises en charge aéroport)
                <input name="flightNumber" value={form.flightNumber} onChange={handleChange} placeholder="ex: AT761" maxLength={8} />
              </label>

              <div className="form-row">
                <label>
                  Nom complet <span className="required">*</span>
                  <input name="name" value={form.name} onChange={handleChange} required />
                </label>
                <label>
                  Téléphone <span className="required">*</span>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="+212 6XX XXX XXX" />
                </label>
              </div>

              <label>
                Email <span className="required">*</span>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </label>

              <div className="form-row">
                <label>
                  Date <span className="required">*</span>
                  <input type="date" name="pickupDate" value={form.pickupDate} onChange={handleChange} required />
                </label>
                <label>
                  Heure <span className="required">*</span>
                  <input type="time" name="pickupTime" value={form.pickupTime} onChange={handleChange} required />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Passagers
                  <select name="passengers" value={form.passengers} onChange={handleChange}>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={String(n)}>{n}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Langue préférée
                  <select name="language" value={form.language} onChange={handleChange}>
                    {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                  </select>
                </label>
              </div>

              <label>
                Véhicule
                <select name="vehicle" value={form.vehicle} onChange={handleChange}>
                  {VEHICLES.map(v => (
                    <option key={v.id} value={v.id}>{v.label} — {v.maxPax} pers. max</option>
                  ))}
                </select>
              </label>

              <label>
                Notes supplémentaires
                <textarea name="notes" value={form.notes} onChange={handleChange} rows="3" placeholder="Sièges enfant, bagages volumineux, demande spéciale..." />
              </label>

              <button className="btn btn-primary btn-block" type="submit">
                Confirmer la réservation
              </button>
            </form>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="page-footer" id="contact">
        <div>
          <h3>✦ Golden Trans</h3>
          <p>Location et transfert de véhicules dans tout le Maroc.</p>
          <p className="footer-tagline">Voyagez en toute confiance.</p>
        </div>
        <div>
          <h4>Contact</h4>
          <p>📞 +212 600 000 000</p>
          <p>✉️ contact@goldentrans.ma</p>
          <p>💬 <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer">WhatsApp</a></p>
        </div>
        <div>
          <h4>Destinations</h4>
          {TOP_ROUTES.slice(0, 5).map(r => (
            <p key={r.id} className="footer-route">{r.label}</p>
          ))}
          <p className="footer-more">+ {CITIES.length} villes desservies</p>
        </div>
        <div>
          <h4>Horaires</h4>
          <p>Lun — Dim : 24h/24</p>
          <p>Service aéroport : 24h/24</p>
          <p className="footer-tagline">Réservation en ligne ouverte</p>
        </div>
      </footer>

    </div>
  )
}

export default App