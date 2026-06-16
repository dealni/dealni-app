import { useCallback, useEffect, useState } from 'react'

// Tema visual da aplicação:
//   "light" → estilo Claude (cream + coral)
//   "dark"  → estilo ChatGPT (#212121)
// O valor é persistido no localStorage e aplicado em <html data-theme="...">,
// que é o seletor usado pelas variáveis CSS em App.css.

const STORAGE_KEY = 'dealni:theme'

// Lê a preferência salva; se não houver, segue o tema do sistema operacional.
function getInitialTheme() {
    if (typeof window === 'undefined') return 'light'
    const salvo = localStorage.getItem(STORAGE_KEY)
    if (salvo === 'light' || salvo === 'dark') return salvo
    const prefereDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    return prefereDark ? 'dark' : 'light'
}

export function useTheme() {
    const [theme, setTheme] = useState(getInitialTheme)

    // Sempre que o tema muda, reflete no <html> e persiste a escolha.
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem(STORAGE_KEY, theme)
    }, [theme])

    const toggleTheme = useCallback(() => {
        setTheme((atual) => (atual === 'light' ? 'dark' : 'light'))
    }, [])

    return { theme, toggleTheme }
}
