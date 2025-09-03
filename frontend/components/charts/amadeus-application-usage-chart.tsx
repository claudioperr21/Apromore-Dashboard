"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface AmadeusApplicationUsageChartProps {
  windowStats: Array<{
    Window: string
    total_usage_time: number
    unique_cases: number
    total_activities: number
  }>
}

export function AmadeusApplicationUsageChart({ windowStats }: AmadeusApplicationUsageChartProps) {
  // Prepare data for pie chart - convert time to hours and limit to top 8 applications
  const chartData = windowStats
    .map(app => ({
      name: app.Window,
      usageHours: Math.round(app.total_usage_time / 3600 * 100) / 100,
      cases: app.unique_cases,
      activities: app.total_activities
    }))
    .sort((a, b) => b.usageHours - a.usageHours)
    .slice(0, 8)

  // Color palette for different applications
  const COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
  ]

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle>Application Usage Distribution</CardTitle>
        <CardDescription>
          Time spent across different applications (hours)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, usageHours }) => `${name}: ${usageHours}h`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="usageHours"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value} hours`, 
                name === 'usageHours' ? 'Usage Time' : 
                name === 'cases' ? 'Unique Cases' : 'Activities'
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
