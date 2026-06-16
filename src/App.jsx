import { useState, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ChatPage from './pages/ChatPage'
import ConversasPage from './pages/ConversasPage'
import MemoriasPage from './pages/MemoriasPage'
import SobrePage from './pages/SobrePage'
import { getActiveConversa, setActiveConversa } from './services/chatStorage'
import './App.css'

// Componente raiz: monta o layout (menu + área de páginas) e o roteamento.
// A "conversa ativa" é o estado compartilhado entre o Chat e a página de Conversas.
export default function App() {
    const [activeConversa, setActive] = useState(getActiveConversa)

    // Define qual conversa está aberta (e persiste no localStorage).
    // useCallback mantém a mesma referência entre renders (estabiliza efeitos que dependem dela).
    const selecionarConversa = useCallback((conversa) => {
        setActive(conversa)
        setActiveConversa(conversa)
    }, [])

    return (
        <div className="app">
            <div className="app-shell">
                <Navbar />
                <main className="app-content">
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
                        <Route path="/sobre" element={<SobrePage />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}
