export async function sendWAMessage(phone, message) {
  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_ID

  if (!token || !phoneId) {
    console.log(`[WA MOCK] To: ${phone}`)
    console.log(`[WA MOCK] Message: ${message.substring(0, 80)}...`)
    return { mock: true, to: phone }
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v18.0/${phoneId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone.replace(/[^0-9]/g, ''),
          type: 'text',
          text: { body: message },
        }),
      }
    )
    const data = await res.json()
    if (data?.messages?.[0]?.id) {
      console.log('✅ WhatsApp sent to', phone)
    } else {
      console.error('[WA ERROR]', JSON.stringify(data))
    }
    return data
  } catch (err) {
    console.error('[WA ERROR]', err.message)
    return { error: err.message }
  }
}
