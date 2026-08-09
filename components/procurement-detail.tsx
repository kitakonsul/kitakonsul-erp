"use client"

import { useMemo, useState } from "react"
import { Boxes, Download, CalendarDays, Search } from "lucide-react"
import { procurementByPlan, procurementTotal } from "@/lib/dashboard-data"
import { TablePagination } from "@/components/table-pagination"
import { ActionMenu } from "@/components/action-menu"
import { FilterPopover, type FilterGroup, type FilterOption } from "@/components/filter-popover"

const PAGE_SIZE = 3

const SORT_OPTIONS: FilterOption[] = [
  { value: "", label: "Default order" },
  { value: "budget-desc", label: "Total Budget (High → Low)" },
  { value: "budget-asc", label: "Total Budget (Low → High)" },
  { value: "delivery-asc", label: "Target Delivery (Earliest)" },
  { value: "delivery-desc", label: "Target Delivery (Latest)" },
]

const toNumber = (s: string) => Number(s.replace(/[^0-9.]/g, "")) || 0
const toDate = (s: string) => {
  const [d, m, y] = s.split("/").map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1).getTime()
}

export function ProcurementDetail({ planId }: { planId: string }) {
  const materials = procurementByPlan[planId] ?? []
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<Record<string, string[]>>({ vendor: [], category: [] })
  const [sort, setSort] = useState("")
  const [page, setPage] = useState(1)

  const filterGroups: FilterGroup[] = useMemo(() => {
    const vendors = Array.from(new Set(materials.map((m) => m.vendor)))
    return [
      {
        key: "vendor",
        label: "Vendor",
        options: vendors.map((v) => ({ value: v, label: v })),
      },
      {
        key: "category",
        label: "Material Category",
        options: [
          { value: "RM", label: "Raw Material (RM)" },
          { value: "PKG", label: "Packaging (PKG)" },
          { value: "CHM", label: "Chemical (CHM)" },
        ],
      },
    ]
  }, [materials])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const result = materials.filter((m) => {
      const matchesQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q) ||
        m.vendor.toLowerCase().includes(q)
      const matchesVendor = filters.vendor.length === 0 || filters.vendor.includes(m.vendor)
      const matchesCategory =
        filters.category.length === 0 || filters.category.some((c) => m.code.startsWith(c))
      return matchesQuery && matchesVendor && matchesCategory
    })

    const sorted = [...result]
    switch (sort) {
      case "budget-desc":
        sorted.sort((a, b) => toNumber(b.totalBudget) - toNumber(a.totalBudget))
        break
      case "budget-asc":
        sorted.sort((a, b) => toNumber(a.totalBudget) - toNumber(b.totalBudget))
        break
      case "delivery-asc":
        sorted.sort((a, b) => toDate(a.targetDelivery) - toDate(b.targetDelivery))
        break
      case "delivery-desc":
        sorted.sort((a, b) => toDate(b.targetDelivery) - toDate(a.targetDelivery))
        break
    }
    return sorted
  }, [materials, query, filters, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <section className="rounded-lg border border-border bg-card shadow-sm" aria-label="Procurement detail">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Boxes className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Procurement Detail</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64 sm:flex-none">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Search plans..."
              aria-label="Search materials"
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <FilterPopover
            groups={filterGroups}
            selected={filters}
            onChange={(next) => {
              setFilters(next)
              setPage(1)
            }}
            sortOptions={SORT_OPTIONS}
            sort={sort}
            onSortChange={(value) => {
              setSort(value)
              setPage(1)
            }}
            ariaLabel="Filter and sort materials"
          />
          <button
            type="button"
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <Download className="size-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-sm">
          <thead>
            <tr className="border-y border-border bg-secondary/60 text-left text-xs font-medium text-muted-foreground">
              <th className="px-4 py-3 font-medium">Material</th>
              <th className="px-4 py-3 text-right font-medium">Required</th>
              <th className="px-4 py-3 text-right font-medium">Est. Unit Price</th>
              <th className="px-4 py-3 text-right font-medium">Total Budget</th>
              <th className="px-4 py-3 font-medium">Target Delivery</th>
              <th className="px-4 py-3 font-medium">Vendor</th>
              <th className="px-4 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.code} className="border-b border-border transition-colors hover:bg-secondary/40">
                <td className="px-4 py-3.5">
                  <div className="font-medium text-foreground">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.code}</div>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-right font-medium text-foreground">
                  {m.required} <span className="text-xs font-normal text-muted-foreground">{m.requiredUnit}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-right text-muted-foreground">{m.unitPrice}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-right font-semibold text-primary">{m.totalBudget}</td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-foreground">
                    <CalendarDays className="size-3.5 text-muted-foreground" />
                    {m.targetDelivery}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                      {m.vendorInitials}
                    </span>
                    <span className="whitespace-nowrap text-foreground">{m.vendor}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex justify-end">
                    <ActionMenu label={m.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-secondary/40">
              <td colSpan={3} className="px-4 py-4 text-right text-sm font-medium text-foreground">
                Total Estimated Budget:
              </td>
              <td className="px-4 py-4 text-right text-base font-bold text-primary">{procurementTotal}</td>
              <td colSpan={3} />
            </tr>
          </tfoot>
        </table>
      </div>

      <TablePagination
        page={currentPage}
        pageCount={pageCount}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        itemLabel="materials"
      />
    </section>
  )
}
