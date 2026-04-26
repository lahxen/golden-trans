const BASE_URL = import.meta.env.VITE_ANTHROPIC_BASE_URL || 'https://openrouter.ai/api/v1'
const AUTH_TOKEN = import.meta.env.VITE_ANTHROPIC_AUTH_TOKEN || ''
const DEFAULT_MODEL = import.meta.env.VITE_ANTHROPIC_DEFAULT_MODEL || 'meta-llama/llama-3.3-70b-instruct:free'

export const makeClaudeRequest = async (messages, options = {}) => {
  if (!AUTH_TOKEN) {
    throw new Error('VITE_ANTHROPIC_AUTH_TOKEN is not configured. Please set it in your .env file.')
  }

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`,
      'HTTP-Referer': window.location.href,
      'X-Title': 'Golden Trans',
    },
    body: JSON.stringify({
      model: options.model || DEFAULT_MODEL,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens || 1024,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`API Error: ${error.message || response.statusText}`)
  }

  return await response.json()
}
