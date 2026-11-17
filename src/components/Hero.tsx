import { ShieldCheck, Sigma, Sparkles, Zap } from 'lucide-react'
import { CATEGORIES } from '../data/units'

const unitCount = CATEGORIES.reduce(
  (total, category) => total + category.units.length,
  0,
)

const stats = [
  { value: String(CATEGORIES.length).padStart(2, '0'), label: 'Categorías' },
  { value: String(unitCount).padStart(2, '0'), label: 'Unidades' },
  { value: '50', label: 'Dígitos internos' },
]

export function Hero() {
  return (
    <section className="animate-rise">
      <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
        <Sparkles aria-hidden="true" className="size-3.5" />
        Herramienta científica · sin servidor
      </div>

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <h1 className="max-w-3xl text-balance text-[2.55rem] font-semibold leading-[1.02] tracking-[-0.055em] text-ink sm:text-6xl">
            Conversiones físicas con{' '}
            <span className="text-gradient">precisión de laboratorio.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-[15px] leading-7 text-muted sm:text-base">
            Longitud, área, volumen, masa y velocidad en una sola interfaz.
            Factores internacionales exactos, cálculo decimal y resultados que
            puedes copiar al instante.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted">
              <Zap
                aria-hidden="true"
                className="size-3.5 text-amber-600 dark:text-amber-300"
              />
              Resultado en tiempo real
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted">
              <ShieldCheck
                aria-hidden="true"
                className="size-3.5 text-emerald-600 dark:text-emerald-300"
              />
              100% local
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted">
              <Sigma
                aria-hidden="true"
                className="size-3.5 text-accent"
              />
              Decimal.js
            </span>
          </div>
        </div>

        <dl
          className="grid grid-cols-3 gap-2 sm:gap-3 lg:min-w-[300px]"
          aria-label="Datos del conversor"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-line bg-surface px-3 py-3.5 shadow-sm backdrop-blur sm:px-4"
            >
              <dt className="text-[10px] font-semibold uppercase leading-4 tracking-[0.1em] text-subtle">
                {stat.label}
              </dt>
              <dd className="tabular mt-1 text-2xl font-semibold tracking-[-0.04em] text-ink">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
