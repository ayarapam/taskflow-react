// =============================================================
// IMPORTS
// =============================================================

import Header from './Header';
import ListaTarefas from './ListaTarefas';
import { useState, useEffect } from 'react';
import ModalTarefa from './ModalTarefa';
import api from '../api';

// =============================================================
// 1. ESTADO DA APLICAÇÃO
// =============================================================
function TarefaV1() {

  // ───────────────────────────────────────────────────────────
  // 1.1 Estados principais
  // ───────────────────────────────────────────────────────────

  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState('afazer');
  const [filtroPrioridade, setFiltroPrioridade] = useState('todas');
  const [tarefas, setTarefas] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  // =============================================================
  // 2. EFEITOS
  // =============================================================

  // ───────────────────────────────────────────────────────────
  // 2.1 Salvar tarefas no LocalStorage
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    async function carregarTarefas() {
      try {
        setCarregando(true);
        setErro('');

        const resposta = await api.get('/tarefas');

        setTarefas(resposta.data);

      } catch (e) {
        setErro('Erro ao carregar tarefas. Verifique a conexao.');
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }
    carregarTarefas();
  }, []);

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
    }
  }, [tarefas]);

  // =============================================================
  // 3. FUNÇÕES DO MODAL
  // =============================================================

  // ───────────────────────────────────────────────────────────
  // 3.1 Abrir modal para criar tarefa
  // ─────────────────────────────────────────────────────

  function abrirModalCriar(coluna) {
    setTarefaEditando(null);
    setColunaAtiva(coluna);
    setModalAberto(true);
  }

  // ───────────────────────────────────────────────────────────
  // 3.2 Abrir modal para editar tarefa
  // ─────────────────────────────────────────────────────

  function abrirModalEditar(tarefa) {
    setTarefaEditando(tarefa);
    setModalAberto(true);
  }

  // =============================================================
  // 4. FUNÇÕES DE GERENCIAMENTO DE TAREFAS
  // =============================================================

  // ───────────────────────────────────────────────────────────
  // 4.1 Salvar / editar tarefa
  // ──────────────────────────────────────────────────────  

  async function salvarTarefa(dados) {

    if (dados.id === undefined){
      try {
        const resposta = await api.post('/tarefas', dados);
        setTarefas([...tarefas, resposta.data]);
      } catch (err) {
        setErro('Erro ao criar tarefa.');
      }
  } else {
    try {
      const resposta = await api.put(
        `/tarefas/${dados.id}`,
         dados);
         
      setTarefas(tarefas.map(t =>
        t.id === dados.id ? resposta.data : t
      ));
    } catch (err) {
      setErro('Erro ao editar tarefa.');
    }
  }
}

// ───────────────────────────────────────────────────────────
// 4.2 Deletar tarefa
// ───────────────────────────────────────────────────────────

  async function deletarTarefa(id) {
    try {
      await api.delete(`/tarefas/${id}`);
      setTarefas(tarefas.filter(t => t.id !== id));
    } catch (err) {
      setErro('Erro ao deletar tarefa.');
    }
  }

  // ───────────────────────────────────────────────────────────
  // 4.3 Mover tarefa entre colunas
  // ───────────────────────────────────────────────────────────
  async function moverTarefa(id, novaColuna) {
    const resposta = await api.put(
      `/tarefas/${id}`,
      { coluna: novaColuna }
    );
    setTarefas(tarefas.map(t => t.id === id ? resposta.data : t));
  }

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
      subtitulo='gerenciador de Tarefa 🚀' />

    <main className='container'>
      {carregando && (
        <p style={{ textAlign: 'center', color: '#94A3B8' }}>
          Carregando tarefas...
        </p>)}

      {erro && (
        <p style={{ textAlign: 'center', color: '#EF4444' }}>{erro}</p>
      )}


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
      {!carregando && !erro && (<>
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
      </>)}
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
