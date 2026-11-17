import { ChevronDown } from 'lucide-react'
import type { Unit } from '../types'

interface UnitSelectProps {
  id: string
  label: string
  value: string
  units: readonly Unit[]
  onChange: (unitId: string) => void
}

export function UnitSelect({
  id,
  label,
  value,
  units,
  onChange,
}: UnitSelectProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="field-control appearance-none px-4 py-3.5 pr-11 text-sm font-medium"
        >
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.name} ({unit.symbol})
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-subtle"
        />
      </div>
    </div>
  )
}
