import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardFilters } from "@/components/dashboard-filters"
import { DashboardCanvases } from "@/components/dashboard-canvases"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <DashboardFilters />
        <DashboardCanvases />
      </main>
    </div>
  )
}
