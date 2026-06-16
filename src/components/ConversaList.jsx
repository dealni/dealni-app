// Listagem das conversas salvas, com ações de abrir, renomear e excluir.

function formatarData(iso) {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export default function ConversaList({ conversas, ativaId, onAbrir, onRenomear, onExcluir }) {
    if (!conversas.length) {
        return <p className="lista-vazia">Nenhuma conversa salva ainda. Crie uma acima. 🗂️</p>
    }

    return (
        <ul className="conversa-lista">
            {conversas.map((conversa) => (
                <li
                    key={conversa.id}
                    className={
                        'conversa-item' + (conversa.id === ativaId ? ' conversa-item--ativa' : '')
                    }
                >
                    <button className="conversa-item__abrir" onClick={() => onAbrir(conversa)}>
                        <span className="conversa-item__titulo">{conversa.titulo}</span>
                        <span className="conversa-item__data">{formatarData(conversa.criadaEm)}</span>
                    </button>
                    <div className="conversa-item__acoes">
                        <button className="icon-btn" title="Renomear" onClick={() => onRenomear(conversa)}>
                            ✏️
                        </button>
                        <button
                            className="icon-btn icon-btn--perigo"
                            title="Excluir"
                            onClick={() => onExcluir(conversa)}
                        >
                            🗑️
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    )
}
