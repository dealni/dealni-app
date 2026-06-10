const API_URL = 'https://api.openai.com/v1/chat/completions'

// Chave lida do arquivo .env (nunca exposta no repositório)
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

// Limite de caracteres por mensagem (igual ao bot do Telegram)
const MSG_LIMIT = 4096

// Limite de mensagens enviadas como contexto para não estourar tokens
const CONTEXT_LIMIT = 20

// Personalidade do Dealni — enviada em toda requisição como instrução ao modelo
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

// Corta mensagens que ultrapassam o limite de caracteres (igual ao bot)
function truncate(text) {
    if (text.length <= MSG_LIMIT) return text
    const cut = text.substring(0, MSG_LIMIT)
    const lastSpace = cut.lastIndexOf(' ')
    return lastSpace > 0 ? cut.substring(0, lastSpace) : cut
}

// Tempo máximo de espera pela resposta da API antes de desistir
const TIMEOUT_MS = 60_000

// Recebe o histórico completo da conversa e retorna a resposta do Dealni
export async function sendMessage(history) {
    if (!API_KEY) {
        throw new Error('Chave da API não configurada. Crie um arquivo .env com VITE_OPENAI_API_KEY.')
    }

    // Usa apenas as últimas CONTEXT_LIMIT mensagens para não estourar tokens
    const recent = history.slice(-CONTEXT_LIMIT)

    // Monta o array de mensagens no formato exigido pela API da OpenAI
    const messages = [
        { role: 'system', content: getSystemPrompt() },
        // Converte o histórico interno para o formato { role, content }
        ...recent.map((msg) => ({
            role: msg.from === 'user' ? 'user' : 'assistant',
            content: truncate(msg.text),
        })),
    ]

    // Cancela a requisição se demorar demais, em vez de deixar o chat travado em "digitando..."
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

    let response
    try {
        response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4.1-nano',
                messages,
                temperature: 1,         // Criatividade: 0 = determinístico, 2 = muito criativo
                max_completion_tokens: 2048,
            }),
            signal: controller.signal,
        })
    } catch (err) {
        if (err.name === 'AbortError') {
            throw new Error('A resposta demorou demais. Tente novamente.')
        }
        throw new Error('Sem conexão com a internet ou API indisponível.')
    } finally {
        clearTimeout(timeout)
    }

    if (!response.ok) {
        // A API pode devolver erro sem corpo JSON (ex: gateway), então o parse é defensivo
        const err = await response.json().catch(() => null)
        throw new Error(err?.error?.message || `Erro ao contatar a API (${response.status}).`)
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content
    if (!content) throw new Error('Resposta vazia da API.')
    return content
}
