"use client"

import { TeamsOverviewCanvas } from "@/components/canvases/teams-overview-canvas"
import { TaskLevelCanvas } from "@/components/canvases/task-level-canvas"
import { ResourcesCanvas } from "@/components/canvases/resources-canvas"
import { AmadeusCanvas } from "@/components/canvases/amadeus-canvas"
import { TaskMiningAssistantCanvas } from "@/components/canvases/task-mining-assistant-canvas"
import { DataLoader } from "@/components/data-loader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSupabaseData } from "@/hooks/use-supabase-data"

export function DashboardCanvases() {
  const { 
    data, 
    teams, 
    resources, 
    getTeamStats, 
    getResourceStats, 
    getWindowStats, 
    getActivityStats,
    amadeusCaseStats,
    amadeusAgentStats,
    amadeusWindowStats,
    amadeusActivityStats
  } = useSupabaseData()

  const teamStats = getTeamStats()
  const resourceStats = getResourceStats()
  const windowStats = getWindowStats()
  const activityStats = getActivityStats()

  return (
    <Tabs defaultValue="data" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="data">Data Overview</TabsTrigger>
        <TabsTrigger value="salesforce">Salesforce Analytics</TabsTrigger>
        <TabsTrigger value="amadeus">Amadeus Process Mining</TabsTrigger>
        <TabsTrigger value="assistant">Task Mining Assistant</TabsTrigger>
      </TabsList>
      
      <TabsContent value="data" className="space-y-6">
        <DataLoader />
      </TabsContent>
      
      <TabsContent value="salesforce" className="space-y-6">
        <TeamsOverviewCanvas teamStats={teamStats} />
        <TaskLevelCanvas />
        <ResourcesCanvas resourceStats={resourceStats} />
      </TabsContent>
      
      <TabsContent value="amadeus" className="space-y-6">
        <AmadeusCanvas 
          caseStats={amadeusCaseStats}
          agentStats={amadeusAgentStats}
          windowStats={amadeusWindowStats}
          activityStats={amadeusActivityStats}
        />
      </TabsContent>
      
      <TabsContent value="assistant" className="space-y-6">
        <TaskMiningAssistantCanvas />
      </TabsContent>
    </Tabs>
  )
}
