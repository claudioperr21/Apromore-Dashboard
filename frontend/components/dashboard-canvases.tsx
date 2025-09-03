"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamsOverviewCanvas } from "@/components/canvases/teams-overview-canvas"
import { TaskLevelCanvas } from "@/components/canvases/task-level-canvas"
import { ResourcesCanvas } from "@/components/canvases/resources-canvas"
import { AmadeusCanvas } from "@/components/canvases/amadeus-canvas"
import { TaskMiningAssistantCanvas } from "@/components/canvases/task-mining-assistant-canvas"

export function DashboardCanvases() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Show loading state during SSR
  if (!isClient) {
    return (
      <Tabs defaultValue="salesforce" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="salesforce">Salesforce Analytics</TabsTrigger>
          <TabsTrigger value="amadeus">Amadeus Process Mining</TabsTrigger>
          <TabsTrigger value="assistant">Task Mining Assistant</TabsTrigger>
        </TabsList>
        
        <TabsContent value="salesforce" className="space-y-6">
          <div className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-4">Salesforce Analytics</h3>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </TabsContent>
        
        <TabsContent value="amadeus" className="space-y-6">
          <div className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-4">Amadeus Process Mining</h3>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </TabsContent>
        
        <TabsContent value="assistant" className="space-y-6">
          <div className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-4">Task Mining Assistant</h3>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </TabsContent>
      </Tabs>
    )
  }

  return (
    <Tabs defaultValue="salesforce" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="salesforce">Salesforce Analytics</TabsTrigger>
        <TabsTrigger value="amadeus">Amadeus Process Mining</TabsTrigger>
        <TabsTrigger value="assistant">Task Mining Assistant</TabsTrigger>
      </TabsList>
      
      <TabsContent value="salesforce" className="space-y-6">
        <TeamsOverviewCanvas />
        <TaskLevelCanvas />
        <ResourcesCanvas />
      </TabsContent>
      
      <TabsContent value="amadeus" className="space-y-6">
        <AmadeusCanvas 
          caseStats={[]}
          agentStats={[]}
          windowStats={[]}
          activityStats={[]}
        />
      </TabsContent>
      
      <TabsContent value="assistant" className="space-y-6">
        <TaskMiningAssistantCanvas />
      </TabsContent>
    </Tabs>
  )
}
