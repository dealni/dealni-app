// Listagem das conversas salvas, com ações de abrir, renomear e excluir.

import { IconEdit, IconTrash } from './icons'

function formatarData(iso) {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export default function ConversaList({ conversas, ativaId, onAbrir, onRenomear, onExcluir }) {
    if (!conversas.length) {
        return <p className="lista-vazia">Nenhuma conversa salva ainda. Crie uma acima.</p>
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
                        <button
                            className="icon-btn"
                            title="Renomear"
                            aria-label="Renomear conversa"
                            onClick={() => onRenomear(conversa)}
                        >
                            <IconEdit size={18} />
                        </button>
                        <button
                            className="icon-btn icon-btn--perigo"
                            title="Excluir"
                            aria-label="Excluir conversa"
                            onClick={() => onExcluir(conversa)}
                        >
                            <IconTrash size={18} />
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    )
}
