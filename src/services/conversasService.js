// Serviço de Conversas - consome o CRUD do recurso /conversas da API.

import { api } from './api'

// READ - lista todas as conversas salvas
export function getConversas() {
    return api.get('/conversas')
}

// CREATE - cria uma nova conversa
export function createConversa(titulo) {
    return api.post('/conversas', { titulo })
}

// UPDATE - renomeia uma conversa
export function updateConversa(id, titulo) {
    return api.put(`/conversas/${id}`, { titulo })
}

// DELETE - remove uma conversa
export function deleteConversa(id) {
    return api.delete(`/conversas/${id}`)
}
