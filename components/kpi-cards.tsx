import { ClipboardList, CalendarCheck, TriangleAlert, TrendingUp } from "lucide-react"

function InfoCard({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
        <span className="text-info-soft-foreground" aria-hidden="true">
          {icon}
        </span>
      </div>
      {children}
    </div>
  )
}

export function KpiCards() {
  return (
    <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <InfoCard title="Total Active Plans" icon={<ClipboardList className="size-4" />}>
        <p className="mt-3 text-2xl font-semibold text-foreground">12</p>
        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600">
          <TrendingUp className="size-3.5" />
          +2 vs last month
        </p>
      </InfoCard>

      <InfoCard title="Total Target Output" icon={<CalendarCheck className="size-4" />}>
        <p className="mt-3 text-2xl font-semibold text-foreground">
          10,000 <span className="text-sm font-normal text-muted-foreground">Pcs</span>
        </p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-3/4 rounded-full bg-primary" />
        </div>
      </InfoCard>

      <InfoCard title="Est. Procurement Cost" icon={null}>
        <p className="mt-3 text-2xl font-semibold text-foreground">
          2.5B <span className="text-sm font-normal text-muted-foreground">IDR</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Within 3B budget limit</p>
      </InfoCard>

      <div className="rounded-lg border border-warn-soft-border bg-warn-soft p-4 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-warn-soft-foreground">Unprocessed Plans</p>
          <span className="text-warn-soft-foreground" aria-hidden="true">
            <TriangleAlert className="size-4" />
          </span>
        </div>
        <p className="mt-3 text-2xl font-semibold text-warn-soft-foreground">4</p>
        <p className="mt-1 text-xs font-medium text-warn-soft-foreground/90">Require immediate MRP generation</p>
      </div>
    </section>
  )
}
