# Back-end — API RESTful (CRUD)

O back-end fica na pasta `backend/` e é uma API RESTful feita em **Express**. Ele guarda os dados
em um arquivo JSON (`backend/data.json`), o que dá persistência real sem precisar de um banco
instalado. Roda na porta **3001**.

## Estrutura

```
backend/
├── server.js          ← cria o app Express, habilita CORS e monta as rotas
├── db.js              ← "banco" simples: lê/escreve o data.json (operações genéricas)
├── data.json          ← onde os dados ficam salvos
└── routes/
    ├── memorias.js    ← CRUD do recurso /memorias
    └── conversas.js   ← CRUD do recurso /conversas
```

## Como rodar

```bash
npm install --prefix backend   # só na primeira vez
npm run api                    # sobe em http://localhost:3001
```

## Recursos e modelo de dados

| Recurso | Campos |
|---|---|
| `memorias` | `id`, `titulo`, `categoria`, `conteudo`, `criadaEm` |
| `conversas` | `id`, `titulo`, `criadaEm`, `atualizadaEm` |

## Rotas (iguais para os dois recursos)

| Método | Rota | O que faz | Respostas |
|---|---|---|---|
| `GET` | `/memorias` | Lista todas | `200` |
| `GET` | `/memorias/:id` | Busca uma | `200` / `404` |
| `POST` | `/memorias` | Cria | `201` / `400` (validação) |
| `PUT` | `/memorias/:id` | Atualiza | `200` / `400` / `404` |
| `DELETE` | `/memorias/:id` | Remove | `204` / `404` |

(o mesmo vale para `/conversas`)

## Exemplos com `curl`

```bash
# Listar (READ)
curl http://localhost:3001/memorias

# Criar (CREATE)
curl -X POST http://localhost:3001/memorias \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Hobby","categoria":"pessoal","conteudo":"Gosta de tocar violão"}'

# Atualizar (UPDATE)
curl -X PUT http://localhost:3001/memorias/1 \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Nome","categoria":"pessoal","conteudo":"Chama-se Diogo"}'

# Excluir (DELETE)
curl -X DELETE http://localhost:3001/memorias/1
```

## Como o front-end consome

O front usa o wrapper `src/services/api.js`, que centraliza a URL base (`/api`, redirecionada pelo
proxy do Vite para a porta 3001), o cabeçalho JSON e o **tratamento de erros** (rede e respostas
de erro do servidor). Os serviços `memoriasService.js` e `conversasService.js` chamam esse wrapper.
