import type Decimal from 'decimal.js'
import {
  AlertTriangle,
  ArrowLeftRight,
  Calculator,
  Check,
  Copy,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Category, Unit } from '../types'
import { UnitSelect } from './UnitSelect'

interface ConversionCardProps {
  category: Category
  fromUnit: Unit
  toUnit: Unit
  rawValue: string
  onChangeValue: (value: string) => void
  onFromChange: (unitId: string) => void
  onToChange: (unitId: string) => void
  onSwap: () => void
  onConvert: () => void
  result: Decimal | null
  formattedResult: string
  error: string | null
  pulseKey: number
}

type CopyStatus = 'idle' | 'copied' | 'error'

async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      // Se intenta el mecanismo clásico como respaldo.
    }
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  document.body.removeChild(textarea)

  if (!copied) {
    throw new Error('No fue posible copiar el resultado.')
  }
}

export function ConversionCard({
  category,
  fromUnit,
  toUnit,
  rawValue,
  onChangeValue,
  onFromChange,
  onToChange,
  onSwap,
  onConvert,
  result,
  formattedResult,
  error,
  pulseKey,
}: ConversionCardProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle')
  const resetTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimer.current !== null) {
        window.clearTimeout(resetTimer.current)
      }
    }
  }, [])

  const scheduleReset = (delay: number) => {
    if (resetTimer.current !== null) {
      window.clearTimeout(resetTimer.current)
    }
    resetTimer.current = window.setTimeout(() => {
      setCopyStatus('idle')
    }, delay)
  }

  const handleCopy = async () => {
    if (!result) {
      return
    }

    try {
      await copyToClipboard(`${formattedResult} ${toUnit.symbol}`)
      setCopyStatus('copied')
      scheduleReset(2000)
    } catch {
      setCopyStatus('error')
      scheduleReset(2600)
    }
  }

  const copyLabel =
    copyStatus === 'copied'
      ? 'Copiado'
      : copyStatus === 'error'
        ? 'No se pudo'
        : 'Copiar'

  return (
    <section
      aria-labelledby="conversion-title"
      className="surface-card animate-rise relative overflow-hidden p-5 sm:p-7 lg:p-8"
      style={{ animationDelay: '80ms' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-24 size-56 rounded-full bg-cyan-400/10 blur-3xl"
      />
      <div className="relative">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
              Panel de conversión
            </p>
            <h2
              id="conversion-title"
              className="mt-1.5 text-xl font-semibold tracking-[-0.025em] text-ink sm:text-2xl"
            >
              {category.name}
            </h2>
            <p className="mt-1 text-sm text-muted">{category.description}</p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-surface-muted px-3 py-1.5 text-[11px] font-semibold text-muted">
            <span className="size-1.5 rounded-full bg-accent" />
            {category.units.length} unidades
          </span>
        </div>

        <form
          className="mt-6"
          onSubmit={(event) => {
            event.preventDefault()
            onConvert()
          }}
        >
          <div>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <label
                htmlFor="value-input"
                className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted"
              >
                Valor a convertir
              </label>
              <span className="text-[11px] font-medium text-subtle">
                Acepta punto o coma decimal
              </span>
            </div>

            <div
              className="field-control relative mt-2 px-4 py-3.5 sm:px-5 sm:py-4"
              data-invalid={error ? 'true' : undefined}
            >
              <input
                id="value-input"
                type="text"
                inputMode="decimal"
                enterKeyHint="done"
                autoComplete="off"
                spellCheck={false}
                value={rawValue}
                onChange={(event) => onChangeValue(event.target.value)}
                placeholder="0.00"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'value-error' : 'value-hint'}
                className="tabular w-full bg-transparent pr-20 font-mono text-4xl font-medium tracking-[-0.04em] text-ink outline-none placeholder:text-subtle/50 sm:text-5xl"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded-lg border border-line bg-surface px-2.5 py-1 font-mono text-xs font-semibold text-muted sm:right-5">
                {fromUnit.symbol}
              </span>
            </div>
            <p id="value-hint" className="mt-2 text-[11px] text-subtle">
              El resultado se recalcula mientras escribes.
            </p>

            {error && (
              <div
                id="value-error"
                role="alert"
                className="mt-3 flex items-start gap-3 rounded-xl border border-danger-line bg-danger-soft px-3.5 py-3 text-danger"
              >
                <AlertTriangle
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0"
                />
                <div>
                  <p className="text-sm font-medium">{error}</p>
                  <p className="mt-0.5 text-xs text-danger/80">
                    Ajusta el valor para continuar con la conversión.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
            <UnitSelect
              id="from-unit"
              label="Unidad de origen"
              value={fromUnit.id}
              units={category.units}
              onChange={onFromChange}
            />

            <button
              type="button"
              onClick={onSwap}
              aria-label="Intercambiar unidades de origen y destino"
              title="Intercambiar unidades"
              className="group mx-auto flex size-11 items-center justify-center rounded-full border border-line bg-surface-solid text-muted shadow-sm transition hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 sm:mb-1"
            >
              <ArrowLeftRight
                aria-hidden="true"
                className="size-4 transition-transform duration-500 group-hover:rotate-180"
              />
            </button>

            <UnitSelect
              id="to-unit"
              label="Unidad de destino"
              value={toUnit.id}
              units={category.units}
              onChange={onToChange}
            />
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={!result}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-page active:scale-[0.985] disabled:opacity-40 disabled:shadow-none dark:from-cyan-300 dark:to-sky-400 dark:text-slate-950 dark:shadow-cyan-400/10"
            >
              <Calculator aria-hidden="true" className="size-4" />
              Convertir
              <kbd className="ml-1 hidden rounded border border-current/20 px-1.5 py-0.5 text-[10px] font-medium opacity-60 sm:inline">
                Enter
              </kbd>
            </button>
            <p className="text-[11px] leading-5 text-subtle">
              Pulsa Convertir para guardar esta conversión en el historial.
            </p>
          </div>
        </form>

        <div className="relative mt-6 overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-accent-soft via-surface-muted to-violet-soft p-5 sm:p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-12 size-48 rounded-full bg-cyan-400/10 blur-3xl"
          />
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="animate-live-dot size-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Resultado
                </span>
              </div>
              <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                En vivo
              </span>
            </div>

            <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0" aria-live="polite">
                <div
                  key={pulseKey}
                  className="animate-result flex flex-wrap items-baseline gap-x-3 gap-y-1"
                >
                  <span
                    className={[
                      'tabular text-4xl font-semibold tracking-[-0.055em] sm:text-5xl',
                      result ? 'text-gradient' : 'text-subtle',
                    ].join(' ')}
                  >
                    {result ? formattedResult : '—'}
                  </span>
                  <span className="font-mono text-lg font-semibold text-muted">
                    {toUnit.symbol}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted">
                  {result
                    ? `${fromUnit.name} → ${toUnit.name}`
                    : error
                      ? 'Corrige el valor para ver el resultado.'
                      : 'Escribe un valor para ver la conversión.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                disabled={!result}
                aria-label="Copiar resultado"
                className={[
                  'inline-flex min-w-[112px] shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-40',
                  copyStatus === 'copied'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : copyStatus === 'error'
                      ? 'border-danger-line bg-danger-soft text-danger'
                      : 'border-line bg-surface text-ink hover:border-accent/40 hover:text-accent',
                ].join(' ')}
              >
                {copyStatus === 'copied' ? (
                  <Check aria-hidden="true" className="size-4" />
                ) : (
                  <Copy aria-hidden="true" className="size-4" />
                )}
                {copyLabel}
              </button>
            </div>
            <span className="sr-only" role="status">
              {copyStatus === 'copied'
                ? 'Resultado copiado al portapapeles.'
                : copyStatus === 'error'
                  ? 'No se pudo copiar el resultado.'
                  : ''}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
