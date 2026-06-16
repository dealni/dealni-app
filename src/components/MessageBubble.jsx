import dealniAvatar from '../assets/hero.jpg'

// Exibe uma mensagem individual.
// Assistente: largura total, sem balão, com avatar e nome (estilo Claude/ChatGPT).
// Usuário: balão arredondado alinhado à direita.
export default function MessageBubble({ message }) {
    const isUser = message.from === 'user'

    if (isUser) {
        return (
            <div className="msg msg--user">
                <div className="msg__bubble">
                    <p className="msg__text">{message.text}</p>
                </div>
                <span className="msg__time">{message.time}</span>
            </div>
        )
    }

    return (
        <div className="msg msg--bot">
            <div className="msg__avatar">
                <img src={dealniAvatar} alt="Dealni" />
            </div>
            <div className="msg__body">
                <p className="msg__author">Dealni</p>
                <p className="msg__text">{message.text}</p>
                <span className="msg__time">{message.time}</span>
            </div>
        </div>
    )
}
