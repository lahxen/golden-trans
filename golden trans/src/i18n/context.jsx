import { createContext, useContext, useState, useCallback } from 'react'
import fr from './fr.js'
import en from './en.js'
import ar from './ar.js'

const LOCALE_MAP = { fr, en, ar }
const STORAGE_KEY = 'gt_lang'

export function getInitialLang() {
  try { return localStorage.getItem(STORAGE_KEY) || 'fr' } catch { return 'fr' }
}

const LangCtx = createContext()

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang)

  const setLang = useCallback(code => {
    setLangState(code)
    try { localStorage.setItem(STORAGE_KEY, code) } catch {}
  }, [])

  const t = LOCALE_MAP[lang] || fr
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  return <LangCtx.Provider value={{ lang, setLang, t, dir }}>{children}</LangCtx.Provider>
}

export function useTranslation() {
  return useContext(LangCtx)
}
