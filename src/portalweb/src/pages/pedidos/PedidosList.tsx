import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Pedido } from '../../types/pedido';
import { getPedidos, deletePedido } from '../../api/pedidos';

function formatFecha(fechaIso: string): string {
  const d = new Date(fechaIso);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  });
}

function formatTotal(total: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(total);
}

export default function PedidosList() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const cargar = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setPedidos(await getPedidos());
    } catch {
      setError('Error al cargar los pedidos. Comprueba que el microservicio está disponible.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const eliminar = async (pedido: Pedido) => {
    if (!window.confirm(`¿Eliminar el pedido #${pedido.id} de "${pedido.cliente}"?`)) return;
    try {
      await deletePedido(pedido.id);
      setPedidos(prev => prev.filter(p => p.id !== pedido.id));
    } catch {
      setError('Error al eliminar el pedido.');
    }
  };

  const filtrados = pedidos.filter(p =>
    p.cliente.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Pedidos</h1>
        <Link to="/pedidos/nuevo" className="btn btn-primary">+ Nuevo pedido</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div style={{ padding: '0.875rem 0.875rem 0' }}>
          <input
            className="search-input"
            placeholder="Buscar por cliente..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="state-message">Cargando...</div>
        ) : filtrados.length === 0 ? (
          <div className="state-message">
            {busqueda
              ? 'No se encontraron pedidos con esa búsqueda.'
              : 'No hay pedidos registrados aún.'}
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 60 }}>ID</th>
                  <th>Cliente</th>
                  <th style={{ width: 120 }}>Fecha</th>
                  <th style={{ width: 120 }}>Total</th>
                  <th style={{ width: 140 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(p => (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{p.id}</td>
                    <td>{p.cliente}</td>
                    <td>{formatFecha(p.fecha)}</td>
                    <td className="currency">{formatTotal(p.total)}</td>
                    <td>
                      <div className="actions">
                        <Link to={`/pedidos/${p.id}/editar`} className="btn btn-ghost">
                          Editar
                        </Link>
                        <button
                          className="btn btn-ghost-danger"
                          onClick={() => eliminar(p)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
