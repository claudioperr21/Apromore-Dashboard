"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface AmadeusCaseDurationChartProps {
  caseStats: Array<{
    Case_ID: string
    total_duration: number
    total_activities: number
    case_duration: string
  }>
}

export function AmadeusCaseDurationChart({ caseStats }: AmadeusCaseDurationChartProps) {
  // Convert duration to minutes and prepare data for chart
  const chartData = caseStats
    .map(case_ => ({
      caseId: case_.Case_ID,
      durationMinutes: Math.round(case_.total_duration / 60 * 100) / 100,
      activities: case_.total_activities
    }))
    .sort((a, b) => b.durationMinutes - a.durationMinutes)
    .slice(0, 15) // Top 15 cases by duration

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Amadeus Case Duration Analysis</CardTitle>
        <CardDescription>
          Top 15 cases by processing duration (in minutes)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="caseId" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis 
              label={{ value: 'Duration (minutes)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value} minutes`, 
                name === 'durationMinutes' ? 'Duration' : 'Activities'
              ]}
              labelFormatter={(label) => `Case: ${label}`}
            />
            <Bar 
              dataKey="durationMinutes" 
              fill="#3b82f6" 
              name="Duration (minutes)"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
