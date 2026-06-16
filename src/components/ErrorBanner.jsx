// Banner de erro reutilizável — mostra erros de rede/API de forma visível ao usuário.
// Aceita um callback opcional para "tentar de novo".
export default function ErrorBanner({ mensagem, onRetry }) {
    if (!mensagem) return null
    return (
        <div className="error-banner" role="alert">
            <span>❌ {mensagem}</span>
            {onRetry && (
                <button className="error-banner__retry" onClick={onRetry}>
                    Tentar de novo
                </button>
            )}
        </div>
    )
}
