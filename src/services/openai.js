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

// Tempo máximo sem receber nenhum dado antes de desistir (renovado a cada chunk do stream)
const TIMEOUT_MS = 60_000

// Extrai os trechos de texto de um bloco de linhas SSE ("data: {...}") da OpenAI.
// Devolve a concatenação dos deltas encontrados nas linhas completas recebidas.
function parseSSE(lines) {
    let text = ''
    for (const line of lines) {
        const trimmed = line.trim()
        // Linhas úteis começam com "data:"; o restante (comentários, vazias) é ignorado
        if (!trimmed.startsWith('data:')) continue
        const payload = trimmed.slice(5).trim()
        // "[DONE]" marca o fim do stream e não é JSON
        if (payload === '[DONE]') continue
        try {
            const delta = JSON.parse(payload)?.choices?.[0]?.delta?.content
            if (delta) text += delta
        } catch {
            // Linha malformada: ignora e segue o stream
        }
    }
    return text
}

// Recebe o histórico completo da conversa e retorna a resposta do Dealni.
// A resposta chega em streaming: onChunk(textoParcial) é chamado a cada trecho
// recebido, permitindo exibir o texto surgindo aos poucos na tela.
export async function sendMessage(history, onChunk) {
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

    // Cancela a requisição se ficar tempo demais sem receber dados,
    // em vez de deixar o chat travado em "digitando..."
    const controller = new AbortController()
    let timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)
    const renewTimeout = () => {
        clearTimeout(timeout)
        timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)
    }

    try {
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
                    stream: true,           // Recebe a resposta aos poucos via Server-Sent Events
                }),
                signal: controller.signal,
            })
        } catch (err) {
            if (err.name === 'AbortError') {
                throw new Error('A resposta demorou demais. Tente novamente.')
            }
            throw new Error('Sem conexão com a internet ou API indisponível.')
        }

        if (!response.ok) {
            // Mesmo com stream:true, erros vêm como JSON normal (e podem nem ter corpo)
            const err = await response.json().catch(() => null)
            throw new Error(err?.error?.message || `Erro ao contatar a API (${response.status}).`)
        }

        // Lê o corpo da resposta em chunks e acumula o texto conforme chega
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let fullText = ''

        while (true) {
            let chunk
            try {
                chunk = await reader.read()
            } catch (err) {
                if (err.name === 'AbortError') {
                    throw new Error('A resposta demorou demais. Tente novamente.')
                }
                throw new Error('Conexão interrompida no meio da resposta. Tente novamente.')
            }
            if (chunk.done) break
            renewTimeout()

            // Acumula no buffer e processa apenas as linhas completas;
            // a última linha pode estar cortada no meio e fica para o próximo chunk
            buffer += decoder.decode(chunk.value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop()

            const delta = parseSSE(lines)
            if (delta) {
                fullText += delta
                onChunk?.(fullText)
            }
        }

        // Processa o que sobrou no buffer após o fim do stream
        const rest = parseSSE([buffer])
        if (rest) {
            fullText += rest
            onChunk?.(fullText)
        }

        if (!fullText) throw new Error('Resposta vazia da API.')
        return fullText
    } finally {
        clearTimeout(timeout)
    }
}
