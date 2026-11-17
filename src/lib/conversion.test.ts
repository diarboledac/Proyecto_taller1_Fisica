import Decimal from 'decimal.js'
import { describe, expect, it } from 'vitest'
import {
  CATEGORIES,
  CATEGORY_IDS,
  getCategory,
  getUnit,
} from '../data/units'
import {
  conversionFactor,
  convertValue,
  evaluateInput,
  formatNumber,
  getEquivalences,
  normalizeNumberInput,
} from './conversion'
import type { CategoryId } from '../types'

function convert(
  value: string,
  categoryId: CategoryId,
  fromUnitId: string,
  toUnitId: string,
): Decimal {
  return convertValue(
    new Decimal(value),
    getCategory(categoryId),
    fromUnitId,
    toUnitId,
  )
}

function expectExact(actual: Decimal, expected: string): void {
  expect(actual.toString()).toBe(new Decimal(expected).toString())
}

function expectRounded(
  actual: Decimal,
  expected: string,
  decimalPlaces = 10,
): void {
  expect(actual.toDecimalPlaces(decimalPlaces).toString()).toBe(
    new Decimal(expected).toDecimalPlaces(decimalPlaces).toString(),
  )
}

describe('inventario de categorías y unidades', () => {
  it('contiene exactamente las cinco categorías obligatorias', () => {
    expect(CATEGORIES.map((category) => category.id)).toEqual([
      'longitud',
      'area',
      'volumen',
      'masa',
      'velocidad',
    ])
  })

  it('contiene exclusivamente las unidades solicitadas', () => {
    const expected: Record<CategoryId, string[]> = {
      longitud: ['m', 'cm', 'mm', 'km', 'in', 'ft', 'yd', 'mi'],
      area: ['m2', 'cm2', 'mm2', 'km2', 'in2', 'ft2'],
      volumen: ['m3', 'cm3', 'mm3', 'ft3', 'in3'],
      masa: ['t', 'kg', 'g', 'lb'],
      velocidad: ['kmh', 'kms', 'mh', 'ms', 'mlh'],
    }

    for (const categoryId of CATEGORY_IDS) {
      expect(
        getCategory(categoryId).units.map((unit) => unit.id),
      ).toEqual(expected[categoryId])
    }
  })

  it('respeta los símbolos obligatorios de velocidad', () => {
    expect(
      getCategory('velocidad').units.map((unit) => unit.symbol),
    ).toEqual(['Km/h', 'Km/s', 'm/h', 'm/s', 'ml/h'])
  })

  it('usa una unidad base con factor 1 en cada categoría', () => {
    for (const category of CATEGORIES) {
      expect(
        getUnit(category, category.baseUnitId).factor.equals(1),
      ).toBe(true)
    }
  })

  it('define los factores internacionales exactos', () => {
    expectExact(getUnit(getCategory('longitud'), 'in').factor, '0.0254')
    expectExact(getUnit(getCategory('longitud'), 'ft').factor, '0.3048')
    expectExact(getUnit(getCategory('longitud'), 'yd').factor, '0.9144')
    expectExact(getUnit(getCategory('longitud'), 'mi').factor, '1609.344')
    expectExact(getUnit(getCategory('masa'), 'lb').factor, '0.45359237')
    expectExact(getUnit(getCategory('masa'), 't').factor, '1000')
  })
})

describe('conversiones de longitud', () => {
  it('convierte pulgadas a centímetros exactamente', () => {
    expectExact(convert('1', 'longitud', 'in', 'cm'), '2.54')
  })

  it('convierte millas a kilómetros exactamente', () => {
    expectExact(convert('1', 'longitud', 'mi', 'km'), '1.609344')
  })

  it('convierte yardas a pies exactamente', () => {
    expectExact(convert('1', 'longitud', 'yd', 'ft'), '3')
  })

  it('convierte un metro a pies sin artefactos flotantes', () => {
    expectRounded(convert('1', 'longitud', 'm', 'ft'), '3.280839895')
  })
})

describe('conversiones de área', () => {
  it('convierte metros cuadrados a centímetros cuadrados', () => {
    expectExact(convert('1', 'area', 'm2', 'cm2'), '10000')
  })

  it('convierte pies cuadrados a pulgadas cuadradas', () => {
    expectExact(convert('1', 'area', 'ft2', 'in2'), '144')
  })

  it('convierte kilómetros cuadrados a metros cuadrados', () => {
    expectExact(convert('1', 'area', 'km2', 'm2'), '1000000')
  })

  it('convierte pulgadas cuadradas a centímetros cuadrados', () => {
    expectExact(convert('1', 'area', 'in2', 'cm2'), '6.4516')
  })
})

