import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';


function Sidebar (){
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();
    
    const linkClass = ({isActive}) => 
        isActive ? styles.link + ' ' + styles.ativo : styles.link;

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return(
        <aside className={styles.sidebar}>

            <div className={styles.logo}>
                <h1>TaskFlow</h1>
            </div>
            <nav className={styles.nav}>
                <NavLink to= '/' className={linkClass}>Dashboard</NavLink>
                <NavLink to= '/sobre' className={linkClass}>Sobre</NavLink>
            </nav>
            <div className='sidebar-usuario'>
                <span>Olá, {usuario?.nome ?? 'Usuário'}</span>
                <button onClick={handleLogout}>Sair</button>
            </div>
            {/* {token && (<button onClick={logout}>Sair</button>)} */}
        </aside>
    )
} 

export default Sidebar