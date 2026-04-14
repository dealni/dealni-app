# Componentes React

## O que é um componente?

No React, um **componente** é uma função JavaScript que retorna JSX (uma mistura de HTML com JavaScript). Cada componente representa uma parte visual da tela e tem uma responsabilidade específica.

Regra de ouro: **um componente, uma responsabilidade.**

---

## Árvore de componentes

```
App                         ← raiz: controla todo o estado
├── Header                  ← cabeçalho fixo (avatar + nome)
├── ChatWindow              ← área de mensagens com scroll
│   ├── MessageBubble       ← bolha de mensagem (repetida para cada msg)
│   └── TypingIndicator     ← animação "digitando..." (aparece/some)
└── InputBar                ← campo de texto + botão enviar
```

---

## 1. `main.jsx` — Ponto de entrada

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**O que faz:**
- Encontra a `<div id="root">` no HTML
- Renderiza o componente `App` dentro dela
- `StrictMode` ajuda a encontrar erros durante o desenvolvimento (não afeta a produção)

---

## 2. `App.jsx` — Componente Raiz

É o "cérebro" do sistema. Ele:
- Guarda o estado (lista de mensagens, se está digitando, erros)
- Passa dados para os filhos via **props**
- Recebe eventos dos filhos via **funções callback**

```jsx
export default function App() {
    const [messages, setMessages] = useState(loadHistory)
    const [isTyping, setIsTyping]  = useState(false)
    const [error, setError]        = useState(null)

    // ...

    return (
        <div className="app">
            <div className="chat-container">
                <div className="chat-header-wrapper">
                    <Header />
                    {messages.length > 0 && (
                        <button className="btn-clear" onClick={handleClearChat}>
                            🗑
                        </button>
                    )}
                </div>
                <ChatWindow messages={messages} isTyping={isTyping} />
                {error && <div className="chat-error">❌ {error}</div>}
                <InputBar onSend={handleSend} disabled={isTyping} />
            </div>
        </div>
    )
}
```

**Props que o App passa para os filhos:**

| Filho | Props enviadas | Significa |
|---|---|---|
| `ChatWindow` | `messages` | lista de mensagens para exibir |
| `ChatWindow` | `isTyping` | se deve mostrar o indicador de digitação |
| `InputBar` | `onSend` | função a chamar quando o usuário envia |
| `InputBar` | `disabled` | bloqueia o campo enquanto aguarda resposta |

---

## 3. `Header.jsx` — Cabeçalho

```jsx
import dealniAvatar from '../assets/hero.jpg'

export default function Header() {
    return (
        <header className="chat-header">
            <div className="chat-header-avatar">
                <img src={dealniAvatar} alt="Dealni" />
            </div>
            <div className="chat-header-info">
                <span className="chat-header-name">Dealni 😼</span>
                <span className="chat-header-status">online</span>
            </div>
        </header>
    )
}
```

**Pontos importantes:**
- Não recebe props — é completamente estático
- Importa a imagem como módulo JavaScript (`import dealniAvatar from ...`)
- O Vite transforma essa importação automaticamente em uma URL válida

---

## 4. `ChatWindow.jsx` — Janela de Mensagens

```jsx
import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

export default function ChatWindow({ messages, isTyping }) {
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    return (
        <div className="chat-window">
            {messages.length === 0 && (
                <div className="chat-empty">
                    <span className="chat-empty-icon">😼</span>
                    <p>Oi! Eu sou o <strong>Dealni</strong>, um gato inteligente.</p>
                    <p>Manda uma mensagem pra começar! 💬</p>
                </div>
            )}

            {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
            ))}

            {isTyping && <TypingIndicator />}

            <div ref={bottomRef} />
        </div>
    )
}
```

**Pontos importantes:**
- Recebe `messages` (array) e `isTyping` (boolean) via props
- `messages.map(...)` renderiza **uma `MessageBubble` para cada mensagem** — isso é renderização dinâmica
- O `key={msg.id}` é obrigatório para o React identificar cada item da lista
- A `<div ref={bottomRef} />` é um elemento invisível no final da lista, usado para forçar o scroll

---

## 5. `MessageBubble.jsx` — Bolha de Mensagem

```jsx
import dealniAvatar from '../assets/hero.jpg'

export default function MessageBubble({ message }) {
    const isUser = message.from === 'user'

    return (
        <div className={`message-row ${isUser ? 'message-row--user' : 'message-row--bot'}`}>
            {!isUser && (
                <div className="message-avatar">
                    <img src={dealniAvatar} alt="Dealni" />
                </div>
            )}
            <div className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--bot'}`}>
                <p className="message-text">{message.text}</p>
                <span className="message-time">{message.time}</span>
            </div>
        </div>
    )
}
```

**Pontos importantes:**
- Recebe um objeto `message` com: `{ id, from, text, time }`
- Usa **renderização condicional** (`isUser ? ... : ...`) para:
  - Mudar a classe CSS (bolha azul = usuário, cinza = bot)
  - Mostrar o avatar apenas nas mensagens do bot
- É um componente **puramente visual** — não tem estado, só exibe o que recebe

**Estrutura do objeto `message`:**
```js
{
  id: 1744638000000,   // timestamp único (Date.now())
  from: 'user',        // 'user' ou 'bot'
  text: 'Olá!',        // conteúdo da mensagem
  time: '14:32'        // horário formatado
}
```

---

## 6. `TypingIndicator.jsx` — Indicador de Digitação

```jsx
import dealniAvatar from '../assets/hero.jpg'

export default function TypingIndicator() {
    return (
        <div className="message-row message-row--bot">
            <div className="message-avatar">
                <img src={dealniAvatar} alt="Dealni" />
            </div>
            <div className="message-bubble message-bubble--bot typing-bubble">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
            </div>
        </div>
    )
}
```

**Pontos importantes:**
- Sem props, sem estado — completamente estático
- Os três pontos animados são feitos **apenas com CSS** (animação `@keyframes typingBounce`)
- Aparece e some condicionalmente no `ChatWindow`: `{isTyping && <TypingIndicator />}`

---

## 7. `InputBar.jsx` — Barra de Entrada

```jsx
import { useState } from 'react'

export default function InputBar({ onSend, disabled }) {
    const [text, setText] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        const trimmed = text.trim()
        if (!trimmed || disabled) return
        onSend(trimmed)
        setText('')
    }

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
                {/* ícone SVG de seta */}
            </button>
        </form>
    )
}
```

**Pontos importantes:**
- É o único componente filho que **tem estado próprio** (`text`)
- O `textarea` é um **input controlado**: seu valor é sempre igual ao estado `text`
- `e.preventDefault()` impede que o formulário recarregue a página (comportamento padrão do HTML)
- Após enviar, limpa o campo com `setText('')`
- `Enter` envia, `Shift+Enter` insere quebra de linha (comportamento do Telegram)
- Recebe `onSend` como prop — é uma função do `App.jsx` que processa o envio
