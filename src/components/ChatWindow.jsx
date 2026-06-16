import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import dealniAvatar from '../assets/hero.jpg'

export default function ChatWindow({ messages, isTyping }) {
    // Referência ao elemento invisível no final da lista, usado para o scroll automático
    const bottomRef = useRef(null)

    // Sempre que uma mensagem nova chegar (ou o Dealni começar a digitar),
    // rola suavemente até o fim da conversa
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    // Tela de boas-vindas (saudação no estilo Claude) enquanto não há mensagens
    if (messages.length === 0 && !isTyping) {
        return (
            <div className="chat-window">
                <div className="chat-empty">
                    <span className="chat-empty__mark">
                        <img src={dealniAvatar} alt="Dealni" />
                    </span>
                    <h2 className="chat-empty__title">Olá! Eu sou o Dealni</h2>
                    <p className="chat-empty__subtitle">
                        Um assistente de IA com jeito de gato. Manda uma mensagem para começarmos a conversar.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="chat-window">
            <div className="chat-window__inner">
                {/* Renderiza uma mensagem para cada item do histórico */}
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}

                {/* Animação de digitação enquanto aguarda a resposta da API */}
                {isTyping && <TypingIndicator />}

                {/* Elemento âncora para o scroll automático */}
                <div ref={bottomRef} />
            </div>
        </div>
    )
}
