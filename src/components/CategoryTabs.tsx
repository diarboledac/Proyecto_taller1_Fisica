import {
  Box,
  Gauge,
  Ruler,
  Scale,
  Square,
  type LucideIcon,
} from 'lucide-react'
import { CATEGORIES } from '../data/units'
import type { CategoryId } from '../types'

const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  longitud: Ruler,
  area: Square,
  volumen: Box,
  masa: Scale,
  velocidad: Gauge,
}

interface CategoryTabsProps {
  activeCategory: CategoryId
  onChange: (categoryId: CategoryId) => void
}

export function CategoryTabs({
  activeCategory,
  onChange,
}: CategoryTabsProps) {
  return (
    <nav aria-label="Categorías de conversión">
      <h2 className="sr-only">Selecciona una categoría</h2>
      <div className="surface-card grid grid-cols-5 gap-1 p-1.5 sm:flex sm:overflow-x-auto">
        {CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category.id]
          const isActive = category.id === activeCategory

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(category.id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`${category.name}, ${category.units.length} unidades`}
              className={[
                'group flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2.5 text-[10px] font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 sm:min-w-[122px] sm:flex-1 sm:flex-row sm:gap-2 sm:px-3 sm:py-3 sm:text-sm',
                isActive
                  ? 'bg-surface-solid text-ink shadow-sm ring-1 ring-line-strong'
                  : 'text-muted hover:bg-surface-muted hover:text-ink',
              ].join(' ')}
            >
              <Icon
                aria-hidden="true"
                className={[
                  'size-4 shrink-0 transition',
                  isActive
                    ? 'text-accent'
                    : 'text-subtle group-hover:text-accent',
                ].join(' ')}
                strokeWidth={isActive ? 2.2 : 1.9}
              />
              <span className="whitespace-nowrap">{category.name}</span>
              <span
                className={[
                  'tabular hidden rounded-md px-1.5 py-0.5 text-[10px] font-semibold sm:inline',
                  isActive
                    ? 'bg-accent-soft text-accent'
                    : 'bg-page/70 text-subtle',
                ].join(' ')}
              >
                {category.units.length}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
