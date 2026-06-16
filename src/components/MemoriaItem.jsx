// Card de uma única memória, com botões de editar e excluir.
// Recebe a memória e os callbacks por props (props bem definidas, componente reutilizável).

export default function MemoriaItem({ memoria, onEditar, onExcluir }) {
    return (
        <li className="memoria-item">
            <div className="memoria-item__corpo">
                <div className="memoria-item__cabecalho">
                    <strong className="memoria-item__titulo">{memoria.titulo}</strong>
                    <span className="memoria-item__categoria">{memoria.categoria}</span>
                </div>
                <p className="memoria-item__conteudo">{memoria.conteudo}</p>
            </div>
            <div className="memoria-item__acoes">
                <button className="icon-btn" title="Editar" onClick={() => onEditar(memoria)}>
                    ✏️
                </button>
                <button
                    className="icon-btn icon-btn--perigo"
                    title="Excluir"
                    onClick={() => onExcluir(memoria)}
                >
                    🗑️
                </button>
            </div>
        </li>
    )
}
