import type { ButtonHTMLAttributes, ReactNode } from "react";
export default function LoadingButton({ loading = false, children, disabled, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; children: ReactNode }) {
  return <button {...props} disabled={disabled || loading} aria-busy={loading}>
    {loading && <span aria-hidden="true" className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent align-[-2px] mr-2 motion-reduce:animate-none" />}
    {children}
  </button>;
}
