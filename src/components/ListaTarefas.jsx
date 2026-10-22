import TarefaItem from './TarefaItem';

const CLASSE_PRIORIDADE = { 7: 'baixa', 8: 'media', 9: 'alta' };


function ListaTarefas({
  tarefas,
  //prioridade = [],
  onEditar,
  onDeletar,
  onMover = null,
  colunaAnterior = null,
  colunaProxima = null,
}) {
  return (
    <section id="lista-section">
      {tarefas.length === 0 && (
      <p className="msg-vazia">
        Nenhuma tarefa aqui ainda.
      </p>
    )}

    {tarefas.length > 0 && (
        <ul id="lista-tarefas">
          {tarefas.map(tarefa => (

  <TarefaItem
    key={tarefa.id}
    texto={tarefa.texto}
    prioridade={CLASSE_PRIORIDADE[tarefa.idprioridade] || 'media'}
    //rotuloPrioridade={prioridade?.descricao}
    rotuloPrioridade={tarefa.prioridade}     // texto do badge
    corPrioridade={tarefa.prioridade_cor}
    usuario={tarefa.usuario || 'Sem responsável'}
    projeto={tarefa.projeto || 'Sem projeto'}
    onDeletar={() => onDeletar(tarefa.id)}
    onEditar={onEditar ? () => onEditar(tarefa) : null}
    onMover={
      onMover
        ? (novaColuna) => onMover(tarefa.id, novaColuna)
        : null
    }
    colunaAnterior={colunaAnterior}
    colunaProxima={colunaProxima}
  />
          ))}
        </ul>
      )}
      </section>
  );
}

export default ListaTarefas;

