import { Atom, Moon, ShieldCheck, Sun } from 'lucide-react'
import type { Theme } from '../types'

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const nextTheme = theme === 'dark' ? 'claro' : 'oscuro'

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-300 via-sky-400 to-indigo-400 text-slate-950 shadow-lg shadow-cyan-500/20">
            <Atom aria-hidden="true" className="size-5" strokeWidth={2.2} />
            <span className="absolute inset-x-1 top-0 h-px bg-white/70" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-[-0.015em] text-ink">
              Conversor de Unidades Físicas
            </p>
            <p className="truncate text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
              Taller #1 · Física ADSO
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted sm:inline-flex">
            <ShieldCheck
              aria-hidden="true"
              className="size-3.5 text-emerald-600 dark:text-emerald-300"
            />
            Cálculo local
          </span>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Cambiar al modo ${nextTheme}`}
            title={`Cambiar al modo ${nextTheme}`}
            className="flex size-10 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-sm transition hover:border-line-strong hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            {theme === 'dark' ? (
              <Sun aria-hidden="true" className="size-4.5" />
            ) : (
              <Moon aria-hidden="true" className="size-4.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
