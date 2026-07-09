import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPedido, createPedido, updatePedido } from '../../api/pedidos';
import { getClientes } from '../../api/clientes';
import type { Cliente } from '../../types/cliente';

function toInputDate(fechaIso: string): string {
  const d = new Date(fechaIso);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function PedidoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = !!id;

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [idCliente, setIdCliente] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [total, setTotal] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [listaClientes, pedidoExistente] = await Promise.all([
          getClientes(),
          esEdicion ? getPedido(Number(id)) : Promise.resolve(null),
        ]);
        setClientes(listaClientes);
        if (pedidoExistente) {
          setIdCliente(String(pedidoExistente.idCliente));
          setFecha(toInputDate(pedidoExistente.fecha));
          setTotal(String(pedidoExistente.total));
        } else if (listaClientes.length > 0) {
          setIdCliente(String(listaClientes[0].id));
        }
      } catch {
        setError('No se pudieron cargar los datos necesarios.');
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [id, esEdicion]);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    const datos = {
      idCliente: Number(idCliente),
      fecha: fecha + 'T00:00:00',
      total: parseFloat(total),
    };
    try {
      if (esEdicion) {
        await updatePedido(Number(id), datos);
      } else {
        await createPedido(datos);
      }
      navigate('/pedidos');
    } catch {
      setError('Error al guardar el pedido. Inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <div className="page"><div className="state-message">Cargando...</div></div>;

  const sinClientes = clientes.length === 0;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{esEdicion ? 'Editar pedido' : 'Nuevo pedido'}</h1>
      </div>
      <div className="form-card">
        {error && <div className="alert alert-error">{error}</div>}
        {sinClientes && !error && (
          <div className="alert alert-error">
            No hay clientes disponibles.{' '}
            <Link to="/clientes/nuevo">Crea un cliente primero.</Link>
          </div>
        )}
        <form onSubmit={guardar}>
          <div className="form-group">
            <label className="form-label" htmlFor="cliente">Cliente</label>
            <select
              id="cliente"
              className="form-select"
              value={idCliente}
              onChange={e => setIdCliente(e.target.value)}
              required
              disabled={sinClientes}
            >
              {clientes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nombre}{c.vip ? ' ★' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="fecha">Fecha</label>
            <input
              id="fecha"
              className="form-input"
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="total">Total (€)</label>
            <input
              id="total"
              className="form-input"
              type="number"
              min="0"
              step="0.01"
              value={total}
              onChange={e => setTotal(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={guardando || sinClientes}
            >
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
            <Link to="/pedidos" className="btn btn-secondary">Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
