import { useState } from 'react'
import { BOOKING_MODES, ALL_DESTINATIONS, VEHICLES } from './config/destinations'
import { saveBooking } from './services/bookingService'
import './App.css'

const DEF_WITH = { from: '', to: '', date: '', time: '', vehicle: 'sedan', passengers: 1, name: '', phone: '', email: '', notes: '' }
const DEF_WITHOUT = { pickupCity: '', returnCity: '', pickupDate: '', pickupTime: '', returnDate: '', returnTime: '', vehicle: 'sedan', passengers: 1, name: '', phone: '', email: '', notes: '' }

function Step({ n, label, active, done }) {
  return (
    <div className={`step ${active ? 'active' : ''} ${done ? 'done' : ''}`}>
      <div className="step-dot">{done ? '✓' : n}</div>
      <span className="step-label">{label}</span>
    </div>
  )
}

function App() {
  const [mode, setMode] = useState(null)
  const [form, setForm] = useState({})
  const [step, setStep] = useState(1)
  const [booking, setBooking] = useState(null)
  const [saving, setSaving] = useState(false)

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const isWith = mode === 'with_driver'

  const steps = isWith
    ? [{ n: 1, l: 'Trajet' }, { n: 2, l: 'Date' }, { n: 3, l: 'Véhicule' }, { n: 4, l: 'Contact' }, { n: 5, l: 'Confirmation' }]
    : [{ n: 1, l: 'Lieu' }, { n: 2, l: 'Dates' }, { n: 3, l: 'Véhicule' }, { n: 4, l: 'Contact' }, { n: 5, l: 'Confirmation' }]

  const chooseMode = (id) => {
    setMode(id)
    setForm(id === 'with_driver' ? { ...DEF_WITH } : { ...DEF_WITHOUT })
    setStep(1)
  }

  const next = () => setStep(s => Math.min(s + 1, 5))
  const prev = () => setStep(s => Math.max(s - 1, 1))

  const canNext = () => {
    if (step === 1) return isWith ? (form.from && form.to) : (form.pickupCity && form.returnCity)
    if (step === 2) return isWith ? (form.date && form.time) : (form.pickupDate && form.pickupTime && form.returnDate && form.returnTime)
    if (step === 4) return form.name && form.phone
    return true
  }

  const submit = async () => {
    setSaving(true)
    const result = await saveBooking({ ...form, type: mode })
    setBooking(result)
    setSaving(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const reset = () => {
    setMode(null); setBooking(null); setForm({}); setStep(1)
  }

  // ── CONFIRMATION ──
  if (booking) {
    const v = VEHICLES.find(x => x.id === booking.vehicle)
    const waUrl = `https://wa.me/212600000000?text=${encodeURIComponent(
      `Bonjour ! Réservation ${booking.ref} : ${isWith ? `${booking.from} → ${booking.to}` : `Location à ${booking.pickupCity}`}`
    )}`

    return (
      <div className="page">
        <div className="card confirm-card">
          <div className="confirm-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h1 className="confirm-title">Réservation confirmée !</h1>
          <p className="confirm-ref">Réf. <strong>{booking.ref}</strong></p>
          <div className="ticket">
            {isWith ? (
              <>
                <div className="ticket-row"><span>🚐 Trajet</span><strong>{booking.from} → {booking.to}</strong></div>
                <div className="ticket-row"><span>📅 Date</span><strong>{booking.date} à {booking.time}</strong></div>
              </>
            ) : (
              <>
                <div className="ticket-row"><span>🚗 Location</span><strong>{booking.pickupCity}</strong></div>
                <div className="ticket-row"><span>📅 Début</span><strong>{booking.pickupDate} à {booking.pickupTime}</strong></div>
                <div className="ticket-row"><span>🏁 Retour</span><strong>{booking.returnCity} — {booking.returnDate} à {booking.returnTime}</strong></div>
              </>
            )}
            <div className="ticket-row"><span>🚘 Véhicule</span><strong>{v?.label} · {booking.passengers} pers.</strong></div>
            <div className="ticket-row"><span>👤 Client</span><strong>{booking.name}</strong></div>
          </div>
          <div className="next-step">
            <p className="next-title">📱 Prochaine étape</p>
            <p className="next-desc">Un assistant vous contacte sur <strong>WhatsApp</strong> dans quelques instants pour finaliser.</p>
            <a className="btn btn-wa" href={waUrl} target="_blank" rel="noopener">Ouvrir WhatsApp</a>
          </div>
          <div className="pay-section">
            <p className="pay-title">Mode de paiement</p>
            <div className="pay-cards">
              <div className="pay-card disabled">
                <div className="pay-icon">💳</div>
                <div className="pay-label">Paiement en ligne</div>
                <div className="pay-sub">Bientôt disponible</div>
              </div>
              <div className="pay-card active" onClick={reset}>
                <div className="pay-icon">🤝</div>
                <div className="pay-label">Paiement à la livraison</div>
                <div className="pay-sub">Vous payez en recevant le véhicule</div>
              </div>
            </div>
          </div>
          <button className="btn btn-outline btn-block" onClick={reset}>Nouvelle réservation</button>
        </div>
      </div>
    )
  }

  // ── MODE SELECTION ──
  if (!mode) {
    return (
      <div className="page">
        <nav className="navbar">
          <div className="nav-brand">
            <div className="nav-logo">G</div>
            <div><span className="gold">Golden</span> Trans</div>
          </div>
          <div className="nav-trust">⭐ 4.9 · 200+ clients</div>
        </nav>
        <header className="hero">
          <div className="hero-bg"><div className="hero-pattern" /></div>
          <div className="hero-content">
            <div className="hero-rating">⭐ 4.9 <span>|</span> 200+ clients satisfaits</div>
            <h1>Votre véhicule<br /><span className="gold">au Maroc</span></h1>
            <p className="hero-desc">Avec ou sans chauffeur. Réservez en 2 minutes, un assistant WhatsApp s'occupe du reste.</p>
            <div className="hero-features">
              <span>💬 Réponse sous 5 min</span>
              <span>✅ Paiement à la livraison</span>
              <span>🌍 Assistance multilingue</span>
            </div>
          </div>
        </header>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 className="mode-title">Comment voulez-vous voyager ?</h2>
          <p className="mode-sub">Choisissez le type de service qui vous correspond.</p>
          <div className="mode-grid">
            {BOOKING_MODES.map(m => (
              <div key={m.id} className="mode-card" onClick={() => chooseMode(m.id)}>
                <div className="mode-img"><img src={m.img} alt={m.label} /></div>
                <div className="mode-label">{m.label}</div>
                <div className="mode-desc">{m.desc}</div>
              </div>
            ))}
          </div>
          <div className="hero-badges" style={{ justifyContent: 'center', marginTop: 24 }}>
            <span>💬 Réponse sous 5 min</span>
            <span>✅ Pas de paiement maintenant</span>
            <span>🇫🇷 🇬🇧 🇪🇸 Assistance multilingue</span>
          </div>
        </div>

        <div className="card reviews-card">
          <h2 className="mode-title">Ce que disent nos clients</h2>
          <p className="mode-sub">⭐ 4.9/5 sur plus de 200 avis</p>
          <div className="reviews-grid">
            <div className="review">
              <div className="review-stars">⭐⭐⭐⭐⭐</div>
              <p className="review-text">"Service incroyable ! Chauffeur ponctuel, voiture impeccable. Réservation en ligne super rapide."</p>
              <div className="review-author">
                <div className="review-avatar">S</div>
                <div>
                  <div className="review-name">Sophie L.</div>
                  <div className="review-date">Marrakech · Mars 2026</div>
                </div>
              </div>
            </div>
            <div className="review">
              <div className="review-stars">⭐⭐⭐⭐⭐</div>
              <p className="review-text">"J'ai loué une SUV pour une semaine. Processus simple, pas de paperasse. Je recommande."</p>
              <div className="review-author">
                <div className="review-avatar">M</div>
                <div>
                  <div className="review-name">Marc D.</div>
                  <div className="review-date">Casablanca · Février 2026</div>
                </div>
              </div>
            </div>
            <div className="review highlight">
              <div className="review-stars">⭐⭐⭐⭐⭐</div>
              <p className="review-text">"Enfin un site qui facilite la location au Maroc. L'assistant WhatsApp m'a trouvé la voiture parfaite."</p>
              <div className="review-author">
                <div className="review-avatar">A</div>
                <div>
                  <div className="review-name">Amina R.</div>
                  <div className="review-date">Rabat · Janvier 2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-brand"><span className="gold">Golden</span> Trans</div>
            <p className="footer-copy">© 2025 · Service de réservation de véhicules au Maroc</p>
          </div>
        </footer>
      </div>
    )
  }

  // ── STEPPER ──
  return (
    <div className="page">
      <nav className="navbar">
        <div className="nav-brand" onClick={() => { setMode(null); setStep(1) }} style={{ cursor: 'pointer' }}>
          <div className="nav-logo">G</div>
          <div><span className="gold">Golden</span> Trans</div>
        </div>
        <div className="nav-badge">{isWith ? '🚐 Avec chauffeur' : '🚗 Sans chauffeur'}</div>
      </nav>
      <div className="mode-indicator" onClick={() => { setMode(null); setStep(1) }}>
        <span className="mode-badge">{isWith ? '🚐 Avec chauffeur' : '🚗 Sans chauffeur'}</span>
        <span className="mode-change">Changer</span>
      </div>

      <div className="steps-bar">
        {steps.map(s => <Step key={s.n} n={s.n} label={s.l} active={step === s.n} done={step > s.n} />)}
      </div>

      <div className="card stepper-card">
        {step === 1 && (
          <div className="step-content">
            <p className="step-number">Étape 1/5</p>
            <h2>{isWith ? 'Où allez-vous ?' : 'Où récupérez-vous la voiture ?'}</h2>
            <p className="step-hint">{isWith ? 'Choisissez votre départ et votre destination.' : 'Indiquez la ville de réception et de retour du véhicule.'}</p>
            {isWith ? (
              <div className="grid-2">
                <label><span className="label-text">📍 Départ</span>
                  <select name="from" value={form.from} onChange={handle} required>
                    <option value="">Ville de départ</option>
                    {ALL_DESTINATIONS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </label>
                <label><span className="label-text">🏁 Destination</span>
                  <select name="to" value={form.to} onChange={handle} required>
                    <option value="">Ville d'arrivée</option>
                    {ALL_DESTINATIONS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </label>
              </div>
            ) : (
              <div className="grid-2">
                <label><span className="label-text">🏁 Ville de réception</span>
                  <select name="pickupCity" value={form.pickupCity} onChange={handle} required>
                    <option value="">Récupération du véhicule</option>
                    {ALL_DESTINATIONS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </label>
                <label><span className="label-text">🏁 Ville de retour</span>
                  <select name="returnCity" value={form.returnCity} onChange={handle} required>
                    <option value="">Retour du véhicule</option>
                    {ALL_DESTINATIONS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </label>
              </div>
            )}
            {(isWith && form.from && form.to) && (
              <div className="route-preview"><span>{form.from}</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg><span>{form.to}</span></div>
            )}
            {(!isWith && form.pickupCity && form.returnCity) && (
              <div className="route-preview"><span>Réception : {form.pickupCity}</span><span style={{ color: '#d4a843' }}>→</span><span>Retour : {form.returnCity}</span></div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <p className="step-number">Étape 2/5</p>
            <h2>{isWith ? 'Quand ?' : 'Quelles dates ?'}</h2>
            <p className="step-hint">{isWith ? 'Sélectionnez la date et l\'heure de prise en charge.' : 'Indiquez les dates et heures de début et fin de location.'}</p>
            {isWith ? (
              <div className="grid-2">
                <label><span className="label-text">📅 Date</span><input type="date" name="date" value={form.date} onChange={handle} required /></label>
                <label><span className="label-text">⏰ Heure</span><input type="time" name="time" value={form.time} onChange={handle} required /></label>
              </div>
            ) : (
              <>
                <h3 className="section-label">Début de location</h3>
                <div className="grid-2">
                  <label><span className="label-text">📅 Date</span><input type="date" name="pickupDate" value={form.pickupDate} onChange={handle} required /></label>
                  <label><span className="label-text">⏰ Heure</span><input type="time" name="pickupTime" value={form.pickupTime} onChange={handle} required /></label>
                </div>
                <h3 className="section-label" style={{ marginTop: 8 }}>Fin de location</h3>
                <div className="grid-2">
                  <label><span className="label-text">📅 Date</span><input type="date" name="returnDate" value={form.returnDate} onChange={handle} required /></label>
                  <label><span className="label-text">⏰ Heure</span><input type="time" name="returnTime" value={form.returnTime} onChange={handle} required /></label>
                </div>
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <p className="step-number">Étape 3/5</p>
            <h2>Quel véhicule ?</h2>
            <p className="step-hint">Choisissez le type. Notre assistant WhatsApp vous proposera les modèles exacts disponibles.</p>
            <div className="vehicle-grid">
              {VEHICLES.map(v => (
                <div key={v.id} className={`vehicle-card ${form.vehicle === v.id ? 'selected' : ''}`} onClick={() => setForm(p => ({ ...p, vehicle: v.id }))}>
                  <div className="v-icon">{v.id === 'sedan' ? '🚗' : v.id === 'suv' ? '🚙' : v.id === '4x4' ? '🛻' : v.id === 'van' ? '🚐' : v.id === 'minibus' ? '🚌' : '🏎️'}</div>
                  <div className="v-name">{v.label}</div>
                  <div className="v-cap">{v.capacity}</div>
                </div>
              ))}
            </div>
            <div className="grid-2" style={{ marginTop: 16 }}>
              <label><span className="label-text">👤 Passagers</span>
                <select name="passengers" value={form.passengers} onChange={handle}>
                  {Array.from({ length: 15 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} {n > 1 ? 'personnes' : 'personne'}</option>)}
                </select>
              </label>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step-content">
            <p className="step-number">Étape 4/5</p>
            <h2>Vos coordonnées</h2>
            <p className="step-hint">Pour recevoir votre confirmation sur WhatsApp.</p>
            <div className="grid-2">
              <label><span className="label-text">👤 Nom complet</span>
                <input name="name" value={form.name} onChange={handle} required placeholder="ex. Omar Alaoui" />
              </label>
              <label><span className="label-text">📱 WhatsApp</span>
                <input name="phone" type="tel" value={form.phone} onChange={handle} required placeholder="+212 6XX XXX XXX" />
                <span className="field-hint">C'est sur ce numéro que vous serez contacté</span>
              </label>
            </div>
            <label><span className="label-text">✉️ Email <span className="optional">(optionnel)</span></span>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="ex. omar@email.com" />
            </label>
            <label><span className="label-text">📝 Notes <span className="optional">(optionnel)</span></span>
              <textarea name="notes" value={form.notes} onChange={handle} rows="2" placeholder="Bagages, siège bébé, demande spéciale..." />
            </label>
            <div className="trust-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span>Vos informations sont confidentielles. Utilisées uniquement pour votre réservation.</span>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="step-content">
            <p className="step-number">Étape 5/5</p>
            <h2>Récapitulatif</h2>
            <p className="step-hint">Vérifiez avant d'envoyer.</p>
            <div className="recap">
              <div className="recap-row"><span>Type</span><strong>{isWith ? '🚐 Avec chauffeur' : '🚗 Sans chauffeur'}</strong></div>
              {isWith ? (
                <>
                  <div className="recap-row"><span>📍 Trajet</span><strong>{form.from} → {form.to}</strong></div>
                  <div className="recap-row"><span>📅 Date</span><strong>{form.date} à {form.time}</strong></div>
                </>
              ) : (
                <>
                  <div className="recap-row"><span>🏁 Réception</span><strong>{form.pickupCity}</strong></div>
                  <div className="recap-row"><span>📅 Début</span><strong>{form.pickupDate} à {form.pickupTime}</strong></div>
                  <div className="recap-row"><span>🏁 Retour</span><strong>{form.returnCity} — {form.returnDate} à {form.returnTime}</strong></div>
                </>
              )}
              <div className="recap-row"><span>🚗 Véhicule</span><strong>{VEHICLES.find(v => v.id === form.vehicle)?.label} · {form.passengers} pers.</strong></div>
              <div className="recap-row"><span>👤 Nom</span><strong>{form.name}</strong></div>
              <div className="recap-row"><span>📱 Téléphone</span><strong>{form.phone}</strong></div>
            </div>
            <div className="consent-box">
              <p>En confirmant, vous acceptez d'être contacté par WhatsApp pour le suivi.</p>
            </div>
          </div>
        )}

        <div className="step-nav">
          {step > 1 && <button className="btn btn-ghost" onClick={prev}>← Retour</button>}
          <div style={{ flex: 1 }} />
          {step < 5 ? (
            <button className="btn btn-primary" onClick={next} disabled={!canNext()}>Continuer →</button>
          ) : (
            <button className="btn btn-primary" onClick={submit} disabled={saving || !form.name || !form.phone}>
              {saving ? 'Envoi...' : 'Confirmer ✓'}
            </button>
          )}
        </div>
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand"><span className="gold">Golden</span> Trans</div>
          <p className="footer-copy">© 2025 · Service de réservation de véhicules au Maroc</p>
        </div>
      </footer>

      {saving && (
        <div className="overlay">
          <div className="loader">
            <div className="spinner" />
            <p>Préparation de votre réservation...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
