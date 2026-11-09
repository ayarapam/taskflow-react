import styles from './Header.module.css';

function Header({ titulo, subtitulo = "Informe o subtítulo"}) {
    // const Total = tarefas.length;
    // const Pendentes = tarefas.filter(tarefa => !tarefa.concluida_em).length;
    // const Concluidas = tarefas.filter(tarefa => tarefa.concluida_em).length;

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* <img src="/src/assets/banner.png" alt="Banner do TaskFlow" className={styles.logo} /> */}
                <img src="/src/assets/logo.png" alt="Logo do TaskFlow" className={styles.logo} />
                {/* <div className={styles.logo}>
                    <h1>{titulo}</h1>
                    <p>{subtitulo}</p>
                </div> */}

                {/* <div id="contadores">
                    <span id="cont-total">{`${Total} tarefas`}</span>
                    <span className="separador">·</span>
                    <span id="cont-pendentes">{`${Pendentes} pendentes`}</span>
                    <span className="separador">·</span>
                    <span id="cont-concluidas">{`${Concluidas} concluídas`}</span>
                </div> */}
            </div>
        </header>
    );
}

export default Header;