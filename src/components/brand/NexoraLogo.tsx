export default function NexoraLogo() {
  return (
    <span className="inline-flex items-center gap-3">
      <svg
        className="brand-logo-mark" viewBox="0 0 48 48"
        width="44"
        height="44"
        fill="none"
        aria-hidden="true"
      >
        <rect width="48" height="48" rx="14" fill="#293547" />
        <path
          d="M14 34V14L34 34V14"
          stroke="#f5f6f2"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="34" cy="14" r="4" fill="#d99a7a" />
      </svg>

      <span>
        <span className="block brand-wordmark">
          NEXORA
        </span>

        <span className="block brand-subtitle">
          Formación técnica · Bolivia
        </span>
      </span>
    </span>
  );
}
