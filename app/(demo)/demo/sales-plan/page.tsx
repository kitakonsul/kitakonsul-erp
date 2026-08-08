import { Plus, FileBox } from "lucide-react"
import { KpiCards } from "@/components/kpi-cards"
import { SalesPlanOverview } from "@/components/sales-plan-overview"
import { ProcurementDetail } from "@/components/procurement-detail"

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-primary text-balance">
            Dashboard Sales Plan &amp; Procurement Planning
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Overview of production targets and material requirements</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent-amber px-4 py-2 text-sm font-semibold text-accent-amber-foreground transition-colors hover:opacity-90"
          >
            <Plus className="size-4" />
            New Sales Plan
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <FileBox className="size-4" />
            New Material Plan
          </button>
        </div>
      </header>

      <div className="mt-6 flex flex-col gap-6">
        <KpiCards />
        <SalesPlanOverview />
        <ProcurementDetail planId="SPL-2026-08-001" />
      </div>
    </main>
  )
}
