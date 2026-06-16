# Relatório — Sprint 2 (N2): Mini Aplicativo React

## Título e tema

**Dealni Chat** — um chat web com o Dealni, assistente de IA com personalidade de gato. Nesta
sprint o app deixou de ser uma tela única e virou um mini aplicativo com várias páginas,
formulários e dados que persistem no navegador.

## Funcionalidades obrigatórias (e onde estão)

| Requisito | Implementação |
|---|---|
| Menu de navegação com 3+ páginas | `Navbar.jsx` + páginas Chat, Conversas, Memórias, Sobre (React Router) |
| Formulário controlado com `useState` (3+ campos) | `MemoriaForm.jsx`: título, categoria e conteúdo |
| Listagem dinâmica dos itens cadastrados | `MemoriaList.jsx` e `ConversaList.jsx` |
| Persistência com `localStorage` | `services/chatStorage.js` salva o histórico de cada conversa |
| 2+ componentes em `.jsx` separados | mais de uma dúzia (ver organização abaixo) |

## Organização dos componentes

- **Páginas** (`src/pages`): `ChatPage`, `ConversasPage`, `MemoriasPage`, `SobrePage`.
- **Componentes** (`src/components`): `Navbar`, `Header`, `ChatWindow`, `MessageBubble`,
  `TypingIndicator`, `InputBar`, `MemoriaForm`, `MemoriaList`, `MemoriaItem`, `ConversaList`,
  `ErrorBanner`, `Loader`.
- **Camada de dados** (`src/services`, `src/hooks`): lógica separada da apresentação.

Cada componente tem uma responsabilidade clara e recebe dados por **props** (ex.: `MemoriaItem`
recebe `memoria`, `onEditar` e `onExcluir`).

## Estado e formulários

- O formulário de memórias é **controlado**: cada campo é ligado a um `useState` e atualizado em
  tempo real no `onChange`. O React é a "fonte da verdade".
- O estado da lista é centralizado em hooks customizados (`useMemorias`, `useConversas`),
  evitando *prop drilling*.

## Persistência (localStorage)

O histórico de mensagens de cada conversa é salvo no `localStorage` com a chave
`dealni_msgs_<id>`. Ao recarregar a página, as mensagens continuam lá. A conversa que estava aberta
também é lembrada (`dealni_conversa_ativa`).

## Estilo e usabilidade

CSS próprio com tema escuro inspirado no Telegram, responsivo para celular (a navbar esconde os
rótulos em telas pequenas).

## Dificuldades e aprendizados

- Entender o ciclo de vida dos `useEffect` ao trocar de conversa (evitar salvar uma lista
  desatualizada — resolvido salvando explicitamente nas ações em vez de depender de um efeito).
- Organizar o código em camadas (componentes × services) para não misturar lógica com tela.
- Usar o React Router para navegação sem recarregar a página.
