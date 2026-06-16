import dealniAvatar from '../assets/hero.jpg'

// Animação de "digitando" exibida enquanto a resposta da IA é aguardada.
// Segue o mesmo layout das mensagens do assistente.
export default function TypingIndicator() {
    return (
        <div className="msg msg--bot">
            <div className="msg__avatar">
                <img src={dealniAvatar} alt="Dealni" />
            </div>
            <div className="msg__body">
                <p className="msg__author">Dealni</p>
                <div className="typing" aria-label="Dealni está digitando">
                    <span className="typing__dot" />
                    <span className="typing__dot" />
                    <span className="typing__dot" />
                </div>
            </div>
        </div>
    )
}
