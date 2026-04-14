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

// Recebe o histórico completo da conversa e retorna a resposta do Dealni
export async function sendMessage(history) {
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

    const response = await fetch(API_URL, {
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
    })

    if (!response.ok) {
        const err = await response.json()
        throw new Error(err?.error?.message || 'Erro ao contatar a API.')
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content
    if (!content) throw new Error('Resposta vazia da API.')
    return content
}
