# Dealni — Chat Web 😼

Chat web com o **Dealni**, um assistente de IA com personalidade de gato, construído com
**React + Vite** e a **API da OpenAI**. O projeto evolui ao longo das três sprints da disciplina
de Desenvolvimento Front-End II:

- **Sprint 1 (N1):** chat React com componentes, estado e eventos.
- **Sprint 2 (N2):** múltiplas páginas, navegação, formulário controlado, listagem e `localStorage`.
- **Sprint 3 (N3):** consumo de uma **API RESTful** própria com **CRUD completo** (conversas e memórias).

## Arquitetura

```
dealni-app/
├── src/            → front-end React (páginas, componentes, hooks, services)
└── backend/        → API RESTful em Express (CRUD de conversas e memórias)
```

O front-end **não acessa a rede diretamente**: tudo passa pela pasta `src/services` (chamadas à
API REST e ao `localStorage`), mantendo a lógica separada da apresentação.

## Como rodar

### 1. Instalar dependências

```bash
# front-end (na raiz)
npm install

# back-end
npm install --prefix backend
```

### 2. Configurar a chave da OpenAI

```bash
cp .env.example .env
```

Abra o `.env` e coloque sua chave:

```
VITE_OPENAI_API_KEY=sk-sua-chave-aqui
```

### 3. Subir o projeto

A forma mais simples sobe o front-end **e** o back-end de uma vez:

```bash
npm run dev:all
```

- Front-end: [http://localhost:5173](http://localhost:5173)
- API REST: [http://localhost:3001](http://localhost:3001)

Ou, em dois terminais separados:

```bash
npm run dev     # terminal 1 — front-end (Vite)
npm run api     # terminal 2 — back-end (Express)
```

> O Vite faz proxy de `/api/*` para o back-end (porta 3001), então não há problema de CORS.

## Funcionalidades

- 💬 **Chat** com o Dealni (gpt-4.1-nano), com histórico por conversa salvo no `localStorage`.
- 🗂️ **Conversas** — criar, abrir, renomear e excluir (CRUD via API REST).
- 🧠 **Memórias** — cadastrar fatos que o Dealni lembra; são injetados no contexto da IA (CRUD via API REST).
- 🧭 **Navegação** entre 4 páginas (Chat, Conversas, Memórias, Sobre).
- ⚠️ **Tratamento de erros** de rede/API visível ao usuário (banner com "tentar de novo").
- 📱 Design responsivo, tema escuro inspirado no Telegram.

## Scripts

| Script | O que faz |
|---|---|
| `npm run dev` | Sobe o front-end (Vite) |
| `npm run api` | Sobe o back-end (Express, porta 3001) |
| `npm run dev:all` | Sobe os dois juntos |
| `npm run build` | Gera o build de produção do front |
| `npm run lint` | Roda o ESLint |

## API REST (back-end)

Recursos com CRUD completo (`GET`, `POST`, `PUT`, `DELETE`):

- `/memorias` — `{ id, titulo, categoria, conteudo, criadaEm }`
- `/conversas` — `{ id, titulo, criadaEm, atualizadaEm }`

Detalhes em [docs/08-backend-api.md](docs/08-backend-api.md).

## Tecnologias

- [React](https://react.dev/) + [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/) (API REST)
- [OpenAI API](https://platform.openai.com/)
