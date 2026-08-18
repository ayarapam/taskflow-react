import Header from './Header';
import ListaTarefas from './ListaTarefas';
import { useState, useEffect } from 'react';
import ModalTarefa from './ModalTarefa';


// =============================================================
// 1. ESTADO DA APLICAÇÃO
// =============================================================

function TarefaV1() { 

  // ───────────────────────────────────────────────────────────
  // 1.1 Estados principais
  // ───────────────────────────────────────────────────────────

    const [proximoId, setProximoId] = useState(1);
    const [modalAberto, setModalAberto] = useState(false);
    const [tarefaEditando, setTarefaEditando] = useState(null);
    const [colunaAtiva, setColunaAtiva] = useState('afazer');
    const [filtroPrioridade, setFiltroPrioridade] = useState('todas');
        const [tarefas, setTarefas] = useState (() => {
      const tarefasSalvas = localStorage.getItem('taskflow-tarefas');
      if (!tarefasSalvas) return [];
      const dados = JSON.parse(tarefasSalvas);
      setProximoId(
      dados[dados.length - 1]?.id + 1 || 1,
    );
      return Array.isArray(dados) ? dados : [];
    });


  // =============================================================
  // 2. EFEITOS
  // =============================================================

    // ───────────────────────────────────────────────────────────
    // 2.1 Salvar tarefas no LocalStorage
    // ───────────────────────────────────────────────────────────

    useEffect(() => {
      localStorage.setItem('taskflow-tarefas', JSON.stringify(tarefas));

    }, [tarefas]);

    // ───────────────────────────────────────────────────────────
    // 2.2 Atualizar título da página
    // ───────────────────────────────────────────────────────────

    useEffect(() => {
      const pendentes = tarefas.filter((tarefa) => tarefa.coluna === 'afazer' ||
        tarefa.coluna === 'andamento').length;
      if (pendentes > 0) {
          document.title = `(${pendentes}) TaskFlow`;
      } else {
          document.title = 'TaskFlow';
      }}, [tarefas]);

  // =============================================================
  // 3. FUNÇÕES DO MODAL
  // =============================================================

    // ───────────────────────────────────────────────────────────
    // 3.1 Abrir modal para criar tarefa
    // ─────────────────────────────────────────────────────

    function abrirModalCriar(coluna){
      setTarefaEditando(null);
      setColunaAtiva(coluna);
      setModalAberto(true);
    }

    // ───────────────────────────────────────────────────────────
    // 3.2 Abrir modal para editar tarefa
    // ─────────────────────────────────────────────────────

    function abrirModalEditar(tarefa){
      setTarefaEditando(tarefa);
      setModalAberto(true);
    }

  // =============================================================
  // 4. FUNÇÕES DE GERENCIAMENTO DE TAREFAS
  // =============================================================

    // ───────────────────────────────────────────────────────────
    // 4.1 Salvar / editar tarefa
    // ──────────────────────────────────────────────────────  

    function salvarTarefa(dados){
     console.log("dados:", dados)
      if (dados.id !== undefined){
        setTarefas(tarefas.map(tarefa => tarefa.id === dados.id ? {...tarefa, ...dados} : tarefa 
        ));
      } else { 
        setTarefas([...tarefas, {...dados, id: proximoId}])
        setProximoId (proximoId + 1)
      };
    }




  // ───────────────────────────────────────────────────────────
  // 4.2 Deletar tarefa
  // ───────────────────────────────────────────────────────────

  function deletarTarefa(id){
    setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
    const confirmado = window.confirm ('Tem certeza que deseja deletar esta tarefa?');

    if (confirmado) {setTarefas(tarefas.filter((t) => t.id !== id));

    }
  };

  // ───────────────────────────────────────────────────────────
  // 4.3 Mover tarefa entre colunas
  // ───────────────────────────────────────────────────────────

  function moverTarefa(id, novaColuna) { 
    setTarefas(
      tarefas.map(tarefa => 
      tarefa.id === id 
      ? {...tarefa, coluna: novaColuna} 
      : tarefa,),);
  };

  // =============================================================
  // 5. FILTROS
  // =============================================================

    const tarefasFiltradas = tarefas.filter((tarefa) => {
      if (filtroPrioridade === 'todas') return true;
      return tarefa.prioridade === filtroPrioridade;
    });

  // =============================================================
  // 6. INTERFACE
  // =============================================================
  return (
  <div className='container' id='app'>

  {/* ─────────────────────────────────────────────────────
  6.1 Cabeçalho
  ───────────────────────────────────────────────────── */}
    <Header 
      titulo='TaskFlow'
      subtitulo='gerenciador de Tarefa 🚀'/>
    
    <main>

{/* ───────────────────────────────────────────────────
  6.2 Filtro de prioridade
─────────────────────────────────────────────────── */}
      <div className='filtro-prioridade'>
        <label>Filtrar por prioridade:</label>
        <select
        className='btn-filtro'
        value={filtroPrioridade}
        onChange={(e) => setFiltroPrioridade(e.target.value)}
        >
          <option value='todas'>Todas</option>
          <option value='alta'>Alta</option>
          <option value='media'>Media</option>
          <option value='baixa'>Baixa</option>
        </select>
      </div>

{/* ───────────────────────────────────────────────────
  6.3 Quadro Kanban
─────────────────────────────────────────────────── */}
 <div className="kanban-quadro">
          <div className="kanban-coluna">

          {/* =================================================
              COLUNA: A FAZER
          ================================================= */}
            <div className="kanban-coluna-header">
              <h3>A Fazer</h3>
              <span className="kanban-contador">
                {tarefas.filter((tarefa) => tarefa.coluna === "afazer").length}
              </span>
              <button className='kanban-btn-add'
              onClick={() => abrirModalCriar('afazer')}>+</button>
            </div>

            <ListaTarefas
              tarefas={tarefasFiltradas.filter((tarefa) => tarefa.coluna === "afazer")}
              onDeletar={deletarTarefa}
              onEditar={abrirModalEditar}
              onMover={moverTarefa}
              colunaAnterior={null}
              colunaProxima="andamento"
            />
          </div>

        {/* =================================================
            COLUNA: EM ANDAMENTO
        ================================================= */}

          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>Em Andamento</h3>
              <span className="kanban-contador">
                {tarefas.filter(
                  (tarefa) => tarefa.coluna === "andamento").length}
              </span>
              <button className='kanban-btn-add'
              onClick={() => abrirModalCriar('andamento')}>+</button>              
            </div>
            <ListaTarefas
              tarefas={tarefasFiltradas.filter((tarefa) => tarefa.coluna === "andamento")}
              onDeletar={deletarTarefa}
              onEditar={abrirModalEditar}
              onMover={moverTarefa}
              colunaAnterior="afazer"
              colunaProxima="concluido"
            />
          </div>

        {/* =================================================
            COLUNA: CONCLUÍDO
        ================================================= */}

          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>Concluído</h3>
              <span className="kanban-contador">
                {tarefas.filter((tarefa) => tarefa.coluna === "concluido").length}
              </span>
              <button className='kanban-btn-add'
              onClick={() => abrirModalCriar('concluido')}>+</button>              
            </div>
            <ListaTarefas
              tarefas={tarefasFiltradas.filter((tarefa) => tarefa.coluna === "concluido")}
              onDeletar={deletarTarefa}
              onEditar={abrirModalEditar}
              onMover={moverTarefa}
              colunaAnterior="andamento"
              colunaProxima={null}
            />
          </div>
        </div>

        {/* ───────────────────────────────────────────────────
            6.4 Modal de tarefa
        ─────────────────────────────────────────────────── */}
        <ModalTarefa
          aberto={modalAberto}
          onFechar={() => setModalAberto(false)}
          onSalvar={salvarTarefa}
          tarefa={tarefaEditando}
          coluna={colunaAtiva}
        />

      
    </main>

    {/* ─────────────────────────────────────────────────────
        6.5 Rodapé
    ───────────────────────────────────────────────────── */}
    <footer>
      <p>TaskFlow 2026 - Prof. Alan Glei</p>
    </footer>
    
  </div>
  );
}



export default TarefaV1
