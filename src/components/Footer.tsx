import { Atom } from 'lucide-react'

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="mt-12 border-t border-line bg-surface/40 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-7 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-xl border border-line bg-surface text-accent">
            <Atom aria-hidden="true" className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-[-0.01em] text-ink">
              Conversor de Unidades Físicas — Taller #1 Física ADSO
            </p>
            <p className="mt-0.5 text-[11px] text-subtle">
              Precisión decimal para laboratorio y aula.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-[11px] text-subtle md:items-end">
          <p>React · TypeScript · Tailwind CSS · Decimal.js</p>
          <p>© {CURRENT_YEAR} · Sin backend, sin cookies.</p>
        </div>
      </div>
    </footer>
  )
}
