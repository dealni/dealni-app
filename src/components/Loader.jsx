// Indicador de carregamento reutilizável, exibido enquanto a API responde.
export default function Loader({ texto = 'Carregando...' }) {
    return (
        <div className="loader">
            <span className="loader__spinner" />
            <span>{texto}</span>
        </div>
    )
}
