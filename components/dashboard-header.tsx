"use client"

import { Button } from "@/components/ui/button"
import { useSupabaseData } from "@/hooks/use-supabase-data"

export function DashboardHeader() {
  const { loading, amadeusCaseStats, amadeusAgentStats } = useSupabaseData()

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">AP</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Apromore Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Process Mining Analytics Platform
              </p>
            </div>
          </div>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          {!loading && amadeusCaseStats && amadeusAgentStats && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-green-600">
                ✓ Amadeus Data Loaded
              </span>
              <span className="mx-2">•</span>
              <span>{amadeusCaseStats.length} Cases</span>
              <span className="mx-2">•</span>
              <span>{amadeusAgentStats.length} Agents</span>
            </div>
          )}
          
          <Button variant="outline" size="sm">
            Settings
          </Button>
        </div>
      </div>
    </header>
  )
}
