import Decimal from 'decimal.js'
import { getUnit } from '../data/units'
import type { Category, InputEvaluation, Unit } from '../types'

const NUMBER_PATTERN =
  /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/

const SCIENTIFIC_UPPER = new Decimal('1e12')
const SCIENTIFIC_LOWER = new Decimal('1e-9')

export interface Equivalence {
  readonly unit: Unit
  readonly value: Decimal
}

/**
 * Normaliza la entrada del usuario: acepta coma o punto decimal.
 * No se admiten separadores de miles para evitar ambigüedad.
 */
export function normalizeNumberInput(raw: string): string {
  return raw.trim().replace(/,/g, '.')
}

/**
 * Valida el texto ingresado y lo convierte a Decimal.
 * Devuelve un estado vacío cuando el campo no contiene nada.
 */
export function evaluateInput(
  raw: string,
  category: Category,
): InputEvaluation {
  if (!raw.trim()) {
    return { value: null, error: null, isEmpty: true }
  }

  const normalized = normalizeNumberInput(raw)
  if (!NUMBER_PATTERN.test(normalized)) {
    return {
      value: null,
      error: 'Ingresa un número válido. Usa punto o coma como separador decimal.',
      isEmpty: false,
    }
  }

  let value: Decimal
  try {
    value = new Decimal(normalized)
  } catch {
    return {
      value: null,
      error: 'No fue posible interpretar el valor ingresado.',
      isEmpty: false,
    }
  }

  if (!value.isFinite()) {
    return {
      value: null,
      error: 'El número es demasiado grande para calcularlo.',
      isEmpty: false,
    }
  }

  if (value.lt(0) && !category.allowsNegative) {
    return {
      value: null,
      error: category.negativeMessage,
      isEmpty: false,
    }
  }

  return { value, error: null, isEmpty: false }
}

/**
 * Convierte mediante la unidad base de la categoría:
 * valor × factorOrigen ÷ factorDestino.
 */
export function convertValue(
  value: Decimal,
  category: Category,
  fromUnitId: string,
  toUnitId: string,
): Decimal {
  const source = getUnit(category, fromUnitId)
  const target = getUnit(category, toUnitId)
  return value.times(source.factor).div(target.factor)
}

/** Factor que transforma una unidad de origen en una de destino. */
export function conversionFactor(
  category: Category,
  fromUnitId: string,
  toUnitId: string,
): Decimal {
  return convertValue(new Decimal(1), category, fromUnitId, toUnitId)
}

/** Convierte un valor a todas las unidades de la categoría. */
export function getEquivalences(
  value: Decimal,
  category: Category,
  fromUnitId: string,
): Equivalence[] {
  return category.units.map((unit) => ({
    unit,
    value: convertValue(value, category, fromUnitId, unit.id),
  }))
}

function trimExponential(value: string): string {
  const [mantissa = '0', exponent = '0'] = value.split('e')
  const trimmedMantissa = mantissa
    .replace(/0+$/, '')
    .replace(/\.$/, '')
  return `${trimmedMantissa}e${exponent}`
}

/**
 * Formatea magnitudes con cifras significativas, sin ceros sobrantes.
 * Solo usa notación científica para valores extremos.
 */
export function formatNumber(
  value: Decimal,
  significantDigits = 10,
): string {
  if (!value.isFinite() || value.isNaN()) {
    return '—'
  }
  if (value.isZero()) {
    return '0'
  }

  const magnitude = value.abs()
  if (
    magnitude.gte(SCIENTIFIC_UPPER) ||
    magnitude.lt(SCIENTIFIC_LOWER)
  ) {
    return trimExponential(
      value.toExponential(Math.max(0, significantDigits - 1)),
    )
  }

  const rounded = value.toSignificantDigits(significantDigits)
  let text = rounded.toFixed()

  if (text.includes('.')) {
    text = text.replace(/0+$/, '').replace(/\.$/, '')
  }

  return text === '-0' ? '0' : text
}
