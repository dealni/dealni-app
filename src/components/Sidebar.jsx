// Barra lateral de navegação (estilo Claude/ChatGPT): marca, ação de nova
// conversa, links das páginas e alternador de tema no rodapé.

import { NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import dealniAvatar from '../assets/hero.jpg'
import {
    IconChat,
    IconConversas,
    IconMemoria,
    IconMoon,
    IconPlus,
    IconSun,
} from './icons'

const links = [
    { to: '/', label: 'Chat', Icon: IconChat, end: true },
    { to: '/conversas', label: 'Conversas', Icon: IconConversas },
    { to: '/memorias', label: 'Memórias', Icon: IconMemoria },
]

export default function Sidebar({ aberta, onNavegar }) {
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()

    function handleNovaConversa() {
        navigate('/conversas')
        onNavegar?.()
    }

    return (
        <aside className={'sidebar' + (aberta ? ' sidebar--aberta' : '')}>
            <div className="sidebar__brand">
                <span className="sidebar__brand-mark">
                    <img src={dealniAvatar} alt="Dealni" />
                </span>
                Dealni
            </div>

            <button className="sidebar__new" onClick={handleNovaConversa}>
                <IconPlus size={18} />
                Nova conversa
            </button>

            <p className="sidebar__section">Navegação</p>
            <ul className="sidebar__nav">
                {links.map((link) => {
                    const Icon = link.Icon
                    return (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                end={link.end}
                                onClick={() => onNavegar?.()}
                                className={({ isActive }) =>
                                    'sidebar__link' + (isActive ? ' sidebar__link--ativo' : '')
                                }
                            >
                                <Icon size={19} />
                                {link.label}
                            </NavLink>
                        </li>
                    )
                })}
            </ul>

            <div className="sidebar__spacer" />

            <div className="sidebar__footer">
                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />}
                    {theme === 'light' ? 'Tema escuro' : 'Tema claro'}
                </button>
            </div>
        </aside>
    )
}
