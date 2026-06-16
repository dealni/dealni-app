# Páginas, Componentes e CRUD (Sprints 2 e 3)

Este documento descreve a organização do front-end depois da evolução para múltiplas páginas
(Sprint 2) e consumo da API REST (Sprint 3).

## Navegação e páginas

A navegação usa o **React Router**. O `App.jsx` é o "shell": mostra a `Navbar` e a área de páginas.

| Página | Rota | Responsabilidade |
|---|---|---|
| `ChatPage` | `/` | Conversa com o Dealni; histórico no `localStorage`; injeta memórias no contexto |
| `ConversasPage` | `/conversas` | CRUD de conversas salvas |
| `MemoriasPage` | `/memorias` | CRUD de memórias |
| `SobrePage` | `/sobre` | Explicação do projeto |

## Componentes

```
components/
├── Navbar.jsx          ← menu de navegação (NavLink marca a página ativa)
├── Header.jsx          ← cabeçalho do chat (mostra a conversa ativa)
├── ChatWindow.jsx      ← área de rolagem das mensagens
├── MessageBubble.jsx   ← bolha individual
├── TypingIndicator.jsx ← animação "digitando..."
├── InputBar.jsx        ← campo de texto (input controlado)
├── MemoriaForm.jsx     ← formulário controlado (título, categoria, conteúdo) — cria e edita
├── MemoriaList.jsx     ← listagem dinâmica das memórias
├── MemoriaItem.jsx     ← card de uma memória (props: memoria, onEditar, onExcluir)
├── ConversaList.jsx    ← listagem das conversas
├── ErrorBanner.jsx     ← erro de rede/API visível ao usuário (reutilizável)
└── Loader.jsx          ← indicador de carregamento (reutilizável)
```

## Camada de dados (services e hooks)

```
services/
├── api.js               ← wrapper base do fetch (URL, JSON, tratamento de erro)
├── memoriasService.js   ← getMemorias / createMemoria / updateMemoria / deleteMemoria
├── conversasService.js  ← CRUD de conversas
├── openai.js            ← chamada à OpenAI (injeta as memórias no system prompt)
└── chatStorage.js       ← mensagens por conversa + conversa ativa (localStorage)

hooks/
├── useMemorias.js       ← estado + CRUD das memórias (loading/erro num só lugar)
└── useConversas.js      ← estado + CRUD das conversas
```

Os componentes visuais **não chamam `fetch` diretamente** — eles usam os hooks/services. Isso
mantém a lógica de negócio separada da apresentação (boa prática pedida na disciplina).

## Onde cada critério é atendido

### Sprint 2 (N2)
- **Navegação 3+ páginas** → `Navbar` + 4 páginas.
- **Formulário controlado (3+ campos)** → `MemoriaForm` (título, categoria, conteúdo) com `useState`.
- **Listagem dinâmica** → `MemoriaList` e `ConversaList`.
- **localStorage** → `chatStorage.js` salva o histórico de cada conversa (sobrevive ao reload).
- **2+ componentes `.jsx`** → o projeto tem mais de uma dúzia.

### Sprint 3 (N3)
- **API RESTful com CRUD completo** → `MemoriasPage` e `ConversasPage` fazem Create, Read, Update e
  Delete contra o back-end Express.
- **Tratamento de erros** → `ErrorBanner` + try/catch nos services/hooks; se o back-end cair, o
  usuário vê a mensagem e um botão "tentar de novo".
- **Componentização e organização** → componentes pequenos com props claras, hooks customizados,
  services separados.

## Fluxo CRUD de Memórias (exemplo)

```
MemoriasPage  ──usa──▶  useMemorias()  ──chama──▶  memoriasService  ──HTTP──▶  /api/memorias
     │                       │                                                      │
  MemoriaForm (Create/Update)│                                                  Express + data.json
  MemoriaList → MemoriaItem (Read/Delete)
```
