# Serviço OpenAI — `src/services/openai.js`

## Por que separar em uma pasta `services`?

O arquivo `openai.js` fica na pasta `services` seguindo a **separação de responsabilidades**:

- `components/` → sabe **como mostrar** dados na tela
- `services/` → sabe **como buscar e enviar** dados para APIs externas

Os componentes **não fazem requisições HTTP diretamente** — eles chamam funções do serviço. Se um dia a API mudar, você altera só o `services/openai.js`, sem tocar nos componentes.

---

## Variáveis de configuração

```js
const API_URL = 'https://api.openai.com/v1/chat/completions'

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

const MSG_LIMIT = 4096    // limite de caracteres por mensagem
const CONTEXT_LIMIT = 20  // máximo de mensagens enviadas como contexto
```

### O que é `import.meta.env`?

É a forma do **Vite** de ler variáveis de ambiente. No arquivo `.env`:

```
VITE_OPENAI_API_KEY=sk-proj-...
```

O prefixo `VITE_` é **obrigatório** — só variáveis com esse prefixo ficam disponíveis no código do navegador. Isso evita expor acidentalmente segredos que não deveriam aparecer na tela.

> A chave não vai para o GitHub porque `.env` está no `.gitignore`.

---

## Função `getSystemPrompt()`

```js
function getSystemPrompt() {
    const now = new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    })

    return `Você é Dealni, um gato inteligente do Telegram.

CAPACIDADES:
- Processar mensagens de texto

INSTRUÇÕES:
- Responda no mesmo idioma do usuário
- Use emojis de forma natural e moderada
- Seja útil, amigável e direto

Data e hora em São Paulo: ${now}`
}
```

**O que é o System Prompt?**

É a instrução que define a **personalidade** do modelo. Em toda requisição à OpenAI, enviamos esse texto com o papel `"system"` — ele nunca aparece na conversa, mas diz ao modelo como se comportar.

Incluir a data e hora atual garante que o Dealni saiba "quando está vivendo".

---

## Função `truncate(text)`

```js
function truncate(text) {
    if (text.length <= MSG_LIMIT) return text
    const cut = text.substring(0, MSG_LIMIT)
    const lastSpace = cut.lastIndexOf(' ')
    return lastSpace > 0 ? cut.substring(0, lastSpace) : cut
}
```

Corta mensagens muito longas (> 4096 caracteres) para não estourar o limite de tokens da API. Corta no último espaço antes do limite para não quebrar palavras no meio.

---

## Função principal: `sendMessage(history)`

```js
export async function sendMessage(history) {
    // 1. Pega apenas as últimas 20 mensagens (contexto)
    const recent = history.slice(-CONTEXT_LIMIT)

    // 2. Monta o array no formato da API da OpenAI
    const messages = [
        { role: 'system', content: getSystemPrompt() },
        ...recent.map((msg) => ({
            role: msg.from === 'user' ? 'user' : 'assistant',
            content: truncate(msg.text),
        })),
    ]

    // 3. Faz a requisição HTTP
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-4.1-nano',
            messages,
            temperature: 1,
            max_completion_tokens: 2048,
        }),
    })

    // 4. Verifica erros HTTP
    if (!response.ok) {
        const err = await response.json()
        throw new Error(err?.error?.message || 'Erro ao contatar a API.')
    }

    // 5. Extrai e retorna o texto da resposta
    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content
    if (!content) throw new Error('Resposta vazia da API.')
    return content
}
```

---

## Passo a passo da requisição

### Passo 1 — Limitar o contexto

```js
const recent = history.slice(-CONTEXT_LIMIT)
```

A API da OpenAI cobra por **tokens** (pedaços de texto). Enviar todo o histórico em conversas longas ficaria caro e lento. Enviamos só as **últimas 20 mensagens**.

### Passo 2 — Converter o formato interno para o formato da API

O histórico interno usa `from: 'user'` e `from: 'bot'`.  
A API da OpenAI exige `role: 'user'` e `role: 'assistant'`.

```js
// Interno:  { from: 'user', text: 'Olá!' }
// API:      { role: 'user', content: 'Olá!' }

role: msg.from === 'user' ? 'user' : 'assistant'
```

### Passo 3 — A requisição HTTP com `fetch`

```js
const response = await fetch(API_URL, {
    method: 'POST',              // estamos enviando dados
    headers: {
        'Content-Type': 'application/json',     // o corpo é JSON
        Authorization: `Bearer ${API_KEY}`,     // autenticação
    },
    body: JSON.stringify({ ... }) // converte objeto JS para string JSON
})
```

`fetch` é uma função nativa do navegador para fazer requisições HTTP.  
O `await` pausa a execução até a resposta chegar — sem travar a interface.

### Passo 4 — Verificar erros

```js
if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error?.message || 'Erro ao contatar a API.')
}
```

`response.ok` é `true` quando o status HTTP é 200-299.  
Se a API retornar erro (ex: chave inválida = 401, limite excedido = 429), lançamos um erro que o `App.jsx` captura.

### Passo 5 — Extrair o texto da resposta

```js
const data = await response.json()
const content = data?.choices?.[0]?.message?.content
```

A resposta da OpenAI tem este formato:

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Meow! Como posso ajudar? 😼"
      }
    }
  ]
}
```

O `?.` (optional chaining) evita erro se algum campo estiver ausente.

---

## Parâmetros do modelo

```js
model: 'gpt-4.1-nano',    // modelo usado (rápido e barato)
temperature: 1,            // criatividade: 0 = robótico, 2 = muito criativo
max_completion_tokens: 2048 // limite de tokens na resposta
```

---

## Por que a função é `async`?

Requisições HTTP são **assíncronas** — levam tempo (milissegundos a segundos) e o navegador não pode travar esperando.

Com `async/await`:
- `async function` → marca a função como assíncrona
- `await fetch(...)` → pausa *só essa função*, deixando o resto do navegador livre
- Quando a resposta chega, a função continua de onde parou

No `App.jsx`, o tratamento de erros usa `try/catch`:

```js
try {
    const reply = await sendMessage(updated)
    // chegou aqui → sucesso
} catch (err) {
    // chegou aqui → deu erro (rede, API, etc.)
    setError(err.message)
} finally {
    // sempre executa, com sucesso ou erro
    setIsTyping(false)
}
```
