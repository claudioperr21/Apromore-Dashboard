import { Card } from "@/components/ui/card"
import { MetricTile } from "@/components/charts/metric-tile"
import { TeamActivityChart } from "@/components/charts/team-activity-chart"
import { TeamDurationChart } from "@/components/charts/team-duration-chart"
import { StepsTeamHeatmap } from "@/components/charts/steps-team-heatmap"

export function TeamsOverviewCanvas() {
  return (
    <div className="space-y-6">
      {/* KPI Tiles Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTile title="Total Teams" value="8" icon="users" color="primary" />
        <MetricTile title="Avg Activity Instances" value="24.5" subtitle="per team" icon="activity" color="secondary" />
        <MetricTile title="Avg Case Duration" value="2.3h" subtitle="±45min std dev" icon="clock" color="accent" />
        <MetricTile title="Total Cases" value="156" icon="folder" color="chart-3" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Team - Activity Instance Frequency</h3>
          <TeamActivityChart />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Team - Average Case Duration</h3>
          <TeamDurationChart />
        </Card>
      </div>

      {/* Heatmap Row */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Steps × Team Analysis</h3>
        <StepsTeamHeatmap />
      </Card>
    </div>
  )
}
