import dealniAvatar from '../assets/hero.jpg'

// `subtitulo` mostra o título da conversa ativa; cai em "online" quando não informado.
export default function Header({ subtitulo = 'online' }) {
    return (
        <header className="chat-header">
            <div className="chat-header-avatar">
                <img src={dealniAvatar} alt="Dealni" />
            </div>
            <div className="chat-header-info">
                <span className="chat-header-name">Dealni 😼</span>
                <span className="chat-header-status">{subtitulo}</span>
            </div>
        </header>
    )
}
