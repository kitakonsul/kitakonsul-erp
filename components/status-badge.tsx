import { CheckCircle2, FileText, Factory } from "lucide-react"
import type { SalesPlanStatus } from "@/lib/dashboard-data"

const config: Record<
  SalesPlanStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  ready: {
    label: "Ready for MRP",
    className: "bg-accent-amber text-accent-amber-foreground",
    icon: <CheckCircle2 className="size-3.5" />,
  },
  draft: {
    label: "Draft",
    className: "bg-secondary text-muted-foreground",
    icon: <FileText className="size-3.5" />,
  },
  production: {
    label: "In Production",
    className: "bg-primary text-primary-foreground",
    icon: <Factory className="size-3.5" />,
  },
}

export function StatusBadge({ status }: { status: SalesPlanStatus }) {
  const { label, className, icon } = config[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {icon}
      {label}
    </span>
  )
}
