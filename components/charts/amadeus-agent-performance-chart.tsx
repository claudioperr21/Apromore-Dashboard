"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface AmadeusAgentPerformanceChartProps {
  agentStats: Array<{
    agent_profile_id: string
    upn: string
    total_cases: number
    total_work_time: number
    avg_activity_duration: number
  }>
}

export function AmadeusAgentPerformanceChart({ agentStats }: AmadeusAgentPerformanceChartProps) {
  // Prepare data for chart - convert work time to hours
  const chartData = agentStats
    .map(agent => ({
      agent: agent.upn.split('@')[0], // Extract username from email
      cases: agent.total_cases,
      workHours: Math.round(agent.total_work_time / 3600 * 100) / 100,
      avgDuration: Math.round(agent.avg_activity_duration * 100) / 100
    }))
    .sort((a, b) => b.cases - a.cases)
    .slice(0, 15) // Top 15 agents by case count

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Amadeus Agent Performance</CardTitle>
        <CardDescription>
          Top 15 agents by case count and work time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="agent" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value: number, name: string) => [
                name === 'cases' ? `${value} cases` : 
                name === 'workHours' ? `${value} hours` : 
                `${value} seconds`,
                name === 'cases' ? 'Cases' : 
                name === 'workHours' ? 'Work Time' : 'Avg Duration'
              ]}
              labelFormatter={(label) => `Agent: ${label}`}
            />
            <Legend />
            <Bar 
              yAxisId="left"
              dataKey="cases" 
              fill="#10b981" 
              name="Cases"
            />
            <Bar 
              yAxisId="right"
              dataKey="workHours" 
              fill="#f59e0b" 
              name="Work Time (hours)"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
