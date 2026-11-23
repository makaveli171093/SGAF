import { Suspense, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import Avatar from "../components/ui/Avatar";
import AppIcon from "../components/ui/AppIcon";
import NexoraLogo from "../components/brand/NexoraLogo";
import PageLoading from "../components/PageLoading";
import { roleLabels } from "../constants/authLabels";
import { useAuthStore } from "../stores/authStore";
import { navigationFor } from "../lib/navigation";

export default function AppLayout() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  if (!user) return null;
  const navigation = navigationFor(user.role);
  const page = navigation.find(item => item.to === location.pathname)?.label ?? "Detalle";
  return <div className="app-shell">
    <a href="#contenido" className="skip-link">Saltar al contenido</a>
    <aside className="app-sidebar" onKeyDown={event => { if (event.key === "Escape") setMenuOpen(false); }}>
      <div className="sidebar-brand"><Link to="/inicio" aria-label="NEXORA, inicio" onClick={() => setMenuOpen(false)}><NexoraLogo /></Link>
        <button type="button" className="mobile-toggle" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen} aria-controls="app-navigation" onClick={() => setMenuOpen(!menuOpen)}><AppIcon name={menuOpen ? "close" : "menu"} /></button>
      </div>
      <div className="sidebar-context"><span className="context-symbol">N</span><div><strong>Aula virtual</strong><span>Gestión académica y financiera</span></div></div>
      <nav id="app-navigation" className={`app-navigation ${menuOpen ? "is-open" : ""}`} aria-label="Navegación principal">
        <p className="nav-caption">Tu espacio</p>
        {navigation.map(item => <NavLink key={item.to} to={item.to} end className={({ isActive }) => `app-nav-link ${isActive ? "is-active" : ""}`} onClick={() => setMenuOpen(false)}><AppIcon name={item.icon} /><span>{item.label}</span></NavLink>)}
      </nav>
      <div className="sidebar-footer"><p>Conecta tu talento<br /><span>con lo que viene.</span></p><Link to="/cuenta" className="sidebar-profile"><Avatar user={user} /><div><strong>{user.firstName} {user.lastName}</strong><span>{roleLabels[user.role]}</span></div><AppIcon name="arrow" /></Link></div>
    </aside>
    <div className="app-workspace">
      <header className="app-topbar"><div className="app-breadcrumb"><Link to="/inicio">Mi espacio</Link><span aria-hidden="true">/</span><strong>{page}</strong></div><div className="topbar-actions"><span className="role-label">{roleLabels[user.role]}</span><button type="button" className="logout-button" onClick={logout}><AppIcon name="logout" /><span>Cerrar sesión</span></button></div></header>
      <main id="contenido" tabIndex={-1} className="app-main"><Suspense fallback={<PageLoading />}><Outlet /></Suspense></main>
      <footer className="app-footer"><span>NEXORA · Formación técnica</span><span>La Paz, Bolivia</span></footer>
    </div>
  </div>;
}
