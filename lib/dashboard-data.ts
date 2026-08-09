export type SalesPlanStatus = "ready" | "draft" | "production"

export type SalesPlan = {
  id: string
  name: string
  customer: string
  period: string
  targetVolume: string
  targetUnit: string
  revenue: string
  status: SalesPlanStatus
}

export const salesPlans: SalesPlan[] = [
  {
    id: "SPL-2026-08-001",
    name: "Sales Plan Batch A - Agustus",
    customer: "Global Industries",
    period: "Aug 2026",
    targetVolume: "5,000",
    targetUnit: "Unit",
    revenue: "Rp 1.2B",
    status: "ready",
  },
  {
    id: "SPL-2026-08-002",
    name: "Q3 Regional Restock",
    customer: "APAC Retailers",
    period: "Sep 2026",
    targetVolume: "12,500",
    targetUnit: "Unit",
    revenue: "Rp 3.1B",
    status: "draft",
  },
  {
    id: "SPL-2026-07-045",
    name: "Custom Order: Delta Corp",
    customer: "Delta Corp",
    period: "Jul 2026",
    targetVolume: "1,200",
    targetUnit: "Unit",
    revenue: "Rp 0.8B",
    status: "production",
  },
  {
    id: "SPL-2026-09-011",
    name: "Sales Plan Batch B - September",
    customer: "Nusantara Foods",
    period: "Sep 2026",
    targetVolume: "8,400",
    targetUnit: "Unit",
    revenue: "Rp 2.4B",
    status: "ready",
  },
  {
    id: "SPL-2026-09-024",
    name: "Export Line - Europe",
    customer: "EuroTrade GmbH",
    period: "Oct 2026",
    targetVolume: "15,000",
    targetUnit: "Unit",
    revenue: "Rp 5.6B",
    status: "draft",
  },
  {
    id: "SPL-2026-07-039",
    name: "Retail Promo Bundle",
    customer: "MegaMart",
    period: "Jul 2026",
    targetVolume: "3,750",
    targetUnit: "Unit",
    revenue: "Rp 1.0B",
    status: "production",
  },
  {
    id: "SPL-2026-10-002",
    name: "Q4 Kickoff Batch",
    customer: "Prima Distribusi",
    period: "Oct 2026",
    targetVolume: "9,200",
    targetUnit: "Unit",
    revenue: "Rp 2.9B",
    status: "ready",
  },
  {
    id: "SPL-2026-08-058",
    name: "Seasonal Snack Line",
    customer: "Sweet Co.",
    period: "Aug 2026",
    targetVolume: "6,100",
    targetUnit: "Unit",
    revenue: "Rp 1.5B",
    status: "draft",
  },
  {
    id: "SPL-2026-06-120",
    name: "Legacy Order Refill",
    customer: "Omega Traders",
    period: "Jun 2026",
    targetVolume: "2,000",
    targetUnit: "Unit",
    revenue: "Rp 0.6B",
    status: "production",
  },
  {
    id: "SPL-2026-11-007",
    name: "Year-End Reserve",
    customer: "Global Industries",
    period: "Nov 2026",
    targetVolume: "18,000",
    targetUnit: "Unit",
    revenue: "Rp 6.8B",
    status: "draft",
  },
]

export type Material = {
  name: string
  code: string
  required: string
  requiredUnit: string
  unitPrice: string
  totalBudget: string
  targetDelivery: string
  vendor: string
  vendorInitials: string
}

