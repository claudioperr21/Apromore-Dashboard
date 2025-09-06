"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabaseData } from "@/hooks/use-supabase-data"

export function StatusTimeWindowHeatmap() {
  const { data } = useSupabaseData()

  // Preselected activities as specified
  const preselectedActivities = [
    'Created.',
    'Status In Progress',
    'Status Escalated', 
    'Status Working',
    'Status On Hold',
    'Status Response Received',
    'Status Waiting for Customer'
  ]

  // Get unique windows from data
  const uniqueWindows = [...new Set(data.map(item => item.Window).filter(Boolean))]

  // Filter data for preselected activities
  const filteredData = data.filter(item => 
    preselectedActivities.includes(item.Activity || '')
  )

  // Create heatmap data structure
  const heatmapData = preselectedActivities.map(activity => {
    const activityData = filteredData.filter(item => item.Activity === activity)
    const windowTotals = uniqueWindows.map(window => {
      const windowData = activityData.filter(item => item.Window === window)
      const totalDuration = windowData.reduce((sum, item) => sum + (item.duration_seconds || 0), 0)
      return {
        window,
        duration: Math.round((totalDuration / 60) * 100) / 100, // Convert to minutes
        count: windowData.length
      }
    })

    return {
      activity,
      windows: windowTotals
    }
  })

  // Calculate max duration for color scaling
  const maxDuration = Math.max(...heatmapData.flatMap(a => a.windows.map(w => w.duration)))

  const getColorIntensity = (duration: number) => {
    if (maxDuration === 0) return 'bg-gray-100'
    const intensity = duration / maxDuration
    if (intensity > 0.8) return 'bg-green-600'
    if (intensity > 0.6) return 'bg-green-500'
    if (intensity > 0.4) return 'bg-green-400'
    if (intensity > 0.2) return 'bg-green-300'
    return 'bg-green-200'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status - Time Spent per Window</CardTitle>
        <CardDescription>
          Heatmap showing time spent by selected activities across different applications (relative scale)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header row */}
          <div className="grid grid-cols-8 gap-2">
            <div className="font-medium text-sm">Activity</div>
            {uniqueWindows.slice(0, 7).map(window => (
              <div key={window} className="font-medium text-sm text-center truncate" title={window}>
                {window}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {heatmapData.map(({ activity, windows }) => (
            <div key={activity} className="grid grid-cols-8 gap-2">
              <div className="font-medium text-sm truncate" title={activity}>
                {activity}
              </div>
              {windows.slice(0, 7).map(({ window, duration, count }) => (
                <div
                  key={window}
                  className={`${getColorIntensity(duration)} text-white text-center p-2 rounded text-sm`}
                  title={`${duration} min (${count} activities)`}
                >
                  {duration > 0 ? `${duration}m` : '-'}
                </div>
              ))}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Duration (minutes):</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-200 rounded"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>High</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
