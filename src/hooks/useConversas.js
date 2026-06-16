// Hook customizado que encapsula o estado e o CRUD das conversas salvas.

import { useState, useEffect, useCallback } from 'react'
import {
    getConversas,
    createConversa,
    updateConversa,
    deleteConversa,
} from '../services/conversasService'

export function useConversas() {
    const [conversas, setConversas] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)

    // READ — carrega a lista do servidor
    const carregar = useCallback(async () => {
        setCarregando(true)
        setErro(null)
        try {
            setConversas(await getConversas())
        } catch (e) {
            setErro(e.message)
        } finally {
            setCarregando(false)
        }
    }, [])

    useEffect(() => {
        carregar()
    }, [carregar])

    // CREATE — retorna a conversa criada (para já abri-la, por exemplo)
    async function adicionar(titulo) {
        const nova = await createConversa(titulo)
        setConversas((prev) => [...prev, nova])
        return nova
    }

    // UPDATE
    async function renomear(id, titulo) {
        const atualizada = await updateConversa(id, titulo)
        setConversas((prev) => prev.map((c) => (c.id === id ? atualizada : c)))
    }

    // DELETE
    async function remover(id) {
        await deleteConversa(id)
        setConversas((prev) => prev.filter((c) => c.id !== id))
    }

    return { conversas, carregando, erro, recarregar: carregar, adicionar, renomear, remover }
}
