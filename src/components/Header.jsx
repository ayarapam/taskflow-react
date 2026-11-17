import styles from './Header.module.css';

function Header() {
    return (
        <header className={styles.header}>

            <div className={styles.logo}>
                <img 
                src="/src/assets/logo.png" 
                alt="Logo do TaskFlow" />
            </div>

        </header>
    );
}

export default Header;