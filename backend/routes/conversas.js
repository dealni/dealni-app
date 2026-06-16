// Rotas REST do recurso "conversas" - CRUD completo.
// Guardamos apenas os metadados da conversa (título e datas).
// As mensagens em si ficam no localStorage do navegador (camada do front-end).

import { Router } from 'express'
import { listAll, findById, create, update, remove } from '../db.js'

const router = Router()
const RESOURCE = 'conversas'

// GET /conversas - lista todas as conversas salvas
router.get('/', (req, res) => {
    res.json(listAll(RESOURCE))
})

// GET /conversas/:id - retorna uma conversa específica
router.get('/:id', (req, res) => {
    const conversa = findById(RESOURCE, req.params.id)
    if (!conversa) return res.status(404).json({ error: 'Conversa não encontrada.' })
    res.json(conversa)
})

// POST /conversas - cria uma nova conversa
router.post('/', (req, res) => {
    const { titulo } = req.body
    if (!titulo?.trim()) {
        return res.status(400).json({ error: 'O título da conversa é obrigatório.' })
    }
    const agora = new Date().toISOString()
    const nova = create(RESOURCE, {
        titulo: titulo.trim(),
        criadaEm: agora,
        atualizadaEm: agora,
    })
    res.status(201).json(nova)
})

// PUT /conversas/:id - renomeia/atualiza uma conversa
router.put('/:id', (req, res) => {
    const { titulo } = req.body
    if (!titulo?.trim()) {
        return res.status(400).json({ error: 'O título da conversa é obrigatório.' })
    }
    const atualizada = update(RESOURCE, req.params.id, {
        titulo: titulo.trim(),
        atualizadaEm: new Date().toISOString(),
    })
    if (!atualizada) return res.status(404).json({ error: 'Conversa não encontrada.' })
    res.json(atualizada)
})

// DELETE /conversas/:id - remove uma conversa
router.delete('/:id', (req, res) => {
    const ok = remove(RESOURCE, req.params.id)
    if (!ok) return res.status(404).json({ error: 'Conversa não encontrada.' })
    res.status(204).end()
})

export default router
