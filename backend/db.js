// Banco de dados simples baseado em arquivo JSON.
// Sem dependência nativa: usamos o módulo `fs` para ler e gravar o data.json.
// Em produção usaríamos um banco real (responsabilidade da disciplina de BD),
// mas para o front-end este store já entrega uma API RESTful com persistência real.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, 'data.json')

// Estrutura inicial caso o arquivo ainda não exista (primeira execução)
const SEED = {
    memorias: [
        {
            id: 1,
            titulo: 'Nome do usuário',
            categoria: 'pessoal',
            conteudo: 'O usuário se chama Diogo e gosta de ser chamado pelo primeiro nome.',
            criadaEm: new Date().toISOString(),
        },
        {
            id: 2,
            titulo: 'Linguagem favorita',
            categoria: 'preferencia',
            conteudo: 'O usuário programa em JavaScript e está aprendendo React.',
            criadaEm: new Date().toISOString(),
        },
    ],
    conversas: [
        {
            id: 1,
            titulo: 'Primeira conversa',
            criadaEm: new Date().toISOString(),
            atualizadaEm: new Date().toISOString(),
        },
    ],
}

// Lê todo o banco do disco. Se o arquivo não existir, cria com os dados iniciais.
function read() {
    if (!existsSync(DB_PATH)) {
        writeFileSync(DB_PATH, JSON.stringify(SEED, null, 2))
        return structuredClone(SEED)
    }
    try {
        return JSON.parse(readFileSync(DB_PATH, 'utf-8'))
    } catch {
        // Se o arquivo estiver corrompido, recria a partir do seed
        writeFileSync(DB_PATH, JSON.stringify(SEED, null, 2))
        return structuredClone(SEED)
    }
}

// Grava o banco inteiro de volta no disco
function write(data) {
    writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

// Gera o próximo ID incremental para um recurso (memorias ou conversas)
function nextId(itens) {
    return itens.reduce((maior, item) => Math.max(maior, item.id), 0) + 1
}

// ---- Operações genéricas reutilizadas pelas duas rotas (memorias e conversas) ----

export function listAll(resource) {
    return read()[resource]
}

export function findById(resource, id) {
    return read()[resource].find((item) => item.id === Number(id)) || null
}

export function create(resource, dados) {
    const db = read()
    const novo = { id: nextId(db[resource]), ...dados }
    db[resource].push(novo)
    write(db)
    return novo
}

export function update(resource, id, dados) {
    const db = read()
    const idx = db[resource].findIndex((item) => item.id === Number(id))
    if (idx === -1) return null
    db[resource][idx] = { ...db[resource][idx], ...dados, id: Number(id) }
    write(db)
    return db[resource][idx]
}

export function remove(resource, id) {
    const db = read()
    const idx = db[resource].findIndex((item) => item.id === Number(id))
    if (idx === -1) return false
    db[resource].splice(idx, 1)
    write(db)
    return true
}
