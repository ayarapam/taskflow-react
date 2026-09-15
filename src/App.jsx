import { Route, Routes } from 'react-router-dom';
import './App.css';
import Sobre from './pages/Sobre';
import Login from './pages/Login';
import TarefaV1 from './components/tarefaV1';
import Sidebar from './components/Sidebar';
import RotaPrivada from './components/RotaPrivada';
import { useAuth } from "./contexts/AuthContext";

function App() {

  const { token } = useAuth();
  console.log(useAuth())

  return (

    <div className="app-layout">

      {token && <Sidebar />}

      <main className="app-conteudo" style={{ marginLeft: token ? '220px' : '0' }}>

        <Routes>

          <Route path="/" element={<RotaPrivada>
            <TarefaV1 />
          </RotaPrivada>} />
          
          <Route path="/sobre" element={<Sobre />} />

          <Route path="/login" element={<Login />} />

          <Route path="*" element={<h1>Página não encontrada</h1>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;