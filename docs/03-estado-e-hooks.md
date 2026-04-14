# Estado e Hooks React

## O que é "estado" no React?

**Estado** (state) é qualquer dado que, quando muda, faz a interface atualizar automaticamente.

Sem estado, a tela seria estática como um HTML comum.  
Com estado, quando uma mensagem chega, o React re-renderiza apenas o necessário.

> Regra simples: se um dado precisa aparecer na tela e pode mudar, ele deve ser **estado**.

---

## Hook `useState`

`useState` é a forma de criar estado em componentes funcionais.

### Sintaxe básica

```jsx
const [valor, setValor] = useState(valorInicial)
```

- `valor` — o dado atual
- `setValor` — função para atualizar o dado (nunca altere diretamente!)
- `valorInicial` — o que o estado tem quando o componente é criado pela primeira vez

### No projeto: `InputBar.jsx`

```jsx
const [text, setText] = useState('')
```

- `text` começa como string vazia `''`
- Cada letra digitada chama `setText(e.target.value)`, atualizando o estado
- O `textarea` exibe sempre o valor de `text` (`value={text}`)
- Isso é chamado de **input controlado** — o React controla o valor do campo

```jsx
<textarea
    value={text}                          // exibe o estado
    onChange={(e) => setText(e.target.value)}  // atualiza o estado
/>
```

### No projeto: `App.jsx` — três estados

```jsx
const [messages, setMessages] = useState(loadHistory)
const [isTyping, setIsTyping]  = useState(false)
const [error, setError]        = useState(null)
```

| Estado | Tipo | Valor inicial | Para que serve |
|---|---|---|---|
| `messages` | Array | histórico salvo | lista de todas as mensagens |
| `isTyping` | Boolean | `false` | controla o indicador de digitação |
| `error` | String ou null | `null` | mensagem de erro para o usuário |

> **Por que passar uma função para `useState`?**
> ```jsx
> useState(loadHistory)   // ← loadHistory é uma função, não um valor
> ```
> Quando o valor inicial é calculado (como ler o localStorage), passamos a **função** em vez do resultado. Assim o React só executa `loadHistory()` uma única vez, na criação do componente. Se passássemos `loadHistory()` (com parênteses), ela seria executada em cada re-render.

---

## Hook `useEffect`

`useEffect` executa código **após** o componente renderizar. É usado para efeitos colaterais: salvar dados, fazer requisições, manipular o DOM, etc.

### Sintaxe básica

```jsx
useEffect(() => {
    // código a executar
}, [dependências])
```

- O array de dependências controla **quando** o efeito roda:
  - `[]` vazio → roda apenas uma vez, na montagem do componente
  - `[variavel]` → roda sempre que `variavel` mudar
  - sem array → roda em toda re-renderização (evitar!)

### No projeto: salvar histórico (`App.jsx`)

```jsx
useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}, [messages])
```

**O que acontece:**
1. O usuário manda uma mensagem → `messages` é atualizado
2. O React re-renderiza o `App`
3. **Após** renderizar, o `useEffect` percebe que `messages` mudou
4. Salva o novo histórico no `localStorage`

Resultado: o histórico sempre fica sincronizado com o que está salvo no navegador.

### No projeto: scroll automático (`ChatWindow.jsx`)

```jsx
const bottomRef = useRef(null)

useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages, isTyping])
```

**O que acontece:**
1. Uma mensagem nova aparece OU o indicador de digitação aparece
2. O React re-renderiza o `ChatWindow`
3. O `useEffect` roda e chama `scrollIntoView` no elemento invisível no final da lista
4. A janela rola suavemente até o fim

---

## Hook `useRef`

`useRef` cria uma referência direta a um elemento do DOM. Diferente do estado, **mudar um ref não causa re-renderização**.

### No projeto: referência ao final da lista (`ChatWindow.jsx`)

```jsx
const bottomRef = useRef(null)

// ...

<div ref={bottomRef} />   // ← elemento invisível no final
```

- `bottomRef.current` aponta diretamente para essa `<div>`
- `bottomRef.current?.scrollIntoView(...)` é o equivalente a `document.querySelector('div').scrollIntoView(...)` — mas de forma segura dentro do React
- O `?.` é o **optional chaining**: se `current` for `null`, não lança erro

---

## Resumo visual dos hooks no projeto

```
App.jsx
  useState(loadHistory)    → messages  ──→ ChatWindow (prop)
  useState(false)          → isTyping  ──→ ChatWindow (prop)
                                       ──→ InputBar (prop disabled)
  useState(null)           → error     ──→ <div className="chat-error">

  useEffect([messages])    → salva no localStorage toda vez que messages muda

ChatWindow.jsx
  useRef(null)             → bottomRef ──→ <div ref={bottomRef} />
  useEffect([messages, isTyping]) → rola até bottomRef quando algo novo aparece

InputBar.jsx
  useState('')             → text ──→ <textarea value={text}>
```

---

## Fluxo de re-renderização

Quando o usuário envia uma mensagem:

```
setText('')               → re-renderiza InputBar (campo limpa)
setMessages([...updated]) → re-renderiza App + ChatWindow + todas as MessageBubbles
setIsTyping(true)         → re-renderiza App + ChatWindow (mostra TypingIndicator)
```

Quando a resposta chega:

```
setMessages([...prev, botMsg]) → re-renderiza ChatWindow com a nova bolha do bot
setIsTyping(false)             → re-renderiza ChatWindow (esconde TypingIndicator)
```

O React é **inteligente**: ele compara o que mudou e atualiza **só as partes necessárias** do DOM real. Isso é o que torna o React eficiente.
