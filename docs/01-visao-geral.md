# Visão Geral do Sistema

## O que é o Dealni Chat?

O **Dealni Chat** é uma aplicação web que permite o usuário conversar com o **Dealni** — um
assistente de inteligência artificial com personalidade de gato, integrado à API da OpenAI.

Além do chat, o sistema tem várias páginas: o usuário pode **organizar suas conversas** e
**cadastrar memórias** (fatos que o Dealni passa a lembrar). As conversas e memórias são
gerenciadas por uma **API RESTful própria** (back-end em Express) com CRUD completo, enquanto o
histórico das mensagens fica no `localStorage` do navegador.

A interface é inspirada no Telegram: tema escuro, bolhas de mensagem, avatar e indicador de
"digitando...".

---

## Tecnologias utilizadas

| Tecnologia | Para quê serve |
|---|---|
| **React 19** | Biblioteca JavaScript para construir a interface |
| **React Router** | Navegação entre as páginas (Chat, Conversas, Memórias, Sobre) |
| **Vite 8** | Ferramenta que executa e compila o projeto em desenvolvimento |
| **Express** | Back-end: API RESTful com CRUD de conversas e memórias |
| **OpenAI API** | Serviço de IA que gera as respostas do Dealni |
| **localStorage** | Armazenamento do histórico de mensagens no navegador |
| **CSS puro** | Estilização completa da interface |

---

## Estrutura de arquivos

```
dealni-app/
│
├── index.html              ← Página HTML única (SPA — Single Page Application)
├── vite.config.js          ← Configuração do Vite (inclui proxy /api → back-end)
├── package.json            ← Dependências e scripts do projeto
├── .env                    ← Chave secreta da API (não vai para o GitHub)
│
├── backend/                ← API RESTful em Express (CRUD de conversas e memórias)
│   ├── server.js           ← Cria o app, CORS e monta as rotas
│   ├── db.js               ← "Banco" baseado em arquivo JSON
│   ├── data.json           ← Onde os dados ficam salvos
│   └── routes/             ← Rotas REST: memorias.js e conversas.js
│
└── src/                    ← Todo o código-fonte React
    │
    ├── main.jsx            ← Ponto de entrada (envolve o App no BrowserRouter)
    ├── App.jsx             ← Shell de layout: Navbar + roteamento das páginas
    ├── App.css             ← Estilos de toda a aplicação
    │
    ├── pages/              ← Uma página por rota
    │   ├── ChatPage.jsx        ← Conversa com o Dealni
    │   ├── ConversasPage.jsx   ← CRUD de conversas
    │   ├── MemoriasPage.jsx    ← CRUD de memórias
    │   └── SobrePage.jsx       ← Sobre o projeto
    │
    ├── components/         ← Componentes visuais (Navbar, Header, ChatWindow,
    │                          MemoriaForm, MemoriaList, ConversaList, ErrorBanner...)
    │
    ├── hooks/              ← Hooks customizados (useMemorias, useConversas)
    │
    └── services/           ← Lógica de dados separada da tela
        ├── api.js              ← Wrapper base do fetch (com tratamento de erro)
        ├── memoriasService.js  ← Chamadas CRUD de /memorias
        ├── conversasService.js ← Chamadas CRUD de /conversas
        ├── chatStorage.js      ← Histórico das mensagens no localStorage
        └── openai.js           ← Comunicação com a API da OpenAI
```

> Detalhes das páginas e do CRUD em [09-crud-e-paginas.md](09-crud-e-paginas.md);
> detalhes da API em [08-backend-api.md](08-backend-api.md).

---

## Como funciona em alto nível

```
Usuário digita mensagem
        ↓
   InputBar.jsx         ← captura o texto e chama onSend()
        ↓
    App.jsx              ← adiciona a mensagem ao estado, chama sendMessage()
        ↓
  services/openai.js    ← monta o histórico e faz a requisição HTTP para a OpenAI
        ↓
  API da OpenAI         ← processa e retorna a resposta do Dealni
        ↓
    App.jsx              ← adiciona a resposta ao estado
        ↓
  ChatWindow.jsx         ← re-renderiza com a nova mensagem
        ↓
 MessageBubble.jsx       ← exibe a bolha na tela
```

---

## Como rodar o projeto

```bash
# 1. Instalar dependências (front e back)
npm install
npm install --prefix backend

# 2. Criar o arquivo .env com a chave da OpenAI
cp .env.example .env   # e preencher VITE_OPENAI_API_KEY

# 3. Iniciar front-end + back-end juntos
npm run dev:all

# 4. Abrir no navegador
# Front: http://localhost:5173   |   API: http://localhost:3001
```

---

## O que é uma SPA (Single Page Application)?

O projeto é uma **SPA** — significa que existe apenas **um arquivo HTML** (`index.html`). O React injeta e atualiza o conteúdo da página dinamicamente, sem recarregar a página inteira a cada ação do usuário.

O ponto de entrada é o `<div id="root">` no `index.html`. O React pega essa `div` e coloca toda a aplicação dentro dela.

```html
<!-- index.html -->
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

```jsx
// main.jsx — pega a div#root e renderiza o App dentro dela
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```
