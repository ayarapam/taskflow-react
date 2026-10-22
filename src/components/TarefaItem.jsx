import styles from './TarefaItem.module.css'

function TarefaItem({
  texto,
  concluida = false,
  //prioridade = 'media', 
  //cidade = "",
  rotuloPrioridade = "",
  corPrioridade = null,
  onDeletar,
  onEditar,
  onMover = null,
  colunaAnterior = null,
  colunaProxima = null,
  usuario = null,
  projeto = null,
}) {

  const classeItem = (concluida
    ? styles.tarefa + ' ' + styles.concluida
    : styles.tarefa);

  const estiloCor = corPrioridade ? { "--cor-prioridade": corPrioridade } : undefined;

  const classeTexto = concluida
    ? styles.textoTarefa + ' ' + styles['texto-tarefa']
    : styles.textoTarefa

  //const classePrioridade = 
  //styles ['badge-prioridade'] + ' ' + styles['badge-' + prioridade];

  const modoKanban = onMover !== null;

  return (
    <li className={classeItem} style={estiloCor} onDoubleClick={onEditar}>
      <dir className={styles.conteudo}>
        <span className={classeTexto}>{texto}</span>
        {/* {cidade && <span className={styles.cidade}>{cidade}</span>} */}
      </dir>

      {(usuario || projeto) && (
        <div className={styles.info}>
          {usuario && (
            <span className={styles.infoItem}>
              <span className={styles.infoRotulo}>Responsável</span>
              {usuario}
            </span>
          )}
          {projeto && (
            <span className={styles.infoItem}>
              <span className={styles.infoRotulo}>Projeto</span>
              {projeto}
            </span>
          )}
        </div>
      )}

      {/* <span className={classePrioridade}>{prioridade}</span> */}

      <div className={styles.rodape}>
        <span className={styles["badge-prioridade"]}>{rotuloPrioridade || "Sem prioridade"}</span>

        <div className={styles.acoes}>
          {modoKanban && colunaAnterior && (
            <button
              className={styles.btnMover}
              onClick={() => onMover(colunaAnterior)}
              title="Mover para coluna anterior"
            >
              ←
            </button>
          )}

          {modoKanban && colunaProxima && (
            <button
              className={styles.btnMover}
              // onClick={e => {onMover(colunaProxima);}}
              onClick={() => { onMover(colunaProxima); }}
              title="Mover para próxima coluna"
            >
              →
            </button>
          )}

          <button className={styles.btnDeletar}
            //onClick={e => { e.stopPropagation(); onDeletar();}}>
            onClick={onDeletar} title="Excluir tarefa">
            X
          </button>

        </div>

      </div>

    </li>
  );
}

export default TarefaItem;