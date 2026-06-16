// Barra superior fina do chat (estilo Claude/ChatGPT): título da conversa,
// status e, opcionalmente, ações à direita (passadas via children).
export default function Header({ titulo = 'Dealni', status = 'online', children }) {
    return (
        <header className="chat-topbar">
            <div className="chat-topbar__info">
                <span className="chat-topbar__name">{titulo}</span>
                <span className="chat-topbar__status">{status}</span>
            </div>
            {children && <div className="chat-topbar__actions">{children}</div>}
        </header>
    )
}
