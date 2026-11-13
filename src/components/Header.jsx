import styles from './Header.module.css';

function Header() {
    return (
        <header className={styles.header}>

            <div className={styles.logo}>
                <img src="/src/assets/logo.png" alt="Logo do TaskFlow" className={styles.logo} />
            </div>

            {/* <div className={styles.banner}>
                <img src="/src/assets/banner.png" alt="Banner do TaskFlow" />
            </div> */}

        </header>
    );
}

export default Header;