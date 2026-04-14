# Canvas do Projeto — Sprint 1 (N1)
## Dealni Chat — Assistente de IA com Interface Web

---

## O que é o Canvas?

O Canvas é uma ferramenta de uma página que resume a **ideia do projeto** de forma visual e estruturada. Ele responde às perguntas: *para quem é, qual problema resolve, como funciona e por que faz sentido*.

---

## Canvas do Projeto

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          CANVAS DO PROJETO — DEALNI CHAT                            │
├───────────────────┬──────────────────────────┬──────────────────────────────────────┤
│  PROBLEMA         │  SOLUÇÃO                 │  PROPOSTA DE VALOR                   │
│                   │                          │                                      │
│  Usuários que     │  Interface web de chat   │  Acesso rápido a um assistente de    │
│  precisam de um   │  integrada à API da      │  IA pelo navegador, sem instalar     │
│  assistente de IA │  OpenAI, com histórico   │  apps, com histórico persistente     │
│  acessível pelo   │  persistente e design    │  e experiência familiar ao           │
│  navegador, sem   │  inspirado no Telegram   │  Telegram                            │
│  depender de      │                          │                                      │
│  apps externos    │                          │                                      │
├───────────────────┴──────────────────────────┼──────────────────────────────────────┤
│  USUÁRIO-ALVO                                │  RECURSOS PRINCIPAIS                 │
│                                              │                                      │
│  Qualquer pessoa com acesso a um navegador   │  • React + Vite (front-end)          │
│  que deseje conversar com um assistente      │  • API da OpenAI (gpt-4.1-nano)      │
│  de IA de forma simples e direta             │  • localStorage (persistência)       │
│                                              │  • CSS puro (estilização)            │
│  Perfil principal:                           │  • Repositório GitHub                │
│  • Estudantes e profissionais                │                                      │
│  • Usuários de Telegram que querem           │                                      │
│    uma alternativa web                       │                                      │
├──────────────────────────────────────────────┼──────────────────────────────────────┤
│  FUNCIONALIDADES                             │  DIFERENCIAIS                        │
│                                              │                                      │
│  • Chat em tempo real com IA                 │  • Design inspirado no Telegram      │
│  • Histórico de conversa com contexto        │  • Sem necessidade de login          │
│  • Indicador "digitando..."                  │  • Histórico persiste entre sessões  │
│  • Persistência com localStorage             │  • Tratamento de erros visível       │
│  • Botão para limpar conversa                │  • Responsivo para mobile            │
│  • Tratamento de erros de rede/API           │  • Código organizado em componentes  │
├──────────────────────────────────────────────┼──────────────────────────────────────┤
│  TECNOLOGIAS UTILIZADAS                      │  VIABILIDADE                         │
│                                              │                                      │
│  • React 19 — componentes e estados          │  • Projeto já está rodando           │
│  • Vite 8 — build e desenvolvimento          │  • API da OpenAI disponível          │
│  • JavaScript (ES2024)                       │  • Sem necessidade de back-end       │
│  • CSS puro com variáveis (design system)    │  • Pode ser publicado gratuitamente  │
│  • fetch API nativa do navegador             │    (Vercel, Netlify, GitHub Pages)   │
└──────────────────────────────────────────────┴──────────────────────────────────────┘
```

---

## Detalhamento dos Blocos

### Problema

Usuários que precisam de um assistente de inteligência artificial muitas vezes dependem de aplicativos externos (como o Telegram ou o ChatGPT) que podem exigir instalação, login ou plataformas específicas. Não existe uma solução web simples, sem cadastro, que funcione direto no navegador com persistência de histórico.

### Solução

O **Dealni Chat** é uma interface web de chat desenvolvida em React que permite ao usuário conversar com um assistente de IA (alimentado pela API da OpenAI) diretamente pelo navegador. O histórico da conversa é salvo localmente e persiste entre sessões, sem necessidade de servidor ou banco de dados externo.

### Usuário-alvo

Qualquer pessoa com acesso a um navegador web que queira interagir com um assistente de IA de forma rápida, sem barreiras de cadastro ou instalação. O perfil principal inclui estudantes, profissionais e usuários familiarizados com o Telegram.

### Proposta de Valor

> **"Conversa com IA no navegador, sem instalar nada, com o histórico sempre salvo."**

- Acesso imediato — abre no navegador, sem login
- Experiência familiar — interface inspirada no Telegram
- Contexto mantido — o Dealni "lembra" as últimas 20 mensagens da conversa
- Resiliente — erros de rede são mostrados ao usuário sem travar o app

### Recursos Principais

| Recurso | Papel no projeto |
|---|---|
| React 19 | Constrói a interface com componentes reutilizáveis |
| Vite 8 | Executa o projeto em desenvolvimento e gera o build |
| API da OpenAI | Processa as mensagens e gera as respostas do Dealni |
| localStorage | Salva o histórico no navegador sem precisar de servidor |
| GitHub | Controle de versão e histórico de commits do time |

### Funcionalidades implementadas na Sprint 1

| Funcionalidade | Status |
|---|---|
| Chat em tempo real com a IA | Implementado |
| Indicador "digitando..." animado | Implementado |
| Persistência com localStorage | Implementado |
| Botão para limpar conversa | Implementado |
| Tratamento de erros de rede e API | Implementado |
| Design responsivo (mobile e desktop) | Implementado |
| Componentes separados por responsabilidade | Implementado |

### Viabilidade

O projeto é **viável e já está funcional**. Não depende de infraestrutura própria — a única dependência externa é a API da OpenAI, que é paga por uso (custo baixo para fins acadêmicos). A aplicação pode ser publicada gratuitamente em plataformas como Vercel ou Netlify.

---

## Resumo para apresentação oral

> *"Identificamos que usuários que precisam de um assistente de IA muitas vezes dependem de apps externos. Nossa solução é o Dealni Chat — uma interface web construída em React que roda no navegador, sem login, com histórico salvo localmente. O usuário-alvo é qualquer pessoa com um navegador. A proposta de valor central é: conversa com IA, sem instalar nada, com o histórico sempre disponível."*

---

## Critério avaliado

> **Clareza e viabilidade da ideia proposta (Canvas) — 20% / 2,0 pontos**

O Canvas cobre todos os elementos esperados:
- Problema identificado e real
- Solução concreta e já implementada
- Usuário-alvo definido
- Proposta de valor clara
- Recursos e tecnologias listados
- Viabilidade demonstrada (projeto rodando)
