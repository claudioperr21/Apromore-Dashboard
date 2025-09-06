import { Card } from "@/components/ui/card"
import { MetricTile } from "@/components/charts/metric-tile"
import { TimeSpentPerAppChart } from "@/components/charts/time-spent-per-app-chart"
import { TimeSpentPerStatusChart } from "@/components/charts/time-spent-per-status-chart"
import { MouseClicksPerAppChart } from "@/components/charts/mouse-clicks-per-app-chart"
import { MouseClicksPerStatusChart } from "@/components/charts/mouse-clicks-per-status-chart"
import { ResourcesTimeWindowHeatmap } from "@/components/charts/resources-time-window-heatmap"
import { StatusTimeWindowHeatmap } from "@/components/charts/status-time-window-heatmap"
import { StepsResourceHeatmap } from "@/components/charts/steps-resource-heatmap"
import { CasesTable } from "@/components/charts/cases-table"
import { useSupabaseData } from "@/hooks/use-supabase-data"

export function TaskLevelCanvas() {
  const { data } = useSupabaseData()

  // Calculate KPI metrics from live data
  const totalMouseClicks = data.reduce((sum, item) => sum + (item.mouse_click_count || 0), 0)
  const totalKeystrokes = data.reduce((sum, item) => sum + (item.keypress_count || 0), 0)
  const uniqueSteps = new Set(data.map(item => item.Step)).size
  const uniqueCases = new Set(data.map(item => item.Case_ID)).size
  const avgStepsPerCase = uniqueCases > 0 ? Math.round((uniqueSteps / uniqueCases) * 100) / 100 : 0
  const totalDuration = data.reduce((sum, item) => sum + (item.duration_seconds || 0), 0)
  const avgDuration = data.length > 0 ? Math.round((totalDuration / data.length) * 100) / 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Task Level Analysis</h2>
          <p className="text-muted-foreground">
            Detailed analysis of task-level metrics and process mining insights
          </p>
        </div>
      </div>

      {/* KPI Tiles Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTile 
          title="Total Mouse Clicks" 
          value={totalMouseClicks.toLocaleString()} 
          icon="mouse-pointer" 
          color="primary" 
        />
        <MetricTile 
          title="Total Keystrokes" 
          value={totalKeystrokes.toLocaleString()} 
          icon="keyboard" 
          color="secondary" 
        />
        <MetricTile 
          title="Avg Steps per Case" 
          value={avgStepsPerCase.toString()} 
          icon="list" 
          color="accent" 
        />
        <MetricTile 
          title="Avg Duration" 
          value={`${Math.round(avgDuration / 60)}m`} 
          icon="clock" 
          color="chart-3" 
        />
      </div>

      {/* Column Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Time spent per app</h3>
          <p className="text-sm text-muted-foreground mb-4">Relative Scale.</p>
          <TimeSpentPerAppChart />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Time spent per status</h3>
          <p className="text-sm text-muted-foreground mb-4">Relative scale.</p>
          <TimeSpentPerStatusChart />
        </Card>
      </div>

      {/* Column Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Mouse clicks per app</h3>
          <MouseClicksPerAppChart />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Mouse clicks per status</h3>
          <MouseClicksPerStatusChart />
        </Card>
      </div>

      {/* Heatmaps Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResourcesTimeWindowHeatmap />
        <StatusTimeWindowHeatmap />
      </div>

      {/* Steps x Resource Heatmap */}
      <StepsResourceHeatmap />

      {/* Cases Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Cases</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Case list with first-touch stats (case count, variant count, variability ratio, min/med/avg/max case duration)
        </p>
        <CasesTable />
      </Card>
    </div>
  )
}
