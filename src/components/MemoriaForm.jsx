// Formulário controlado de memória (cria uma nova ou edita uma existente).
// Todos os campos são controlados por useState - o React é a "fonte da verdade".
// Campos: título (texto), categoria (select) e conteúdo (textarea) = 3 campos controlados.

import { useState, useEffect } from 'react'

const CATEGORIAS = ['pessoal', 'preferencia', 'trabalho', 'geral']

const VAZIO = { titulo: '', categoria: 'geral', conteudo: '' }

export default function MemoriaForm({ memoriaEmEdicao, onSalvar, onCancelar }) {
    // Estado controlado do formulário
    const [form, setForm] = useState(VAZIO)
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState(null)

    const editando = Boolean(memoriaEmEdicao)

    // Quando entra em modo de edição, preenche o formulário com a memória selecionada
    useEffect(() => {
        if (memoriaEmEdicao) {
            setForm({
                titulo: memoriaEmEdicao.titulo,
                categoria: memoriaEmEdicao.categoria,
                conteudo: memoriaEmEdicao.conteudo,
            })
        } else {
            setForm(VAZIO)
        }
        setErro(null)
    }, [memoriaEmEdicao])

    // Atualiza qualquer campo do formulário em tempo real
    function handleChange(e) {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!form.titulo.trim() || !form.conteudo.trim()) {
            setErro('Preencha pelo menos o título e o conteúdo.')
            return
        }
        setSalvando(true)
        setErro(null)
        try {
            await onSalvar(form)
            setForm(VAZIO) // limpa o formulário após salvar
        } catch (err) {
            setErro(err.message)
        } finally {
            setSalvando(false)
        }
    }

    return (
        <form className="memoria-form" onSubmit={handleSubmit}>
            <h3 className="memoria-form__titulo">
                {editando ? 'Editar memória' : 'Nova memória'}
            </h3>

            <label className="campo">
                <span>Título</span>
                <input
                    type="text"
                    name="titulo"
                    value={form.titulo}
                    onChange={handleChange}
                    placeholder="Ex: Nome do usuário"
                    maxLength={60}
                />
            </label>

            <label className="campo">
                <span>Categoria</span>
                <select name="categoria" value={form.categoria} onChange={handleChange}>
                    {CATEGORIAS.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </label>

            <label className="campo">
                <span>Conteúdo</span>
                <textarea
                    name="conteudo"
                    value={form.conteudo}
                    onChange={handleChange}
                    placeholder="O que o Dealni deve lembrar?"
                    rows={3}
                />
            </label>

            {erro && <p className="campo-erro">{erro}</p>}

            <div className="memoria-form__acoes">
                <button type="submit" className="btn btn--primario" disabled={salvando}>
                    {salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Adicionar'}
                </button>
                {editando && (
                    <button
                        type="button"
                        className="btn btn--secundario"
                        onClick={onCancelar}
                        disabled={salvando}
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    )
}
