import { Link } from "react-router";
import type { UserRole } from "../../types/auth";
import { navigationFor } from "../../lib/navigation";
import AppIcon from "../ui/AppIcon";

export default function AcademicMap({ role }: { role: UserRole }) {
  const nodes = navigationFor(role).filter(item => item.to !== "/inicio" && item.to !== "/cuenta");
  return <section className="editorial-panel academic-map" aria-labelledby="map-title">
    <div className="panel-title"><div><span className="section-label">Todo está conectado</span><h2 id="map-title">Tu espacio académico</h2><p>Elige por dónde continuar.</p></div><AppIcon name="book" /></div>
    <div className="map-canvas">
      <div className="map-origin"><span className="map-origin-dot" />NEXORA<span>Tu formación, en un solo lugar</span></div>
      <div className="map-nodes">{nodes.map((node, index) => <Link to={node.to} key={node.to} className={`map-node map-tone-${index % 3}`}><span className="node-icon"><AppIcon name={node.icon} /></span><span><strong>{node.label}</strong><small>{node.description}</small></span><AppIcon name="arrow" className="node-arrow" /></Link>)}</div>
    </div>
    <div className="map-caption"><span>Accesos según tu perfil</span><Link to="/cuenta">Mi cuenta <AppIcon name="arrow" /></Link></div>
  </section>;
}
