// Listagem dinâmica das memórias cadastradas.
// Renderiza um MemoriaItem para cada memória; mostra estado vazio quando não há nenhuma.

import MemoriaItem from './MemoriaItem'

export default function MemoriaList({ memorias, onEditar, onExcluir }) {
    if (!memorias.length) {
        return (
            <p className="lista-vazia">
                Nenhuma memória ainda. Cadastre uma acima para o Dealni começar a lembrar.
            </p>
        )
    }

    return (
        <ul className="memoria-lista">
            {memorias.map((memoria) => (
                <MemoriaItem
                    key={memoria.id}
                    memoria={memoria}
                    onEditar={onEditar}
                    onExcluir={onExcluir}
                />
            ))}
        </ul>
    )
}
