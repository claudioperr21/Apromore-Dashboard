"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardFilters } from "@/components/dashboard-filters"
import { DashboardCanvases } from "@/components/dashboard-canvases"
import { useSupabaseData } from "@/hooks/use-supabase-data"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { loading, error } = useSupabaseData()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6">
          <Alert variant="destructive">
            <AlertDescription>
              Error loading dashboard data: {error}
            </AlertDescription>
          </Alert>
        </main>
      </div>
    )
  }

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
