import { useState, useRef, useEffect } from 'react'

export default function AutocompleteInput({ items, placeholder, icon, value, onChange, onSelect }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value || '')
  const [highlightIdx, setHighlightIdx] = useState(-1)
  const ref = useRef(null)

  const filtered = items.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8)

  useEffect(() => {
    const handleClick = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => { setHighlightIdx(-1) }, [query])

  function handleInput(e) {
    const val = e.target.value
    setQuery(val)
    setOpen(true)
    if (onChange) onChange(val)
  }

  function handleSelect(item) {
    setQuery(item)
    setOpen(false)
    if (onSelect) onSelect(item)
  }

  function handleKeyDown(e) {
    if (!open) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIdx(i => Math.min(i + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIdx(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && highlightIdx >= 0) { e.preventDefault(); handleSelect(filtered[highlightIdx]) }
    if (e.key === 'Escape') setOpen(false)
  }

  function highlightMatch(text, query) {
    if (!query) return text
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <span className="text-secondary font-semibold">{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </>
    )
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">{icon}</span>
        )}
        <input
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all ${icon ? 'pl-10' : ''}`}
        />
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 max-h-56 overflow-y-auto animate-fadeIn">
          {filtered.map((item, i) => (
            <button
              key={item}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setHighlightIdx(i)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                i === highlightIdx ? 'bg-primary/5 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-gray-400 text-base">📍</span>
              <span>{highlightMatch(item, query)}</span>
            </button>
          ))}
        </div>
      )}

      {open && query && filtered.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-lg border border-gray-100 py-4 px-4 z-50 animate-fadeIn">
          <p className="text-gray-400 text-sm text-center">Aucun résultat pour "{query}"</p>
        </div>
      )}
    </div>
  )
}
