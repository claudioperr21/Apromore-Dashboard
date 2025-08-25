import { Card } from "@/components/ui/card"
import { MetricTile } from "@/components/charts/metric-tile"
import { ResourceFrequencyPie } from "@/components/charts/resource-frequency-pie"
import { ResourceActivityPie } from "@/components/charts/resource-activity-pie"
import { ResourceWindowHeatmap } from "@/components/charts/resource-window-heatmap"

export function ResourcesCanvas() {
  return (
    <div className="space-y-6">
      {/* KPI Tiles Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTile title="Active Resources" value="24" icon="users" color="primary" />
        <MetricTile title="Avg Utilization" value="73%" icon="gauge" color="secondary" />
        <MetricTile title="Peak Hours" value="2-4 PM" icon="clock" color="accent" />
        <MetricTile title="Idle Time" value="18%" icon="pause" color="chart-3" />
      </div>

      {/* Pie Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Resource - Case Frequency</h3>
          <ResourceFrequencyPie />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Resource - Activity Instance Frequency</h3>
          <ResourceActivityPie />
        </Card>
      </div>

      {/* Heatmap Row */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Resources - Time Spent per Window</h3>
        <ResourceWindowHeatmap />
      </Card>
    </div>
  )
}
