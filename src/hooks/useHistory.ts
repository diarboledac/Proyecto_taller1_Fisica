import { useCallback, useState } from 'react'
import { getCategory, isCategoryId } from '../data/units'
import type { HistoryEntry } from '../types'

const STORAGE_KEY = 'conversor-history-v1'
const MAX_ENTRIES = 5

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const entry = value as Record<string, unknown>
  if (
    typeof entry.id !== 'string' ||
    typeof entry.categoryId !== 'string' ||
    typeof entry.fromUnitId !== 'string' ||
    typeof entry.toUnitId !== 'string' ||
    typeof entry.input !== 'string' ||
    typeof entry.result !== 'string' ||
    typeof entry.timestamp !== 'number' ||
    !Number.isFinite(entry.timestamp) ||
    !isCategoryId(entry.categoryId)
  ) {
    return false
  }

  const category = getCategory(entry.categoryId)
  return (
    category.units.some((unit) => unit.id === entry.fromUnitId) &&
    category.units.some((unit) => unit.id === entry.toUnitId)
  )
}

function loadEntries(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return []
    }
    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter(isHistoryEntry).slice(0, MAX_ENTRIES)
  } catch {
    return []
  }
}

function persistEntries(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // El historial es una mejora progresiva: si el almacenamiento falla,
    // la conversión sigue funcionando en memoria.
  }
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(loadEntries)

  const addEntry = useCallback((entry: HistoryEntry) => {
    setEntries((previous) => {
      const withoutDuplicate = previous.filter(
        (item) =>
          !(
            item.categoryId === entry.categoryId &&
            item.fromUnitId === entry.fromUnitId &&
            item.toUnitId === entry.toUnitId &&
            item.input === entry.input
          ),
      )
      const next = [entry, ...withoutDuplicate].slice(0, MAX_ENTRIES)
      persistEntries(next)
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    setEntries([])
    persistEntries([])
  }, [])

  return { entries, addEntry, clearHistory }
}
