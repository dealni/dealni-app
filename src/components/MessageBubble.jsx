import dealniAvatar from '../assets/hero.jpg'

// Converte formatações simples que o modelo costuma usar em elementos React:
// **negrito**, `código` e links http(s) clicáveis. Sem dependências externas.
function formatText(text) {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|https?:\/\/[^\s]+)/g)
    return parts.map((part, i) => {
        if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
            return <code key={i}>{part.slice(1, -1)}</code>
        }
        if (/^https?:\/\//.test(part)) {
            return (
                <a key={i} href={part} target="_blank" rel="noopener noreferrer">
                    {part}
                </a>
            )
        }
        return part
    })
}

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
                <p className="message-text">{isUser ? message.text : formatText(message.text)}</p>
                {/* A mensagem em streaming ainda não tem horário definido */}
                {message.time && <span className="message-time">{message.time}</span>}
            </div>
        </div>
    )
}
