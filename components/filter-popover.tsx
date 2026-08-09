"use client"

import { useEffect, useRef, useState } from "react"
import { SlidersHorizontal, Check, X, ArrowUpDown } from "lucide-react"

export type FilterOption = { value: string; label: string }
export type FilterGroup = { key: string; label: string; options: FilterOption[] }

export function FilterPopover({
  groups,
  selected,
  onChange,
  sortOptions,
  sort,
  onSortChange,
  defaultSort = "",
  ariaLabel = "Filter",
}: {
  groups: FilterGroup[]
  selected: Record<string, string[]>
  onChange: (next: Record<string, string[]>) => void
  sortOptions?: FilterOption[]
  sort?: string
  onSortChange?: (value: string) => void
  defaultSort?: string
  ariaLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDoc)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const sortActive = Boolean(sortOptions && sort && sort !== defaultSort)
  const activeCount =
    Object.values(selected).reduce((sum, arr) => sum + arr.length, 0) + (sortActive ? 1 : 0)

  function toggle(groupKey: string, value: string) {
    const current = selected[groupKey] ?? []
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onChange({ ...selected, [groupKey]: next })
  }

  function clearAll() {
    const cleared: Record<string, string[]> = {}
    for (const g of groups) cleared[g.key] = []
    onChange(cleared)
    if (onSortChange) onSortChange(defaultSort)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`relative flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors ${
          activeCount > 0
            ? "border-primary bg-primary/10 text-primary"
            : "border-input bg-background text-muted-foreground hover:bg-secondary"
        }`}
      >
        <SlidersHorizontal className="size-4" />
        {activeCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-30 w-64 rounded-lg border border-border bg-popover p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Filters</span>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <X className="size-3" />
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {sortOptions && sortOptions.length > 0 && onSortChange && (
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <ArrowUpDown className="size-3.5 text-muted-foreground" />
                  Sort by
                </p>
                <div className="flex flex-col gap-0.5">
                  {sortOptions.map((opt) => {
                    const active = (sort ?? defaultSort) === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => onSortChange(opt.value)}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-foreground transition-colors hover:bg-secondary"
                      >
                        <span
                          className={`flex size-4 items-center justify-center rounded-full border ${
                            active ? "border-primary" : "border-input"
                          }`}
                        >
                          {active && <span className="size-2 rounded-full bg-primary" />}
                        </span>
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
                {groups.length > 0 && <div className="mt-3 h-px bg-border" />}
              </div>
            )}
            {groups.map((group) => (
              <div key={group.key}>
                <p className="mb-1.5 text-xs font-medium text-foreground">{group.label}</p>
                <div className="flex flex-col gap-0.5">
                  {group.options.map((opt) => {
                    const checked = (selected[group.key] ?? []).includes(opt.value)
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggle(group.key, opt.value)}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-foreground transition-colors hover:bg-secondary"
                      >
                        <span
                          className={`flex size-4 items-center justify-center rounded border ${
                            checked ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background"
                          }`}
                        >
                          {checked && <Check className="size-3" />}
                        </span>
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
