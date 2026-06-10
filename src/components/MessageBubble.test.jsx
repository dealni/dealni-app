import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MessageBubble from './MessageBubble'

function botMessage(text) {
    return { id: '1', from: 'bot', text, time: '10:00' }
}

describe('MessageBubble', () => {
    it('renderiza **negrito** das respostas do bot como <strong>', () => {
        render(<MessageBubble message={botMessage('isso é **importante** mesmo')} />)
        const strong = screen.getByText('importante')
        expect(strong.tagName).toBe('STRONG')
    })

    it('renderiza `código` das respostas do bot como <code>', () => {
        render(<MessageBubble message={botMessage('use `npm install` para instalar')} />)
        const code = screen.getByText('npm install')
        expect(code.tagName).toBe('CODE')
    })

    it('transforma URLs em links clicáveis que abrem em nova aba', () => {
        render(<MessageBubble message={botMessage('veja https://react.dev para saber mais')} />)
        const link = screen.getByRole('link', { name: 'https://react.dev' })
        expect(link).toHaveAttribute('href', 'https://react.dev')
        expect(link).toHaveAttribute('target', '_blank')
    })

    it('não formata mensagens do usuário (texto exibido literalmente)', () => {
        render(
            <MessageBubble message={{ id: '2', from: 'user', text: 'olha o **negrito**', time: '10:01' }} />
        )
        expect(screen.getByText('olha o **negrito**')).toBeInTheDocument()
        expect(screen.queryByText('negrito')).not.toBeInTheDocument()
    })

    it('omite o horário em mensagens de streaming (ainda sem time)', () => {
        render(<MessageBubble message={{ from: 'bot', text: 'digitando' }} />)
        expect(screen.getByText('digitando')).toBeInTheDocument()
        expect(document.querySelector('.message-time')).toBeNull()
    })
})
