import { Component, type ReactNode } from "react";
export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <main className="mx-auto max-w-xl p-8" role="alert"><h1 className="text-3xl">No pudimos mostrar esta pantalla</h1><p className="my-4">Los datos recibidos o la pantalla tuvieron un error. Recarga para volver a intentarlo.</p><button className="btn-primary" onClick={() => window.location.reload()}>Recargar aplicación</button><a className="ml-4 underline" href="/inicio">Volver al inicio</a></main>;
  }
}
