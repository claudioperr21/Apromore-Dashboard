"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamsOverviewCanvas } from "@/components/canvases/teams-overview-canvas"
import { TaskLevelCanvas } from "@/components/canvases/task-level-canvas"
import { ResourcesCanvas } from "@/components/canvases/resources-canvas"

export function DashboardCanvases() {
  return (
    <Tabs defaultValue="teams" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="teams">Teams Overview</TabsTrigger>
        <TabsTrigger value="tasks">Task Level Analysis</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
      </TabsList>

      <TabsContent value="teams" className="space-y-6">
        <TeamsOverviewCanvas />
      </TabsContent>

      <TabsContent value="tasks" className="space-y-6">
        <TaskLevelCanvas />
      </TabsContent>

      <TabsContent value="resources" className="space-y-6">
        <ResourcesCanvas />
      </TabsContent>
    </Tabs>
  )
}
