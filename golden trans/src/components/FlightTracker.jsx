import { useState, useEffect } from 'react'
import './FlightTracker.css'

const AVIATION_KEY = import.meta.env.VITE_AVIATION_API_KEY

function addMinutes(dateStr, min) {
  const d = new Date(dateStr)
  d.setMinutes(d.getMinutes() + min)
  return d
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function FlightTracker({ flightNumber }) {
  const [flightData, setFlightData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fn = flightNumber?.trim().toUpperCase()
    if (!fn || fn.length < 4) {
      setFlightData(null)
      setError(null)
      return
    }

    if (!AVIATION_KEY) {
      setFlightData({ mock: true, id: fn })
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `http://api.aviationstack.com/v1/flights?access_key=${AVIATION_KEY}&flight_iata=${fn}`,
          { signal: controller.signal }
        )
        const json = await res.json()
        if (json.data?.length > 0) {
          setFlightData(json.data[0])
        } else {
          setError('Flight not found. Please verify the flight number.')
        }
      } catch (e) {
        if (e.name !== 'AbortError') setError('Unable to fetch live data.')
      } finally {
        setLoading(false)
      }
    }, 800)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [flightNumber])

  const fn = flightNumber?.trim().toUpperCase()
  if (!fn || fn.length < 4) return null

  if (loading) {
    return (
      <div className="flight-tracker ft-loading">
        <span className="ft-spinner" /> Searching for {fn}...
      </div>
    )
  }

  if (error) {
    return <div className="flight-tracker ft-error">⚠️ {error}</div>
  }

  if (!flightData) return null

  // No API key — show peace-of-mind tracking badge
  if (flightData.mock) {
    return (
      <div className="flight-tracker">
        <div className="ft-row ft-header-row">
          <span className="ft-badge ft-tracking">🛰️ Tracking Active</span>
          <span className="ft-flight-id">✈️ {fn}</span>
        </div>
        <div className="ft-guarantee">
          ✅ Your driver will monitor this flight and wait for you — no extra charge.
        </div>
        <p className="ft-api-note">
          Add <code>VITE_AVIATION_API_KEY</code> to .env for live arrival times.
        </p>
      </div>
    )
  }

  // Live data from AviationStack
  const status = flightData.flight_status
  const arrivalEst = flightData.arrival?.estimated || flightData.arrival?.scheduled
  const isDelayed = status === 'delayed'
  const isLanded = status === 'landed'
  const readyTime = arrivalEst ? addMinutes(arrivalEst, 45) : null

  const badgeText = isLanded ? '🟢 Landed' : isDelayed ? '🟡 Delayed' : '🟢 On Time'
  const badgeClass = isDelayed ? 'ft-yellow' : 'ft-green'

  return (
    <div className={`flight-tracker${isDelayed ? ' ft-is-delayed' : ''}`}>
      <div className="ft-row ft-header-row">
        <span className={`ft-badge ${badgeClass}`}>{badgeText}</span>
        <span className="ft-flight-id">✈️ {fn}</span>
      </div>
      <div className="ft-row ft-stats-row">
        {flightData.departure?.airport && (
          <div className="ft-stat">
            <span className="ft-stat-label">Departs</span>
            <span className="ft-stat-value">{flightData.departure.airport}</span>
          </div>
        )}
        {arrivalEst && (
          <div className="ft-stat">
            <span className="ft-stat-label">Arrives</span>
            <span className="ft-stat-value">{formatTime(arrivalEst)}</span>
          </div>
        )}
        {readyTime && (
          <div className="ft-stat ft-stat-highlight">
            <span className="ft-stat-label">Driver Ready At</span>
            <span className="ft-stat-value">{formatTime(readyTime)}</span>
          </div>
        )}
      </div>
      <div className={`ft-guarantee${isDelayed ? ' ft-guarantee-delayed' : ''}`}>
        {isDelayed
          ? '⚠️ Flight delayed — your driver has been notified and will wait at no extra charge.'
          : '✅ Your driver will wait for you — no extra charge.'}
      </div>
    </div>
  )
}

export default FlightTracker
