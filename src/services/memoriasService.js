// Serviço de Memórias — consome o CRUD do recurso /memorias da API.
// Mantém as chamadas de rede separadas dos componentes visuais (boa prática).

import { api } from './api'

// READ — lista todas as memórias
export function getMemorias() {
    return api.get('/memorias')
}

// CREATE — cria uma nova memória
export function createMemoria(dados) {
    return api.post('/memorias', dados)
}

// UPDATE — atualiza uma memória existente
export function updateMemoria(id, dados) {
    return api.put(`/memorias/${id}`, dados)
}

// DELETE — remove uma memória
export function deleteMemoria(id) {
    return api.delete(`/memorias/${id}`)
}
