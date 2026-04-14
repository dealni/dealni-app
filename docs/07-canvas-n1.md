# Canvas do Projeto — Sprint 1 (N1)

## Dealni Chat

---

## Problema

Pessoas que querem conversar com uma IA precisam de apps externos como ChatGPT ou Telegram. Não existe uma opção simples que abra direto no navegador, sem login, e ainda salve o histórico.

## Solução

Uma interface web de chat feita em React que conecta o usuário ao Dealni — um assistente de IA com personalidade de gato — direto no navegador, sem cadastro e sem instalar nada.

## Usuário-alvo

Qualquer pessoa com acesso a um navegador que queira conversar com uma IA de forma rápida e simples.

## Proposta de Valor

> **"Conversa com IA no navegador. Sem instalar nada. Histórico sempre salvo."**

## Funcionalidades

- Chat em tempo real com IA (OpenAI)
- Histórico salvo no navegador (localStorage)
- Indicador "digitando..." enquanto aguarda resposta
- Tratamento de erros de rede visível ao usuário
- Botão para limpar a conversa
- Interface responsiva (funciona no celular)

## Tecnologias

| Tecnologia | Para quê |
|---|---|
| React + Vite | Interface e componentes |
| API da OpenAI | Gerar as respostas da IA |
| localStorage | Salvar o histórico sem servidor |
| CSS puro | Estilização inspirada no Telegram |

## Viabilidade

O projeto já está funcional e roda com `npm run dev`. Não precisa de servidor próprio nem banco de dados. Pode ser publicado gratuitamente no Vercel ou Netlify.
