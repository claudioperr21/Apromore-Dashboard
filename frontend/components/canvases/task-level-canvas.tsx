import { Card } from "@/components/ui/card"
import { MetricTile } from "@/components/charts/metric-tile"
import { AppTimeChart } from "@/components/charts/app-time-chart"
import { StatusTimeChart } from "@/components/charts/status-time-chart"
import { CasesTable } from "@/components/charts/cases-table"

export function TaskLevelCanvas() {
  return (
    <div className="space-y-6">
      {/* KPI Tiles Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTile title="Total Mouse Clicks" value="1,247" icon="mouse-pointer" color="primary" />
        <MetricTile title="Total Keystrokes" value="8,934" icon="keyboard" color="secondary" />
        <MetricTile title="Avg Steps per Case" value="12.4" icon="list" color="accent" />
        <MetricTile title="Process Efficiency" value="87%" icon="trending-up" color="chart-3" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Time Spent per App</h3>
          <AppTimeChart />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Time Spent per Status</h3>
          <StatusTimeChart />
        </Card>
      </div>

      {/* Cases Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Cases Overview</h3>
        <CasesTable />
      </Card>
    </div>
  )
}
