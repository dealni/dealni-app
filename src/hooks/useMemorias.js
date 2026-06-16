// Hook customizado que encapsula todo o estado e as operações de CRUD das memórias.
// Mantém os componentes de página enxutos e centraliza loading/erro num só lugar.

import { useState, useEffect, useCallback } from 'react'
import {
    getMemorias,
    createMemoria,
    updateMemoria,
    deleteMemoria,
} from '../services/memoriasService'

export function useMemorias() {
    const [memorias, setMemorias] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)

    // READ - carrega a lista do servidor
    const carregar = useCallback(async () => {
        setCarregando(true)
        setErro(null)
        try {
            setMemorias(await getMemorias())
        } catch (e) {
            setErro(e.message)
        } finally {
            setCarregando(false)
        }
    }, [])

    // Carrega assim que o componente que usa o hook é montado
    useEffect(() => {
        carregar()
    }, [carregar])

    // CREATE
    async function adicionar(dados) {
        const nova = await createMemoria(dados)
        setMemorias((prev) => [...prev, nova])
    }

    // UPDATE
    async function editar(id, dados) {
        const atualizada = await updateMemoria(id, dados)
        setMemorias((prev) => prev.map((m) => (m.id === id ? atualizada : m)))
    }

    // DELETE
    async function remover(id) {
        await deleteMemoria(id)
        setMemorias((prev) => prev.filter((m) => m.id !== id))
    }

    return { memorias, carregando, erro, recarregar: carregar, adicionar, editar, remover }
}
