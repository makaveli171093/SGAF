import type { UserRole } from "../types/auth";
import type { IconName } from "../components/ui/AppIcon";
export interface NavigationItem { to: string; label: string; icon: IconName; description: string; roles?: UserRole[] }
const items: NavigationItem[] = [
  { to: "/inicio", label: "Inicio", icon: "home", description: "Tu actividad de un vistazo" },
  { to: "/admin/reportes", label: "Métricas y reportes", icon: "chart", description: "Resultados de la institución", roles: ["ADMIN"] },
  { to: "/grupos", label: "Grupos académicos", icon: "groups", description: "Materias, docentes y horarios" },
  { to: "/mis-inscripciones", label: "Mis inscripciones", icon: "book", description: "Tu recorrido académico", roles: ["STUDENT"] },
  { to: "/mis-tareas", label: "Mis tareas", icon: "tasks", description: "Actividades y entregas", roles: ["STUDENT"] },
  { to: "/mis-finanzas", label: "Mis finanzas", icon: "wallet", description: "Pagos y obligaciones", roles: ["STUDENT"] },
  { to: "/docente/grupos", label: "Mis grupos", icon: "groups", description: "Clases y publicación de tareas", roles: ["TEACHER"] },
  { to: "/docente/tareas", label: "Tareas publicadas", icon: "tasks", description: "Entregas y calificaciones", roles: ["TEACHER"] },
  { to: "/recepcion/obligaciones", label: "Obligaciones pendientes", icon: "wallet", description: "Seguimiento de obligaciones", roles: ["RECEPCIONIST"] },
  { to: "/recepcion/pagos", label: "Pagos por verificar", icon: "tasks", description: "Revisión de comprobantes", roles: ["RECEPCIONIST"] },
  { to: "/recepcion/postulantes", label: "Postulantes pendientes", icon: "user", description: "Solicitudes de inscripción", roles: ["RECEPCIONIST"] },
  { to: "/admin/usuarios", label: "Usuarios", icon: "user", description: "Estudiantes y personal", roles: ["ADMIN"] },
  { to: "/admin/periodos", label: "Períodos académicos", icon: "calendar", description: "Organización de ciclos", roles: ["ADMIN"] },
  { to: "/admin/materias", label: "Materias", icon: "book", description: "Oferta de formación", roles: ["ADMIN"] },
  { to: "/admin/grupos", label: "Grupos y horarios", icon: "groups", description: "Planificación de clases", roles: ["ADMIN"] },
  { to: "/cuenta", label: "Mi cuenta", icon: "user", description: "Perfil y seguridad" },
];
export function navigationFor(role: UserRole) { return items.filter(item => !item.roles || item.roles.includes(role)); }
