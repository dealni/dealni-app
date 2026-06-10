import dealniAvatar from '../assets/hero.jpg'

// O status muda para "digitando..." enquanto o Dealni prepara a resposta, como no Telegram
export default function Header({ isTyping }) {
    return (
        <header className="chat-header">
            <div className="chat-header-avatar">
                <img src={dealniAvatar} alt="Dealni" />
            </div>
            <div className="chat-header-info">
                <span className="chat-header-name">Dealni 😼</span>
                <span className={`chat-header-status ${isTyping ? 'chat-header-status--typing' : ''}`}>
                    {isTyping ? 'digitando...' : 'online'}
                </span>
            </div>
        </header>
    )
}
