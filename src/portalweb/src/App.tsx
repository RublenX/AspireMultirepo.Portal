import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ClientesList from './pages/clientes/ClientesList';
import ClienteForm from './pages/clientes/ClienteForm';
import PedidosList from './pages/pedidos/PedidosList';
import PedidoForm from './pages/pedidos/PedidoForm';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<ClientesList />} />
        <Route path="/clientes/nuevo" element={<ClienteForm />} />
        <Route path="/clientes/:id/editar" element={<ClienteForm />} />
        <Route path="/pedidos" element={<PedidosList />} />
        <Route path="/pedidos/nuevo" element={<PedidoForm />} />
        <Route path="/pedidos/:id/editar" element={<PedidoForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