export const procurementByPlan: Record<string, Material[]> = {
  "SPL-2026-08-001": [
    {
      name: "Flour Grade A",
      code: "RM-001",
      required: "500",
      requiredUnit: "Kg",
      unitPrice: "Rp 15,000",
      totalBudget: "Rp 7.5M",
      targetDelivery: "15/08/2026",
      vendor: "Sinar Mas",
      vendorInitials: "SM",
    },
    {
      name: "Corrugated Box L",
      code: "PKG-102",
      required: "5,000",
      requiredUnit: "Pcs",
      unitPrice: "Rp 4,500",
      totalBudget: "Rp 22.5M",
      targetDelivery: "18/08/2026",
      vendor: "Indah Pack",
      vendorInitials: "IP",
    },
    {
      name: "Preservative X-10",
      code: "CHM-044",
      required: "25",
      requiredUnit: "Ltr",
      unitPrice: "Rp 120,000",
      totalBudget: "Rp 3.0M",
      targetDelivery: "10/08/2026",
      vendor: "ChemCorp Intl",
      vendorInitials: "CK",
    },
    {
      name: "Sugar Refined",
      code: "RM-014",
      required: "320",
      requiredUnit: "Kg",
      unitPrice: "Rp 12,500",
      totalBudget: "Rp 4.0M",
      targetDelivery: "16/08/2026",
      vendor: "Manis Jaya",
      vendorInitials: "MJ",
    },
    {
      name: "Label Roll Premium",
      code: "PKG-210",
      required: "8,000",
      requiredUnit: "Pcs",
      unitPrice: "Rp 350",
      totalBudget: "Rp 2.8M",
      targetDelivery: "17/08/2026",
      vendor: "PrintPro",
      vendorInitials: "PP",
    },
    {
      name: "Vegetable Oil",
      code: "RM-022",
      required: "150",
      requiredUnit: "Ltr",
      unitPrice: "Rp 18,000",
      totalBudget: "Rp 2.7M",
      targetDelivery: "14/08/2026",
      vendor: "Sinar Mas",
      vendorInitials: "SM",
    },
    {
      name: "Sealing Tape",
      code: "PKG-305",
      required: "1,200",
      requiredUnit: "Pcs",
      unitPrice: "Rp 2,000",
      totalBudget: "Rp 2.4M",
      targetDelivery: "19/08/2026",
      vendor: "Indah Pack",
      vendorInitials: "IP",
    },
  ],
}

export const procurementTotal = "Rp 44.9M"

// Procurement budget ceiling used to flag over-budget spend on the dashboard.
export const BUDGET_LIMIT_IDR = 60_000_000

function parseVolume(s: string): number {
  return Number(s.replace(/[^0-9.]/g, "")) || 0
}

function parseCurrencyToIDR(s: string): number {
  const match = s.match(/([\d.]+)\s*([BMK]?)/i)
  if (!match) return 0
  const value = Number.parseFloat(match[1])
  const suffix = (match[2] || "").toUpperCase()
  const multiplier = suffix === "B" ? 1e9 : suffix === "M" ? 1e6 : suffix === "K" ? 1e3 : 1
  return value * multiplier
}

function formatIDRShort(n: number): string {
  if (n >= 1e9) return `Rp ${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `Rp ${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `Rp ${Math.round(n / 1e3)}K`
  return `Rp ${n}`
}

export type DashboardMetrics = {
  activePlansCount: number
  totalPlansCount: number
  readyCount: number
  productionCount: number
  totalOutputLabel: string
  outputUnit: string
  outputProgress: number
  procurementCostLabel: string
  budgetLimitLabel: string
  withinBudget: boolean
  unprocessedCount: number
}

// Derives every KPI card value from the sales plan + procurement data above.
// Swap the data source for a real database query and the cards update automatically.
export function getDashboardMetrics(): DashboardMetrics {
  const activePlans = salesPlans.filter((p) => p.status !== "draft")
  const readyPlans = salesPlans.filter((p) => p.status === "ready")
  const productionPlans = salesPlans.filter((p) => p.status === "production")

  const totalOutput = salesPlans.reduce((sum, p) => sum + parseVolume(p.targetVolume), 0)
  const activeOutput = activePlans.reduce((sum, p) => sum + parseVolume(p.targetVolume), 0)

  const procurementCost = Object.values(procurementByPlan)
    .flat()
    .reduce((sum, m) => sum + parseCurrencyToIDR(m.totalBudget), 0)

  return {
    activePlansCount: activePlans.length,
    totalPlansCount: salesPlans.length,
    readyCount: readyPlans.length,
    productionCount: productionPlans.length,
    totalOutputLabel: totalOutput.toLocaleString("en-US"),
    outputUnit: salesPlans[0]?.targetUnit ?? "Unit",
    outputProgress: totalOutput > 0 ? Math.round((activeOutput / totalOutput) * 100) : 0,
    procurementCostLabel: formatIDRShort(procurementCost),
    budgetLimitLabel: formatIDRShort(BUDGET_LIMIT_IDR),
    withinBudget: procurementCost <= BUDGET_LIMIT_IDR,
    unprocessedCount: readyPlans.length,
  }
}
