import { useState } from 'react'
import { useMemorias } from '../hooks/useMemorias'
import MemoriaForm from '../components/MemoriaForm'
import MemoriaList from '../components/MemoriaList'
import ErrorBanner from '../components/ErrorBanner'
import Loader from '../components/Loader'

export default function MemoriasPage() {
    const { memorias, carregando, erro, recarregar, adicionar, editar, remover } = useMemorias()
    // Memória atualmente em edição (null = formulário em modo "criar")
    const [emEdicao, setEmEdicao] = useState(null)
    const [acaoErro, setAcaoErro] = useState(null)

    // CREATE / UPDATE — o mesmo formulário cuida dos dois casos
    async function handleSalvar(dados) {
        setAcaoErro(null)
        if (emEdicao) {
            await editar(emEdicao.id, dados)
            setEmEdicao(null)
        } else {
            await adicionar(dados)
        }
    }

    // DELETE
    async function handleExcluir(memoria) {
        if (!window.confirm(`Excluir a memória "${memoria.titulo}"?`)) return
        setAcaoErro(null)
        try {
            await remover(memoria.id)
            if (emEdicao?.id === memoria.id) setEmEdicao(null)
        } catch (err) {
            setAcaoErro(err.message)
        }
    }

    return (
        <div className="page">
            <div className="page__inner">
                <h2 className="page__titulo">Memórias</h2>
                <p className="page__subtitulo">
                    Cadastre fatos que o Dealni deve lembrar. Eles são enviados como contexto em todas as conversas.
                </p>

                <MemoriaForm
                    memoriaEmEdicao={emEdicao}
                    onSalvar={handleSalvar}
                    onCancelar={() => setEmEdicao(null)}
                />

                <ErrorBanner mensagem={acaoErro || erro} onRetry={erro ? recarregar : undefined} />

                {carregando ? (
                    <Loader texto="Carregando memórias..." />
                ) : (
                    <MemoriaList memorias={memorias} onEditar={setEmEdicao} onExcluir={handleExcluir} />
                )}
            </div>
        </div>
    )
}
