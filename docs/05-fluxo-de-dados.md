# Fluxo de Dados — Ciclo Completo de uma Mensagem

Este documento mostra, passo a passo, o que acontece desde o momento em que o usuário digita uma mensagem até a resposta aparecer na tela.

---

## Diagrama geral

```
╔══════════════╗
║   Usuário    ║  digita texto e pressiona Enter (ou clica em enviar)
╚══════╦═══════╝
       ↓
╔══════╩═══════╗
║  InputBar    ║  captura o evento → chama onSend(text) → limpa o campo
╚══════╦═══════╝
       ↓
╔══════╩═══════╗
║    App.jsx   ║  recebe o texto → cria a mensagem do usuário → adiciona ao estado
║              ║  → chama sendMessage(histórico) → seta isTyping = true
╚══════╦═══════╝
       ↓
╔══════╩═══════════╗
║ services/        ║  monta o payload → faz fetch para a OpenAI
║ openai.js        ║  → aguarda resposta assíncrona
╚══════╦═══════════╝
       ↓
╔══════╩═══════════╗
║ API da OpenAI    ║  processa o histórico + system prompt → gera resposta
╚══════╦═══════════╝
       ↓
╔══════╩═══════════╗
║ services/        ║  recebe a resposta → extrai o texto → retorna para App.jsx
║ openai.js        ║
╚══════╦═══════════╝
       ↓
╔══════╩═══════╗
║    App.jsx   ║  adiciona a resposta ao estado → seta isTyping = false
║              ║  → useEffect salva no localStorage
╚══════╦═══════╝
       ↓
╔══════╩═══════╗
║ ChatWindow   ║  re-renderiza com a nova mensagem
║ MessageBubble║  → scroll automático até o final
╚══════════════╝
```

---

## Passo 1 — Usuário digita no `InputBar`

```jsx
// InputBar.jsx
const [text, setText] = useState('')

<textarea
    value={text}
    onChange={(e) => setText(e.target.value)}  // cada tecla atualiza o estado
/>
```

O estado `text` é atualizado **a cada tecla pressionada** (input controlado).  
A tela re-renderiza mostrando o texto atualizado no campo.

---

## Passo 2 — Usuário envia (Enter ou clique)

```jsx
// InputBar.jsx
function handleSubmit(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || disabled) return   // proteção: não envia vazio
    onSend(trimmed)                    // chama a função do App
    setText('')                        // limpa o campo
}
```

`onSend` é uma **prop do tipo função** — ela veio do `App.jsx`.  
Chamar `onSend(trimmed)` é como chamar a função `handleSend` do App diretamente.

---

## Passo 3 — `App.jsx` processa o envio

```jsx
// App.jsx
async function handleSend(text) {
    // Cria objeto da mensagem do usuário
    const userMsg = { id: Date.now(), from: 'user', text, time: getTime() }

    // Adiciona ao estado (re-renderiza ChatWindow com a nova mensagem)
    const updated = [...messages, userMsg]
    setMessages(updated)

    // Mostra o indicador de digitação
    setIsTyping(true)

    // Limpa qualquer erro anterior
    setError(null)

    try {
        // Chama o serviço (operação assíncrona)
        const reply = await sendMessage(updated)

        // Cria objeto da resposta do bot
        const botMsg = { id: Date.now() + 1, from: 'bot', text: reply, time: getTime() }

        // Adiciona ao estado (re-renderiza com a resposta)
        setMessages((prev) => [...prev, botMsg])

    } catch (err) {
        // Em caso de erro de rede ou API, exibe para o usuário
        setError(err.message || 'Erro ao conectar com a API.')
    } finally {
        // Sempre esconde o indicador (com ou sem erro)
        setIsTyping(false)
    }
}
```

**Por que `[...messages, userMsg]` em vez de `messages.push(userMsg)`?**

No React, **nunca se modifica o estado diretamente**. O `push` altera o array original — o React não detecta isso e não re-renderiza.

`[...messages, userMsg]` cria um **array novo** com todos os itens anteriores mais o novo. O React compara o array antigo com o novo e sabe que algo mudou.

---

## Passo 4 — O serviço faz a requisição

```js
// services/openai.js
export async function sendMessage(history) {
    const recent = history.slice(-20)   // últimas 20 mensagens

    const messages = [
        { role: 'system', content: getSystemPrompt() },
        ...recent.map((msg) => ({
            role: msg.from === 'user' ? 'user' : 'assistant',
            content: truncate(msg.text),
        })),
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-4.1-nano', messages, temperature: 1, max_completion_tokens: 2048 }),
    })

    // ...verifica erro, extrai texto e retorna
    return content
}
```

Enquanto o `await fetch(...)` espera, o navegador **continua responsivo** — o usuário vê a animação de digitando...

---

## Passo 5 — O estado é atualizado e a tela re-renderiza

Após a resposta chegar:

```
setMessages([...prev, botMsg])
  → App re-renderiza
  → ChatWindow recebe o novo array de messages
  → messages.map(...) renderiza a nova MessageBubble
  → useEffect([messages]) rola até o final da lista
  → useEffect([messages]) salva no localStorage
```

```
setIsTyping(false)
  → App re-renderiza
  → ChatWindow recebe isTyping = false
  → {isTyping && <TypingIndicator />} → não renderiza mais
```

---

## Persistência com `localStorage`

```jsx
// App.jsx
const STORAGE_KEY = 'dealni_chat_history'

function loadHistory() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) : []
    } catch {
        return []
    }
}

// Carrega na inicialização:
const [messages, setMessages] = useState(loadHistory)

// Salva toda vez que messages muda:
useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}, [messages])
```

**localStorage** é um mini-banco de dados do navegador que persiste mesmo após fechar a aba.

- `localStorage.setItem(chave, valor)` — salva (só aceita strings → por isso `JSON.stringify`)
- `localStorage.getItem(chave)` — lê (retorna string → por isso `JSON.parse`)
- `localStorage.removeItem(chave)` — apaga (usado no botão de limpar chat)

---

## O botão de limpar chat

```jsx
// App.jsx
function handleClearChat() {
    setMessages([])          // esvazia o estado
    setError(null)           // limpa erros
    localStorage.removeItem(STORAGE_KEY)  // apaga do localStorage
}

// No JSX — aparece só se houver mensagens:
{messages.length > 0 && (
    <button className="btn-clear" onClick={handleClearChat}>
        🗑
    </button>
)}
```

`messages.length > 0 && <button>` é **renderização condicional com `&&`**:
- Se `messages.length > 0` for `false`, o React não renderiza nada
- Se for `true`, renderiza o botão

---

## Tratamento de erros

```
App.jsx
  ↓ catch(err) → setError(err.message)
  ↓ {error && <div className="chat-error">❌ {error}</div>}

Possíveis erros:
  - 401 Unauthorized → chave da API inválida ou expirada
  - 429 Too Many Requests → limite de requisições excedido
  - Sem conexão → fetch lança TypeError: Failed to fetch
  - Resposta vazia → throw new Error('Resposta vazia da API.')
```

O usuário vê o erro em vermelho, mas o app **não trava** — pode tentar enviar novamente.
