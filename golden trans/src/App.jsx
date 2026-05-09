import { useState } from 'react'
import sedanImg from '../public/images/sedan.jpg'
import suvImg from '../public/images/suv.jpg'
import fourxfourImg from '../public/images/4x4.jpg'
import vanImg from '../public/images/van.jpg'
import luxuryImg from '../public/images/luxury.jpg'
import minibusImg from '../public/images/minibus.jpg'
import chauffeurImg from '../public/images/chauffeur.jpg'
import selfdriveImg from '../public/images/selfdrive.jpg'
import { VEHICLES, LANGUAGES } from './config/routes'
import { CITIES, AIRPORTS } from './config/destinations'

const DEFAULT_FORM = {
  mode: 'with_driver',
  name: '', phone: '', email: '',
  pickupCity: '', returnCity: '', destination: '',
  pickupDate: '', pickupTime: '',
  returnDate: '', returnTime: '',
  vehicle: 'sedan',
  passengers: '1',
  language: 'Français',
  notes: '',
}

const FLEET_DATA = [
  { id: 'sedan', label: 'SEDAN', desc: 'Berline confortable pour trajets urbains et professionnels.', img: sedanImg, capacity: '1-3 pers.' },
  { id: 'suv', label: 'SUV', desc: 'SUV spacieux pour routes et autoroutes en tout confort.', img: suvImg, capacity: '1-5 pers.' },
  { id: '4x4', label: '4X4', desc: '4x4 robuste pour pistes, montagnes et désert.', img: fourxfourImg, capacity: '1-5 pers.' },
  { id: 'van', label: 'VAN', desc: 'Van pour groupes et familles, idéal pour les bagages.', img: vanImg, capacity: '1-7 pers.' },
  { id: 'minibus', label: 'MINIBUS', desc: 'Minibus pour groupes jusqu\'à 15 personnes.', img: minibusImg, capacity: '8-15 pers.' },
  { id: 'luxe', label: 'LUXE', desc: 'Véhicule prestige pour un voyage haut de gamme.', img: luxuryImg, capacity: '1-5 pers.' },
]

const REVIEWS = [
  { name: 'Sophie M.', text: 'Service impeccable, chauffeur ponctuel et véhicule très propre.', rating: 5, city: 'Casablanca' },
  { name: 'Karim B.', text: 'Excellent trajet Marrakech. Prix transparent, conduite sécurisée.', rating: 5, city: 'Marrakech' },
  { name: 'Emma W.', text: 'Perfect airport transfer. Driver waited despite flight delay!', rating: 5, city: 'Rabat' },
  { name: 'Youssef A.', text: '4x4 pour le désert — véhicule en super état, voyage inoubliable.', rating: 5, city: 'Merzouga' },
]

