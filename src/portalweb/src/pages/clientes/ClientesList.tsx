import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Cliente } from '../../types/cliente';
import { getClientes, deleteCliente } from '../../api/clientes';

export default function ClientesList() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const cargar = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setClientes(await getClientes());
    } catch {
      setError('Error al cargar los clientes. Comprueba que el microservicio está disponible.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const eliminar = async (cliente: Cliente) => {
    if (!window.confirm(
      `¿Eliminar al cliente "${cliente.nombre}"?\nSe eliminarán también todos sus pedidos (vía evento RabbitMQ).`
    )) return;
    try {
      await deleteCliente(cliente.id);
      setClientes(prev => prev.filter(c => c.id !== cliente.id));
    } catch {
      setError('Error al eliminar el cliente.');
    }
  };

  const filtrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
        <Link to="/clientes/nuevo" className="btn btn-primary">+ Nuevo cliente</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div style={{ padding: '0.875rem 0.875rem 0' }}>
          <input
            className="search-input"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="state-message">Cargando...</div>
        ) : filtrados.length === 0 ? (
          <div className="state-message">
            {busqueda
              ? 'No se encontraron clientes con esa búsqueda.'
              : 'No hay clientes registrados aún.'}
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 60 }}>ID</th>
                  <th>Nombre</th>
                  <th style={{ width: 100 }}>VIP</th>
                  <th style={{ width: 140 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(c => (
                  <tr key={c.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{c.id}</td>
                    <td>{c.nombre}</td>
                    <td>
                      <span className={`badge ${c.vip ? 'badge-vip' : 'badge-regular'}`}>
                        {c.vip ? '★ VIP' : 'Regular'}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <Link to={`/clientes/${c.id}/editar`} className="btn btn-ghost">
                          Editar
                        </Link>
                        <button
                          className="btn btn-ghost-danger"
                          onClick={() => eliminar(c)}
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
