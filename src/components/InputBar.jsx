import { useState } from 'react'

export default function InputBar({ onSend, disabled }) {
    // Estado controlado: o valor do textarea é sempre sincronizado com `text`
    const [text, setText] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        const trimmed = text.trim()
        // Não envia se estiver vazio ou se o Dealni ainda estiver respondendo
        if (!trimmed || disabled) return
        onSend(trimmed)
        setText('') // Limpa o campo após enviar
    }

    // Permite enviar com Enter (Shift+Enter insere quebra de linha)
    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e)
        }
    }

    return (
        <form className="input-bar" onSubmit={handleSubmit}>
            <textarea
                className="input-bar__textarea"
                placeholder="Escreva uma mensagem..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                rows={1}
            />
            <button
                className="input-bar__btn"
                type="submit"
                disabled={disabled || !text.trim()}
                aria-label="Enviar"
            >
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
            </button>
        </form>
    )
}
