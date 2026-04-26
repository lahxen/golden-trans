import { useState } from 'react'
import { makeClaudeRequest } from '../config/apiConfig'
import './ChatComponent.css'

const SYSTEM_PROMPT = `You are a helpful assistant for Golden Trans, a premium luxury chauffeur service based in Morocco.
You help clients with:
- Booking private transfers across Morocco (Casablanca, Marrakech, Rabat, Fes, Agadir, and more)
- Information about our fleet: Mercedes V-Class (5 passengers), Ford Tourneo, and Luxury Coach Bus
- Airport transfers, city-to-city journeys, and customized tours
- Pricing inquiries and itinerary suggestions
- English, French, and Arabic spoken

Always be professional, warm, and concise. For bookings, direct clients to the booking form on the page or to contact us directly. Do not invent specific prices — instead encourage them to fill in the booking form for a personalized quote.`

function ChatComponent() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError('')

    const systemMessage = { role: 'system', content: SYSTEM_PROMPT }

    try {
      const response = await makeClaudeRequest([systemMessage, ...messages, userMessage])
      const assistantMessage = {
        role: 'assistant',
        content: response.choices[0].message.content
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError(err.message)
      setMessages(prev => prev.slice(0, -1)) // Remove user message on error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Golden Trans Assistant</h2>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p>Ask me about bookings, transfers, or our fleet across Morocco</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`message message-${msg.role}`}>
            <div className="message-role">
              {msg.role === 'user' ? 'You' : 'Golden Trans'}
            </div>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="message message-assistant">
            <div className="message-role">Golden Trans</div>
            <div className="message-content typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="chat-error">
          <p>⚠️ {error}</p>
        </div>
      )}

      <form className="chat-input-form" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          className="chat-input"
        />
        <button type="submit" disabled={loading} className="chat-send-btn">
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

export default ChatComponent
