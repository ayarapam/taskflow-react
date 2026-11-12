import styles from './Header.module.css';

function Header() {
    return (
        <header className={styles.header}>

            <div className={styles.container}>
                <img src="/src/assets/logo.png" alt="Logo do TaskFlow" className={styles.logo} />
            </div>

        </header>
    );
}

export default Header;