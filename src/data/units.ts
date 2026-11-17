import Decimal from 'decimal.js'
import type { Category, CategoryId, Unit } from '../types'

// Alta precisión interna para que el redondeo ocurra únicamente al mostrar.
Decimal.set({ precision: 50, rounding: Decimal.ROUND_HALF_UP })

const METER = new Decimal('1')
const INCH = new Decimal('0.0254')
const FOOT = new Decimal('0.3048')
const YARD = new Decimal('0.9144')
const MILE = new Decimal('1609.344')
const KILOGRAM = new Decimal('1')
const POUND = new Decimal('0.45359237')
const TONNE = new Decimal('1000')

const SQUARE_INCH = INCH.pow(2)
const SQUARE_FOOT = FOOT.pow(2)
const CUBIC_INCH = INCH.pow(3)
const CUBIC_FOOT = FOOT.pow(3)

const KMH_IN_MPS = new Decimal(1000).div(3600)
const KMS_IN_MPS = new Decimal(1000)
const MH_IN_MPS = new Decimal(1).div(3600)
const MS_IN_MPS = new Decimal(1)
const MLH_IN_MPS = new Decimal('1609.344').div(3600)

const unit = (
  id: string,
  name: string,
  symbol: string,
  factor: Decimal,
): Unit => ({
  id,
  name,
  symbol,
  factor,
})

export const CATEGORIES: readonly Category[] = [
  {
    id: 'longitud',
    name: 'Longitud',
    description: 'Distancias y dimensiones lineales.',
    baseUnitId: 'm',
    allowsNegative: false,
    negativeMessage: 'La longitud no admite valores negativos.',
    units: [
      unit('m', 'Metro', 'm', METER),
      unit('cm', 'Centímetro', 'cm', new Decimal('0.01')),
      unit('mm', 'Milímetro', 'mm', new Decimal('0.001')),
      unit('km', 'Kilómetro', 'km', new Decimal('1000')),
      unit('in', 'Pulgada', 'in', INCH),
      unit('ft', 'Pie', 'ft', FOOT),
      unit('yd', 'Yarda', 'yd', YARD),
      unit('mi', 'Milla', 'mi', MILE),
    ],
  },
  {
    id: 'area',
    name: 'Área',
    description: 'Superficies y regiones planas.',
    baseUnitId: 'm2',
    allowsNegative: false,
    negativeMessage: 'El área no admite valores negativos.',
    units: [
      unit('m2', 'Metro cuadrado', 'm²', new Decimal('1')),
      unit('cm2', 'Centímetro cuadrado', 'cm²', new Decimal('0.0001')),
      unit('mm2', 'Milímetro cuadrado', 'mm²', new Decimal('0.000001')),
      unit('km2', 'Kilómetro cuadrado', 'km²', new Decimal('1000000')),
      unit('in2', 'Pulgada cuadrada', 'in²', SQUARE_INCH),
      unit('ft2', 'Pie cuadrado', 'ft²', SQUARE_FOOT),
    ],
  },
  {
    id: 'volumen',
    name: 'Volumen',
    description: 'Capacidad y espacio tridimensional.',
    baseUnitId: 'm3',
    allowsNegative: false,
    negativeMessage: 'El volumen no admite valores negativos.',
    units: [
      unit('m3', 'Metro cúbico', 'm³', new Decimal('1')),
      unit('cm3', 'Centímetro cúbico', 'cm³', new Decimal('0.000001')),
      unit('mm3', 'Milímetro cúbico', 'mm³', new Decimal('0.000000001')),
      unit('ft3', 'Pie cúbico', 'ft³', CUBIC_FOOT),
      unit('in3', 'Pulgada cúbica', 'in³', CUBIC_INCH),
    ],
  },
  {
    id: 'masa',
    name: 'Masa',
    description: 'Cantidad de materia y peso equivalente.',
    baseUnitId: 'kg',
    allowsNegative: false,
    negativeMessage: 'La masa no admite valores negativos.',
    units: [
      unit('t', 'Tonelada', 't', TONNE),
      unit('kg', 'Kilogramo', 'kg', KILOGRAM),
      unit('g', 'Gramo', 'g', new Decimal('0.001')),
      unit('lb', 'Libra', 'lb', POUND),
    ],
  },
  {
    id: 'velocidad',
    name: 'Velocidad',
    description: 'Rapidez y movimiento en el tiempo.',
    baseUnitId: 'ms',
    allowsNegative: true,
    negativeMessage: 'La velocidad admite valores negativos.',
    units: [
      unit('kmh', 'Kilómetro por hora', 'Km/h', KMH_IN_MPS),
      unit('kms', 'Kilómetro por segundo', 'Km/s', KMS_IN_MPS),
      unit('mh', 'Metro por hora', 'm/h', MH_IN_MPS),
      unit('ms', 'Metro por segundo', 'm/s', MS_IN_MPS),
      unit('mlh', 'Milla por hora', 'ml/h', MLH_IN_MPS),
    ],
  },
]

export const CATEGORY_IDS: readonly CategoryId[] = CATEGORIES.map(
  (category) => category.id,
)

export const DEFAULT_PAIRS: Record<
  CategoryId,
  { readonly from: string; readonly to: string }
> = {
  longitud: { from: 'm', to: 'ft' },
  area: { from: 'm2', to: 'ft2' },
  volumen: { from: 'm3', to: 'ft3' },
  masa: { from: 'kg', to: 'lb' },
  velocidad: { from: 'kmh', to: 'ms' },
}

const CATEGORY_MAP = new Map<CategoryId, Category>(
  CATEGORIES.map((category) => [category.id, category]),
)

export function isCategoryId(value: string): value is CategoryId {
  return CATEGORY_IDS.includes(value as CategoryId)
}

export function getCategory(categoryId: CategoryId): Category {
  const category = CATEGORY_MAP.get(categoryId)
  if (!category) {
    throw new Error(`Categoría desconocida: ${categoryId}`)
  }
  return category
}

export function getUnit(category: Category, unitId: string): Unit {
  const found = category.units.find((candidate) => candidate.id === unitId)
  if (!found) {
    throw new Error(
      `Unidad desconocida en ${category.name}: ${unitId}`,
    )
  }
  return found
}
