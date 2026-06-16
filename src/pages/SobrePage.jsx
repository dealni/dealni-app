// Página informativa sobre o projeto — útil para a apresentação.
export default function SobrePage() {
    return (
        <div className="page">
            <h2 className="page__titulo">ℹ️ Sobre o Dealni Chat</h2>

            <p className="page__subtitulo">
                Chat web com o Dealni — um assistente de IA com personalidade de gato. Projeto da
                disciplina de Desenvolvimento Front-End II.
            </p>

            <section className="card">
                <h3>O que dá para fazer</h3>
                <ul className="bullets">
                    <li>💬 Conversar com o Dealni (API da OpenAI), com histórico salvo por conversa.</li>
                    <li>🗂️ Criar, renomear e excluir conversas salvas.</li>
                    <li>🧠 Cadastrar memórias que o Dealni usa como contexto nas respostas.</li>
                </ul>
            </section>

            <section className="card">
                <h3>Como foi construído</h3>
                <ul className="bullets">
                    <li><strong>Front-end:</strong> React + Vite, React Router, componentes e hooks.</li>
                    <li><strong>Estado:</strong> useState/useEffect e hooks customizados (useMemorias, useConversas).</li>
                    <li><strong>Persistência local:</strong> histórico das mensagens no localStorage.</li>
                    <li><strong>Back-end:</strong> API RESTful em Express com CRUD de conversas e memórias.</li>
                </ul>
            </section>

            <section className="card">
                <h3>Arquitetura em camadas</h3>
                <p>
                    Os componentes visuais não falam direto com a rede: tudo passa pela pasta
                    <code> src/services</code> (chamadas à API e ao localStorage), mantendo a lógica
                    separada da apresentação.
                </p>
            </section>
        </div>
    )
}
