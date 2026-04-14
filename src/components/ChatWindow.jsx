import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

export default function ChatWindow({ messages, isTyping }) {
    // Referência ao elemento invisível no final da lista, usado para o scroll automático
    const bottomRef = useRef(null)

    // Sempre que uma mensagem nova chegar (ou o Dealni começar a digitar),
    // rola suavemente até o fim da conversa
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    return (
        <div className="chat-window">
            {/* Tela de boas-vindas exibida enquanto não há mensagens */}
            {messages.length === 0 && (
                <div className="chat-empty">
                    <span className="chat-empty-icon">😼</span>
                    <p>Oi! Eu sou o <strong>Dealni</strong>, um gato inteligente.</p>
                    <p>Manda uma mensagem pra começar! 💬</p>
                </div>
            )}

            {/* Renderiza uma bolha para cada mensagem do histórico */}
            {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Mostra a animação de digitação enquanto aguarda a resposta da API */}
            {isTyping && <TypingIndicator />}

            {/* Elemento âncora para o scroll automático */}
            <div ref={bottomRef} />
        </div>
    )
}