export default function App() {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [confirmed, setConfirmed] = useState(null)
  const [step, setStep] = useState(0)

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setConfirmed({ ...form, ref: `GT-${Date.now()}`, createdAt: new Date().toISOString() })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showStep = (s) => {
    setStep(s)
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div data-theme="navy" className="min-h-screen bg-base-200">

      {/* ── NAVBAR ── */}
      <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-4 lg:px-8">
        <div className="flex-1">
          <a href="#hero" className="btn btn-ghost text-xl font-bold gap-2 px-2">
            <span className="text-secondary text-2xl">✦</span>
            Golden Trans
          </a>
        </div>
        <div className="hidden md:flex gap-1">
          <a href="#services" className="btn btn-ghost btn-sm">Services</a>
          <a href="#fleet" className="btn btn-ghost btn-sm">Flotte</a>
          <a href="#booking" className="btn btn-ghost btn-sm">Réservation</a>
          <a href="#reviews" className="btn btn-ghost btn-sm">Avis</a>
          <a href="#contact" className="btn btn-ghost btn-sm">Contact</a>
        </div>
        <a href="#booking" className="btn btn-primary btn-sm ml-2">Réserver</a>
      </div>

      {/* ── HERO ── */}
      <section id="hero" className="hero min-h-[80vh] bg-base-100">
        <div className="hero-content flex-col lg:flex-row-reverse gap-8 max-w-6xl">
          <div className="lg:w-1/2">
            <img src={chauffeurImg} className="rounded-2xl shadow-2xl w-full object-cover max-h-[450px]" alt="Golden Trans" />
          </div>
          <div className="lg:w-1/2">
            <span className="badge badge-secondary text-sm mb-4 px-4 py-3">Location & Transfert au Maroc</span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Voyagez en Toute Liberté
            </h1>
            <p className="py-6 text-base-content/70 text-lg">
              Berlines, SUV, 4x4, Vans, Minibus ou Luxe — choisissez votre véhicule
              avec ou sans chauffeur. Réservez en ligne, payez à l'arrivée.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <a href="#booking" className="btn btn-primary btn-lg">Réserver maintenant</a>
              <a href="#fleet" className="btn btn-outline btn-lg">Voir la flotte</a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="badge badge-ghost badge-lg">📍 Tout le Maroc</span>
              <span className="badge badge-ghost badge-lg">💬 WhatsApp 5min</span>
              <span className="badge badge-ghost badge-lg">💰 Paiement à l'arrivée</span>
              <span className="badge badge-ghost badge-lg">⭐ 4.9/5</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Pourquoi Golden Trans ?</h2>
          <p className="text-base-content/60 mt-2">Le transport au Maroc simplifié</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: '🚗', title: '6 Types de Véhicules', desc: 'De la berline au minibus, trouvez le véhicule idéal pour chaque voyage.' },
            { icon: '📍', title: 'Tout le Maroc', desc: 'De Tanger à Dakhla, toutes les villes et destinations touristiques.' },
            { icon: '💬', title: 'WhatsApp Instantané', desc: 'Réponse sous 5 minutes après votre réservation.' },
            { icon: '💰', title: 'Paiement Flexible', desc: 'Payez à la livraison ou en ligne, choisissez votre option.' },
          ].map((s, i) => (
            <div key={i} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="card-body items-center text-center">
                <span className="text-4xl mb-2">{s.icon}</span>
                <h3 className="card-title text-lg">{s.title}</h3>
                <p className="text-base-content/60 text-sm">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FLEET ── */}
      <section id="fleet" className="py-16 px-4 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Notre Flotte</h2>
            <p className="text-base-content/60 mt-2">6 catégories pour tous vos besoins</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FLEET_DATA.map(car => (
              <div key={car.id} className="card bg-base-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                <figure className="h-44 overflow-hidden">
                  <img src={car.img} alt={car.label} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </figure>
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <h3 className="card-title text-lg">{car.label}</h3>
                    <span className="badge badge-primary badge-sm">{car.capacity}</span>
                  </div>
                  <p className="text-base-content/60 text-sm">{car.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING ── */}
      <section id="booking" className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Réserver votre véhicule</h2>
          <p className="text-base-content/60 mt-2">Remplissez le formulaire et recevez votre confirmation par WhatsApp</p>
        </div>

        {confirmed ? (
          /* ── CONFIRMATION ── */
          <div className="card bg-base-100 shadow-lg max-w-2xl mx-auto">
            <div className="card-body items-center text-center">
              <div className="text-5xl mb-4">✅</div>
              <span className="badge badge-success badge-lg mb-2">Réservation confirmée</span>
              <h3 className="text-2xl font-bold">Merci, {confirmed.name} !</h3>
              <p className="text-base-content/60">Votre demande a été enregistrée. Vous recevrez une confirmation sous 5 min sur WhatsApp.</p>
              <div className="bg-base-200 rounded-xl p-6 w-full max-w-md text-left mt-4 space-y-3">
                <div className="flex justify-between"><span className="text-base-content/60">Réf</span><strong>{confirmed.ref}</strong></div>
                <div className="flex justify-between"><span className="text-base-content/60">Mode</span><strong>{confirmed.mode === 'with_driver' ? 'Avec chauffeur' : 'Sans chauffeur'}</strong></div>
                {confirmed.pickupCity && <div className="flex justify-between"><span className="text-base-content/60">De</span><strong>{confirmed.pickupCity}</strong></div>}
                {confirmed.returnCity && <div className="flex justify-between"><span className="text-base-content/60">À</span><strong>{confirmed.returnCity}</strong></div>}
                <div className="flex justify-between"><span className="text-base-content/60">Date</span><strong>{confirmed.pickupDate} à {confirmed.pickupTime}</strong></div>
                <div className="flex justify-between"><span className="text-base-content/60">Véhicule</span><strong>{confirmed.vehicle.toUpperCase()}</strong></div>
                <div className="flex justify-between"><span className="text-base-content/60">Passagers</span><strong>{confirmed.passengers}</strong></div>
              </div>
              <button className="btn btn-primary mt-6" onClick={() => { setConfirmed(null); setForm(DEFAULT_FORM) }}>
                Nouvelle réservation
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* ── MODE SELECTION ── */}
            <div className="md:col-span-1 space-y-4">
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-base">Mode de réservation</h3>
                  <div className="flex flex-col gap-3 mt-2">
                    <button
                      className={`btn ${form.mode === 'with_driver' ? 'btn-primary' : 'btn-outline'} gap-3 justify-start`}
                      onClick={() => setForm(p => ({ ...p, mode: 'with_driver' }))}
                    >
                      <span className="text-xl">🧑‍✈️</span>
                      <div className="text-left">
                        <div className="font-bold">Avec chauffeur</div>
                        <div className="text-xs opacity-70">Transfert privé, prise en charge à votre adresse</div>
                      </div>
                    </button>
                    <button
                      className={`btn ${form.mode === 'without_driver' ? 'btn-primary' : 'btn-outline'} gap-3 justify-start`}
                      onClick={() => setForm(p => ({ ...p, mode: 'without_driver' }))}
                    >
                      <span className="text-xl">🚘</span>
                      <div className="text-left">
                        <div className="font-bold">Sans chauffeur</div>
                        <div className="text-xs opacity-70">Location de voiture, liberté de conduire</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="card bg-primary text-primary-content shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-sm">💬 Questions ?</h3>
                  <p className="text-xs opacity-80">Contactez-nous directement sur WhatsApp</p>
                  <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm mt-2">
                    Nous écrire
                  </a>
                </div>
              </div>
            </div>

            {/* ── FORM ── */}
            <form onSubmit={handleSubmit} className="md:col-span-2 card bg-base-100 shadow-sm">
              <div className="card-body">
                {form.mode === 'with_driver' ? (
                  <>
                    <div className="form-control">
                      <label className="label"><span className="label-text">Lieu de prise en charge <span className="text-error">*</span></span></label>
                      <input type="text" name="pickupCity" value={form.pickupCity} onChange={handleChange} className="input input-bordered" placeholder="Hôtel, aéroport, adresse..." required />
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text">Destination <span className="text-error">*</span></span></label>
                      <input type="text" name="returnCity" value={form.returnCity} onChange={handleChange} className="input input-bordered" placeholder="Ville ou lieu de destination" required />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-control">
                      <label className="label"><span className="label-text">Ville de retrait <span className="text-error">*</span></span></label>
                      <input type="text" name="pickupCity" value={form.pickupCity} onChange={handleChange} className="input input-bordered" placeholder="Ville de prise en charge" required />
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text">Ville de retour</span></label>
                      <input type="text" name="returnCity" value={form.returnCity} onChange={handleChange} className="input input-bordered" placeholder="Même ville si identique" />
                    </div>
                  </>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text">Date <span className="text-error">*</span></span></label>
                    <input type="date" name="pickupDate" value={form.pickupDate} onChange={handleChange} className="input input-bordered" required />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text">Heure <span className="text-error">*</span></span></label>
                    <input type="time" name="pickupTime" value={form.pickupTime} onChange={handleChange} className="input input-bordered" required />
                  </div>
                </div>

                {form.mode === 'without_driver' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label"><span className="label-text">Date de retour</span></label>
                      <input type="date" name="returnDate" value={form.returnDate} onChange={handleChange} className="input input-bordered" />
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text">Heure de retour</span></label>
                      <input type="time" name="returnTime" value={form.returnTime} onChange={handleChange} className="input input-bordered" />
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text">Véhicule <span className="text-error">*</span></span></label>
                    <select name="vehicle" value={form.vehicle} onChange={handleChange} className="select select-bordered" required>
                      {VEHICLES.map(v => (
                        <option key={v.id} value={v.id}>{v.label} — {v.maxPax} pers.</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text">Passagers</span></label>
                    <select name="passengers" value={form.passengers} onChange={handleChange} className="select select-bordered">
                      {Array.from({ length: 15 }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text">Nom complet <span className="text-error">*</span></span></label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} className="input input-bordered" required />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text">Téléphone <span className="text-error">*</span></span></label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="input input-bordered" placeholder="+212 6XX XXX XXX" required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text">Email</span></label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} className="input input-bordered" />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text">Langue</span></label>
                    <select name="language" value={form.language} onChange={handleChange} className="select select-bordered">
                      {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text">Notes</span></label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} className="textarea textarea-bordered" rows="2" placeholder="Sièges enfant, bagages, demande spéciale..."></textarea>
                </div>

                <button type="submit" className="btn btn-primary mt-2">
                  Confirmer la réservation
                </button>
              </div>
            </form>
          </div>
        )}
      </section>

      {/* ── REVIEWS ── */}
      <section id="reviews" className="py-16 px-4 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Avis Clients</h2>
            <p className="text-base-content/60 mt-2">Ils nous ont fait confiance</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="card bg-base-200 shadow-sm">
                <div className="card-body">
                  <div className="rating rating-sm mb-2">
                    {[...Array(5)].map((_, j) => (
                      <input key={j} type="radio" className={`mask mask-star-2 bg-secondary ${j < r.rating ? 'checked' : ''}`} checked={j < r.rating} readOnly />
                    ))}
                  </div>
                  <p className="text-sm text-base-content/70 italic">"{r.text}"</p>
                  <div className="mt-2">
                    <strong className="text-sm">{r.name}</strong>
                    <span className="text-xs text-base-content/50 block">{r.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" className="footer footer-center p-10 bg-neutral text-neutral-content">
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl w-full text-left">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2"><span className="text-secondary">✦</span> Golden Trans</h3>
            <p className="text-sm opacity-70">Location et transfert de véhicules dans tout le Maroc.</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Contact</h4>
            <p className="text-sm opacity-70">📞 +212 600 000 000</p>
            <p className="text-sm opacity-70">✉️ contact@goldentrans.ma</p>
            <p className="text-sm opacity-70">💬 WhatsApp</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Destinations</h4>
            <p className="text-sm opacity-70">Casablanca, Marrakech, Rabat, Fès, Tanger...</p>
            <p className="text-sm opacity-70">+{CITIES.length} villes desservies</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Horaires</h4>
            <p className="text-sm opacity-70">24h/24 — 7j/7</p>
            <p className="text-sm opacity-70">Service aéroport inclus</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 mt-6 text-center text-sm opacity-50 max-w-6xl w-full">
          © {new Date().getFullYear()} Golden Trans. Tous droits réservés.
        </div>
      </footer>

    </div>
  )
}