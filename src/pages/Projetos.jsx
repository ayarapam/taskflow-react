import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import api, { mensagensDeErro } from '../api';
import styles from './Projetos.module.css';

const projetoVazio = { nome: '', descricao: '', status: 'ativo' };

function Projetos() {
  const [projetos, setProjetos] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [projetoEditando, setProjetoEditando] = useState(null);
  const [formulario, setFormulario] = useState(projetoVazio);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const [resProjetos, resTarefas] = await Promise.all([
        api.get('/projetos'),
        api.get('/tarefas'),
      ]);
      setProjetos(Array.isArray(resProjetos.data) ? resProjetos.data : []);
      setTarefas(Array.isArray(resTarefas.data) ? resTarefas.data : []);
    } catch (e) {
      setErro(mensagensDeErro(e).join(' '));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregarDados(); }, [carregarDados]);

  const projetosFiltrados = useMemo(() => projetos.filter((projeto) => {
    const status = (projeto.status || 'ativo').toLowerCase();
    const correspondeFiltro = filtro === 'todos' || status === filtro;
    const correspondeBusca = (projeto.nome || '').toLowerCase().includes(busca.toLowerCase()) ||
      (projeto.descricao || '').toLowerCase().includes(busca.toLowerCase());
    return correspondeFiltro && correspondeBusca;
  }), [projetos, filtro, busca]);

  function contarTarefas(idProjeto) {
    return tarefas.filter((tarefa) => Number(tarefa.projeto_id) === Number(idProjeto)).length;
  }

  function abrirNovo() {
    setProjetoEditando(null);
    setFormulario(projetoVazio);
    setErro('');
    setModalAberto(true);
  }

  function abrirEdicao(projeto) {
    setProjetoEditando(projeto);
    setFormulario({
      nome: projeto.nome || '',
      descricao: projeto.descricao || '',
      status: projeto.status || 'ativo',
    });
    setErro('');
    setModalAberto(true);
  }

  async function salvarProjeto(event) {
    event.preventDefault();
    if (!formulario.nome.trim()) {
      setErro('Informe o nome do projeto.');
      return;
    }
    setSalvando(true);
    setErro('');
    try {
      const dados = { ...formulario, nome: formulario.nome.trim(), descricao: formulario.descricao.trim() };
      if (projetoEditando) {
        const resposta = await api.put(`/projetos/${projetoEditando.id}`, dados);
        setProjetos((atuais) => atuais.map((p) => p.id === projetoEditando.id ? resposta.data : p));
      } else {
        const resposta = await api.post('/projetos', dados);
        setProjetos((atuais) => [...atuais, resposta.data]);
      }
      setModalAberto(false);
    } catch (e) {
      setErro(mensagensDeErro(e).join(' '));
    } finally {
      setSalvando(false);
    }
  }

  async function excluirProjeto(projeto) {
    const quantidade = contarTarefas(projeto.id);
    const confirmacao = quantidade
      ? `Este projeto possui ${quantidade} tarefa(s) vinculada(s). Deseja realmente excluí-lo?`
      : `Deseja excluir o projeto "${projeto.nome}"?`;
    if (!window.confirm(confirmacao)) return;
    try {
      await api.delete(`/projetos/${projeto.id}`);
      setProjetos((atuais) => atuais.filter((p) => p.id !== projeto.id));
    } catch (e) {
      setErro(mensagensDeErro(e).join(' '));
    }
  }
  

  return (
    <div className={styles.pagina}>
      <Header titulo="Projetos" subtitulo="Organize suas tarefas por objetivos" />
      <main className={styles.conteudo}>
        <section className={styles.resumo}>
          <div><span className={styles.resumoNumero}>{projetos.length}</span><span>Projetos cadastrados</span></div>
          <div><span className={styles.resumoNumero}>{tarefas.filter(tarefa => tarefa.coluna !== 'concluido').length}</span><span>Tarefas no total</span></div>
          <div><span className={styles.resumoNumero}>{projetos.filter((p) => (p.status || 'ativo') === 'ativo').length}</span><span>Projetos ativos</span></div>
        </section>

        <div className={styles.ferramentas}>
          <input aria-label="Buscar projeto" placeholder="Buscar projeto..." value={busca} onChange={(e) => setBusca(e.target.value)} />
          <select aria-label="Filtrar projetos" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="todos">Todos os projetos</option>
            <option value="ativo">Ativos</option>
            <option value="concluido">Concluídos</option>
          </select>
          <button className={styles.botaoPrimario} onClick={abrirNovo}>+ Novo projeto</button>
        </div>

        {erro && !modalAberto && <p className={styles.erro}>{erro}</p>}
        {carregando ? <p className={styles.estado}>Carregando projetos...</p> : projetosFiltrados.length === 0 ? (
          <div className={styles.vazio}><span>▧</span><h2>Nenhum projeto encontrado</h2><p>Crie um projeto para começar a organizar suas tarefas.</p><button className={styles.botaoPrimario} onClick={abrirNovo}>Criar projeto</button></div>
        ) : (
          <section className={styles.grade}>
            {projetosFiltrados.map((projeto) => {
              const total = contarTarefas(projeto.id);
              const concluidas = tarefas.filter((t) => Number(t.projeto_id) === Number(projeto.id) && t.coluna === 'concluido').length;
              const percentual = total ? Math.round((concluidas / total) * 100) : 0;
              const status = projeto.status || 'ativo';
              return (
                <article className={styles.cardProjeto} key={projeto.id}>
                  <div className={styles.cardTopo}>
                    <span className={`${styles.status} ${status === 'concluido' ? styles.statusConcluido : ''}`}>{status === 'concluido' ? 'Concluído' : 'Ativo'}</span>
                  </div>
                  <h2>{projeto.nome}</h2>
                  <p className={styles.descricao}>{projeto.descricao || 'Sem descrição adicionada.'}</p>
                  <div className={styles.progressoTexto}><span>Progresso</span><strong>{percentual}%</strong></div>
                  <div className={styles.trilho}><span style={{ width: `${percentual}%` }} /></div>
                  <div className={styles.cardRodape}><span>{concluidas} de {total} tarefas concluídas</span>
                    <div><button onClick={() => abrirEdicao(projeto)} aria-label={`Editar ${projeto.nome}`}>Editar</button><button className={styles.botaoExcluir} onClick={() => excluirProjeto(projeto)} aria-label={`Excluir ${projeto.nome}`}>Excluir</button></div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>

      {modalAberto && (
        <div className={styles.overlay} onClick={() => setModalAberto(false)}>
          <form className={styles.modal} onSubmit={salvarProjeto} onClick={(e) => e.stopPropagation()}>
            <h2>{projetoEditando ? 'Editar projeto' : 'Novo projeto'}</h2>
            <label htmlFor="projeto-nome">Nome do projeto</label>
            <input id="projeto-nome" autoFocus value={formulario.nome} onChange={(e) => setFormulario({ ...formulario, nome: e.target.value })} placeholder="Ex.: Desenvolvimento do site" />
            <label htmlFor="projeto-descricao">Descrição</label>
            <textarea id="projeto-descricao" rows="4" value={formulario.descricao} onChange={(e) => setFormulario({ ...formulario, descricao: e.target.value })} placeholder="Descreva o objetivo do projeto" />
            <label htmlFor="projeto-status">Status</label>
            <select id="projeto-status" value={formulario.status} onChange={(e) => setFormulario({ ...formulario, status: e.target.value })}>
              <option value="ativo">Ativo</option><option value="concluido">Concluído</option>
            </select>
            {erro && <p className={styles.erro}>{erro}</p>}
            <div className={styles.acoesModal}><button type="button" onClick={() => setModalAberto(false)}>Cancelar</button><button className={styles.botaoPrimario} type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar projeto'}</button></div>
          </form>
        </div>
      )}
      <footer className={styles.rodape}>TaskFlow 2026</footer>
    </div>
  );
}

export default Projetos;
