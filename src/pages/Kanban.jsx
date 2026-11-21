// =============================================================
// IMPORTS
// =============================================================

import Header from '../components/Header';
import ListaTarefas from '../components/ListaTarefas';
import { useState, useEffect } from 'react';
import ModalTarefa from '../components/ModalTarefa';
import api, { mensagensDeErro } from '../api';

// =============================================================
// 1. ESTADO DA APLICAÇÃO
// =============================================================
function Kanban() {

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
  const [listaPrioridades, setListaPrioridades] = useState([]);
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [listaProjetos, setListaProjetos] = useState([]);
  const [colunaAlvo, setColunaAlvo] = useState(null);


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

        const [respPrioridades, respTarefas, respUsuarios, respProjetos] =

          await Promise.all([
            api.get("/prioridades"),
            api.get("/tarefas"),
            api.get("/usuarios"),
            api.get("/projetos"),
          ]);

        setListaPrioridades(respPrioridades.data);
        setTarefas(respTarefas.data);
        setListaUsuarios(respUsuarios.data);
        setListaProjetos(respProjetos.data);

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

  // useEffect(() => {
  //   const pendentes = tarefas.filter((tarefa) => tarefa.coluna === 'afazer' ||
  //     tarefa.coluna === 'andamento').length;
  //   if (pendentes > 0) {
  //     document.title = `(${pendentes}) TaskFlow`;
  //   } else {
  //     document.title = 'TaskFlow';
  //   }
  // }, [tarefas]);

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
    if (dados.id) {
      const resposta = await api.put(`/tarefas/${dados.id}`, dados);
      setTarefas(tarefas.map((t) => (
        t.id === dados.id
          ? resposta.data
          : t)));
    } else {
      const resposta = await api.post('/tarefas', dados);
      setTarefas([...tarefas, resposta.data]);
    }
  }

  // ───────────────────────────────────────────────────────────
  // 4.2 Deletar tarefa
  // ───────────────────────────────────────────────────────────

  const deletarTarefa = async (id) => {
    try {
      await api.delete(`/tarefas/${id}`);
      setTarefas(tarefas.filter((t) => t.id !== id));
    } catch (e) {
      alert(mensagensDeErro(e).join("\n"));
    }
  };

  // ───────────────────────────────────────────────────────────
  // 4.3 Mover tarefa entre colunas
  // ───────────────────────────────────────────────────────────
  //  const moverTarefa = async (id, novaColuna) => {
  //     const tarefa = tarefas.find((t) => t.id === id);
  //   try {
  //     const resposta = await api.put(
  //       `/tarefas/${id}`,
  //       {
  //         ...tarefa,
  //         coluna: novaColuna
  //       }
  //     );
  //     setTarefas(tarefas.map((t) => (t.id === id ? resposta.data : t)));
  //   } catch (e) {
  //     alert(mensagensDeErro(e).join("\n"));}
  // };

  async function moverTarefa(id, novaColuna) {
    const tarefa = tarefas.find(
      (t) => String(t.id) === String(id)
    );

    if (!tarefa || tarefa.coluna === novaColuna) return;

    try {
      const resposta = await api.put(
        `/tarefas/${id}`,
        {
          ...tarefa,
          coluna: novaColuna
        }
      );

      setTarefas((tarefasAtuais) =>
        tarefasAtuais.map((t) =>
          String(t.id) === String(id) ? resposta.data : t
        )
      );

    } catch (e) {
      alert(mensagensDeErro(e).join("\n"));
    }
  }

  async function soltarTarefa(e, novaColuna) {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData('tarefaId'));
    setColunaAlvo(null);
    if (!id) return;
    moverTarefa(id, novaColuna);
  }

  function destacarColuna(e, coluna) {
    e.preventDefault();
    setColunaAlvo(coluna);
  }

  function removerDestaque(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setColunaAlvo(null);
    }
  }

  // =============================================================
  // 5. FILTROS
  // =============================================================

  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtroPrioridade === "todas") return true;

    const prioridade = tarefa.prioridade
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const prioridadeNormalizada = {
      baixo: "baixa",
      medio: "media",
      alta: "alta"
    };

    return prioridadeNormalizada[prioridade] === filtroPrioridade;
  });
  // =============================================================
  // 6. INTERFACE
  // =============================================================
  return (
    <div id='app'>

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
            <div
              className={`kanban-coluna ${colunaAlvo === 'afazer' ? 'coluna-destacada' : ''}`}
              onDragEnter={(e) => destacarColuna(e, 'afazer')}
              onDragOver={(e) => destacarColuna(e, 'afazer')}
              onDragLeave={removerDestaque}
              onDrop={(e) => soltarTarefa(e, 'afazer')}
            >

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
                prioridades={listaPrioridades}
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

            <div
              className={`kanban-coluna ${colunaAlvo === 'andamento' ? 'coluna-destacada' : ''}`}
              id="andamento"
              onDragEnter={(e) => destacarColuna(e, 'andamento')}
              onDragOver={(e) => destacarColuna(e, 'andamento')}
              onDragLeave={removerDestaque}
              onDrop={(e) => soltarTarefa(e, 'andamento')}
            >
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
                prioridades={listaPrioridades}
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

            <div
              className={`kanban-coluna ${colunaAlvo === 'concluido' ? 'coluna-destacada' : ''}`}
              onDragEnter={(e) => destacarColuna(e, 'concluido')}
              onDragOver={(e) => destacarColuna(e, 'concluido')}
              onDragLeave={removerDestaque}
              onDrop={(e) => soltarTarefa(e, 'concluido')}
            >
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
                prioridades={listaPrioridades}
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
            prioridades={listaPrioridades}
            usuarios={listaUsuarios}
            projetos={listaProjetos}
          />
        </>)}
      </main>

      {/* ─────────────────────────────────────────────────────
        6.5 Rodapé
    ───────────────────────────────────────────────────── */}
      <footer>
        <p>TaskFlow 2026 - Aluna: Ayara Dantas</p>
      </footer>

    </div>
  );
}



export default Kanban
