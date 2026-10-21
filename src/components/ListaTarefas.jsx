import TarefaItem from './TarefaItem';

const CLASSE_PRIORIDADE = { 7: 'baixa', 8: 'media', 9: 'alta' };


function ListaTarefas({ 
  tarefas,
  prioridade = [], 
  onEditar, 
  onDeletar, 
  onMover          = null,
  colunaAnterior   = null,
  colunaProxima    = null,
}) {
  return (
    <select id='lista-section'>)


  {tarefas.length > 0 && (
    <ul id="lista-tarefas">
      {tarefas.map((tarefa) => (
       
       const prioridade = prioridade.find((p) => p.id === tarefa.idprioridade);
        return (
        <TarefaItem
          key={tarefa.id}
          texto={tarefa.texto}
          prioridade={ClASSE_PRIORIDADE[tarefa.idprioridade] || 'media'}
          rotuloPrioridade={prioridade?.descricao}
          onDeletar = {() => onDeletar(tarefa.id)}
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

export default ListaTarefas;

