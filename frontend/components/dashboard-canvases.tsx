"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DashboardCanvases() {
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
          <p className="text-muted-foreground">Dashboard content loading...</p>
        </div>
      </TabsContent>
      
      <TabsContent value="amadeus" className="space-y-6">
        <div className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-4">Amadeus Process Mining</h3>
          <p className="text-muted-foreground">Dashboard content loading...</p>
        </div>
      </TabsContent>
      
      <TabsContent value="assistant" className="space-y-6">
        <div className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-4">Task Mining Assistant</h3>
          <p className="text-muted-foreground">AI Assistant loading...</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
