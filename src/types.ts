import type Decimal from 'decimal.js'

export type CategoryId =
  | 'longitud'
  | 'area'
  | 'volumen'
  | 'masa'
  | 'velocidad'

export type Theme = 'dark' | 'light'

export interface Unit {
  readonly id: string
  readonly name: string
  readonly symbol: string
  /** Factor exacto hacia la unidad base de la categoría. */
  readonly factor: Decimal
}

export interface Category {
  readonly id: CategoryId
  readonly name: string
  readonly description: string
  readonly baseUnitId: string
  readonly allowsNegative: boolean
  readonly negativeMessage: string
  readonly units: readonly Unit[]
}

export interface HistoryEntry {
  readonly id: string
  readonly categoryId: CategoryId
  readonly fromUnitId: string
  readonly toUnitId: string
  readonly input: string
  readonly result: string
  readonly timestamp: number
}

export interface InputEvaluation {
  readonly value: Decimal | null
  readonly error: string | null
  readonly isEmpty: boolean
}
