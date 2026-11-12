import { Route, Routes } from 'react-router-dom';
import './App.css';
import Sobre from './pages/Sobre';
import Login from './pages/Login';
import TarefaV1 from './pages/Kanban';
import Sidebar from './components/Sidebar';
import RotaPrivada from './components/RotaPrivada';
import { useAuth } from "./contexts/AuthContext";
import { useState } from 'react';

function App() {
  const { token } = useAuth();

  const [sidebarAberto, setSidebarAberto] = useState(true);

  return (

    <div className={`app-layout ${sidebarAberto ? 'sidebar-aberto' : ''}`}>

      {token && (
        <>
          <button
            className="botao-sidebar"
            onClick={() => setSidebarAberto(!sidebarAberto)}
            title={sidebarAberto ? 'Fechar menu' : 'Abrir menu'}
          >
            {sidebarAberto ? '✕' : '☰'}
          </button>

          {sidebarAberto && <Sidebar />}
        </>
      )}

      <main
        className="app-conteudo"
        style={{
          marginLeft: token
            ? sidebarAberto ? '220px' : '0'
            : '0'
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <RotaPrivada>
                <TarefaV1 />
              </RotaPrivada>
            }
          />

          <Route path="/sobre" element={<Sobre />} />

          <Route path="/login" element={<Login />} />

          <Route path="*" element={<h1>Página não encontrada</h1>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;