import { DashboardCanvases } from '@/components/dashboard-canvases'
import { DashboardHeader } from '@/components/dashboard-header'
import { DashboardFilters } from '@/components/dashboard-filters'

// Force dynamic rendering to prevent prerendering errors
export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <DashboardFilters />
        <DashboardCanvases />
      </main>
    </div>
  )
}
