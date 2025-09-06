"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useSupabaseData } from "@/hooks/use-supabase-data"

export function TimeSpentPerAppChart() {
  const { data } = useSupabaseData()

  // Aggregate time spent per app (Window) with relative scale and logarithmic
  const chartData = data.reduce((acc, item) => {
    const window = item.Window || 'Unknown'
    if (!acc[window]) {
      acc[window] = {
        window,
        totalDuration: 0,
        count: 0
      }
    }
    acc[window].totalDuration += item.duration_seconds || 0
    acc[window].count += 1
    return acc
  }, {} as Record<string, { window: string; totalDuration: number; count: number }>)

  // Convert to array and calculate relative values
  const totalDuration = Object.values(chartData).reduce((sum, item) => sum + item.totalDuration, 0)
  const processedData = Object.values(chartData)
    .map(item => ({
      window: item.window,
      durationMinutes: Math.round((item.totalDuration / 60) * 100) / 100,
      relativeDuration: totalDuration > 0 ? Math.round((item.totalDuration / totalDuration) * 10000) / 100 : 0,
      count: item.count
    }))
    .sort((a, b) => b.durationMinutes - a.durationMinutes)
    .slice(0, 10) // Top 10 apps

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="window" 
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={12}
          />
          <YAxis 
            label={{ value: "Duration (minutes)", angle: -90, position: "insideLeft" }}
            scale="log"
            domain={['dataMin', 'dataMax']}
          />
          <Tooltip 
            formatter={(value: number, name: string) => [
              name === 'durationMinutes' ? `${value} min` : `${value}%`,
              name === 'durationMinutes' ? 'Duration' : 'Relative %'
            ]}
            labelFormatter={(label) => `App: ${label}`}
          />
          <Bar 
            dataKey="durationMinutes" 
            fill="#84C7E3" 
            radius={[4, 4, 0, 0]}
            name="Duration (minutes)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
