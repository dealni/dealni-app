# Relatório — Sprint 3 (N3): Sistema Integrado

## Capa

**Dealni Chat** — sistema web completo em React consumindo uma **API RESTful** própria com **CRUD
completo**. Disciplina: Desenvolvimento Front-End II.

## Problema que o sistema resolve

Conversar com uma IA de forma simples, no navegador, sem instalar nada — e com a IA **lembrando**
de fatos do usuário entre as conversas. O usuário organiza suas conversas e cadastra "memórias"
que o assistente passa a considerar nas respostas.

## Modelagem dos dados (back-end)

Dois recursos, cada um com persistência no `data.json`:

| Recurso | Campos |
|---|---|
| `memorias` | `id`, `titulo`, `categoria`, `conteudo`, `criadaEm` |
| `conversas` | `id`, `titulo`, `criadaEm`, `atualizadaEm` |

> A modelagem ER detalhada e a escolha de banco são responsabilidade da disciplina de BD; aqui o
> back-end usa um arquivo JSON, mas com uma API REST de verdade.

## Interfaces / serviços do back-end

API Express na porta 3001, com CRUD completo (ver [08-backend-api.md](08-backend-api.md)):

```
GET    /memorias        GET    /conversas
GET    /memorias/:id    GET    /conversas/:id
POST   /memorias        POST   /conversas
PUT    /memorias/:id    PUT    /conversas/:id
DELETE /memorias/:id    DELETE /conversas/:id
```

## Componentes e páginas React

- **Páginas:** `ChatPage`, `ConversasPage`, `MemoriasPage`, `SobrePage`.
- **Consumo da API:** `src/services/api.js` (wrapper fetch) + `memoriasService.js` /
  `conversasService.js`, usados pelos hooks `useMemorias` / `useConversas`.
- **CRUD completo na interface:**
  - **Create** → formulário de nova memória / nova conversa.
  - **Read** → listagens que carregam da API ao abrir a página.
  - **Update** → editar memória (formulário) / renomear conversa.
  - **Delete** → botão de excluir (com confirmação).

## Tratamento de erros (diferencial de nota máxima)

Toda chamada passa por `api.js`, que distingue **erro de rede** (back-end fora do ar) de **erro do
servidor** (ex.: validação 400). O componente `ErrorBanner` mostra a mensagem ao usuário com a
opção "tentar de novo". Se o back-end cair, o app **não trava** — exibe o erro.

## Integração que amarra tudo

As memórias cadastradas (CRUD via API) são injetadas no *system prompt* enviado à OpenAI em
`services/openai.js`. Ou seja: o que você cadastra na página de Memórias o Dealni realmente passa a
"lembrar" durante a conversa.

## Decisões técnicas (para explicar na banca)

- **Por que API + localStorage juntos?** Conversas e memórias são dados de domínio → ficam no
  back-end (CRUD REST). O histórico de mensagens é dado de sessão do cliente → fica no
  `localStorage` (rápido e funciona offline).
- **Por que uma camada de services?** Para separar lógica de rede da apresentação e poder trocar a
  origem dos dados sem mexer nos componentes.
- **Por que hooks customizados?** Para centralizar estado/loading/erro e evitar *prop drilling*.

## Como rodar na apresentação

```bash
npm install && npm install --prefix backend
cp .env.example .env   # preencher VITE_OPENAI_API_KEY
npm run dev:all        # sobe front (5173) + API (3001)
```
