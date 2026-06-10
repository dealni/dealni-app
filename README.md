# Dealni — Chat Web 😼

Chat web com o **Dealni**, o gato inteligente do bot do Telegram, construído com React + Vite e a API da OpenAI.

## Como rodar

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar a API Key

Crie um arquivo `.env` na raiz da pasta `/app`:

```bash
cp .env.example .env
```

Abra o `.env` e coloque sua chave da OpenAI:

```
VITE_OPENAI_API_KEY=sk-sua-chave-aqui
```

### 3. Rodar o projeto

```bash
npm run dev
```

Acesse em: [http://localhost:5173](http://localhost:5173)

## Funcionalidades

- Chat em tempo real com o Dealni (gpt-4.1-nano)
- Histórico de conversa com contexto
- Indicador "digitando..." nas bolhas e no header enquanto aguarda resposta
- Persistência com `localStorage` (dados permanecem após recarregar)
- Tratamento de erros de rede/API com botão "Tentar novamente"
- Timeout de 60s para requisições que demoram demais
- Formatação básica nas respostas: **negrito**, `código` e links clicáveis
- Campo de mensagem que cresce conforme o texto (auto-resize)
- Confirmação antes de limpar a conversa
- Design inspirado nos chats do Claude e do ChatGPT (tema claro e escuro automático)
- Tela inicial com sugestões de prompt clicáveis
- Responsivo para mobile

## Tecnologias

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [OpenAI API](https://platform.openai.com/)
