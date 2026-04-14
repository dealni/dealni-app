# Visão Geral do Sistema

## O que é o Dealni Chat?

O **Dealni Chat** é uma aplicação web de chat em tempo real que permite o usuário conversar com o **Dealni** — um assistente de inteligência artificial com personalidade de gato, integrado à API da OpenAI.

A interface é inspirada no Telegram: tema escuro, bolhas de mensagem, avatar, indicador de "digitando..." e persistência do histórico entre sessões.

---

## Tecnologias utilizadas

| Tecnologia | Para quê serve |
|---|---|
| **React 19** | Biblioteca JavaScript para construir a interface |
| **Vite 8** | Ferramenta que executa e compila o projeto em desenvolvimento |
| **OpenAI API** | Serviço de IA que gera as respostas do Dealni |
| **localStorage** | Armazenamento do histórico no navegador do usuário |
| **CSS puro** | Estilização completa da interface |

---

## Estrutura de arquivos

```
dealni-app/
│
├── index.html              ← Página HTML única (SPA — Single Page Application)
├── vite.config.js          ← Configuração do Vite
├── package.json            ← Dependências e scripts do projeto
├── .env                    ← Chave secreta da API (não vai para o GitHub)
│
├── public/                 ← Arquivos estáticos públicos
│
└── src/                    ← Todo o código-fonte React
    │
    ├── main.jsx            ← Ponto de entrada: monta o App no HTML
    ├── index.css           ← Reset CSS global (zeragem de margens/padding)
    │
    ├── App.jsx             ← Componente raiz: gerencia todo o estado do chat
    ├── App.css             ← Estilos de todos os componentes
    │
    ├── assets/
    │   └── hero.jpg        ← Foto do avatar do Dealni
    │
    ├── components/         ← Componentes visuais separados por responsabilidade
    │   ├── Header.jsx          ← Cabeçalho com nome e avatar
    │   ├── ChatWindow.jsx      ← Área de rolagem das mensagens
    │   ├── MessageBubble.jsx   ← Bolha individual de mensagem
    │   ├── TypingIndicator.jsx ← Animação "Dealni está digitando..."
    │   └── InputBar.jsx        ← Campo de texto e botão de enviar
    │
    └── services/
        └── openai.js       ← Toda a lógica de comunicação com a API da OpenAI
```

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
# 1. Instalar dependências
npm install

# 2. Criar o arquivo .env com a chave da OpenAI
# (o arquivo já existe no projeto)

# 3. Iniciar o servidor de desenvolvimento
npm run dev

# 4. Abrir no navegador
# http://localhost:5173
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
