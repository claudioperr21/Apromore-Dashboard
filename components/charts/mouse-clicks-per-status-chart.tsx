"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useSupabaseData } from "@/hooks/use-supabase-data"

export function MouseClicksPerStatusChart() {
  const { data } = useSupabaseData()

  // Aggregate mouse clicks per status (Activity) with relative scale
  const chartData = data.reduce((acc, item) => {
    const activity = item.Activity || 'Unknown'
    if (!acc[activity]) {
      acc[activity] = {
        activity,
        totalClicks: 0,
        count: 0
      }
    }
    acc[activity].totalClicks += item.mouse_click_count || 0
    acc[activity].count += 1
    return acc
  }, {} as Record<string, { activity: string; totalClicks: number; count: number }>)

  // Convert to array and calculate relative values
  const totalClicks = Object.values(chartData).reduce((sum, item) => sum + item.totalClicks, 0)
  const processedData = Object.values(chartData)
    .map(item => ({
      activity: item.activity,
      clicks: item.totalClicks,
      relativeClicks: totalClicks > 0 ? Math.round((item.totalClicks / totalClicks) * 10000) / 100 : 0,
      count: item.count
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10) // Top 10 activities

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="activity" 
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={12}
          />
          <YAxis 
            label={{ value: "Mouse Clicks", angle: -90, position: "insideLeft" }}
          />
          <Tooltip 
            formatter={(value: number, name: string) => [
              name === 'clicks' ? `${value} clicks` : `${value}%`,
              name === 'clicks' ? 'Total Clicks' : 'Relative %'
            ]}
            labelFormatter={(label) => `Status: ${label}`}
          />
          <Bar 
            dataKey="clicks" 
            fill="#84C7E3" 
            radius={[4, 4, 0, 0]}
            name="Mouse Clicks"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
