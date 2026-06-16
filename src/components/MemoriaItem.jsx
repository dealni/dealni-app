// Card de uma única memória, com botões de editar e excluir.
// Recebe a memória e os callbacks por props (props bem definidas, componente reutilizável).

import { IconEdit, IconTrash } from './icons'

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
                <button
                    className="icon-btn"
                    title="Editar"
                    aria-label="Editar memória"
                    onClick={() => onEditar(memoria)}
                >
                    <IconEdit size={18} />
                </button>
                <button
                    className="icon-btn icon-btn--perigo"
                    title="Excluir"
                    aria-label="Excluir memória"
                    onClick={() => onExcluir(memoria)}
                >
                    <IconTrash size={18} />
                </button>
            </div>
        </li>
    )
}
