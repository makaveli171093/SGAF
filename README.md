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
