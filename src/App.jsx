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

// Gera um id único para cada mensagem (Date.now() pode colidir em envios rápidos)
function getId() {
    return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
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
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
        } catch {
            // Quota cheia ou localStorage indisponível: o chat segue funcionando sem persistir
        }
    }, [messages])

    // Envia o histórico para a API e adiciona a resposta do Dealni ao chat.
    // Separado de handleSend para permitir "tentar novamente" sem duplicar a mensagem do usuário.
    async function requestReply(history) {
        setIsTyping(true)
        setError(null)

        try {
            // Envia todo o histórico como contexto para a API manter a conversa coerente
            const reply = await sendMessage(history)
            const botMsg = { id: getId(), from: 'bot', text: reply, time: getTime() }
            setMessages((prev) => [...prev, botMsg])
        } catch (err) {
            // Exibe o erro para o usuário sem travar o app
            setError(err.message || 'Erro ao conectar com a API.')
        } finally {
            setIsTyping(false)
        }
    }

    function handleSend(text) {
        // Adiciona a mensagem do usuário ao histórico imediatamente
        const userMsg = { id: getId(), from: 'user', text, time: getTime() }
        const updated = [...messages, userMsg]
        setMessages(updated)
        requestReply(updated)
    }

    // Reenvia o histórico atual (a mensagem do usuário já está nele)
    function handleRetry() {
        requestReply(messages)
    }

    function handleClearChat() {
        if (!window.confirm('Apagar toda a conversa?')) return
        setMessages([])
        setError(null)
        localStorage.removeItem(STORAGE_KEY)
    }

    return (
        <div className="app">
            <div className="chat-container">
                <div className="chat-header-wrapper">
                    <Header isTyping={isTyping} />
                    {messages.length > 0 && (
                        <button className="btn-clear" onClick={handleClearChat} title="Limpar conversa">
                            🗑
                        </button>
                    )}
                </div>
                <ChatWindow messages={messages} isTyping={isTyping} onSuggestion={handleSend} />
                {error && (
                    <div className="chat-error">
                        <span>❌ {error}</span>
                        <button className="btn-retry" onClick={handleRetry} disabled={isTyping}>
                            Tentar novamente
                        </button>
                    </div>
                )}
                <InputBar onSend={handleSend} disabled={isTyping} />
            </div>
        </div>
    )
}
