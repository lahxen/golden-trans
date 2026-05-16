import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24, background: '#0f1a2e' }}>
      <h1 style={{ fontSize: '4rem', margin: 0, color: '#D4AF37' }}>404</h1>
      <p style={{ fontSize: '1.2rem', marginTop: 8, color: '#94a3b8' }}>Page not found</p>
      <p style={{ color: '#64748b', marginTop: 4 }}>The page you're looking for doesn't exist.</p>
      <Link to="/" style={{ marginTop: 24, padding: '12px 32px', background: '#D4AF37', color: '#0f1a2e', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>Back to Home</Link>
    </div>
  )
}