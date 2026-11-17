import { useCallback, useMemo, useState } from 'react'
import { CategoryTabs } from './components/CategoryTabs'
import { ConversionCard } from './components/ConversionCard'
import { EquivalencesCard } from './components/EquivalencesCard'
import { Footer } from './components/Footer'
import { FormulaCard } from './components/FormulaCard'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HistoryPanel } from './components/HistoryPanel'
import { DEFAULT_PAIRS, getCategory, getUnit } from './data/units'
import { useHistory } from './hooks/useHistory'
import { useTheme } from './hooks/useTheme'
import {
  convertValue,
  evaluateInput,
  formatNumber,
} from './lib/conversion'
import type { CategoryId, HistoryEntry } from './types'

function createHistoryId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function App() {
  const { theme, toggleTheme } = useTheme()
  const { entries, addEntry, clearHistory } = useHistory()

  const [categoryId, setCategoryId] = useState<CategoryId>('longitud')
  const [fromUnitId, setFromUnitId] = useState(
    DEFAULT_PAIRS.longitud.from,
  )
  const [toUnitId, setToUnitId] = useState(DEFAULT_PAIRS.longitud.to)
  const [rawValue, setRawValue] = useState('1')
  const [pulseKey, setPulseKey] = useState(0)

  const category = getCategory(categoryId)
  const fromUnit = getUnit(category, fromUnitId)
  const toUnit = getUnit(category, toUnitId)

  const evaluation = useMemo(
    () => evaluateInput(rawValue, category),
    [rawValue, category],
  )

  const result = useMemo(
    () =>
      evaluation.value
        ? convertValue(evaluation.value, category, fromUnitId, toUnitId)
        : null,
    [category, evaluation.value, fromUnitId, toUnitId],
  )

  const formattedResult = result ? formatNumber(result) : '—'

  const handleCategoryChange = useCallback((nextCategoryId: CategoryId) => {
    const pair = DEFAULT_PAIRS[nextCategoryId]
    setCategoryId(nextCategoryId)
    setFromUnitId(pair.from)
    setToUnitId(pair.to)
  }, [])

  const handleSwap = useCallback(() => {
    setFromUnitId(toUnitId)
    setToUnitId(fromUnitId)
  }, [fromUnitId, toUnitId])

  const handleConvert = useCallback(() => {
    if (!evaluation.value || !result) {
      return
    }

    const entry: HistoryEntry = {
      id: createHistoryId(),
      categoryId,
      fromUnitId,
      toUnitId,
      input: rawValue.trim(),
      result: formatNumber(result),
      timestamp: Date.now(),
    }

    addEntry(entry)
    setPulseKey((current) => current + 1)
  }, [
    addEntry,
    categoryId,
    evaluation.value,
    fromUnitId,
    rawValue,
    result,
    toUnitId,
  ])

  const handleHistorySelect = useCallback((entry: HistoryEntry) => {
    setCategoryId(entry.categoryId)
    setFromUnitId(entry.fromUnitId)
    setToUnitId(entry.toUnitId)
    setRawValue(entry.input)
    setPulseKey((current) => current + 1)

    requestAnimationFrame(() => {
      const panel = document.getElementById('conversion-panel')
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      panel?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    })
  }, [])

  return (
    <div className="app-shell">
      <a
        href="#conversion-panel"
        className="sr-only z-50 rounded-lg bg-surface-solid px-4 py-2 text-sm font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Ir al conversor
      </a>

      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="mx-auto w-full max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <Hero />

        <div
          className="animate-rise mt-7 sm:mt-8"
          style={{ animationDelay: '60ms' }}
        >
          <CategoryTabs
            activeCategory={categoryId}
            onChange={handleCategoryChange}
          />
        </div>

        <div
          id="conversion-panel"
          className="mt-5 grid scroll-mt-24 gap-5 lg:grid-cols-[minmax(0,1.58fr)_minmax(320px,0.82fr)]"
        >
          <ConversionCard
            category={category}
            fromUnit={fromUnit}
            toUnit={toUnit}
            rawValue={rawValue}
            onChangeValue={setRawValue}
            onFromChange={setFromUnitId}
            onToChange={setToUnitId}
            onSwap={handleSwap}
            onConvert={handleConvert}
            result={result}
            formattedResult={formattedResult}
            error={evaluation.error}
            pulseKey={pulseKey}
          />

          <div className="flex flex-col gap-5">
            <FormulaCard
              category={category}
              fromUnit={fromUnit}
              toUnit={toUnit}
            />
            <HistoryPanel
              entries={entries}
              onClear={clearHistory}
              onSelect={handleHistorySelect}
            />
          </div>
        </div>

        <EquivalencesCard
          category={category}
          fromUnit={fromUnit}
          toUnit={toUnit}
          value={evaluation.value}
          onSelectTarget={setToUnitId}
        />
      </main>

      <Footer />
    </div>
  )
}

export default App
