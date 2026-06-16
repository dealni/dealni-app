import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConversas } from '../hooks/useConversas'
import ConversaList from '../components/ConversaList'
import ErrorBanner from '../components/ErrorBanner'
import Loader from '../components/Loader'
import { clearMessages, setActiveConversa } from '../services/chatStorage'

export default function ConversasPage({ activeConversa, onSelecionar }) {
    const { conversas, carregando, erro, recarregar, adicionar, renomear, remover } = useConversas()
    const [titulo, setTitulo] = useState('') // campo controlado da nova conversa
    const [acaoErro, setAcaoErro] = useState(null)
    const navigate = useNavigate()

    // CREATE - cria uma conversa a partir do campo controlado
    async function handleCriar(e) {
        e.preventDefault()
        if (!titulo.trim()) return
        setAcaoErro(null)
        try {
            await adicionar(titulo.trim())
            setTitulo('')
        } catch (err) {
            setAcaoErro(err.message)
        }
    }

    // Abre a conversa: define como ativa e vai para o chat
    function handleAbrir(conversa) {
        onSelecionar(conversa)
        navigate('/')
    }

    // UPDATE - renomeia
    async function handleRenomear(conversa) {
        const novo = window.prompt('Novo título da conversa:', conversa.titulo)
        if (!novo?.trim()) return
        setAcaoErro(null)
        try {
            await renomear(conversa.id, novo.trim())
            // Se a conversa renomeada é a ativa, atualiza a referência salva
            if (activeConversa?.id === conversa.id) {
                const atualizada = { ...conversa, titulo: novo.trim() }
                onSelecionar(atualizada)
            }
        } catch (err) {
            setAcaoErro(err.message)
        }
    }

    // DELETE - exclui a conversa e limpa as mensagens locais dela
    async function handleExcluir(conversa) {
        if (!window.confirm(`Excluir a conversa "${conversa.titulo}"?`)) return
        setAcaoErro(null)
        try {
            await remover(conversa.id)
            clearMessages(conversa.id)
            if (activeConversa?.id === conversa.id) {
                setActiveConversa(null)
                onSelecionar(null)
            }
        } catch (err) {
            setAcaoErro(err.message)
        }
    }

    return (
        <div className="page">
            <div className="page__inner">
                <h2 className="page__titulo">Conversas</h2>
                <p className="page__subtitulo">
                    Crie e organize suas conversas com o Dealni. Cada conversa tem seu próprio histórico.
                </p>

                <form className="inline-form" onSubmit={handleCriar}>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Título da nova conversa"
                        maxLength={60}
                    />
                    <button type="submit" className="btn btn--primario" disabled={!titulo.trim()}>
                        Criar conversa
                    </button>
                </form>

                <ErrorBanner mensagem={acaoErro || erro} onRetry={erro ? recarregar : undefined} />

                {carregando ? (
                    <Loader texto="Carregando conversas..." />
                ) : (
                    <ConversaList
                        conversas={conversas}
                        ativaId={activeConversa?.id}
                        onAbrir={handleAbrir}
                        onRenomear={handleRenomear}
                        onExcluir={handleExcluir}
                    />
                )}
            </div>
        </div>
    )
}
