import dealniAvatar from '../assets/hero.jpg'

// Exibe uma bolha de mensagem individual.
// A aparência muda dependendo de quem enviou: usuário (direita) ou Dealni (esquerda).
export default function MessageBubble({ message }) {
    const isUser = message.from === 'user'

    return (
        <div className={`message-row ${isUser ? 'message-row--user' : 'message-row--bot'}`}>
            {/* Avatar do Dealni aparece só nas mensagens do bot */}
            {!isUser && (
                <div className="message-avatar">
                    <img src={dealniAvatar} alt="Dealni" />
                </div>
            )}
            <div className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--bot'}`}>
                <p className="message-text">{message.text}</p>
                <span className="message-time">{message.time}</span>
            </div>
        </div>
    )
}
