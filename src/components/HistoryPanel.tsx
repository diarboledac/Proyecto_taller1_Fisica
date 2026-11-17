import {
  ArrowUpRight,
  History as HistoryIcon,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import { getCategory, getUnit } from '../data/units'
import type { HistoryEntry } from '../types'

interface HistoryPanelProps {
  entries: HistoryEntry[]
  onClear: () => void
  onSelect: (entry: HistoryEntry) => void
}

const TIME_FORMATTER = new Intl.DateTimeFormat('es', {
  hour: '2-digit',
  minute: '2-digit',
})

export function HistoryPanel({
  entries,
  onClear,
  onSelect,
}: HistoryPanelProps) {
  return (
    <section
      aria-labelledby="history-title"
      className="surface-card animate-rise p-5 sm:p-6"
      style={{ animationDelay: '220ms' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl border border-line bg-violet-soft text-indigo-500 dark:text-indigo-300">
            <HistoryIcon aria-hidden="true" className="size-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2
                id="history-title"
                className="text-sm font-semibold tracking-[-0.01em] text-ink"
              >
                Historial reciente
              </h2>
              <span className="tabular rounded-full border border-line bg-surface-muted px-2 py-0.5 text-[10px] font-semibold text-muted">
                {entries.length}/5
              </span>
            </div>
            <p className="text-[11px] text-subtle">
              Tus últimas conversiones guardadas
            </p>
          </div>
        </div>

        {entries.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Borrar todo el historial"
            title="Borrar historial"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-subtle transition hover:bg-danger-soft hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/30"
          >
            <Trash2 aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="mt-5 flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface-muted/50 px-4 py-7 text-center">
          <HistoryIcon
            aria-hidden="true"
            className="size-6 text-subtle"
            strokeWidth={1.5}
          />
          <p className="mt-2 text-xs font-medium text-muted">
            Aún no hay conversiones guardadas.
          </p>
          <p className="mt-1 max-w-[220px] text-[11px] leading-5 text-subtle">
            Pulsa Convertir para registrar la primera.
          </p>
        </div>
      ) : (
        <ol className="mt-5 space-y-2">
          {entries.map((entry) => {
            const category = getCategory(entry.categoryId)
            const source = getUnit(category, entry.fromUnitId)
            const target = getUnit(category, entry.toUnitId)

            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => onSelect(entry)}
                  aria-label={`Restaurar conversión: ${entry.input} ${source.symbol} a ${entry.result} ${target.symbol}`}
                  className="group w-full rounded-xl border border-line bg-surface-muted/65 p-3 text-left transition hover:border-accent/30 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                      {category.name}
                    </span>
                    <time
                      dateTime={new Date(entry.timestamp).toISOString()}
                      className="tabular text-[10px] text-subtle"
                    >
                      {TIME_FORMATTER.format(entry.timestamp)}
                    </time>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="tabular min-w-0 break-words font-mono text-[11px] leading-5 text-muted sm:text-xs">
                      <span className="font-semibold text-ink">
                        {entry.input} {source.symbol}
                      </span>
                      <span className="px-1.5 text-subtle">→</span>
                      <span className="font-semibold text-ink">
                        {entry.result} {target.symbol}
                      </span>
                    </p>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3.5 shrink-0 text-subtle transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    />
                  </div>
                </button>
              </li>
            )
          })}
        </ol>
      )}

      <p className="mt-4 flex items-start gap-1.5 text-[10px] leading-4 text-subtle">
        <ShieldCheck
          aria-hidden="true"
          className="mt-0.5 size-3 shrink-0 text-emerald-600 dark:text-emerald-400"
        />
        Guardado solo en este navegador. Toca una entrada para recuperarla.
      </p>
    </section>
  )
}
