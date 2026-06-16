// Conjunto de ícones SVG (estilo Lucide, traço 1.8, viewBox 24x24).
// Substituem os emojis usados como ícones - visual mais próximo de Claude/ChatGPT.
// Todos herdam a cor via `currentColor` e o tamanho via prop `size`.

function Svg({ size = 20, children, ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            {children}
        </svg>
    )
}

export function IconChat(props) {
    return (
        <Svg {...props}>
            <path d="M7.5 8h9M7.5 12h6" />
            <path d="M21 11.5a8.5 8.5 0 0 1-12.2 7.7L3 21l1.8-5.8A8.5 8.5 0 1 1 21 11.5Z" />
        </Svg>
    )
}

export function IconConversas(props) {
    return (
        <Svg {...props}>
            <path d="M4 6h16M4 12h16M4 18h10" />
        </Svg>
    )
}

export function IconMemoria(props) {
    return (
        <Svg {...props}>
            <path d="M9.5 3A4.5 4.5 0 0 0 5 7.5c-1.2.5-2 1.7-2 3 0 .9.4 1.8 1 2.4-.3.5-.5 1.1-.5 1.8A3.3 3.3 0 0 0 8 18c.4 1.2 1.6 2 2.9 2 .9 0 1.6-.4 1.6-.4V4.5S11.5 3 9.5 3Z" />
            <path d="M14.5 3A4.5 4.5 0 0 1 19 7.5c1.2.5 2 1.7 2 3 0 .9-.4 1.8-1 2.4.3.5.5 1.1.5 1.8A3.3 3.3 0 0 1 16 18c-.4 1.2-1.6 2-2.9 2-.9 0-1.6-.4-1.6-.4" />
        </Svg>
    )
}

export function IconEdit(props) {
    return (
        <Svg {...props}>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
        </Svg>
    )
}

export function IconTrash(props) {
    return (
        <Svg {...props}>
            <path d="M4 7h16M10 11v6M14 11v6" />
            <path d="M5 7l1 13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1l1-13" />
            <path d="M9 7V4h6v3" />
        </Svg>
    )
}

export function IconArrowUp(props) {
    return (
        <Svg {...props}>
            <path d="M12 19V5M5 12l7-7 7 7" />
        </Svg>
    )
}

export function IconPlus(props) {
    return (
        <Svg {...props}>
            <path d="M12 5v14M5 12h14" />
        </Svg>
    )
}

export function IconMenu(props) {
    return (
        <Svg {...props}>
            <path d="M4 6h16M4 12h16M4 18h16" />
        </Svg>
    )
}

export function IconSun(props) {
    return (
        <Svg {...props}>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </Svg>
    )
}

export function IconMoon(props) {
    return (
        <Svg {...props}>
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </Svg>
    )
}
