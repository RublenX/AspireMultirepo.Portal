import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page">
      <h1 className="page-title">Portal de Gestión</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem', marginBottom: '1.5rem' }}>
        Gestiona clientes y pedidos de los microservicios Aspire
      </p>
      <div className="home-grid">
        <Link to="/clientes" className="home-card">
          <div className="home-card-icon">👤</div>
          <h2>Clientes</h2>
          <p>
            Consulta, crea, edita y elimina clientes. Los cambios se propagan
            automáticamente a los pedidos vía RabbitMQ.
          </p>
        </Link>
        <Link to="/pedidos" className="home-card">
          <div className="home-card-icon">📦</div>
          <h2>Pedidos</h2>
          <p>
            Gestiona pedidos asociados a clientes. El nombre del cliente se
            resuelve automáticamente por el microservicio de pedidos.
          </p>
        </Link>
      </div>
    </div>
  );
}
