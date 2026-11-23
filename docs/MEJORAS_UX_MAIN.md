# Mejoras UX propuestas para `main` — revisión manual

Esta versión integra el ZIP de mejoras UX en el repositorio SGAF. La publicación del código no constituye una validación de los flujos contra el backend.

## Cambios incluidos

- `PageLoading`: spinner accesible con la marca NEXORA.
- `Skeleton`, `LoadingButton`: indicadores reutilizables; animaciones reducidas con `prefers-reduced-motion`.
- `assignmentFilters`: filtrado, búsqueda y ordenamiento sin modificar las respuestas de la API; 10 registros por página.
- `MyAssignmentsPage`: búsqueda por tarea/materia, grupo, estado de entrega, orden y paginación.
- `TeacherAssignmentsPage`: búsqueda, grupo, período, orden y paginación.
- `TeacherSubmissionsPage`: búsqueda por estudiante/matrícula, filtro de calificación, conteo de pendientes y paginación.
- `useMyAssignments`: conservar los datos al actualizar, manteniendo el aislamiento por token de sesión.
- `StudentDueTasks`: resumen de tareas no entregadas que vencen en 48 horas en Inicio del estudiante.
- `ToastProvider`: notificaciones al entregar y guardar calificaciones.
- Skeletons de varias pantallas para mejorar la carga inicial.
- `npm test`: pruebas de reglas de filtros, estados y paginación.

## Instalación y comprobación

Usar Node compatible con las versiones de `package.json` (React Router 8 requiere Node >= 22.22.0). En el directorio:

```bash
cp .env.example .env.local
npm ci
npm test
npm run lint
npm run build
npm run dev
```

Ajustar `VITE_API_URL` al backend de prueba. Mantener `VITE_ONLINE_PAYMENTS_ENABLED=false` si la pasarela no funciona.

## Pruebas manuales prioritarias

1. Como estudiante, con más de 10 tareas, verificar que cambiar de página no pierda filtros y que buscar vuelva a la página 1.
2. Comprobar estados: pendiente, vencida, entregada, calificada y grupos distintos.
3. Crear entrega, cancelar confirmación, guardar entrega y comprobar que aparece sin recargar; verificar notificación.
4. Como docente, comprobar filtros por período/grupo y el contador de entregas.
5. En entregas de una tarea, filtrar pendientes y calificadas, guardar nota, comprobar actualización de contador y notificación.
6. En Inicio de estudiante, comprobar próximas tareas dentro de 48 horas, excluyendo entregadas.
7. Refrescar tareas y verificar que no se vacíe la lista; probar desconexión y error de API.
8. Probar móvil 320px, navegación por teclado, modo de movimiento reducido y sesiones de roles diferentes.

## Fuera de alcance por depender del servidor

- Paginación y filtros remotos para bases de datos grandes.
- Notificaciones persistentes, leídas/no leídas o en tiempo real.
- Cambios a endpoints, permisos o reglas de pagos.

## Estado de verificación

Integración local del 23 de noviembre de 2026, con Node 24.19.0. Se corrigió el ejecutor de pruebas para usar el soporte nativo de TypeScript de Node y se ajustaron las dependencias de memorización y la separación del contexto de notificaciones. Los indicadores de vencimiento usan el instante de la última consulta de tareas.

La validación funcional con cuentas de estudiante/docente y un backend activo permanece pendiente. `.env.example` apunta a un backend local y debe adaptarse al entorno de ejecución.