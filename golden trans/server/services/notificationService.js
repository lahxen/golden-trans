import nodemailer from 'nodemailer'
import { sendWAMessage } from './whatsappService.js'
import { generateWAMessage } from './aiService.js'

const ADMIN_EMAIL = 'goldentrans68@gmail.com'
const ADMIN_PHONE = '212726760517'

function getTransporter() {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS
  if (!user || !pass) return null
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
    family: 4,
  })
}

function formatBookingHTML(booking) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <div style="background:#1a3a5c;color:#D4AF37;padding:24px;text-align:center;border-radius:12px 12px 0 0">
        <h1 style="margin:0">Golden Trans</h1>
        <p style="margin:8px 0 0;color:#fff">Nouvelle réservation</p>
      </div>
      <div style="padding:24px;background:#f8f9fa;border-radius:0 0 12px 12px">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666">Réf</td><td style="padding:8px 0;font-weight:bold">${booking.ref}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Client</td><td style="padding:8px 0;font-weight:bold">${booking.name}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Téléphone</td><td style="padding:8px 0;font-weight:bold">${booking.phone}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0">${booking.email || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Trajet</td><td style="padding:8px 0;font-weight:bold">${booking.pickup} → ${booking.dropoff}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Date</td><td style="padding:8px 0">${booking.date} à ${booking.time}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Véhicule</td><td style="padding:8px 0">${booking.deal?.type || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Passagers</td><td style="padding:8px 0">${booking.passengers}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Paiement</td><td style="padding:8px 0">${booking.paymentMethod === 'online' ? 'En ligne' : 'À l\'arrivée'}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Total</td><td style="padding:8px 0;font-weight:bold;font-size:18px">${booking.totalPrice?.toLocaleString()} MAD</td></tr>
        </table>
        ${booking.specialRequest ? `<div style="margin-top:16px;padding:12px;background:#fff3cd;border-radius:8px;font-size:13px"><strong>Demande spéciale :</strong> ${booking.specialRequest}</div>` : ''}
        <div style="margin-top:20px;padding-top:16px;border-top:1px solid#dee2e6;text-align:center;color:#999;font-size:12px">
          Golden Trans · Morocco
        </div>
      </div>
    </div>
  `
}

function formatBookingText(booking) {
  const lines = [
    `🔔 NOUVELLE RÉSERVATION`,
    `Réf: ${booking.ref}`,
    `Client: ${booking.name}`,
    `Tél: ${booking.phone}`,
    `Email: ${booking.email || '—'}`,
    `Trajet: ${booking.pickup} → ${booking.dropoff}`,
    `Date: ${booking.date} à ${booking.time}`,
    `Véhicule: ${booking.deal?.type || '—'}`,
    `Passagers: ${booking.passengers}`,
    `Paiement: ${booking.paymentMethod === 'online' ? 'En ligne' : 'À l\'arrivée'}`,
    `Total: ${(booking.totalPrice || 0).toLocaleString()} MAD`,
  ]
  if (booking.specialRequest) lines.push(`\nDemande: ${booking.specialRequest}`)
  lines.push(`\nhttps://golden-trans.pages.dev/admin`)
  return lines.join('\n')
}

// ── Send email notification to admin ──
export async function sendEmailNotification(booking) {
  const transporter = getTransporter()
  if (!transporter) {
    console.log(`[EMAIL MOCK] New booking: ${booking.ref} — ${booking.name}`)
    return { mock: true }
  }
  try {
    await transporter.sendMail({
      from: `"Golden Trans" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `🔔 Nouvelle réservation — ${booking.name} (${booking.ref})`,
      html: formatBookingHTML(booking),
    })
    console.log(`✅ Email sent for booking ${booking.ref}`)
    return { sent: true }
  } catch (err) {
    console.error(`❌ Email failed: ${err.message}`)
    return { error: err.message }
  }
}

// ── Send WhatsApp notification to admin ──
export async function sendWANotification(booking) {
  const text = formatBookingText(booking)
  return sendWAMessage(ADMIN_PHONE, text)
}

// ── Send auto-reply to customer ──
export async function sendCustomerReply(booking) {
  const message = await generateWAMessage(booking)
  if (!message) {
    console.log(`[CUSTOMER MOCK] No AI message generated for ${booking.phone}`)
    return
  }
  return sendWAMessage(booking.phone, message)
}
