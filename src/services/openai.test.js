import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Cria um corpo de resposta em streaming (SSE) como o que a OpenAI envia
function sseBody(events) {
    const encoder = new TextEncoder()
    return new ReadableStream({
        start(controller) {
            for (const event of events) {
                controller.enqueue(encoder.encode(event))
            }
            controller.close()
        },
    })
}

// Monta uma linha SSE com um delta de texto no formato da OpenAI
function sseChunk(text) {
    return `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`
}

// A chave é lida no momento do import, então o módulo precisa ser
// recarregado depois de configurar a variável de ambiente
async function loadService() {
    vi.resetModules()
    const mod = await import('./openai.js')
    return mod.sendMessage
}

describe('sendMessage', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_OPENAI_API_KEY', 'test-key')
        vi.stubGlobal('fetch', vi.fn())
    })

    afterEach(() => {
        vi.unstubAllEnvs()
        vi.unstubAllGlobals()
    })

    it('lança erro claro quando a chave da API não está configurada', async () => {
        vi.stubEnv('VITE_OPENAI_API_KEY', '')
        const sendMessage = await loadService()

        await expect(sendMessage([{ from: 'user', text: 'oi' }])).rejects.toThrow(
            /Chave da API não configurada/
        )
        expect(fetch).not.toHaveBeenCalled()
    })

    it('acumula os chunks do stream e retorna o texto completo', async () => {
        fetch.mockResolvedValue({
            ok: true,
            body: sseBody([sseChunk('Miau, '), sseChunk('tudo bem?'), 'data: [DONE]\n\n']),
        })
        const sendMessage = await loadService()

        const onChunk = vi.fn()
        const reply = await sendMessage([{ from: 'user', text: 'oi' }], onChunk)

        expect(reply).toBe('Miau, tudo bem?')
        // onChunk recebe sempre o texto acumulado até o momento
        expect(onChunk).toHaveBeenNthCalledWith(1, 'Miau, ')
        expect(onChunk).toHaveBeenNthCalledWith(2, 'Miau, tudo bem?')
    })

    it('remonta linhas SSE cortadas no meio entre dois chunks', async () => {
        const line = sseChunk('resposta inteira')
        fetch.mockResolvedValue({
            ok: true,
            // A mesma linha chega quebrada em dois pedaços de rede
            body: sseBody([line.slice(0, 20), line.slice(20)]),
        })
        const sendMessage = await loadService()

        const reply = await sendMessage([{ from: 'user', text: 'oi' }])
        expect(reply).toBe('resposta inteira')
    })

    it('envia o histórico convertido para o formato da OpenAI com system prompt', async () => {
        fetch.mockResolvedValue({ ok: true, body: sseBody([sseChunk('ok')]) })
        const sendMessage = await loadService()

        await sendMessage([
            { from: 'user', text: 'oi' },
            { from: 'bot', text: 'miau' },
            { from: 'user', text: 'tudo bem?' },
        ])

        const body = JSON.parse(fetch.mock.calls[0][1].body)
        expect(body.stream).toBe(true)
        expect(body.messages[0].role).toBe('system')
        expect(body.messages.slice(1)).toEqual([
            { role: 'user', content: 'oi' },
            { role: 'assistant', content: 'miau' },
            { role: 'user', content: 'tudo bem?' },
        ])
    })

    it('repassa a mensagem de erro retornada pela API', async () => {
        fetch.mockResolvedValue({
            ok: false,
            status: 401,
            json: async () => ({ error: { message: 'Incorrect API key provided' } }),
        })
        const sendMessage = await loadService()

        await expect(sendMessage([{ from: 'user', text: 'oi' }])).rejects.toThrow(
            'Incorrect API key provided'
        )
    })

    it('mostra erro genérico com status quando a API responde erro sem JSON', async () => {
        fetch.mockResolvedValue({
            ok: false,
            status: 502,
            json: async () => {
                throw new Error('not json')
            },
        })
        const sendMessage = await loadService()

        await expect(sendMessage([{ from: 'user', text: 'oi' }])).rejects.toThrow(
            'Erro ao contatar a API (502).'
        )
    })

    it('traduz falha de rede para uma mensagem amigável', async () => {
        fetch.mockRejectedValue(new TypeError('Failed to fetch'))
        const sendMessage = await loadService()

        await expect(sendMessage([{ from: 'user', text: 'oi' }])).rejects.toThrow(
            'Sem conexão com a internet ou API indisponível.'
        )
    })

    it('lança erro quando o stream termina sem nenhum texto', async () => {
        fetch.mockResolvedValue({ ok: true, body: sseBody(['data: [DONE]\n\n']) })
        const sendMessage = await loadService()

        await expect(sendMessage([{ from: 'user', text: 'oi' }])).rejects.toThrow(
            'Resposta vazia da API.'
        )
    })
})
