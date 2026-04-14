# Roteiro de Apresentação — Sprint 1 (N1)

> Tempo: até 10 minutos. Use este documento como guia do que falar em cada momento.

---

## Abertura (30 segundos)

> *"Nosso projeto é o **Dealni Chat** — uma interface web de chat que permite conversar com o Dealni, um assistente de IA com personalidade de gato, integrado à API da OpenAI. A ideia surgiu do bot do Telegram que já existia, e resolvemos criar uma versão web com React."*

---

## 1. Mostrar a aplicação rodando (2 minutos)

Execute no terminal antes da apresentação:
```bash
npm run dev
```
Abra `http://localhost:5173` no navegador.

**O que demonstrar:**
- A tela inicial com o emoji animado do gato
- Digitar uma mensagem e enviar (Enter ou clique)
- Mostrar o indicador "digitando..." enquanto aguarda
- A resposta aparecendo na bolha do lado esquerdo
- Recarregar a página → mostrar que o histórico persiste (localStorage)
- Clicar no botão 🗑 para limpar o chat

**Frases para falar:**
> *"Quando mando uma mensagem, ela aparece imediatamente na tela — sem recarregar a página — e o Dealni mostra que está 'digitando'. Quando a resposta chega, ela é adicionada automaticamente à lista."*

> *"Se eu recarregar a página, o histórico continua aqui — isso é porque salvamos as mensagens no localStorage do navegador."*

---

## 2. Mostrar o repositório (1 minuto)

Abra o GitHub/Codeberg no navegador.

**O que mostrar:**
- Estrutura de pastas (`src/`, `components/`, `services/`)
- Commits com mensagens descritivas
- O `README.md` com instruções de instalação

---

## 3. Navegar pelo código — Componentes (3 minutos)

Abra o VS Code/Cursor e mostre os arquivos enquanto explica.

### `src/App.jsx`
> *"O App é o componente raiz. Ele guarda três estados com `useState`: a lista de mensagens, se o Dealni está digitando e se há algum erro. Cada filho recebe exatamente o que precisa via props."*

Aponte para:
```jsx
const [messages, setMessages] = useState(loadHistory)
const [isTyping, setIsTyping]  = useState(false)
const [error, setError]        = useState(null)
```

### `src/components/InputBar.jsx`
> *"O InputBar tem seu próprio estado: o texto que o usuário está digitando. Isso é um input controlado — o React sempre controla o valor do campo."*

Aponte para:
```jsx
const [text, setText] = useState('')
<textarea value={text} onChange={(e) => setText(e.target.value)} />
```

### `src/components/ChatWindow.jsx`
> *"O ChatWindow recebe a lista de mensagens e renderiza uma MessageBubble para cada uma com `.map()`. O `useRef` aponta para um elemento invisível no final da lista, e o `useEffect` rola até ele sempre que uma mensagem nova chega."*

Aponte para:
```jsx
{messages.map((msg) => (
    <MessageBubble key={msg.id} message={msg} />
))}
```

### `src/components/MessageBubble.jsx`
> *"A MessageBubble recebe um objeto de mensagem e decide a aparência baseada em quem enviou. Se for o usuário, a bolha fica azul à direita. Se for o bot, fica cinza à esquerda com o avatar."*

Aponte para:
```jsx
const isUser = message.from === 'user'
<div className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--bot'}`}>
```

### `src/services/openai.js`
> *"Toda a lógica de comunicação com a API fica isolada em `services/openai.js`. O componente App não sabe como a requisição funciona — ele só chama `sendMessage(histórico)` e recebe o texto da resposta."*

Aponte para:
```js
const response = await fetch(API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({ model: 'gpt-4.1-nano', messages }),
})
```

---

## 4. Mostrar persistência no código (1 minuto)

> *"A persistência usa o `localStorage` do navegador. Quando o componente monta, ele lê o histórico salvo. O `useEffect` salva automaticamente toda vez que a lista de mensagens muda."*

```jsx
// lê ao montar:
useState(loadHistory)

// salva a cada mudança:
useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}, [messages])
```

---

## 5. Fechamento (30 segundos)

> *"O projeto está 100% funcional com React + Vite. Aplicamos: componentes separados por responsabilidade, estados com `useState`, efeitos colaterais com `useEffect`, input controlado, renderização dinâmica com `.map()`, e consumo de API externa com `fetch` assíncrono."*

---

## Perguntas que o professor pode fazer — e como responder

**"O que é um componente React?"**
> É uma função JavaScript que retorna JSX — uma mistura de HTML com JavaScript. Cada componente representa uma parte da tela e tem uma responsabilidade clara.

**"O que é estado (`useState`)?"**
> É um dado que, quando muda, faz o React atualizar a tela automaticamente. Sem estado, a interface seria estática.

**"Por que usar `useEffect`?"**
> Para executar código *depois* da renderização — como salvar no localStorage ou fazer uma requisição à API. Não podemos fazer isso direto no corpo do componente porque causaria loops infinitos.

**"O que é um input controlado?"**
> É um campo de formulário cujo valor é sempre controlado pelo estado do React (`value={text}`). Diferente do comportamento padrão do HTML, onde o DOM controla o valor.

**"Por que a função `handleSend` é `async`?"**
> Porque faz uma requisição HTTP que leva tempo. Com `async/await`, a função pausa e espera a resposta sem travar o navegador.

**"O que é props?"**
> São parâmetros que um componente pai passa para um filho. É como o componente pai "configura" o filho. O filho não pode alterar a prop — só lê.

**"Por que separar em `services/openai.js`?"**
> Separação de responsabilidades: o componente cuida da tela, o serviço cuida da comunicação com APIs. Se a API mudar, só altera o serviço.

**"O que é localStorage?"**
> Um mini-banco de dados do navegador que persiste mesmo após fechar a aba. Armazena pares chave-valor em formato de string.

**"Por que `[...messages, newMsg]` em vez de `messages.push()`?"**
> No React, nunca se modifica o estado diretamente. O `push` altera o array original sem criar um novo, então o React não detecta a mudança e não re-renderiza.

**"O que é o `key` no `.map()`?"**
> É um identificador único que o React usa para rastrear cada item da lista. Sem o `key`, o React não sabe qual item foi adicionado, removido ou reordenado.

---

## Checklist antes de apresentar

- [ ] `npm run dev` rodando sem erros no terminal
- [ ] Nenhum erro vermelho no console do navegador (F12)
- [ ] Histórico salvando (envie uma mensagem, recarregue, confirme que persiste)
- [ ] Botão de limpar funcionando
- [ ] Arquivos abertos no editor prontos para mostrar
- [ ] `.env` configurado com a chave da OpenAI
