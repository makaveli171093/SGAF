# SGAF — Frontend NEXORA

Interfaz del Sistema de Gestión Académica y Financiera, construida con React, TypeScript y Vite. Incluye navegación por roles, gestión académica, tareas, entregas, calificaciones y consultas financieras.

## Requisitos e instalación

Node.js 22.22.0 o superior (verificado con Node 24.19.0) y npm.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Configura `VITE_API_URL` en `.env.local` con la URL del backend. El ejemplo apunta a `http://localhost:3000/api/v1`. El backend se ejecuta por separado. Las variables `VITE_*` son públicas: no incluyas secretos. Los pagos en línea están desactivados por defecto mediante `VITE_ONLINE_PAYMENTS_ENABLED=false`.

## Mejoras UX incluidas

- Indicadores de carga, skeletons y botones con estado de operación.
- Búsqueda, filtros, ordenamiento y paginación de 10 tareas por página para estudiantes y docentes.
- Filtros de entregas calificadas y pendientes, y búsqueda de estudiantes.
- Conservación de tareas durante las actualizaciones.
- Próximas entregas dentro de 48 horas y avisos al entregar o calificar.
- Respeto de la preferencia de movimiento reducido.

## Comprobaciones

```powershell
npm test
npm run lint
npm run build
```

Las pruebas importan TypeScript directamente usando el soporte nativo de Node. La compilación genera `dist/`. Para revisar el resultado localmente, ejecuta `npm run preview` después de compilar con la URL correcta del backend.

Consulta [la guía de revisión UX](docs/MEJORAS_UX_MAIN.md) para validar los flujos con cuentas de estudiante y docente. Las pruebas automatizadas cubren filtros, estados y paginación; no sustituyen la revisión con el backend.

## Publicación

Repositorio: https://github.com/makaveli171093/SGAF

Configura las variables de entorno antes de compilar para un alojamiento web. `vercel.json` incluye la configuración del proyecto. Este repositorio contiene el frontend; no incluye un backend ni credenciales. No se versionan dependencias, compilados, archivos de entorno locales ni el ZIP original.

## Diseño editorial

La interfaz utiliza una barra lateral azul tinta, superficies marfil, títulos editoriales y acentos terracota. El inicio combina el resumen real de la API, accesos por rol y el horario semanal de períodos activos. En móvil, el menú se despliega con un botón y el mapa se convierte en una lista de accesos.

El mapa es navegación entre módulos de SGAF; no representa relaciones académicas calculadas. No se incorporan las estadísticas, observaciones ni actividades ficticias del prototipo visual. La identidad permanece como NEXORA.

La configuración local utilizada para esta integración apunta a `https://sgaf-backend.onrender.com/api/v1`. En un alojamiento web, establece esa misma URL en `VITE_API_URL` antes de compilar si deseas consumir Render.

## Correcciones verificadas — 24 de noviembre de 2026

- **Actualización coordinada:** Actualizar en Inicio recarga resumen, próximas entregas y horario.
- **Estado conservado:** los listados permanecen visibles durante recargas y fallos posteriores; las respuestas de sesiones anteriores se descartan.
- **Reloj reactivo:** vencimientos se recalculan cada 30 segundos y al volver a la ventana; `checkedAt` queda reservado para la última consulta.
- **Paginación del servidor:** tareas y entregas solicitan páginas y filtros a la API. Se conserva compatibilidad temporal con el backend anterior mediante filtrado local cuando falta `pagination`.
- **Contratos de datos:** se validan respuestas críticas con Zod antes de renderizar. Un `ErrorBoundary` permite recuperarse de fallos de pantalla.
- **Fechas y agenda:** se rechazan fechas inexistentes; las horas ISO del backend se muestran como HH:mm y las clases se ordenan desde el momento actual en Bolivia.
- **Consistencia visual:** se elimina el tercer bloque redundante de accesos del Inicio y los gráficos usan el color del tema. Se conservan las correcciones del header fijo.
- **Pruebas y CI:** pruebas de lógica y componentes React; GitHub Actions ejecuta pruebas, análisis y compilación con Node 24.

Ejecuta `npm ci`, `npm test`, `npm run lint` y `npm run build`. Las pruebas de componentes usan un entorno DOM simulado; no sustituyen la comprobación visual en navegadores reales. El backend tiene su propia suite HTTP con PostgreSQL para los flujos académicos y financieros.

La configuración local continúa consumiendo Render. Las correcciones del servidor entran en producción únicamente al desplegar el backend actualizado. Los pagos en línea conservan su configuración previa.
