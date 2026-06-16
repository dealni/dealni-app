// Rotas REST do recurso "memorias" — CRUD completo.
// Cada memória é um fato que o Dealni deve lembrar entre conversas.

import { Router } from 'express'
import { listAll, findById, create, update, remove } from '../db.js'

const router = Router()
const RESOURCE = 'memorias'

// GET /memorias — lista todas as memórias
router.get('/', (req, res) => {
    res.json(listAll(RESOURCE))
})

// GET /memorias/:id — retorna uma memória específica
router.get('/:id', (req, res) => {
    const memoria = findById(RESOURCE, req.params.id)
    if (!memoria) return res.status(404).json({ error: 'Memória não encontrada.' })
    res.json(memoria)
})

// POST /memorias — cria uma nova memória
router.post('/', (req, res) => {
    const { titulo, categoria, conteudo } = req.body
    // Validação dos campos obrigatórios
    if (!titulo?.trim() || !conteudo?.trim()) {
        return res.status(400).json({ error: 'Título e conteúdo são obrigatórios.' })
    }
    const nova = create(RESOURCE, {
        titulo: titulo.trim(),
        categoria: categoria?.trim() || 'geral',
        conteudo: conteudo.trim(),
        criadaEm: new Date().toISOString(),
    })
    res.status(201).json(nova)
})

// PUT /memorias/:id — atualiza uma memória existente
router.put('/:id', (req, res) => {
    const { titulo, categoria, conteudo } = req.body
    if (!titulo?.trim() || !conteudo?.trim()) {
        return res.status(400).json({ error: 'Título e conteúdo são obrigatórios.' })
    }
    const atualizada = update(RESOURCE, req.params.id, {
        titulo: titulo.trim(),
        categoria: categoria?.trim() || 'geral',
        conteudo: conteudo.trim(),
    })
    if (!atualizada) return res.status(404).json({ error: 'Memória não encontrada.' })
    res.json(atualizada)
})

// DELETE /memorias/:id — remove uma memória
router.delete('/:id', (req, res) => {
    const ok = remove(RESOURCE, req.params.id)
    if (!ok) return res.status(404).json({ error: 'Memória não encontrada.' })
    res.status(204).end()
})

export default router
