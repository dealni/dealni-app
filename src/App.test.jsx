import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { sendMessage } from './services/openai'

// Substitui o serviço real da OpenAI por um mock controlado pelos testes
vi.mock('./services/openai', () => ({
    sendMessage: vi.fn(),
}))

describe('App', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
    })

    it('mostra a tela de boas-vindas com sugestões quando não há mensagens', () => {
        render(<App />)
        expect(screen.getByText('Oi! Como posso ajudar?')).toBeInTheDocument()
        expect(screen.getAllByRole('button').length).toBeGreaterThan(1)
    })

    it('envia uma mensagem e exibe a resposta do Dealni', async () => {
        sendMessage.mockResolvedValue('Miau! Tudo ótimo 😼')
        const user = userEvent.setup()
        render(<App />)

        await user.type(screen.getByPlaceholderText('Pergunte alguma coisa...'), 'oi, tudo bem?')
        await user.click(screen.getByRole('button', { name: 'Enviar' }))

        expect(screen.getByText('oi, tudo bem?')).toBeInTheDocument()
        expect(await screen.findByText('Miau! Tudo ótimo 😼')).toBeInTheDocument()
    })

    it('exibe o texto parcial conforme o streaming avança', async () => {
        let emitChunk
        sendMessage.mockImplementation(
            (history, onChunk) =>
                new Promise((resolve) => {
                    emitChunk = onChunk
                    // O teste controla quando o stream "termina"
                    sendMessage.finish = (text) => resolve(text)
                })
        )
        const user = userEvent.setup()
        render(<App />)

        await user.type(screen.getByPlaceholderText('Pergunte alguma coisa...'), 'oi')
        await user.click(screen.getByRole('button', { name: 'Enviar' }))

        // Chega o primeiro pedaço da resposta: deve aparecer na tela imediatamente
        await vi.waitFor(() => expect(emitChunk).toBeDefined())
        emitChunk('Miau')
        expect(await screen.findByText('Miau')).toBeInTheDocument()

        // Chega o restante e o stream termina
        emitChunk('Miau, tudo bem?')
        sendMessage.finish('Miau, tudo bem?')
        expect(await screen.findByText('Miau, tudo bem?')).toBeInTheDocument()
    })

    it('mostra o erro com botão "Tentar novamente" e refaz a requisição', async () => {
        sendMessage.mockRejectedValueOnce(new Error('Sem conexão com a internet ou API indisponível.'))
        sendMessage.mockResolvedValueOnce('Voltei! 😼')
        const user = userEvent.setup()
        render(<App />)

        await user.type(screen.getByPlaceholderText('Pergunte alguma coisa...'), 'oi')
        await user.click(screen.getByRole('button', { name: 'Enviar' }))

        expect(
            await screen.findByText(/Sem conexão com a internet/)
        ).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))

        expect(await screen.findByText('Voltei! 😼')).toBeInTheDocument()
        // O retry não duplica a mensagem do usuário no histórico
        expect(screen.getAllByText('oi')).toHaveLength(1)
        expect(sendMessage).toHaveBeenCalledTimes(2)
    })

    it('envia a sugestão clicada como mensagem', async () => {
        sendMessage.mockResolvedValue('Claro! 😼')
        const user = userEvent.setup()
        render(<App />)

        await user.click(screen.getByText('Me ajude a escrever uma mensagem'))

        expect(screen.getByText('Me ajude a escrever uma mensagem')).toBeInTheDocument()
        expect(await screen.findByText('Claro! 😼')).toBeInTheDocument()
    })

    it('restaura o histórico salvo no localStorage ao iniciar', () => {
        localStorage.setItem(
            'dealni_chat_history',
            JSON.stringify([{ id: '1', from: 'user', text: 'mensagem antiga', time: '09:00' }])
        )
        render(<App />)
        expect(screen.getByText('mensagem antiga')).toBeInTheDocument()
    })

    it('limpa a conversa após confirmação do usuário', async () => {
        localStorage.setItem(
            'dealni_chat_history',
            JSON.stringify([{ id: '1', from: 'user', text: 'mensagem antiga', time: '09:00' }])
        )
        vi.spyOn(window, 'confirm').mockReturnValue(true)
        const user = userEvent.setup()
        render(<App />)

        await user.click(screen.getByTitle('Limpar conversa'))

        expect(screen.queryByText('mensagem antiga')).not.toBeInTheDocument()
        expect(screen.getByText('Oi! Como posso ajudar?')).toBeInTheDocument()
    })
})
