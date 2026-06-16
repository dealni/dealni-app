// Persistência local das mensagens do chat (camada localStorage).
// As mensagens de cada conversa ficam salvas no navegador, então o histórico
// permanece após recarregar a página (requisito de persistência da Sprint 2).
// A conversa ativa (a que está aberta no chat) também é guardada aqui.

const MSGS_PREFIX = 'dealni_msgs_'      // chave por conversa: dealni_msgs_<id>
const ACTIVE_KEY = 'dealni_conversa_ativa'   // guarda a conversa aberta (objeto)

// Lê as mensagens salvas de uma conversa específica
export function loadMessages(conversaId) {
    if (!conversaId) return []
    try {
        const saved = localStorage.getItem(MSGS_PREFIX + conversaId)
        return saved ? JSON.parse(saved) : []
    } catch {
        return []
    }
}

// Salva as mensagens de uma conversa
export function saveMessages(conversaId, messages) {
    if (!conversaId) return
    localStorage.setItem(MSGS_PREFIX + conversaId, JSON.stringify(messages))
}

// Remove as mensagens de uma conversa (usado ao excluir a conversa)
export function clearMessages(conversaId) {
    localStorage.removeItem(MSGS_PREFIX + conversaId)
}

// Lê a conversa que estava aberta na última sessão (objeto completo)
export function getActiveConversa() {
    try {
        const saved = localStorage.getItem(ACTIVE_KEY)
        return saved ? JSON.parse(saved) : null
    } catch {
        return null
    }
}

// Guarda qual conversa está aberta no chat (objeto completo)
export function setActiveConversa(conversa) {
    if (conversa) localStorage.setItem(ACTIVE_KEY, JSON.stringify(conversa))
    else localStorage.removeItem(ACTIVE_KEY)
}
