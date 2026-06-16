import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import ChatWindow from '../components/ChatWindow'
import InputBar from '../components/InputBar'
import { IconTrash } from '../components/icons'
import { sendMessage } from '../services/openai'
import { getMemorias } from '../services/memoriasService'
import { getConversas } from '../services/conversasService'
import { loadMessages, saveMessages } from '../services/chatStorage'

// Formata a hora atual no padrão HH:MM para exibir nas bolhas
function getTime() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatPage({ activeConversa, onSelecionar }) {
    // Conversa efetivamente aberta no chat
    const [conversa, setConversa] = useState(activeConversa)
    // Mensagens da conversa atual (carregadas do localStorage)
    const [messages, setMessages] = useState([])
    // Memórias do usuário (vêm da API) — injetadas no system prompt
    const [memorias, setMemorias] = useState([])
    const [isTyping, setIsTyping] = useState(false)
    const [error, setError] = useState(null)

    // Se não há conversa ativa, busca a primeira no servidor e a seleciona.
    // Assim o chat já funciona "de cara" com a conversa de exemplo (seed).
    useEffect(() => {
        if (activeConversa) {
            setConversa(activeConversa)
            return
        }
        getConversas()
            .then((lista) => {
                if (lista.length > 0) {
                    setConversa(lista[0])
                    onSelecionar?.(lista[0])
                }
            })
            .catch(() => {
                /* back-end fora do ar: chat só fica indisponível até criar/abrir conversa */
            })
    }, [activeConversa, onSelecionar])

    // Carrega o histórico (localStorage) sempre que a conversa muda
    useEffect(() => {
        setMessages(conversa ? loadMessages(conversa.id) : [])
    }, [conversa])

    // Busca as memórias uma vez para dar contexto ao Dealni (best-effort)
    useEffect(() => {
        getMemorias()
            .then(setMemorias)
            .catch(() => setMemorias([]))
    }, [])

    // Atualiza o estado e persiste no localStorage no mesmo passo.
    // (Salvar explicitamente, em vez de via useEffect, evita salvar uma lista
    //  desatualizada ao trocar de conversa.)
    function atualizarMensagens(novas) {
        setMessages(novas)
        if (conversa) saveMessages(conversa.id, novas)
    }

    async function handleSend(text) {
        if (!conversa) return
        const userMsg = { id: Date.now(), from: 'user', text, time: getTime() }
        const comUsuario = [...messages, userMsg]
        atualizarMensagens(comUsuario)
        setIsTyping(true)
        setError(null)

        try {
            // Envia o histórico + as memórias como contexto para a IA
            const reply = await sendMessage(comUsuario, memorias)
            const botMsg = { id: Date.now() + 1, from: 'bot', text: reply, time: getTime() }
            atualizarMensagens([...comUsuario, botMsg])
        } catch (err) {
            setError(err.message || 'Erro ao conectar com a API.')
        } finally {
            setIsTyping(false)
        }
    }

    function handleClear() {
        atualizarMensagens([])
        setError(null)
    }

    // Nenhuma conversa disponível ainda → orienta o usuário a criar uma
    if (!conversa) {
        return (
            <div className="chat-page">
                <Header titulo="Dealni" status="nenhuma conversa aberta" />
                <div className="chat-window">
                    <div className="chat-empty">
                        <h2 className="chat-empty__title">Nenhuma conversa aberta</h2>
                        <p className="chat-empty__subtitle">
                            Vá para <Link to="/conversas" className="link">Conversas</Link> e crie ou
                            abra uma para começar.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="chat-page">
            <Header titulo={conversa.titulo} status="online">
                {messages.length > 0 && (
                    <button
                        className="icon-btn icon-btn--perigo"
                        onClick={handleClear}
                        title="Limpar mensagens desta conversa"
                        aria-label="Limpar mensagens desta conversa"
                    >
                        <IconTrash size={18} />
                    </button>
                )}
            </Header>
            <ChatWindow messages={messages} isTyping={isTyping} />
            {error && <div className="chat-error">{error}</div>}
            <InputBar onSend={handleSend} disabled={isTyping} />
        </div>
    )
}
