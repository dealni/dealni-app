import dealniAvatar from '../assets/hero.jpg'

export default function TypingIndicator() {
    return (
        <div className="message-row message-row--bot">
            <div className="message-avatar">
                <img src={dealniAvatar} alt="Dealni" />
            </div>
            <div className="message-bubble message-bubble--bot typing-bubble">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
            </div>
        </div>
    )
}
