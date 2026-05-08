const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'meta-llama/llama-3.3-70b-instruct:free'

export async function generateWAMessage(booking) {
  const isWith = booking.type === 'with_driver'

  const details = isWith
    ? `Trajet : ${booking.from} → ${booking.to}
Date : ${booking.date} à ${booking.time}`
    : `Location à ${booking.pickupCity}
Début : ${booking.pickupDate} à ${booking.pickupTime}
Retour : ${booking.returnCity} — ${booking.returnDate} à ${booking.returnTime}`

  const prompt = `Tu es un assistant commercial pour une agence de location de véhicules au Maroc qui aide les petites sociétés locales à recevoir des réservations de clients internationaux.

Réservation reçue :
- Type : ${isWith ? 'Avec chauffeur (transfert)' : 'Sans chauffeur (location auto)'}
- Client : ${booking.name}
- Téléphone : ${booking.phone}
- ${details}
- Véhicule : ${booking.vehicle}
- Passagers : ${booking.passengers}

Génère un message WhatsApp professionnel en français pour accueillir le client. Le message doit :
1. Remercier chaleureusement le client pour sa réservation
2. Confirmer les détails du voyage/location
3. Annoncer qu'on va lui proposer les meilleures options disponibles (marques et modèles exacts)
4. Lui demander s'il préfère payer en ligne ou à la livraison du véhicule
5. Être chaleureux, professionnel et concis (max 150 mots)
6. Signature : L'équipe Golden Trans`

  const apiKey = process.env.VITE_ANTHROPIC_AUTH_TOKEN
  if (!apiKey) {
    const t = isWith ? 'votre transfert' : 'votre location'
    return `Bonjour ${booking.name} ! 👋

Merci pour ${t} de ${isWith ? `${booking.from} à ${booking.to}` : booking.pickupCity} le ${isWith ? booking.date : booking.pickupDate}.

Nous avons bien reçu votre demande pour un ${booking.vehicle}. Notre équipe vous contacte très prochainement pour vous proposer les meilleures options disponibles.

Souhaitez-vous payer en ligne ou à la livraison ?

Belle journée ! 🌟
— L'équipe Golden Trans`
  }

  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 8000)
    const res = await fetch(OPENROUTER_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
      }),
      signal: ctrl.signal,
    })
    clearTimeout(timer)
    const data = await res.json()
    return data.choices?.[0]?.message?.content || null
  } catch {
    return null
  }
}
