import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';

function Sidebar() {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const linkClass = ({ isActive }) =>
        isActive ? `${styles.link} ${styles.ativo}` : styles.link;

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <aside className={styles.sidebar}>

            <div className={styles.logo}>
                <h1>TaskFlow</h1>
            </div>

            <nav className={styles.nav}>
                <NavLink to="/" className={linkClass}>

                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/sobre" className={linkClass}>

                    <span>Sobre</span>
                </NavLink>
            </nav>

            <div className={styles.usuario}>
                <span className={styles.ola}>
                    Olá, {usuario?.nome ?? 'Usuário'}
                </span>

                <button onClick={handleLogout}>
                     Sair
                </button>
            </div>

        </aside>
    );
}

export default Sidebar;