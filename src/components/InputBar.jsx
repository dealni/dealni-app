import { useRef, useState } from 'react'
import { IconArrowUp } from './icons'

export default function InputBar({ onSend, disabled }) {
    // Estado controlado: o valor do textarea é sempre sincronizado com `text`
    const [text, setText] = useState('')
    const textareaRef = useRef(null)

    // Ajusta a altura do textarea ao conteúdo (cresce até o limite do CSS)
    function autoGrow(el) {
        if (!el) return
        el.style.height = 'auto'
        el.style.height = `${el.scrollHeight}px`
    }

    function handleChange(e) {
        setText(e.target.value)
        autoGrow(e.target)
    }

    function handleSubmit(e) {
        e.preventDefault()
        const trimmed = text.trim()
        // Não envia se estiver vazio ou se o Dealni ainda estiver respondendo
        if (!trimmed || disabled) return
        onSend(trimmed)
        setText('') // Limpa o campo após enviar
        if (textareaRef.current) textareaRef.current.style.height = 'auto'
    }

    // Permite enviar com Enter (Shift+Enter insere quebra de linha)
    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e)
        }
    }

    return (
        <div className="composer-wrap">
            <form className="composer" onSubmit={handleSubmit}>
                <textarea
                    ref={textareaRef}
                    className="composer__textarea"
                    placeholder="Envie uma mensagem para o Dealni..."
                    value={text}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    rows={1}
                />
                <button
                    className="composer__send"
                    type="submit"
                    disabled={disabled || !text.trim()}
                    aria-label="Enviar mensagem"
                >
                    <IconArrowUp size={20} />
                </button>
            </form>
        </div>
    )
}
