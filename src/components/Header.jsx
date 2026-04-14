import dealniAvatar from '../assets/hero.jpg'

export default function Header() {
    return (
        <header className="chat-header">
            <div className="chat-header-avatar">
                <img src={dealniAvatar} alt="Dealni" />
            </div>
            <div className="chat-header-info">
                <span className="chat-header-name">Dealni 😼</span>
                <span className="chat-header-status">online</span>
            </div>
        </header>
    )
}
