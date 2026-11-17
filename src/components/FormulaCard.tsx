import { Sigma } from 'lucide-react'
import { getUnit } from '../data/units'
import { conversionFactor, formatNumber } from '../lib/conversion'
import type { Category, Unit } from '../types'

interface FormulaCardProps {
  category: Category
  fromUnit: Unit
  toUnit: Unit
}

export function FormulaCard({
  category,
  fromUnit,
  toUnit,
}: FormulaCardProps) {
  const factor = conversionFactor(category, fromUnit.id, toUnit.id)
  const baseUnit = getUnit(category, category.baseUnitId)

  return (
    <aside
      aria-labelledby="formula-title"
      className="surface-card animate-rise p-5 sm:p-6"
      style={{ animationDelay: '160ms' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl border border-line bg-accent-soft text-accent">
            <Sigma aria-hidden="true" className="size-4" />
          </span>
          <div>
            <h2
              id="formula-title"
              className="text-sm font-semibold tracking-[-0.01em] text-ink"
            >
              Fórmula aplicada
            </h2>
            <p className="text-[11px] text-subtle">
              Conversión directa por unidad base
            </p>
          </div>
        </div>
        <span className="rounded-full border border-line bg-surface-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
          Rigor
        </span>
      </div>

      <div className="surface-inset mt-5 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-subtle">
          Factor de conversión
        </p>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 font-mono text-sm text-ink">
          <span className="font-semibold">
            1 {fromUnit.symbol}
          </span>
          <span aria-hidden="true" className="text-subtle">
            =
          </span>
          <span className="text-gradient tabular text-base font-semibold">
            {formatNumber(factor, 10)}
          </span>
          <span className="font-semibold">{toUnit.symbol}</span>
        </div>
        <p className="mt-2 text-[11px] leading-5 text-muted">
          resultado = valor × factor aplicado
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-line bg-surface-muted px-3 py-2.5">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-subtle">
            Unidad base
          </dt>
          <dd className="mt-1 text-xs font-medium text-ink">
            {baseUnit.name}{' '}
            <span className="font-mono text-muted">({baseUnit.symbol})</span>
          </dd>
        </div>
        <div className="rounded-xl border border-line bg-surface-muted px-3 py-2.5">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-subtle">
            Precisión
          </dt>
          <dd className="tabular mt-1 text-xs font-medium text-ink">
            50 dígitos internos
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-[11px] leading-5 text-subtle">
        Cada unidad se convierte a la base de su categoría y luego a la unidad
        de destino, sin redondeos intermedios.
      </p>
    </aside>
  )
}