describe('conversiones de volumen', () => {
  it('convierte metros cúbicos a centímetros cúbicos', () => {
    expectExact(convert('1', 'volumen', 'm3', 'cm3'), '1000000')
  })

  it('convierte pies cúbicos a pulgadas cúbicas', () => {
    expectExact(convert('1', 'volumen', 'ft3', 'in3'), '1728')
  })

  it('convierte centímetros cúbicos a milímetros cúbicos', () => {
    expectExact(convert('1', 'volumen', 'cm3', 'mm3'), '1000')
  })

  it('convierte metros cúbicos a pies cúbicos', () => {
    expectRounded(convert('1', 'volumen', 'm3', 'ft3'), '35.3146667215')
  })
})

describe('conversiones de masa', () => {
  it('convierte toneladas a kilogramos', () => {
    expectExact(convert('1', 'masa', 't', 'kg'), '1000')
  })

  it('convierte libras a kilogramos exactamente', () => {
    expectExact(convert('1', 'masa', 'lb', 'kg'), '0.45359237')
  })

  it('convierte kilogramos a libras con precisión decimal', () => {
    expectRounded(
      convert('1', 'masa', 'kg', 'lb'),
      '2.2046226218',
    )
  })

  it('convierte gramos a kilogramos', () => {
    expectExact(convert('250', 'masa', 'g', 'kg'), '0.25')
  })
})

describe('conversiones de velocidad', () => {
  it('convierte 100 Km/h a m/s', () => {
    expectRounded(
      convert('100', 'velocidad', 'kmh', 'ms'),
      '27.7777777778',
    )
  })

  it('convierte metros por segundo a kilómetros por hora', () => {
    expectExact(convert('10', 'velocidad', 'ms', 'kmh'), '36')
  })

  it('admite velocidades negativas', () => {
    expect(formatNumber(convert('-36', 'velocidad', 'kmh', 'ms'))).toBe(
      '-10',
    )
  })

  it('convierte millas por hora a m/s exactamente', () => {
    expectExact(convert('1', 'velocidad', 'mlh', 'ms'), '0.44704')
  })

  it('convierte kilómetros por segundo a Km/h', () => {
    expectExact(convert('1', 'velocidad', 'kms', 'kmh'), '3600')
  })
})

describe('validación de entradas', () => {
  it('acepta coma y punto como separador decimal', () => {
    expect(normalizeNumberInput('2,5')).toBe('2.5')
    expect(normalizeNumberInput(' 2.5 ')).toBe('2.5')
    expect(evaluateInput('2,5', getCategory('longitud')).value?.toString()).toBe(
      '2.5',
    )
  })

  it('trata el campo vacío como un estado neutral', () => {
    const evaluation = evaluateInput('   ', getCategory('longitud'))
    expect(evaluation.isEmpty).toBe(true)
    expect(evaluation.error).toBeNull()
    expect(evaluation.value).toBeNull()
  })

  it('rechaza texto y formatos numéricos ambiguos', () => {
    for (const invalid of ['abc', '1,2,3', '1.2.3', 'Infinity']) {
      const evaluation = evaluateInput(invalid, getCategory('longitud'))
      expect(evaluation.value).toBeNull()
      expect(evaluation.error).not.toBeNull()
    }
  })

  it.each(['longitud', 'area', 'volumen', 'masa'] as CategoryId[])(
    'rechaza valores negativos en %s',
    (categoryId) => {
      const evaluation = evaluateInput('-5', getCategory(categoryId))
      expect(evaluation.value).toBeNull()
      expect(evaluation.error).toBe(
        getCategory(categoryId).negativeMessage,
      )
    },
  )

  it('permite valores negativos en velocidad', () => {
    const evaluation = evaluateInput('-5', getCategory('velocidad'))
    expect(evaluation.error).toBeNull()
    expect(evaluation.value?.toString()).toBe('-5')
  })
})

describe('formato y utilidades', () => {
  it('formatea sin artefactos de punto flotante', () => {
    expect(formatNumber(new Decimal('0.1').plus('0.2'))).toBe('0.3')
  })

  it('usa notación científica solo en magnitudes extremas', () => {
    expect(formatNumber(new Decimal('1234567890123'))).toBe(
      '1.23456789e+12',
    )
    expect(formatNumber(new Decimal('0.0000000001'))).toBe('1e-10')
    expect(formatNumber(new Decimal('0.00000001'))).toBe('0.00000001')
  })

  it('calcula el factor de conversión aplicado a la fórmula', () => {
    expect(
      formatNumber(
        conversionFactor(getCategory('velocidad'), 'kmh', 'ms'),
        10,
      ),
    ).toBe('0.2777777778')
  })

  it('genera equivalencias para todas las unidades de la categoría', () => {
    const equivalences = getEquivalences(
      new Decimal('1'),
      getCategory('longitud'),
      'm',
    )
    expect(equivalences).toHaveLength(8)
    expect(
      equivalences.find((item) => item.unit.id === 'cm')?.value.toString(),
    ).toBe('100')
    expect(
      equivalences.find((item) => item.unit.id === 'ft')?.value
        .toDecimalPlaces(10)
        .toString(),
    ).toBe('3.280839895')
  })
})
