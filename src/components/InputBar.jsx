import { useState, useRef, useEffect } from 'react'

// Altura máxima do textarea antes de aparecer a barra de rolagem (igual ao CSS)
const MAX_HEIGHT = 120

export default function InputBar({ onSend, disabled }) {
    // Estado controlado: o valor do textarea é sempre sincronizado com `text`
    const [text, setText] = useState('')
    const textareaRef = useRef(null)

    // Devolve o foco ao campo quando o Dealni termina de responder
    useEffect(() => {
        if (!disabled) textareaRef.current?.focus()
    }, [disabled])

    // Ajusta a altura do textarea conforme o conteúdo cresce (até MAX_HEIGHT)
    function resize() {
        const el = textareaRef.current
        if (!el) return
        el.style.height = 'auto'
        el.style.height = Math.min(el.scrollHeight, MAX_HEIGHT) + 'px'
    }

    function handleChange(e) {
        setText(e.target.value)
        resize()
    }

    function handleSubmit(e) {
        e.preventDefault()
        const trimmed = text.trim()
        // Não envia se estiver vazio ou se o Dealni ainda estiver respondendo
        if (!trimmed || disabled) return
        onSend(trimmed)
        setText('') // Limpa o campo após enviar
        // Volta o textarea à altura de uma linha
        if (textareaRef.current) textareaRef.current.style.height = 'auto'
    }

    // Permite enviar com Enter (Shift+Enter insere quebra de linha).
    // isComposing evita enviar no meio da digitação com teclados IME (japonês, chinês etc.)
    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            handleSubmit(e)
        }
    }

    return (
        <form className="input-bar" onSubmit={handleSubmit}>
            <textarea
                ref={textareaRef}
                className="input-bar__textarea"
                placeholder="Escreva uma mensagem..."
                value={text}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                rows={1}
                autoFocus
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
