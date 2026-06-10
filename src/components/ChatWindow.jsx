import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

// Sugestões de prompt exibidas na tela inicial, como nos chats do Claude/ChatGPT
const SUGGESTIONS = [
    'Me conte uma curiosidade sobre gatos 🐱',
    'Me ajude a escrever uma mensagem',
    'Explique um conceito de forma simples',
]

export default function ChatWindow({ messages, isTyping, streamingText, onSuggestion }) {
    // Referência ao elemento invisível no final da lista, usado para o scroll automático
    const bottomRef = useRef(null)

    // Sempre que uma mensagem nova chegar (ou o Dealni começar a digitar/responder),
    // rola suavemente até o fim da conversa
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping, streamingText])

    return (
        <div className="chat-window">
            {/* Tela de boas-vindas exibida enquanto não há mensagens */}
            {messages.length === 0 && (
                <div className="chat-empty">
                    <span className="chat-empty-icon">😼</span>
                    <h1 className="chat-empty-title">Oi! Como posso ajudar?</h1>
                    <p className="chat-empty-subtitle">
                        Eu sou o <strong>Dealni</strong>, um gato inteligente.
                    </p>
                    <div className="chat-suggestions">
                        {SUGGESTIONS.map((s) => (
                            <button key={s} className="chat-suggestion" onClick={() => onSuggestion(s)}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Renderiza uma bolha para cada mensagem do histórico */}
            {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Resposta parcial em streaming: o texto vai surgindo conforme chega */}
            {streamingText != null && (
                <MessageBubble message={{ from: 'bot', text: streamingText }} />
            )}

            {/* Animação de digitação enquanto aguarda o primeiro chunk da resposta */}
            {isTyping && streamingText == null && <TypingIndicator />}

            {/* Elemento âncora para o scroll automático */}
            <div ref={bottomRef} />
        </div>
    )
}
