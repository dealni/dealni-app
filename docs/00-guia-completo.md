# Guia Completo do Dealni Chat — Entendendo Tudo do Zero

> Este guia foi escrito para você que **fez o projeto mas não entende como ele funciona**.
> A ideia é te ensinar de verdade: começamos pelos conceitos básicos (o que é front-end,
> back-end, API, React...) e depois passamos por **cada arquivo de código**, explicando o que
> cada parte faz e *por quê*. Leia na ordem. Não pule as seções de conceito — elas são a base
> para entender o código que vem depois.

---

## Índice

1. [Visão de 30 segundos: o que é o projeto](#1-visão-de-30-segundos)
2. [Conceitos fundamentais (pré-requisitos)](#2-conceitos-fundamentais)
3. [As tecnologias usadas](#3-as-tecnologias-usadas)
4. [A arquitetura: as três camadas](#4-a-arquitetura-as-três-camadas)
5. [Como rodar o projeto](#5-como-rodar-o-projeto)
6. [Fundamentos de React que você precisa dominar](#6-fundamentos-de-react)
7. [O código do FRONT-END, arquivo por arquivo](#7-o-código-do-front-end)
8. [O código do BACK-END, arquivo por arquivo](#8-o-código-do-back-end)
9. [Fluxos completos ponta a ponta](#9-fluxos-completos-ponta-a-ponta)
10. [CRUD, REST e códigos de status explicados](#10-crud-rest-e-status)
11. [Glossário](#11-glossário)
12. [Perguntas que podem cair na apresentação](#12-perguntas-da-apresentação)

---

## 1. Visão de 30 segundos

O **Dealni Chat** é um site onde você conversa com o **Dealni**, um assistente de IA com
personalidade de gato. Por trás disso há três coisas funcionando juntas:

- **O site (front-end):** a parte visual, feita em **React**, que roda no navegador.
- **O servidor (back-end):** uma **API** feita em **Express** (Node.js) que guarda suas
  *conversas* e *memórias* em um arquivo.
- **A IA (OpenAI):** um serviço externo da OpenAI que de fato gera as respostas do Dealni.

Além de conversar, você pode:
- **Criar/abrir/renomear/excluir conversas** (cada uma com seu histórico).
- **Cadastrar "memórias"** — fatos sobre você que o Dealni passa a lembrar em toda conversa.
- **Alternar entre tema claro e escuro.**

Esse projeto foi crescendo em três etapas (sprints):
- **Sprint 1:** o chat básico em React.
- **Sprint 2:** virou um app com várias páginas + salvamento no navegador (`localStorage`).
- **Sprint 3:** ganhou um back-end próprio (API REST) com CRUD completo.

---

## 2. Conceitos fundamentais

Antes do código, você precisa entender estas ideias. Elas se repetem o tempo todo.

### 2.1. Cliente e Servidor

Quando você abre um site, existem **dois lados**:

- **Cliente:** o seu navegador (Chrome, Firefox...). É onde a página aparece e onde você clica.
- **Servidor:** um computador em outro lugar que *responde* aos pedidos do cliente (por exemplo,
  "me dê a lista de conversas").

Eles conversam pela internet usando um "idioma" chamado **HTTP**.

> No nosso projeto, durante o desenvolvimento, tanto o "cliente" quanto o "servidor" rodam na sua
> própria máquina, em **portas** diferentes (front na 5173, back na 3001). Porta é só um "número
> de apartamento" dentro do mesmo computador (`localhost`).

### 2.2. HTTP, requisição e resposta

**HTTP** é o protocolo (conjunto de regras) que cliente e servidor usam para conversar. Toda
comunicação é um par **requisição → resposta**:

- **Requisição (request):** o cliente pede algo. Tem:
  - um **método** (o "verbo" da ação): `GET` (ler), `POST` (criar), `PUT` (atualizar), `DELETE` (apagar);
  - uma **URL/caminho** (o "endereço": `/conversas`, `/memorias/3`...);
  - opcionalmente um **corpo (body)** com dados (geralmente em JSON).
- **Resposta (response):** o servidor responde. Tem:
  - um **código de status** (número que diz se deu certo: `200` ok, `201` criado, `404` não
    achou, `400` pedido inválido, `500` erro no servidor...);
  - geralmente um **corpo** com dados (também em JSON).

### 2.3. JSON

**JSON** (JavaScript Object Notation) é o formato de texto usado para trocar dados. Parece um
objeto JavaScript:

```json
{
  "id": 1,
  "titulo": "Primeira conversa",
  "criadaEm": "2026-06-16T12:00:00.000Z"
}
```

Cliente e servidor mandam dados nesse formato porque é fácil de ler tanto para humanos quanto
para o código. Em JavaScript convertemos com `JSON.stringify(obj)` (objeto → texto) e
`JSON.parse(texto)` (texto → objeto).

### 2.4. API e API REST

- **API** = "Interface de Programação de Aplicações". É um conjunto de "endereços" (endpoints)
  que um programa oferece para outro programa usar. Pense num cardápio: você não entra na cozinha,
  você pede pelos itens do cardápio.
- **REST** é um *estilo* de organizar uma API. As regras principais que usamos:
  - Cada "coisa" do sistema é um **recurso** com uma URL: `/conversas`, `/memorias`.
  - Você age sobre o recurso usando os **métodos HTTP**: `GET /conversas` (listar),
    `POST /conversas` (criar), `PUT /conversas/1` (atualizar a de id 1),
    `DELETE /conversas/1` (apagar a de id 1).

### 2.5. CRUD

**CRUD** são as 4 operações básicas sobre dados. É o coração do projeto:

| Letra | Operação | Método HTTP | Exemplo |
|---|---|---|---|
| **C** | Create (criar) | `POST` | criar uma nova memória |
| **R** | Read (ler) | `GET` | listar as memórias |
| **U** | Update (atualizar) | `PUT` | renomear uma conversa |
| **D** | Delete (apagar) | `DELETE` | excluir uma conversa |

### 2.6. SPA — Single Page Application

O nosso site é uma **SPA**: existe **um único arquivo HTML** (`index.html`). Quando você "muda de
página" (Chat → Conversas → Memórias), a página **não recarrega** de verdade — o React troca o
conteúdo na tela na hora. Isso deixa a navegação instantânea. Quem cuida dessa troca é o
**React Router**.

### 2.7. Síncrono x Assíncrono (e `async/await`)

Algumas operações são **demoradas**: pedir dados pela internet, por exemplo, leva tempo. Se o
código "parasse" esperando, a tela travaria. Por isso usamos código **assíncrono**: disparamos o
pedido e continuamos; quando a resposta chega, tratamos ela.

Em JavaScript isso aparece como **Promise** (uma "promessa" de um valor futuro) e as palavras
`async` / `await`:

```js
async function exemplo() {
  const dados = await getMemorias() // "espera" a resposta SEM travar a tela
  console.log(dados)                // só roda depois que os dados chegam
}
```

- `async` marca uma função que faz algo assíncrono.
- `await` "espera" uma Promise terminar e te dá o resultado.
- Para tratar erros usamos `try { ... } catch (e) { ... }`.

Guarde isso: **toda vez que falamos com o back-end ou com a OpenAI, usamos `async/await`.**

---

## 3. As tecnologias usadas

| Tecnologia | Onde | Para quê serve |
|---|---|---|
| **React 19** | front | Biblioteca para montar a interface a partir de "componentes" |
| **React Router 7** | front | Navegação entre páginas sem recarregar (SPA) |
| **Vite 8** | front | Liga o servidor de desenvolvimento e empacota o site final |
| **CSS puro** | front | Toda a aparência (cores, layout, temas claro/escuro) |
| **localStorage** | front | Guarda o histórico das mensagens no navegador |
| **Node.js** | back | Permite rodar JavaScript fora do navegador (no servidor) |
| **Express 4** | back | Framework que facilita criar a API REST |
| **CORS** | back | Libera o front (porta 5173) a chamar o back (porta 3001) |
| **OpenAI API** | externo | O serviço de IA que escreve as respostas do Dealni |

---

## 4. A arquitetura: as três camadas

```
┌─────────────────────────────────────────────────────────────────┐
│                         SEU NAVEGADOR                             │
│                                                                   │
│   FRONT-END (React + Vite)  ──────────────────────────────────┐  │
│   - Páginas: Chat, Conversas, Memórias                         │  │
│   - localStorage: histórico das mensagens + tema + conversa    │  │
│   └────────────┬───────────────────────────────┬──────────────┘  │
└────────────────│───────────────────────────────│─────────────────┘
                 │ (fetch via /api)               │ (fetch direto)
                 ▼                                 ▼
   ┌─────────────────────────────┐     ┌────────────────────────────┐
   │   BACK-END (Express :3001)   │     │     API da OpenAI          │
   │   - /memorias  (CRUD)        │     │  (gera a resposta da IA)   │
   │   - /conversas (CRUD)        │     └────────────────────────────┘
   │   - guarda em data.json      │
   └─────────────────────────────┘
```

Pontos importantes dessa arquitetura:

1. **O front-end nunca fala "direto" com a rede dentro dos componentes visuais.** Toda chamada de
   rede passa pela pasta `src/services`. Isso se chama **separação de responsabilidades**: a tela
   cuida do visual, os serviços cuidam dos dados. Se amanhã trocar a API, você mexe só em
   `services/`, não em 15 telas.

2. **Onde cada dado mora:**
   - *Conversas* e *memórias* (os metadados) → no **back-end** (`data.json`).
   - *Mensagens* do chat (o que foi digitado) → no **localStorage** do navegador.
   - *Resposta da IA* → vem da **OpenAI** na hora e é guardada junto das mensagens no localStorage.

3. **Por que duas chamadas de rede diferentes?** O back-end é *seu* (você fez). A OpenAI é um
   serviço externo. O chat fala com os dois: pega contexto (memórias) do seu back-end e pede a
   resposta para a OpenAI.

---

## 5. Como rodar o projeto

```bash
# 1) Instalar as dependências do front (na raiz do projeto)
npm install

# 2) Instalar as dependências do back-end
npm install --prefix backend

# 3) Criar o arquivo .env com a chave da OpenAI
cp .env.example .env
#    depois edite o .env e coloque:  VITE_OPENAI_API_KEY=sk-sua-chave-aqui

# 4) Subir front + back ao mesmo tempo
npm run dev:all
```

Depois disso:
- Front-end: http://localhost:5173
- API REST: http://localhost:3001

Os scripts (definidos em `package.json`) significam:

| Script | O que faz |
|---|---|
| `npm run dev` | sobe só o front-end (Vite) |
| `npm run api` | sobe só o back-end (Express na porta 3001) |
| `npm run dev:all` | sobe os dois juntos (usando a ferramenta `concurrently`) |
| `npm run build` | gera a versão final/otimizada do front para publicar |
| `npm run lint` | roda o ESLint, que verifica erros e padrões no código |

> **Sobre o `.env`:** é um arquivo com segredos (a chave da OpenAI). Ele está no `.gitignore`, ou
> seja, **não vai para o GitHub** — chave de API é coisa que nunca se publica. O prefixo `VITE_`
> é uma regra do Vite: só variáveis que começam com `VITE_` ficam acessíveis no código do front.

---

## 6. Fundamentos de React

Esta é a seção mais importante para entender o front. Leia com calma; tudo aqui aparece no seu
código.

### 6.1. Componente

Um **componente** é uma função JavaScript que **retorna a tela** (em JSX). Cada pedaço da
interface é um componente: um botão, um cabeçalho, a lista de mensagens, a página inteira.

```jsx
function Header() {
  return <h1>Olá</h1>   // isso é JSX: parece HTML, mas está dentro do JS
}
```

Componentes começam com **letra maiúscula** e podem ser usados como se fossem tags HTML:
`<Header />`. Componentes podem conter outros componentes — é assim que se monta a tela inteira,
como peças de Lego.

### 6.2. JSX

**JSX** é a sintaxe que mistura HTML com JavaScript. Regras que aparecem no seu projeto:

- Atributo `class` do HTML vira `className` no JSX (porque `class` é palavra reservada do JS).
- Para colocar **JavaScript dentro do JSX**, use chaves `{ }`:
  ```jsx
  <span>{conversa.titulo}</span>          {/* mostra o valor da variável */}
  <p>{messages.length} mensagens</p>      {/* pode ter expressões */}
  ```
- Um componente só pode retornar **um elemento raiz**. Quando precisa de vários lado a lado sem
  uma `div` extra, usa-se um *Fragment*: `<>...</>`.

### 6.3. Props

**Props** ("propriedades") são os **dados que um componente recebe de quem o usa** — como os
parâmetros de uma função. Servem para o componente "pai" mandar informação para o "filho".

```jsx
// Componente filho recebe props (aqui usando "desestruturação" para pegar titulo e status):
function Header({ titulo, status }) {
  return <span>{titulo} — {status}</span>
}

// Componente pai passa as props como se fossem atributos:
<Header titulo="Dealni" status="online" />
```

Props são **somente leitura**: o filho não muda as props que recebeu; ele só as usa. Quando o
filho precisa "avisar" o pai de algo, o pai passa uma **função** como prop (um *callback*) — você
verá `onSend`, `onSelecionar`, `onEditar` etc. no projeto. O filho chama essa função; quem reage
é o pai.

### 6.4. Estado (`useState`)

**Estado** é qualquer dado que, quando muda, faz a tela **re-renderizar** (se redesenhar)
automaticamente. É o que torna a interface "viva".

```jsx
import { useState } from 'react'

function Contador() {
  const [valor, setValor] = useState(0) //   ↑ valor inicial = 0
  //      ↑ valor atual    ↑ função para mudar o valor
  return <button onClick={() => setValor(valor + 1)}>Cliques: {valor}</button>
}
```

- `useState(inicial)` devolve um par: **[valor atual, função que muda o valor]**.
- Você **nunca** muda o valor direto (`valor = 5` ❌). Sempre usa a função (`setValor(5)` ✅).
  É chamando a função que o React sabe que precisa redesenhar a tela.
- Quando o novo valor depende do anterior, use a forma com função:
  `setMemorias(prev => [...prev, nova])` — "pegue o valor anterior e devolva um novo".

> **Por que `[...prev, nova]` e não `prev.push(nova)`?** No React, criamos um **novo** array/objeto
> em vez de modificar o existente (imutabilidade). O `...` (spread) "espalha" os itens antigos
> num array novo, e adicionamos o novo no fim. Isso é o que faz o React perceber a mudança.

### 6.5. Efeitos (`useEffect`)

`useEffect` serve para rodar código **em reação a algo** — tipicamente para *sincronizar* com o
"mundo de fora" (buscar dados, mexer no `localStorage`, ajustar o `document`...).

```jsx
useEffect(() => {
  // este código roda DEPOIS que a tela é desenhada
  carregar()
}, [carregar])   // ← "array de dependências"
```

A regra do **array de dependências** (o segundo argumento) é o que mais confunde:
- `[]` (vazio) → roda **uma vez só**, quando o componente aparece (monta).
- `[x, y]` → roda na montagem **e toda vez que `x` ou `y` mudarem**.
- *sem* o array → roda em **toda** renderização (raramente o que se quer).

No projeto, usamos `useEffect` para: carregar memórias/conversas ao abrir a página, recarregar o
histórico quando troca a conversa, rolar o chat para baixo quando chega mensagem nova, e aplicar
o tema no `<html>`.

### 6.6. Referências (`useRef`)

`useRef` guarda um valor que **persiste entre renderizações mas NÃO causa re-render** quando muda.
O uso mais comum (e o do projeto) é **apontar para um elemento do DOM** para manipulá-lo
diretamente:

```jsx
const bottomRef = useRef(null)
// ...
<div ref={bottomRef} />          // "marca" esse elemento
bottomRef.current.scrollIntoView() // depois conseguimos mexer nele
```

### 6.7. `useCallback`

`useCallback` **memoriza uma função** para que ela mantenha a *mesma referência* entre renders.
Parece detalhe, mas importa quando essa função é dependência de um `useEffect` ou é passada como
prop: evita recriar a função à toa (e evita efeitos rodando sem necessidade).

```jsx
const fecharMenu = useCallback(() => setMenuAberto(false), [])
// a mesma função "fecharMenu" sobrevive entre renders, em vez de ser recriada
```

### 6.8. Hooks customizados

Os nomes que começam com `use` (`useState`, `useEffect`...) são **hooks**. Você pode criar os
**seus próprios hooks** para reaproveitar lógica. No projeto temos `useMemorias`, `useConversas`
e `useTheme` — cada um junta o estado + as funções relacionadas a um assunto, deixando as páginas
mais limpas. Um hook customizado é só uma função que começa com `use` e usa outros hooks dentro.

### 6.9. Renderizar listas e condicionais

- **Lista:** usamos `.map()` para transformar um array de dados em um array de elementos. Cada
  item precisa de uma prop **`key`** única (ajuda o React a identificar cada item):
  ```jsx
  {memorias.map((m) => <MemoriaItem key={m.id} memoria={m} />)}
  ```
- **Condicional:** mostrar algo só "se":
  ```jsx
  {error && <div className="chat-error">{error}</div>}   // mostra a div SÓ se houver erro
  {carregando ? <Loader /> : <Lista />}                  // um OU outro
  ```

Com esses 9 conceitos você consegue ler **qualquer** arquivo do front. Vamos ao código.

---

## 7. O código do FRONT-END

Vamos seguir a ordem em que as coisas "ligam", do ponto de entrada até as folhas.

### 7.1. `index.html` — o esqueleto

É o **único** HTML do site (lembra: SPA). As partes que importam:

```html
<html lang="pt-BR" data-theme="light">
  ...
  <body>
    <div id="root"></div>                      <!-- (1) -->
    <script type="module" src="/src/main.jsx"></script>  <!-- (2) -->
  </body>
</html>
```

1. `<div id="root">` está **vazia**. É o "buraco" onde o React vai injetar todo o app.
2. `<script ... src="/src/main.jsx">` carrega o JavaScript inicial — o arquivo `main.jsx`.

O atributo `data-theme="light"` no `<html>` é a chave do sistema de temas: o CSS muda as cores
conforme esse atributo for `light` ou `dark`. O `<head>` ainda carrega as fontes do Google
(Inter e Source Serif) e define o ícone (um emoji de gato 😼).

### 7.2. `src/main.jsx` — o ponto de entrada

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

Linha a linha:
- `createRoot(document.getElementById('root'))` → pega aquela `<div id="root">` do HTML e cria
  ali a "raiz" do React.
- `.render(...)` → manda o React desenhar o que está dentro.
- `<App />` → o componente principal (toda a aplicação).
- `<BrowserRouter>` → **envolve** o app para habilitar o roteamento (as URLs `/`, `/conversas`...).
  Tudo que precisa navegar tem que estar dentro dele.
- `<StrictMode>` → um modo de desenvolvimento do React que ajuda a achar bugs (ele propositalmente
  roda alguns trechos duas vezes em dev para detectar problemas; some no build final).
- `import './index.css'` → carrega o CSS base.

### 7.3. `src/App.jsx` — layout + roteamento

Este é o "esqueleto" visual: a **sidebar** à esquerda e a **área de páginas** à direita. Também
é onde fica o **estado compartilhado** entre Chat e Conversas: qual é a *conversa ativa*.

```jsx
export default function App() {
    const [activeConversa, setActive] = useState(getActiveConversa)
    const [menuAberto, setMenuAberto] = useState(false)
```

- `activeConversa` → a conversa que está aberta no chat. O valor inicial vem de
  `getActiveConversa` (lê do `localStorage`), então ao recarregar a página ela continua aberta.
  Repare que passamos a **função** `getActiveConversa` (sem `()`): isso é "inicialização preguiçosa"
  — o React chama essa função só uma vez para descobrir o valor inicial.
- `menuAberto` → controla se a sidebar está aberta no celular (no desktop ela fica sempre visível).

```jsx
    const selecionarConversa = useCallback((conversa) => {
        setActive(conversa)            // atualiza o estado (re-renderiza)
        setActiveConversa(conversa)    // persiste no localStorage
    }, [])
```

`selecionarConversa` faz as duas coisas juntas: muda o estado **e** salva no navegador. Está em
`useCallback` para manter a mesma referência (ela é passada como prop para as páginas e usada em
efeitos). Note os dois nomes parecidos mas diferentes: `setActive` (estado do React) e
`setActiveConversa` (função do `chatStorage` que escreve no localStorage).

```jsx
    return (
        <div className="app">
          <div className="app-shell">
            <button className="sidebar-mobile-btn" onClick={() => setMenuAberto(true)} ...>
                <IconMenu size={20} />
            </button>

            {menuAberto && <div className="sidebar-backdrop" onClick={fecharMenu} />}

            <Sidebar aberta={menuAberto} onNavegar={fecharMenu} />

            <main className="main-area">
                <Routes>
                    <Route path="/"          element={<ChatPage ... />} />
                    <Route path="/conversas" element={<ConversasPage ... />} />
                    <Route path="/memorias"  element={<MemoriasPage />} />
                </Routes>
            </main>
          </div>
        </div>
    )
```

O que está acontecendo:
- O **botão de menu** (☰) só faz sentido no celular; ao clicar, abre a sidebar (`setMenuAberto(true)`).
- O **backdrop** (fundo escuro) só aparece `{menuAberto && ...}` — renderização condicional. Clicar
  nele fecha o menu.
- `<Sidebar />` recebe se está `aberta` e uma função `onNavegar` (para fechar o menu ao clicar num link).
- `<Routes>` + `<Route>` são do React Router. Cada `Route` diz: "quando a URL for *path*, mostre
  *element*". É isso que faz a SPA "trocar de página":
  - `/` → `ChatPage`
  - `/conversas` → `ConversasPage`
  - `/memorias` → `MemoriasPage`
- Note que `ChatPage` e `ConversasPage` recebem `activeConversa` e `onSelecionar` — assim as duas
  páginas compartilham *qual conversa está aberta*. Isso é o padrão **"lifting state up"** (subir o
  estado para o pai comum, aqui o `App`, e passá-lo para baixo via props).

### 7.4. `src/components/Sidebar.jsx` — a navegação

```jsx
const links = [
    { to: '/', label: 'Chat', Icon: IconChat, end: true },
    { to: '/conversas', label: 'Conversas', Icon: IconConversas },
    { to: '/memorias', label: 'Memórias', Icon: IconMemoria },
]
```

Os links ficam num **array de dados**, e a tela é gerada a partir dele com `.map()`. Vantagem: para
adicionar uma página, basta acrescentar um item no array.

```jsx
export default function Sidebar({ aberta, onNavegar }) {
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()
```

- `useTheme()` → nosso hook customizado: devolve o tema atual e a função para alterná-lo.
- `useNavigate()` → hook do React Router para **navegar via código** (sem o usuário clicar num
  link). Usado no botão "Nova conversa".

```jsx
    {links.map((link) => {
        const Icon = link.Icon
        return (
            <li key={link.to}>
                <NavLink to={link.to} end={link.end} onClick={() => onNavegar?.()}
                    className={({ isActive }) =>
                        'sidebar__link' + (isActive ? ' sidebar__link--ativo' : '')}>
                    <Icon size={19} />
                    {link.label}
                </NavLink>
            </li>
        )
    })}
```

- `NavLink` é como um link (`<a>`), mas que sabe se está "ativo" (se a URL atual bate com o `to`).
  Por isso o `className` aqui é uma **função** que recebe `{ isActive }` e adiciona a classe
  `--ativo` quando a página está selecionada (fica destacada na sidebar).
- `end={link.end}` no link do Chat (`/`) garante que ele só fica ativo na rota exata `/`, e não em
  `/conversas` (que também "começa" com `/`).
- `onNavegar?.()` → ao clicar, fecha o menu no celular. O `?.` ("optional chaining") só chama a
  função **se ela existir**, evitando erro caso não tenha sido passada.

No rodapé há o botão de tema, que mostra "Tema escuro" ou "Tema claro" (com lua/sol) dependendo do
tema atual e chama `toggleTheme` ao clicar.

### 7.5. As páginas

#### 7.5.1. `src/pages/ChatPage.jsx` — a conversa

Esta é a página mais "cheia" porque junta várias fontes de dados. Vamos pelos estados:

```jsx
const [conversa, setConversa] = useState(activeConversa) // conversa aberta
const [messages, setMessages] = useState([])             // mensagens (do localStorage)
const [memorias, setMemorias] = useState([])             // memórias (da API) → contexto da IA
const [isTyping, setIsTyping] = useState(false)          // "Dealni está digitando..."
const [error, setError] = useState(null)                 // erro para mostrar ao usuário
```

Agora os três `useEffect` (cada um sincroniza com uma fonte diferente):

```jsx
// (A) Garante que há uma conversa aberta
useEffect(() => {
    if (activeConversa) { setConversa(activeConversa); return }
    getConversas()
      .then((lista) => { if (lista.length > 0) { setConversa(lista[0]); onSelecionar?.(lista[0]) } })
      .catch(() => { /* back-end fora do ar */ })
}, [activeConversa, onSelecionar])
```
Se já existe conversa ativa, usa ela. Senão, busca a lista no back-end e abre a primeira — assim o
chat já "funciona de cara" com a conversa de exemplo (o *seed* do back-end). Se o back-end estiver
desligado, o `.catch` evita quebrar (o chat só fica indisponível até você abrir/criar uma conversa).

```jsx
// (B) Recarrega o histórico sempre que a conversa muda
useEffect(() => {
    setMessages(conversa ? loadMessages(conversa.id) : [])
}, [conversa])
```
Cada conversa tem suas mensagens salvas no `localStorage`. Ao trocar de conversa, carregamos as
mensagens daquela conversa específica.

```jsx
// (C) Busca as memórias uma vez (contexto para a IA)
useEffect(() => {
    getMemorias().then(setMemorias).catch(() => setMemorias([]))
}, [])
```
As memórias são injetadas no "system prompt" da IA (veremos em `openai.js`). O `[]` faz isso
rodar uma vez só. Se falhar, segue com lista vazia (best-effort).

O envio de mensagem:

```jsx
async function handleSend(text) {
    if (!conversa) return
    const userMsg = { id: Date.now(), from: 'user', text, time: getTime() }
    const comUsuario = [...messages, userMsg]
    atualizarMensagens(comUsuario)   // mostra a SUA mensagem imediatamente
    setIsTyping(true)                // liga o "digitando..."
    setError(null)

    try {
        const reply = await sendMessage(comUsuario, memorias)  // chama a OpenAI
        const botMsg = { id: Date.now() + 1, from: 'bot', text: reply, time: getTime() }
        atualizarMensagens([...comUsuario, botMsg])            // mostra a resposta
    } catch (err) {
        setError(err.message || 'Erro ao conectar com a API.')
    } finally {
        setIsTyping(false)           // desliga o "digitando..." aconteça o que acontecer
    }
}
```

Observe o padrão:
1. Cria o objeto da sua mensagem. `id: Date.now()` usa o "carimbo de tempo" (milissegundos) como
   id único simples. `from: 'user'` marca quem mandou. `time` é a hora formatada (HH:MM).
2. Adiciona ao array e **mostra na hora** (UI otimista — você vê sua mensagem antes da IA responder).
3. Liga o indicador de digitação, chama a IA com `await`, e adiciona a resposta.
4. `try/catch/finally`: se der erro, mostra no banner; o `finally` sempre desliga o "digitando".

`atualizarMensagens` salva e atualiza juntos (importante para não salvar uma lista desatualizada):

```jsx
function atualizarMensagens(novas) {
    setMessages(novas)
    if (conversa) saveMessages(conversa.id, novas)
}
```

No final, a página decide **o que mostrar**:
- Se **não há conversa** (`if (!conversa)`) → uma tela orientando a ir em "Conversas".
- Senão → `<Header>` (com botão de limpar, que só aparece se há mensagens) + `<ChatWindow>` (a
  lista) + o banner de erro (se houver) + `<InputBar>` (o campo de escrever).

#### 7.5.2. `src/pages/MemoriasPage.jsx` — CRUD de memórias

```jsx
const { memorias, carregando, erro, recarregar, adicionar, editar, remover } = useMemorias()
const [emEdicao, setEmEdicao] = useState(null) // memória sendo editada (null = modo "criar")
```

Repare como a página fica **enxuta**: toda a lógica de CRUD veio pronta do hook `useMemorias`. A
página só decide *o que fazer* com isso.

```jsx
async function handleSalvar(dados) {       // serve para CRIAR e EDITAR
    setAcaoErro(null)
    if (emEdicao) { await editar(emEdicao.id, dados); setEmEdicao(null) }
    else          { await adicionar(dados) }
}

async function handleExcluir(memoria) {
    if (!window.confirm(`Excluir a memória "${memoria.titulo}"?`)) return
    await remover(memoria.id)
    ...
}
```

- O **mesmo formulário** (`MemoriaForm`) cria *ou* edita, dependendo de `emEdicao` estar
  preenchido. Clicar em "Editar" num item chama `setEmEdicao(memoria)`, o que põe o formulário em
  modo de edição.
- `window.confirm(...)` mostra aquele pop-up nativo "OK/Cancelar" antes de excluir.

A renderização junta as peças: o formulário, o `ErrorBanner` (mostra erro de ação ou de
carregamento), e ou um `Loader` (enquanto `carregando`) ou a `MemoriaList`.

#### 7.5.3. `src/pages/ConversasPage.jsx` — CRUD de conversas

Mesma estrutura, com o hook `useConversas`. Diferenças:

```jsx
const [titulo, setTitulo] = useState('') // campo controlado da nova conversa

async function handleCriar(e) {
    e.preventDefault()              // impede o recarregamento padrão do <form>
    if (!titulo.trim()) return      // não cria sem título
    await adicionar(titulo.trim())
    setTitulo('')                   // limpa o campo
}

function handleAbrir(conversa) {
    onSelecionar(conversa)          // marca como ativa (sobe para o App)
    navigate('/')                   // vai para o chat
}
```

- **Campo controlado:** o `<input>` tem `value={titulo}` e `onChange={e => setTitulo(e.target.value)}`.
  Isso é um padrão React fundamental: o estado é a "fonte da verdade", o input só reflete o estado.
- `e.preventDefault()` é essencial em formulários: por padrão, enviar um `<form>` recarregaria a
  página (comportamento antigo do HTML). Nós impedimos isso para tratar tudo em JavaScript.
- Renomear usa `window.prompt(...)` (pop-up que pede texto). Excluir usa `window.confirm(...)` e,
  além de apagar no back-end, chama `clearMessages` para apagar as mensagens locais daquela conversa
  e desmarca a conversa ativa se for o caso.

### 7.6. Os componentes de UI

#### `Header.jsx`
Barra superior do chat. Recebe `titulo`, `status` e `children` (conteúdo opcional à direita).
`children` é uma prop especial: é tudo que você escreve **entre** as tags do componente. Na
`ChatPage`, o botão de "limpar" é passado como `children` do `Header`.

#### `ChatWindow.jsx`
A área que lista as mensagens.
- `const bottomRef = useRef(null)` + um `<div ref={bottomRef} />` no fim da lista, e um `useEffect`
  que faz `bottomRef.current?.scrollIntoView({ behavior: 'smooth' })` sempre que chegam mensagens
  novas ou o "digitando" muda → **rola automaticamente para a última mensagem**.
- Se não há mensagens, mostra uma tela de boas-vindas. Senão, faz `.map()` das mensagens criando um
  `<MessageBubble key={msg.id} message={msg} />` para cada uma, e mostra `<TypingIndicator />` se
  `isTyping`.

#### `MessageBubble.jsx`
Mostra **uma** mensagem. Decide o visual pelo `message.from`:
- `'user'` → balão alinhado à direita.
- senão (bot) → mensagem em largura cheia com avatar e o nome "Dealni" (estilo Claude/ChatGPT).

#### `InputBar.jsx`
O campo de escrever, com truques de usabilidade:
- É **controlado** (`value={text}` + `onChange`).
- `autoGrow` ajusta a altura do `<textarea>` ao conteúdo (cresce conforme você digita).
- `handleKeyDown`: **Enter envia**, **Shift+Enter quebra linha**.
- Ao enviar (`handleSubmit`): `e.preventDefault()`, valida que não está vazio nem desabilitado,
  chama `onSend(trimmed)` (callback do pai), limpa o campo e reseta a altura.
- O botão de enviar fica desabilitado quando o campo está vazio ou enquanto a IA responde
  (`disabled`).

#### `TypingIndicator.jsx`
Os três pontinhos animados de "digitando". É puramente visual (a animação está no CSS).

#### `Loader.jsx`
Um spinner + texto, reutilizável. Recebe `texto` por prop (com um padrão "Carregando...").

#### `ErrorBanner.jsx`
Banner de erro reutilizável. `if (!mensagem) return null` — **se não há erro, não renderiza nada**
(retornar `null` é como dizer "não desenhe nada"). Se receber `onRetry`, mostra um botão "Tentar de
novo". O `role="alert"` é acessibilidade: avisa leitores de tela que apareceu um erro.

#### `MemoriaForm.jsx` — formulário controlado (3 campos)
```jsx
const [form, setForm] = useState({ titulo: '', categoria: 'geral', conteudo: '' })
```
- Um **único** estado `form` guarda os 3 campos. O `handleChange` atualiza qualquer um deles de
  forma genérica usando o atributo `name` do campo:
  ```jsx
  function handleChange(e) {
      const { name, value } = e.target
      setForm((prev) => ({ ...prev, [name]: value }))  // [name] = "chave dinâmica"
  }
  ```
  `[name]` significa "use o valor da variável `name` como nome da chave". Assim um só handler serve
  para título, categoria e conteúdo.
- O `useEffect` que depende de `memoriaEmEdicao` **preenche** o formulário quando você entra em modo
  de edição (e limpa quando sai).
- No `handleSubmit`: valida que título e conteúdo não estão vazios, chama `onSalvar(form)` e mostra
  "Salvando..." enquanto espera.

#### `MemoriaList.jsx` / `MemoriaItem.jsx`
- `MemoriaList` mostra um aviso se a lista está vazia; senão, faz `.map()` criando um `MemoriaItem`
  por memória (com `key={memoria.id}`).
- `MemoriaItem` é o "card" de uma memória, com os botões de editar/excluir que chamam os callbacks
  `onEditar(memoria)` / `onExcluir(memoria)`.

> Esse trio **List → Item** com callbacks vindos da página é o padrão de "componentes burros":
> eles não sabem *o que* acontece ao clicar; só avisam o pai. Isso os torna reutilizáveis.

#### `ConversaList.jsx`
Mesma ideia da lista de memórias, mas para conversas. Destaca a conversa ativa
(`conversa.id === ativaId`) e formata a data de criação com `toLocaleDateString`.

#### `icons.jsx`
Coleção de ícones em **SVG** (desenhos vetoriais). Há um componente base `Svg` que define o estilo
comum (tamanho, traço, cor herdada via `currentColor`) e cada ícone (`IconChat`, `IconTrash`...) só
fornece o desenho específico. Usar SVG em vez de emojis dá um visual mais profissional e
consistente. `currentColor` faz o ícone assumir a cor do texto ao redor — então ele combina
automaticamente com o tema.

### 7.7. Os hooks customizados

#### `src/hooks/useTheme.js`
Gerencia o tema claro/escuro:
- `getInitialTheme()` lê a preferência salva no `localStorage`; se não houver, usa a preferência do
  **sistema operacional** (`window.matchMedia('(prefers-color-scheme: dark)')`).
- Um `useEffect` aplica o tema escrevendo `data-theme` no `<html>` e salvando no `localStorage`
  toda vez que ele muda.
- `toggleTheme` alterna entre `'light'` e `'dark'`.
- O componente que usa o hook recebe `{ theme, toggleTheme }`.

#### `src/hooks/useMemorias.js` e `useConversas.js`
São quase idênticos (um para cada recurso). Eles encapsulam **estado + CRUD**:

```jsx
export function useMemorias() {
    const [memorias, setMemorias] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)

    const carregar = useCallback(async () => {       // READ
        setCarregando(true); setErro(null)
        try { setMemorias(await getMemorias()) }
        catch (e) { setErro(e.message) }
        finally { setCarregando(false) }
    }, [])

    useEffect(() => { carregar() }, [carregar])      // carrega ao montar

    async function adicionar(dados) {                // CREATE
        const nova = await createMemoria(dados)
        setMemorias((prev) => [...prev, nova])       // adiciona localmente sem recarregar tudo
    }
    async function editar(id, dados) {               // UPDATE
        const atualizada = await updateMemoria(id, dados)
        setMemorias((prev) => prev.map((m) => (m.id === id ? atualizada : m)))
    }
    async function remover(id) {                     // DELETE
        await deleteMemoria(id)
        setMemorias((prev) => prev.filter((m) => m.id !== id))
    }

    return { memorias, carregando, erro, recarregar: carregar, adicionar, editar, remover }
}
```

Pontos de ouro deste hook (é onde a "mágica do CRUD" mora):
- **Padrão de carga:** `carregando=true` → tenta → em caso de erro guarda a mensagem → no
  `finally` desliga `carregando`. A página usa isso para mostrar o `Loader` ou o `ErrorBanner`.
- **Atualização local inteligente:** depois de criar/editar/apagar no servidor, o hook **ajusta a
  lista na memória** em vez de buscar tudo de novo:
  - criar → `[...prev, nova]` (adiciona no fim)
  - editar → `.map(...)` (troca só o item alterado)
  - apagar → `.filter(...)` (remove o item)
  Isso deixa a tela responder na hora, sem uma nova ida ao servidor.
- O hook **devolve um objeto** com tudo que a página precisa. Por isso a página consegue fazer
  `const { memorias, adicionar, ... } = useMemorias()`.

`useConversas` é igual, com `renomear` no lugar de `editar` e `adicionar` retornando a conversa
criada (caso você queira já abri-la).

### 7.8. Os services (a camada de dados)

#### `src/services/api.js` — o "carteiro" base
Centraliza **todas** as chamadas HTTP ao back-end. Os outros services usam ele.

```js
const BASE_URL = '/api'  // o Vite redireciona /api → http://localhost:3001 (proxy)

async function request(caminho, opcoes = {}) {
    let response
    try {
        response = await fetch(`${BASE_URL}${caminho}`, {
            headers: { 'Content-Type': 'application/json' },
            ...opcoes,
        })
    } catch {
        throw new Error(NETWORK_ERROR)  // servidor fora do ar / sem internet
    }

    if (response.status === 204) return null  // DELETE não tem corpo

    let dados = null
    try { dados = await response.json() } catch { dados = null }

    if (!response.ok) {  // status 4xx/5xx
        throw new Error(dados?.error || `Erro ${response.status} ao acessar o servidor.`)
    }
    return dados
}

export const api = {
    get:    (caminho)        => request(caminho),
    post:   (caminho, corpo) => request(caminho, { method: 'POST',   body: JSON.stringify(corpo) }),
    put:    (caminho, corpo) => request(caminho, { method: 'PUT',    body: JSON.stringify(corpo) }),
    delete: (caminho)        => request(caminho, { method: 'DELETE' }),
}
```

O que aprender aqui:
- **`fetch`** é a função do navegador que faz requisições HTTP. Recebe a URL e um objeto de opções
  (método, headers, body) e devolve uma Promise com a resposta.
- O **primeiro `try/catch`** pega *erro de rede* (não conseguiu nem falar com o servidor) e troca
  por uma mensagem amigável.
- **`204 No Content`** é o status do `DELETE` bem-sucedido: não há JSON para ler, então retorna `null`.
- **`response.ok`** é `true` para status 200–299. Se não está ok (ex.: 400, 404, 500), lançamos um
  erro usando a mensagem que o *back-end* mandou (`dados?.error`).
- O objeto `api` expõe métodos curtinhos (`get/post/put/delete`) que os services usam. Note como
  `post`/`put` já fazem `JSON.stringify(corpo)` — convertem o objeto JS em texto JSON para enviar.

#### `src/services/memoriasService.js` e `conversasService.js`
São finos de propósito — só traduzem "operação" em "chamada de API":

```js
export const getMemorias    = ()        => api.get('/memorias')
export const createMemoria  = (dados)   => api.post('/memorias', dados)
export const updateMemoria  = (id, dados) => api.put(`/memorias/${id}`, dados)
export const deleteMemoria  = (id)      => api.delete(`/memorias/${id}`)
```

Repare nas **crases** (`` ` ``) em `` `/memorias/${id}` `` — é *template string*: monta a URL
inserindo o `id` no meio. `conversasService.js` é igual, mas envia `{ titulo }` no create/update.

> **Por que essa camada existe** se é tão fininha? Porque ela isola "como falar com a API" do resto.
> Os hooks chamam `getMemorias()` sem saber se é REST, GraphQL, localStorage... Trocar a fonte de
> dados não obriga a mexer nos hooks nem nas telas.

#### `src/services/chatStorage.js` — mensagens no navegador
As mensagens do chat **não** vão para o back-end; ficam no `localStorage` (uma "gavetinha" de
texto do navegador que sobrevive a recarregar a página).

```js
const MSGS_PREFIX = 'dealni_msgs_'           // chave por conversa: dealni_msgs_<id>
const ACTIVE_KEY  = 'dealni_conversa_ativa'  // qual conversa está aberta

export function loadMessages(conversaId) {     // ler
    const saved = localStorage.getItem(MSGS_PREFIX + conversaId)
    return saved ? JSON.parse(saved) : []
}
export function saveMessages(conversaId, messages) {  // gravar
    localStorage.setItem(MSGS_PREFIX + conversaId, JSON.stringify(messages))
}
export function clearMessages(conversaId) { localStorage.removeItem(MSGS_PREFIX + conversaId) }
```

Conceitos:
- `localStorage.getItem/setItem/removeItem` lê/grava/apaga texto por uma **chave**.
- Como o localStorage só guarda **texto**, usamos `JSON.stringify` para gravar e `JSON.parse` para
  ler de volta como objeto.
- Cada conversa tem sua própria chave (`dealni_msgs_1`, `dealni_msgs_2`...) — por isso cada conversa
  tem histórico separado.
- `getActiveConversa`/`setActiveConversa` guardam o **objeto** da conversa aberta, para o app abrir
  na mesma conversa quando você volta.
- Tudo é cercado por `try/catch` para nunca quebrar caso o dado esteja corrompido.

#### `src/services/openai.js` — falando com a IA
Aqui montamos a requisição para a OpenAI. É o cérebro da "personalidade" do Dealni.

```js
const API_URL = 'https://api.openai.com/v1/chat/completions'
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY  // vem do .env
const CONTEXT_LIMIT = 20  // manda só as últimas 20 mensagens (controle de custo/tokens)
```

**O system prompt** (a instrução que define quem é o Dealni) é montado dinamicamente e inclui as
memórias:

```js
function formatMemorias(memorias = []) {
    if (!memorias.length) return ''
    const lista = memorias.map((m) => `- ${m.titulo}: ${m.conteudo}`).join('\n')
    return `\n\nMEMÓRIAS sobre o usuário (use quando for relevante):\n${lista}`
}
function getSystemPrompt(memorias = []) {
    const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', ... })
    return `Você é Dealni, um gato inteligente do Telegram.
    ...
    Data e hora em São Paulo: ${now}${formatMemorias(memorias)}`
}
```

É **aqui** que suas memórias viram contexto: elas são transformadas em texto e coladas no fim do
prompt. Por isso cadastrar uma memória faz o Dealni "lembrar" dela.

O envio em si:

```js
export async function sendMessage(history, memorias = []) {
    const recent = history.slice(-CONTEXT_LIMIT)   // só as últimas 20

    const messages = [
        { role: 'system', content: getSystemPrompt(memorias) },     // instruções
        ...recent.map((msg) => ({
            role: msg.from === 'user' ? 'user' : 'assistant',       // traduz nosso formato
            content: truncate(msg.text),
        })),
    ]

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
        body: JSON.stringify({
            model: 'gpt-4.1-nano',
            messages,
            temperature: 1,            // 0 = previsível, 2 = muito criativo
            max_completion_tokens: 2048,
        }),
    })

    if (!response.ok) { const err = await response.json(); throw new Error(err?.error?.message || ...) }
    const data = await response.json()
    return data?.choices?.[0]?.message?.content   // o texto da resposta
}
```

Pontos-chave:
- A API de chat da OpenAI espera um **array de mensagens** com `role` (`system`, `user` ou
  `assistant`) e `content`. Nós **traduzimos** o nosso formato interno (`from: 'user'/'bot'`) para
  esse formato.
- `Authorization: Bearer <chave>` é como a OpenAI sabe quem está pedindo (autenticação).
- A resposta vem aninhada; o texto está em `data.choices[0].message.content`. O `?.` evita erro se
  algum nível vier vazio.
- `slice(-20)` e `truncate` controlam o tamanho do que é enviado (texto demais = mais "tokens" =
  mais caro/lento).

> ⚠️ **Detalhe de segurança que vale saber:** como a chave fica no front (prefixo `VITE_`), ela
> tecnicamente fica acessível no navegador. Para um trabalho de faculdade tudo bem, mas em um
> sistema real você passaria essa chamada pelo *seu* back-end, mantendo a chave secreta no servidor.

---

## 8. O código do BACK-END

O back-end é uma API REST em **Express** (que roda sobre **Node.js**). Node.js é o que permite
rodar JavaScript fora do navegador — no "servidor". Express é uma biblioteca que facilita
**receber requisições HTTP e responder**.

A pasta `backend/` tem:
```
backend/
├── server.js          ← liga o servidor, configura e monta as rotas
├── db.js              ← "banco de dados" baseado em arquivo JSON
├── data.json          ← onde os dados ficam gravados
└── routes/
    ├── memorias.js    ← rotas CRUD de /memorias
    └── conversas.js   ← rotas CRUD de /conversas
```

### 8.1. `backend/server.js` — o servidor

```js
import express from 'express'
import cors from 'cors'
import memoriasRouter from './routes/memorias.js'
import conversasRouter from './routes/conversas.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())          // (1) libera o front a chamar esta API
app.use(express.json())  // (2) entende corpos de requisição em JSON

app.get('/', (req, res) => {                 // (3) rota de "saúde"
    res.json({ nome: 'Dealni API', status: 'online', recursos: ['/memorias', '/conversas'] })
})

app.use('/memorias', memoriasRouter)         // (4) monta os recursos
app.use('/conversas', conversasRouter)

app.use((req, res) => {                       // (5) qualquer rota não encontrada
    res.status(404).json({ error: 'Rota não encontrada.' })
})

app.listen(PORT, () => console.log(`🐱 Dealni API rodando em http://localhost:${PORT}`)) // (6)
```

1. **`cors()`** — CORS é uma proteção do navegador que, por padrão, bloqueia um site de chamar um
   servidor em "origem" diferente (porta diferente conta como diferente). Como o front roda na 5173
   e o back na 3001, precisamos liberar com `cors()`.
2. **`express.json()`** é um *middleware*: lê o corpo das requisições `POST`/`PUT` e transforma o
   JSON em `req.body` (objeto JS) para usarmos. Sem isso, `req.body` viria vazio.
3. **Rota de saúde** (`GET /`): retorna um JSON dizendo que a API está no ar. Útil para testar.
4. **`app.use('/memorias', memoriasRouter)`** "pendura" todas as rotas do arquivo de memórias sob o
   caminho `/memorias`. Idem para conversas.
5. **404 padrão:** se nenhuma rota acima respondeu, cai aqui e devolve um erro JSON organizado.
6. **`app.listen(PORT)`** liga o servidor na porta 3001 e fica "escutando" pedidos.

> **O que é middleware?** É uma função que roda *no meio do caminho* entre receber a requisição e
> respondê-la. `cors()` e `express.json()` são middlewares: cada requisição passa por eles antes de
> chegar à sua rota. A ordem importa — por isso eles vêm antes das rotas.

### 8.2. `backend/db.js` — o "banco de dados" em arquivo

Não usamos um banco de dados de verdade (isso seria assunto de outra disciplina). Em vez disso,
guardamos tudo num arquivo `data.json` e usamos o módulo `fs` ("file system") do Node para ler e
gravar.

```js
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
// ... descobre o caminho do data.json ao lado deste arquivo ...

const SEED = { memorias: [ ...2 exemplos... ], conversas: [ ...1 exemplo... ] }
```

`SEED` são os **dados iniciais** (semente): se o `data.json` ainda não existe, criamos com esses
exemplos. Por isso, ao rodar pela primeira vez, já há uma conversa e duas memórias prontas.

```js
function read() {            // lê o banco inteiro do disco
    if (!existsSync(DB_PATH)) { writeFileSync(DB_PATH, JSON.stringify(SEED, null, 2)); return structuredClone(SEED) }
    try { return JSON.parse(readFileSync(DB_PATH, 'utf-8')) }
    catch { writeFileSync(DB_PATH, JSON.stringify(SEED, null, 2)); return structuredClone(SEED) }
}
function write(data) { writeFileSync(DB_PATH, JSON.stringify(data, null, 2)) } // grava o banco inteiro
function nextId(itens) { return itens.reduce((maior, item) => Math.max(maior, item.id), 0) + 1 }
```

- `read()` lê o arquivo e converte de texto para objeto (`JSON.parse`). Se não existir ou estiver
  corrompido, recria a partir do SEED. (`readFileSync` = "ler de forma síncrona", ou seja, espera
  terminar antes de seguir — simples e suficiente aqui.)
- `write(data)` salva o objeto inteiro de volta (`JSON.stringify(data, null, 2)` — o `2` é só para
  o arquivo ficar identado/legível).
- `nextId` calcula o próximo id: pega o maior id existente e soma 1.

As **operações genéricas** servem para os dois recursos (note o parâmetro `resource`, que será
`'memorias'` ou `'conversas'`):

```js
export function listAll(resource)        { return read()[resource] }
export function findById(resource, id)   { return read()[resource].find((i) => i.id === Number(id)) || null }
export function create(resource, dados)  {
    const db = read()
    const novo = { id: nextId(db[resource]), ...dados }
    db[resource].push(novo); write(db); return novo
}
export function update(resource, id, dados) {
    const db = read()
    const idx = db[resource].findIndex((i) => i.id === Number(id))
    if (idx === -1) return null
    db[resource][idx] = { ...db[resource][idx], ...dados, id: Number(id) }
    write(db); return db[resource][idx]
}
export function remove(resource, id) {
    const db = read()
    const idx = db[resource].findIndex((i) => i.id === Number(id))
    if (idx === -1) return false
    db[resource].splice(idx, 1); write(db); return true
}
```

Padrão de toda operação que escreve: **lê o banco → modifica o objeto → grava o banco**.
- `create`: cria um id novo, espalha (`...dados`) os campos recebidos, adiciona ao array, grava.
- `update`: acha o índice; se não achar, retorna `null` (a rota vira isso em 404); senão, mescla os
  campos antigos com os novos (`{ ...antigo, ...novos }`) preservando o `id`.
- `remove`: acha o índice e usa `splice` para tirar do array; retorna `true`/`false`.

> Reaproveitar essas funções genéricas para os dois recursos é o motivo de o código das rotas ficar
> tão curto. É o mesmo espírito do `api.js` no front: **uma base genérica, usos específicos em cima**.

### 8.3. `backend/routes/memorias.js` — as rotas REST

Cada método HTTP vira uma função. `req` = requisição (o pedido), `res` = resposta.

```js
const router = Router()
const RESOURCE = 'memorias'

router.get('/', (req, res) => res.json(listAll(RESOURCE)))            // LISTAR (READ)

router.get('/:id', (req, res) => {                                    // BUSCAR UM
    const memoria = findById(RESOURCE, req.params.id)
    if (!memoria) return res.status(404).json({ error: 'Memória não encontrada.' })
    res.json(memoria)
})

router.post('/', (req, res) => {                                      // CRIAR (CREATE)
    const { titulo, categoria, conteudo } = req.body
    if (!titulo?.trim() || !conteudo?.trim())
        return res.status(400).json({ error: 'Título e conteúdo são obrigatórios.' })
    const nova = create(RESOURCE, {
        titulo: titulo.trim(),
        categoria: categoria?.trim() || 'geral',
        conteudo: conteudo.trim(),
        criadaEm: new Date().toISOString(),
    })
    res.status(201).json(nova)                                        // 201 = criado
})

router.put('/:id', (req, res) => { ...valida... ; const at = update(...); if (!at) 404; res.json(at) })  // UPDATE
router.delete('/:id', (req, res) => { const ok = remove(...); if (!ok) 404; res.status(204).end() })     // DELETE
```

O que observar:
- **`req.params.id`** é a parte variável da URL. Em `GET /memorias/3`, `req.params.id` vale `"3"`.
  O `:id` na definição da rota é o que cria esse parâmetro.
- **`req.body`** é o JSON enviado pelo cliente (graças ao `express.json()`). Daí pegamos `titulo`,
  `categoria`, `conteudo`.
- **Validação:** antes de criar/atualizar, checamos os campos obrigatórios. Se faltarem, devolvemos
  **400 Bad Request** com uma mensagem — que o front mostra no `ErrorBanner`. Nunca confie só na
  validação do front; o servidor valida de novo.
- **Status corretos:** `201 Created` ao criar, `204 No Content` ao apagar (resposta sem corpo, por
  isso `.end()`), `404 Not Found` quando o id não existe, `200 OK` (padrão do `res.json`) ao listar/
  atualizar.
- O servidor é quem carimba **`criadaEm`** (data de criação) — o cliente não envia isso.

### 8.4. `backend/routes/conversas.js`
Mesma estrutura, com `RESOURCE = 'conversas'`. Diferenças: valida só o `titulo`, e mantém duas
datas — `criadaEm` (fixa) e `atualizadaEm` (renovada a cada `PUT`).

> **Importante:** o back-end guarda só os **metadados** da conversa (título e datas). As
> **mensagens** ficam no localStorage do navegador. Por isso, ao excluir uma conversa, a
> `ConversasPage` também chama `clearMessages` para apagar as mensagens locais.

### 8.5. `backend/data.json`
É o arquivo onde tudo fica salvo de verdade. Exemplo (encurtado):
```json
{
  "memorias":  [ { "id": 1, "titulo": "Nome do usuário", "categoria": "pessoal", "conteudo": "...", "criadaEm": "..." } ],
  "conversas": [ { "id": 1, "titulo": "Primeira conversa", "criadaEm": "...", "atualizadaEm": "..." } ]
}
```
Toda vez que você cria/edita/apaga algo, este arquivo é reescrito. É a "persistência real" do
projeto: feche tudo, reabra, e os dados continuam lá.

---

## 9. Fluxos completos ponta a ponta

Aqui amarramos tudo. Siga o caminho dos dados.

### 9.1. Enviar uma mensagem no chat

```
Você digita e aperta Enter no InputBar
   └─ InputBar.handleSubmit → onSend(texto)            [componente filho avisa o pai]
        └─ ChatPage.handleSend(texto)
             ├─ cria userMsg e mostra na tela (estado messages)   [UI otimista]
             ├─ saveMessages(...) grava no localStorage
             ├─ setIsTyping(true) → aparece o TypingIndicator
             ├─ await sendMessage(historico, memorias)            [services/openai.js]
             │     └─ fetch para a OpenAI (system prompt + memórias + histórico)
             │           └─ OpenAI processa e devolve o texto da resposta
             ├─ cria botMsg com a resposta e mostra na tela
             ├─ saveMessages(...) grava de novo
             └─ finally: setIsTyping(false)
   └─ ChatWindow re-renderiza (useEffect rola para o fim) → MessageBubble mostra cada balão
```

### 9.2. Criar uma memória (exemplo de CRUD completo)

```
MemoriaForm (você preenche e envia)
   └─ onSalvar(dados) → MemoriasPage.handleSalvar
        └─ adicionar(dados)                            [hook useMemorias]
             └─ createMemoria(dados)                   [services/memoriasService.js]
                  └─ api.post('/memorias', dados)      [services/api.js]
                       └─ fetch POST /api/memorias
                            └─ (Vite faz proxy /api → :3001)
                                 └─ Express: POST /memorias  [routes/memorias.js]
                                      ├─ valida req.body
                                      ├─ create('memorias', ...)  [db.js → grava no data.json]
                                      └─ responde 201 + a memória criada
             ← volta a memória criada
        └─ setMemorias(prev => [...prev, nova])  → a tela atualiza sozinha
```

Leia esse fluxo de cima a baixo e de baixo para cima algumas vezes: ele mostra **as 5 camadas** do
front (página → hook → service → api → fetch) e como elas chegam ao back-end. **Editar** e
**excluir** seguem o mesmo caminho, trocando o método (`PUT`/`DELETE`) e a atualização local
(`.map`/`.filter`).

### 9.3. Trocar de tema
```
Clica no botão da Sidebar → toggleTheme()   [hook useTheme]
   └─ setTheme('dark')
        └─ useEffect: document.documentElement.setAttribute('data-theme', 'dark')
             └─ o CSS reage ao [data-theme="dark"] e troca todas as cores
        └─ localStorage salva a preferência (persiste ao recarregar)
```

---

## 10. CRUD, REST e status

Tabela de referência rápida do que o back-end faz:

| Ação | Método + rota | Corpo enviado | Resposta (sucesso) | Erros comuns |
|---|---|---|---|---|
| Listar memórias | `GET /memorias` | — | `200` + array | — |
| Buscar uma | `GET /memorias/:id` | — | `200` + objeto | `404` |
| Criar | `POST /memorias` | `{titulo, categoria, conteudo}` | `201` + objeto criado | `400` (faltou campo) |
| Atualizar | `PUT /memorias/:id` | `{titulo, categoria, conteudo}` | `200` + objeto atualizado | `400`, `404` |
| Excluir | `DELETE /memorias/:id` | — | `204` (sem corpo) | `404` |

(As conversas são iguais, enviando `{ titulo }`.)

**Códigos de status que aparecem no projeto:**
- `200 OK` — deu certo, com dados.
- `201 Created` — criou um recurso novo.
- `204 No Content` — deu certo, sem nada para devolver (usado no DELETE).
- `400 Bad Request` — o pedido veio errado (faltou campo obrigatório).
- `404 Not Found` — não existe (id inexistente ou rota desconhecida).
- `500` (geral) — erro inesperado no servidor.

---

## 11. Glossário

- **Front-end:** parte que roda no navegador (a interface).
- **Back-end:** parte que roda no servidor (a API).
- **API:** conjunto de endereços que um programa oferece a outro.
- **REST:** estilo de API baseado em recursos + métodos HTTP.
- **Endpoint:** um endereço específico da API (ex.: `GET /memorias`).
- **CRUD:** Create, Read, Update, Delete.
- **HTTP:** protocolo de comunicação cliente↔servidor.
- **JSON:** formato de texto para trocar dados.
- **Requisição / Resposta:** o pedido do cliente e a devolução do servidor.
- **fetch:** função do navegador que faz requisições HTTP.
- **Promise / async / await:** ferramentas para código assíncrono (que espera sem travar).
- **SPA:** site de página única; o conteúdo troca sem recarregar.
- **Componente:** função React que devolve um pedaço de tela (JSX).
- **JSX:** sintaxe que mistura HTML com JavaScript.
- **Props:** dados que um componente recebe do pai.
- **Estado (state):** dado que, ao mudar, redesenha a tela.
- **Hook:** função `useX` do React; pode ser nativa ou customizada.
- **useState / useEffect / useRef / useCallback:** hooks usados no projeto (ver seção 6).
- **Render / re-render:** o React desenhar / redesenhar a tela.
- **Callback:** função passada como prop para o filho avisar o pai.
- **localStorage:** armazenamento de texto no navegador, persistente.
- **Middleware (Express):** função que processa a requisição no meio do caminho.
- **CORS:** mecanismo que libera chamadas entre origens diferentes.
- **Proxy (Vite):** redireciona `/api` do front para o back (porta 3001).
- **Seed:** dados iniciais para popular o "banco" na primeira execução.
- **System prompt:** instrução base que define o comportamento da IA.
- **Token:** "pedaço" de texto que a IA processa; mais tokens = mais custo/tempo.

---

## 12. Perguntas da apresentação

Treine respondendo estas — são as perguntas típicas de banca/professor:

**1. "Qual a diferença entre front-end e back-end no seu projeto?"**
O front (React) é a interface no navegador; o back (Express) é a API que guarda conversas e
memórias em `data.json`. Eles conversam por HTTP via `fetch`.

**2. "Onde ficam salvos os dados?"**
Conversas e memórias (metadados) no back-end (`data.json`). As mensagens do chat no `localStorage`
do navegador. As respostas da IA vêm da OpenAi na hora e são salvas junto das mensagens.

**3. "O que é CRUD e onde ele está?"**
São as 4 operações (criar/ler/atualizar/apagar). Estão implementadas nas rotas
`backend/routes/*.js` (lado servidor) e consumidas pelos hooks `useMemorias`/`useConversas` (lado
cliente).

**4. "O que é estado no React? Dê um exemplo do seu código."**
É dado que redesenha a tela ao mudar. Ex.: `messages` na `ChatPage` — ao adicionar uma mensagem
(`setMessages`), o chat se atualiza sozinho.

**5. "Para que serve o `useEffect`?"**
Rodar código em reação a algo (montar a tela, mudar uma dependência). Ex.: carregar as memórias da
API quando a `ChatPage` aparece.

**6. "Por que separar `services` e `hooks` dos componentes?"**
Separação de responsabilidades: a tela cuida do visual, os services cuidam da rede, os hooks
juntam estado+lógica. Fica mais organizado, testável e fácil de manter.

**7. "Como o Dealni 'lembra' das memórias?"**
Em `openai.js`, as memórias são formatadas como texto e injetadas no *system prompt* enviado à
OpenAI a cada mensagem.

**8. "O que é REST e quais métodos você usou?"**
Estilo de API baseado em recursos (`/memorias`, `/conversas`) e métodos HTTP: `GET`, `POST`,
`PUT`, `DELETE`.

**9. "O que acontece se o back-end estiver desligado?"**
O `api.js` captura o erro de rede e mostra uma mensagem amigável no `ErrorBanner`, com botão
"Tentar de novo".

**10. "O que é o proxy do Vite e por que ele existe?"**
O front chama `/api/...` e o Vite redireciona para `http://localhost:3001`. Isso evita problemas de
CORS e mantém URLs relativas no código.

---

> **Próximo passo sugerido para aprender de verdade:** abra dois arquivos lado a lado — uma página
> (ex.: `MemoriasPage.jsx`) e seu hook (`useMemorias.js`) — e siga uma ação (criar memória) com o
> dedo, pulando de arquivo em arquivo conforme a seção 9.2. Quando esse "pulo entre camadas" fizer
> sentido, você entendeu o projeto.
