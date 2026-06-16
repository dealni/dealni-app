// Wrapper base para falar com a API RESTful do back-end.
// Centraliza a URL base, o cabeçalho JSON e o tratamento de erros
// (tanto erros de rede quanto respostas de erro do servidor),
// para que os serviços (memorias/conversas) fiquem curtos e limpos.

// Em desenvolvimento o Vite faz proxy de /api -> http://localhost:3001 (ver vite.config.js).
const BASE_URL = '/api'

// Mensagem amigável para o caso clássico de "back-end desligado".
const NETWORK_ERROR = 'Não foi possível conectar ao servidor. Verifique se o back-end está rodando (npm run api).'

async function request(caminho, opcoes = {}) {
    let response
    try {
        response = await fetch(`${BASE_URL}${caminho}`, {
            headers: { 'Content-Type': 'application/json' },
            ...opcoes,
        })
    } catch {
        // Falha de rede: servidor fora do ar, sem internet, etc.
        throw new Error(NETWORK_ERROR)
    }

    // DELETE retorna 204 (sem corpo) - sucesso sem JSON para ler
    if (response.status === 204) return null

    let dados = null
    try {
        dados = await response.json()
    } catch {
        dados = null
    }

    if (!response.ok) {
        // Usa a mensagem que o back-end mandou, ou uma genérica
        throw new Error(dados?.error || `Erro ${response.status} ao acessar o servidor.`)
    }

    return dados
}

export const api = {
    get: (caminho) => request(caminho),
    post: (caminho, corpo) => request(caminho, { method: 'POST', body: JSON.stringify(corpo) }),
    put: (caminho, corpo) => request(caminho, { method: 'PUT', body: JSON.stringify(corpo) }),
    delete: (caminho) => request(caminho, { method: 'DELETE' }),
}
