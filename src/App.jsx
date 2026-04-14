import { useState, useEffect } from 'react'
import Header from './components/Header'
import ChatWindow from './components/ChatWindow'
import InputBar from './components/InputBar'
import { sendMessage } from './services/openai'
import './App.css'

const STORAGE_KEY = 'dealni_chat_history'

// Formata a hora atual no padrão HH:MM para exibir nas bolhas
function getTime() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

// Tenta carregar o histórico salvo no localStorage ao iniciar o app
function loadHistory() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) : []
    } catch {
        return []
    }
}

export default function App() {
    // Estado principal: lista de todas as mensagens do chat
    const [messages, setMessages] = useState(loadHistory)

    // Controla se o Dealni está "digitando" (aguardando resposta da API)
    const [isTyping, setIsTyping] = useState(false)

    // Armazena a mensagem de erro caso a API falhe
    const [error, setError] = useState(null)

    // Sempre que o histórico muda, salva no localStorage para persistir entre recarregamentos
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }, [messages])

    async function handleSend(text) {
        // Adiciona a mensagem do usuário ao histórico imediatamente
        const userMsg = { id: Date.now(), from: 'user', text, time: getTime() }
        const updated = [...messages, userMsg]
        setMessages(updated)
        setIsTyping(true)
        setError(null)

        try {
            // Envia todo o histórico como contexto para a API manter a conversa coerente
            const reply = await sendMessage(updated)
            const botMsg = { id: Date.now() + 1, from: 'bot', text: reply, time: getTime() }
            setMessages((prev) => [...prev, botMsg])
        } catch (err) {
            // Exibe o erro para o usuário sem travar o app
            setError(err.message || 'Erro ao conectar com a API.')
        } finally {
            setIsTyping(false)
        }
    }

    function handleClearChat() {
        setMessages([])
        setError(null)
        localStorage.removeItem(STORAGE_KEY)
    }

    return (
        <div className="app">
            <div className="chat-container">
                <div className="chat-header-wrapper">
                    <Header />
                    {messages.length > 0 && (
                        <button className="btn-clear" onClick={handleClearChat} title="Limpar conversa">
                            🗑
                        </button>
                    )}
                </div>
                <ChatWindow messages={messages} isTyping={isTyping} />
                {error && (
                    <div className="chat-error">
                        ❌ {error}
                    </div>
                )}
                <InputBar onSend={handleSend} disabled={isTyping} />
            </div>
        </div>
    )
}
