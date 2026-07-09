import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCliente, createCliente, updateCliente } from '../../api/clientes';

export default function ClienteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = !!id;

  const [nombre, setNombre] = useState('');
  const [vip, setVip] = useState(false);
  const [cargando, setCargando] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!esEdicion) return;
    getCliente(Number(id))
      .then(c => {
        setNombre(c.nombre);
        setVip(c.vip);
      })
      .catch(() => setError('No se pudo cargar el cliente.'))
      .finally(() => setCargando(false));
  }, [id, esEdicion]);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      if (esEdicion) {
        await updateCliente(Number(id), { id: Number(id), nombre, vip });
      } else {
        await createCliente({ nombre, vip });
      }
      navigate('/clientes');
    } catch {
      setError('Error al guardar el cliente. Inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <div className="page"><div className="state-message">Cargando...</div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{esEdicion ? 'Editar cliente' : 'Nuevo cliente'}</h1>
      </div>
      <div className="form-card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={guardar}>
          <div className="form-group">
            <label className="form-label" htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              className="form-input"
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              maxLength={200}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-check">
              <input
                type="checkbox"
                checked={vip}
                onChange={e => setVip(e.target.checked)}
              />
              <span>Cliente VIP</span>
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
            <Link to="/clientes" className="btn btn-secondary">Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
