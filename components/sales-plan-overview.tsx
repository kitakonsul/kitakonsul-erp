"use client"

import { useMemo, useState } from "react"
import { Table2, Search, Play, Pencil, Download } from "lucide-react"
import { salesPlans, type SalesPlan } from "@/lib/dashboard-data"
import { StatusBadge } from "@/components/status-badge"
import { TablePagination } from "@/components/table-pagination"
import { FilterPopover, type FilterGroup, type FilterOption } from "@/components/filter-popover"

const PAGE_SIZE = 3

const SORT_OPTIONS: FilterOption[] = [
  { value: "", label: "Default order" },
  { value: "revenue-desc", label: "Revenue (High → Low)" },
  { value: "revenue-asc", label: "Revenue (Low → High)" },
  { value: "volume-desc", label: "Target Volume (High → Low)" },
  { value: "volume-asc", label: "Target Volume (Low → High)" },
  { value: "name-asc", label: "Name (A → Z)" },
]

const toNumber = (s: string) => Number(s.replace(/[^0-9.]/g, "")) || 0

const FILTER_GROUPS: FilterGroup[] = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "ready", label: "Ready for MRP" },
      { value: "draft", label: "Draft" },
      { value: "production", label: "In Production" },
    ],
  },
  {
    key: "period",
    label: "Period",
    options: [
      { value: "Jul 2026", label: "Jul 2026" },
      { value: "Aug 2026", label: "Aug 2026" },
      { value: "Sep 2026", label: "Sep 2026" },
      { value: "Oct 2026", label: "Oct 2026" },
      { value: "Nov 2026", label: "Nov 2026" },
    ],
  },
]

export function SalesPlanOverview() {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<Record<string, string[]>>({ status: [], period: [] })
  const [sort, setSort] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const result = salesPlans.filter((p) => {
      const matchesQuery =
        !q ||
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.customer.toLowerCase().includes(q)
      const matchesStatus = filters.status.length === 0 || filters.status.includes(p.status)
      const matchesPeriod = filters.period.length === 0 || filters.period.includes(p.period)
      return matchesQuery && matchesStatus && matchesPeriod
    })

    const sorted = [...result]
    switch (sort) {
      case "revenue-desc":
        sorted.sort((a, b) => toNumber(b.revenue) - toNumber(a.revenue))
        break
      case "revenue-asc":
        sorted.sort((a, b) => toNumber(a.revenue) - toNumber(b.revenue))
        break
      case "volume-desc":
        sorted.sort((a, b) => toNumber(b.targetVolume) - toNumber(a.targetVolume))
        break
      case "volume-asc":
        sorted.sort((a, b) => toNumber(a.targetVolume) - toNumber(b.targetVolume))
        break
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
    }
    return sorted
  }, [query, filters, sort])

  function exportCsv() {
    const headers = ["Sales Plan ID", "Name", "Customer/Market", "Period", "Target Volume", "Unit", "Est. Revenue", "Status"]
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
    const lines = [
      headers.join(","),
      ...filtered.map((p: SalesPlan) =>
        [p.id, p.name, p.customer, p.period, p.targetVolume, p.targetUnit, p.revenue, p.status]
          .map((v) => escape(String(v)))
          .join(","),
      ),
    ]
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sales-plan-overview.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <section className="rounded-lg border border-border bg-card shadow-sm" aria-label="Sales plan overview">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Table2 className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Sales Plan Overview</h2>
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
              aria-label="Search plans"
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <FilterPopover
            groups={FILTER_GROUPS}
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
            ariaLabel="Filter and sort plans"
          />
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <Download className="size-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr className="border-y border-border bg-secondary/60 text-left text-xs font-medium text-muted-foreground">
              <th className="px-4 py-3 font-medium">Sales Plan ID</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Customer/Market</th>
              <th className="px-4 py-3 font-medium">Period</th>
              <th className="px-4 py-3 text-right font-medium">Target Volume</th>
              <th className="px-4 py-3 text-right font-medium">Est. Revenue</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No sales plans match your search.
                </td>
              </tr>
            ) : (
              rows.map((plan) => (
                <tr
                  key={plan.id}
                  className="border-b border-border last:border-0 transition-colors hover:bg-secondary/40"
                >
                  <td className="whitespace-nowrap px-4 py-3.5 font-medium text-primary">{plan.id}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 font-medium text-foreground">{plan.name}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">{plan.customer}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">{plan.period}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right font-medium text-foreground">
                    {plan.targetVolume}{" "}
                    <span className="text-xs font-normal text-muted-foreground">{plan.targetUnit}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right text-muted-foreground">{plan.revenue}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={plan.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      {plan.status === "ready" && (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:opacity-90"
                        >
                          <Play className="size-3.5" />
                          Process
                        </button>
                      )}
                      {plan.status === "draft" && (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                        >
                          <Pencil className="size-3.5" />
                          Edit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        page={currentPage}
        pageCount={pageCount}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        itemLabel="plans"
      />
    </section>
  )
}
