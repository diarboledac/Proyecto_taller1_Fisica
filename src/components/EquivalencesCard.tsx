import type Decimal from 'decimal.js'
import { Check, LayoutGrid } from 'lucide-react'
import { convertValue, formatNumber } from '../lib/conversion'
import type { Category, Unit } from '../types'

interface EquivalencesCardProps {
  category: Category
  fromUnit: Unit
  toUnit: Unit
  value: Decimal | null
  onSelectTarget: (unitId: string) => void
}

export function EquivalencesCard({
  category,
  fromUnit,
  toUnit,
  value,
  onSelectTarget,
}: EquivalencesCardProps) {
  return (
    <section
      aria-labelledby="equivalences-title"
      className="surface-card animate-rise mt-5 p-5 sm:p-7"
      style={{ animationDelay: '280ms' }}
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-line bg-accent-soft text-accent">
            <LayoutGrid aria-hidden="true" className="size-4" />
          </span>
          <div>
            <h2
              id="equivalences-title"
              className="text-sm font-semibold tracking-[-0.01em] text-ink sm:text-base"
            >
              Equivalencias rápidas
            </h2>
            <p className="mt-0.5 text-[11px] leading-5 text-muted sm:text-xs">
              {value
                ? `${formatNumber(value)} ${fromUnit.symbol} convertido a todas las unidades de ${category.name.toLowerCase()}.`
                : 'Ingresa un valor válido para ver la tabla completa.'}
            </p>
          </div>
        </div>
        <span className="w-fit rounded-full border border-line bg-surface-muted px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
          {category.units.length} unidades
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {category.units.map((unit) => {
          const converted = value
            ? convertValue(value, category, fromUnit.id, unit.id)
            : null
          const isSource = unit.id === fromUnit.id
          const isTarget = unit.id === toUnit.id

          return (
            <button
              key={unit.id}
              type="button"
              onClick={() => onSelectTarget(unit.id)}
              disabled={!converted}
              aria-pressed={isTarget}
              aria-label={`Usar ${unit.name} (${unit.symbol}) como unidad de destino`}
              className={[
                'group relative overflow-hidden rounded-xl border p-3.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-default',
                isTarget
                  ? 'border-accent/40 bg-accent-soft shadow-sm'
                  : 'border-line bg-surface-muted/55 hover:-translate-y-0.5 hover:border-accent/30 hover:bg-surface-muted hover:shadow-sm',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-muted">
                    {unit.name}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-subtle">
                    {unit.symbol}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  {isTarget ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-accent">
                      <Check aria-hidden="true" className="size-2.5" />
                      Destino
                    </span>
                  ) : (
                    isSource && (
                      <span className="rounded-md bg-surface px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-subtle">
                        Origen
                      </span>
                    )
                  )}
                </div>
              </div>

              <p className="tabular mt-3 break-words font-mono text-lg font-semibold tracking-[-0.02em] text-ink">
                {converted ? formatNumber(converted) : '—'}
                <span className="ml-1.5 text-[10px] font-medium text-subtle">
                  {unit.symbol}
                </span>
              </p>
            </button>
          )
        })}
      </div>

      <p className="mt-4 text-[10px] leading-4 text-subtle">
        Toca una tarjeta para fijarla como unidad de destino. Todas las
        conversiones se calculan mediante la unidad base de la categoría.
      </p>
    </section>
  )
}
