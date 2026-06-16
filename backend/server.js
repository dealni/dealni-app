// Servidor da API RESTful do Dealni Chat.
// Express + CORS, com as rotas de CRUD de memórias e conversas.

import express from 'express'
import cors from 'cors'
import memoriasRouter from './routes/memorias.js'
import conversasRouter from './routes/conversas.js'

const app = express()
const PORT = process.env.PORT || 3001

// Libera o acesso a partir do front-end (Vite roda em outra porta)
app.use(cors())
// Interpreta o corpo das requisições como JSON
app.use(express.json())

// Rota de saúde — útil para checar rapidamente se a API está no ar
app.get('/', (req, res) => {
    res.json({
        nome: 'Dealni API',
        status: 'online',
        recursos: ['/memorias', '/conversas'],
    })
})

// Monta os recursos REST
app.use('/memorias', memoriasRouter)
app.use('/conversas', conversasRouter)

// Qualquer rota não encontrada cai aqui (404 padronizado em JSON)
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada.' })
})

app.listen(PORT, () => {
    console.log(`🐱 Dealni API rodando em http://localhost:${PORT}`)
})
