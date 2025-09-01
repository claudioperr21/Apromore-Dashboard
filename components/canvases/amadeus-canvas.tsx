"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AmadeusCaseDurationChart } from "@/components/charts/amadeus-case-duration-chart"
import { AmadeusAgentPerformanceChart } from "@/components/charts/amadeus-agent-performance-chart"
import { AmadeusApplicationUsageChart } from "@/components/charts/amadeus-application-usage-chart"
import { MetricTile } from "@/components/charts/metric-tile"

interface AmadeusCanvasProps {
  caseStats: Array<{
    Case_ID: string
    total_duration: number
    total_activities: number
    case_duration: string
  }>
  agentStats: Array<{
    agent_profile_id: string
    upn: string
    total_cases: number
    total_work_time: number
    avg_activity_duration: number
  }>
  windowStats: Array<{
    Window: string
    total_usage_time: number
    unique_cases: number
    total_activities: number
  }>
  activityStats: Array<{
    Activity: string
    total_occurrences: number
    unique_cases: number
    total_time_spent: number
  }>
}

export function AmadeusCanvas({ 
  caseStats, 
  agentStats, 
  windowStats, 
  activityStats 
}: AmadeusCanvasProps) {
  // Calculate summary metrics
  const totalCases = caseStats.length
  const totalActivities = caseStats.reduce((sum, case_) => sum + case_.total_activities, 0)
  const totalWorkTime = caseStats.reduce((sum, case_) => sum + case_.total_duration, 0)
  const avgCaseDuration = totalCases > 0 ? totalWorkTime / totalCases : 0
  const totalAgents = agentStats.length
  const totalApplications = windowStats.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Amadeus Process Mining</h2>
          <p className="text-muted-foreground">
            Process mining analysis for Amadeus workflow data
          </p>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <MetricTile
          title="Total Cases"
          value={totalCases.toString()}
          description="Processed cases"
          icon="📋"
        />
        <MetricTile
          title="Total Activities"
          value={totalActivities.toString()}
          description="Workflow activities"
          icon="⚡"
        />
        <MetricTile
          title="Total Work Time"
          value={`${Math.round(totalWorkTime / 3600 * 100) / 100}h`}
          description="Cumulative processing time"
          icon="⏱️"
        />
        <MetricTile
          title="Avg Case Duration"
          value={`${Math.round(avgCaseDuration / 60 * 100) / 100}m`}
          description="Average case processing time"
          icon="📊"
        />
        <MetricTile
          title="Active Agents"
          value={totalAgents.toString()}
          description="Users in the system"
          icon="👥"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Case Duration Chart */}
        <div className="lg:col-span-2">
          <AmadeusCaseDurationChart caseStats={caseStats} />
        </div>

        {/* Application Usage Chart */}
        <div className="lg:col-span-1">
          <AmadeusApplicationUsageChart windowStats={windowStats} />
        </div>

        {/* Agent Performance Chart */}
        <div className="lg:col-span-3">
          <AmadeusAgentPerformanceChart agentStats={agentStats} />
        </div>

        {/* Top Activities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Activities by Frequency</CardTitle>
              <CardDescription>
                Most common workflow activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activityStats
                  .sort((a, b) => b.total_occurrences - a.total_occurrences)
                  .slice(0, 10)
                  .map((activity, index) => (
                    <div key={activity.Activity} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          #{index + 1}
                        </span>
                        <span className="font-medium">{activity.Activity}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {activity.total_occurrences} occurrences
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(activity.total_time_spent / 60 * 100) / 100}m total
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Process Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Process Overview</CardTitle>
              <CardDescription>
                Workflow statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Applications Used</span>
                  <span className="text-sm text-muted-foreground">{totalApplications}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Unique Activities</span>
                  <span className="text-sm text-muted-foreground">{activityStats.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Avg Activities/Case</span>
                  <span className="text-sm text-muted-foreground">
                    {totalCases > 0 ? Math.round(totalActivities / totalCases * 100) / 100 : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Efficiency</span>
                  <span className="text-sm text-muted-foreground">
                    {totalWorkTime > 0 ? Math.round((totalActivities / totalWorkTime) * 100) / 100 : 0} act/min
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
