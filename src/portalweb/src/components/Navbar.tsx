import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        AspireMultirepo Portal
      </NavLink>
      <ul className="navbar-links">
        <li>
          <NavLink to="/clientes" className={({ isActive }) => isActive ? 'active' : ''}>
            Clientes
          </NavLink>
        </li>
        <li>
          <NavLink to="/pedidos" className={({ isActive }) => isActive ? 'active' : ''}>
            Pedidos
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
