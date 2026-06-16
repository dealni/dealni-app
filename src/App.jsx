import { useState, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { IconMenu } from './components/icons'
import ChatPage from './pages/ChatPage'
import ConversasPage from './pages/ConversasPage'
import MemoriasPage from './pages/MemoriasPage'
import { getActiveConversa, setActiveConversa } from './services/chatStorage'
import './App.css'

// Componente raiz: monta o layout (sidebar + área de páginas) e o roteamento.
// A "conversa ativa" é o estado compartilhado entre o Chat e a página de Conversas.
export default function App() {
    const [activeConversa, setActive] = useState(getActiveConversa)
    // Controle da sidebar no mobile (off-canvas)
    const [menuAberto, setMenuAberto] = useState(false)

    // Define qual conversa está aberta (e persiste no localStorage).
    // useCallback mantém a mesma referência entre renders (estabiliza efeitos que dependem dela).
    const selecionarConversa = useCallback((conversa) => {
        setActive(conversa)
        setActiveConversa(conversa)
    }, [])

    const fecharMenu = useCallback(() => setMenuAberto(false), [])

    return (
        <div className="app">
            <div className="app-shell">
                <button
                    className="sidebar-mobile-btn"
                    onClick={() => setMenuAberto(true)}
                    aria-label="Abrir menu"
                >
                    <IconMenu size={20} />
                </button>

                {menuAberto && <div className="sidebar-backdrop" onClick={fecharMenu} />}

                <Sidebar aberta={menuAberto} onNavegar={fecharMenu} />

                <main className="main-area">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ChatPage
                                    activeConversa={activeConversa}
                                    onSelecionar={selecionarConversa}
                                />
                            }
                        />
                        <Route
                            path="/conversas"
                            element={
                                <ConversasPage
                                    activeConversa={activeConversa}
                                    onSelecionar={selecionarConversa}
                                />
                            }
                        />
                        <Route path="/memorias" element={<MemoriasPage />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}
