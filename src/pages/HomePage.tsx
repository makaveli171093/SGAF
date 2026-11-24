import { useState } from "react";
import { RefreshContext } from "../lib/refreshContext";
import StudentDueTasks from "../components/dashboard/StudentDueTasks";
import AcademicMap from "../components/dashboard/AcademicMap";
import WeeklySchedule from "../components/dashboard/WeeklySchedule";
import Skeleton from "../components/ui/Skeleton";
import AppIcon from "../components/ui/AppIcon";
import { Link } from "react-router";
import { api } from "../lib/axios";
import { useAuthStore } from "../stores/authStore";
import { useAuthenticatedQuery } from "../hooks/useAuthenticatedQuery";
import { roleLabels } from "../constants/authLabels";

async function load(token: string, signal: AbortSignal) {
  return (
    await api.get<{
      cards: { label: string; value: number; href: string }[];
      generatedAt: string;
    }>("/account/summary", {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    })
  ).data;
}
export default function HomePage() {
  const [refreshVersion, setRefreshVersion] = useState(0);
  const user = useAuthStore((state) => state.user);
  const { data, error, isLoading, reload } = useAuthenticatedQuery(load);
  if (!user) return null;
  const messages = {
    ADMIN:
      "Organiza la gestión académica y consulta los resultados de tu institución.",
    RECEPCIONIST:
      "Acompaña las inscripciones y mantén al día la gestión de pagos.",
    TEACHER: "Conecta tus clases, actividades y entregas en un mismo espacio.",
    STUDENT: "Tus clases, entregas y próximos pasos, conectados.",
  };
  return (
    <section className="editorial-home">
      <div className="home-heading">
        <div>
          <p className="section-label">NEXORA · {roleLabels[user.role]}</p>
          <h1>Tu comunidad, en perspectiva</h1>
          <p>{messages[user.role]}</p>
        </div>
        <button
          className="btn-secondary refresh-button"
          onClick={() => {
            reload();
            setRefreshVersion((value) => value + 1);
          }}
          disabled={isLoading}
        >
          <AppIcon name="refresh" />
          {isLoading ? "Actualizando…" : "Actualizar"}
        </button>
      </div>
      {user.status === "SUSPEND_FOR_DEBT" && (
        <p className="mb-5 rounded-xl bg-warning-soft p-5 text-warning">
          Tu cuenta tiene obligaciones vencidas.{" "}
          <Link to="/mis-finanzas" className="font-semibold underline">
            Revisar mis finanzas
          </Link>
        </p>
      )}
      {isLoading && (
        <div className="summary-loading">
          <Skeleton lines={2} />
        </div>
      )}
      {error && (
        <p
          role="alert"
          className="mb-6 rounded-xl bg-danger-soft p-5 text-danger"
        >
          {error}
        </p>
      )}
      {data && (
        <>
          <div className="summary-strip" aria-label="Resumen de tu actividad">
            {data.cards.map((card) => (
              <Link
                key={card.href + card.label}
                to={card.href}
                className="summary-metric"
              >
                <span>{card.label}</span>
                <strong>{card.value.toLocaleString("es-BO")}</strong>
                <small>
                  Ver detalle <AppIcon name="arrow" />
                </small>
              </Link>
            ))}
          </div>
          {data.cards.length === 0 && (
            <p className="panel-empty">Aún no hay actividad para mostrar.</p>
          )}
        </>
      )}
      <RefreshContext.Provider value={refreshVersion}>
        <div className="home-grid">
          <div className="home-primary">
            <AcademicMap role={user.role} />
            {user.role === "STUDENT" && <StudentDueTasks />}
            <section className="editorial-note">
              <span className="note-mark" aria-hidden="true">
                N
              </span>
              <div>
                <h2>Un espacio para avanzar</h2>
                <p>
                  Aprende, organiza tus actividades y sigue tu formación paso a
                  paso.
                </p>
              </div>
              <Link to="/grupos" aria-label="Explorar grupos académicos">
                <AppIcon name="arrow" />
              </Link>
            </section>
          </div>
          <aside className="home-aside">
            <WeeklySchedule role={user.role} />
          </aside>
        </div>
      </RefreshContext.Provider>
      {data && (
        <p className="last-update">
          Última consulta:{" "}
          {new Date(data.generatedAt).toLocaleString("es-BO", {
            timeZone: "America/La_Paz",
          })}{" "}
          · Bolivia
        </p>
      )}
    </section>
  );
}
