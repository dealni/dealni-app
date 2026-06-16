// Menu de navegação entre as páginas do app.
// Usa NavLink do React Router, que aplica a classe "ativo" no link da página atual.

import { NavLink } from 'react-router-dom'

const links = [
    { to: '/', label: 'Chat', icon: '💬', end: true },
    { to: '/conversas', label: 'Conversas', icon: '🗂️' },
    { to: '/memorias', label: 'Memórias', icon: '🧠' },
    { to: '/sobre', label: 'Sobre', icon: 'ℹ️' },
]

export default function Navbar() {
    return (
        <nav className="navbar">
            <span className="navbar__brand">😼 Dealni</span>
            <ul className="navbar__links">
                {links.map((link) => (
                    <li key={link.to}>
                        <NavLink
                            to={link.to}
                            end={link.end}
                            className={({ isActive }) =>
                                'navbar__link' + (isActive ? ' navbar__link--ativo' : '')
                            }
                        >
                            <span className="navbar__icon">{link.icon}</span>
                            <span className="navbar__label">{link.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
