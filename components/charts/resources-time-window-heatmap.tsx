"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabaseData } from "@/hooks/use-supabase-data"

export function ResourcesTimeWindowHeatmap() {
  const { data } = useSupabaseData()

  // Preselected resources and windows as specified
  const preselectedResources = ['user2@apromore.com', 'user1@apromore.com', 'user3@apromore.com']
  const preselectedWindows = ['Salesforce', 'Microsoft Word', 'Microsoft Excel']

  // Filter data for preselected resources and windows
  const filteredData = data.filter(item => 
    preselectedResources.includes(item.Resource || '') && 
    preselectedWindows.includes(item.Window || '')
  )

  // Create heatmap data structure
  const heatmapData = preselectedResources.map(resource => {
    const resourceData = filteredData.filter(item => item.Resource === resource)
    const windowTotals = preselectedWindows.map(window => {
      const windowData = resourceData.filter(item => item.Window === window)
      const totalDuration = windowData.reduce((sum, item) => sum + (item.duration_seconds || 0), 0)
      return {
        window,
        duration: Math.round((totalDuration / 60) * 100) / 100, // Convert to minutes
        count: windowData.length
      }
    })

    return {
      resource,
      windows: windowTotals
    }
  })

  // Calculate max duration for color scaling
  const maxDuration = Math.max(...heatmapData.flatMap(r => r.windows.map(w => w.duration)))

  const getColorIntensity = (duration: number) => {
    if (maxDuration === 0) return 'bg-gray-100'
    const intensity = duration / maxDuration
    if (intensity > 0.8) return 'bg-blue-600'
    if (intensity > 0.6) return 'bg-blue-500'
    if (intensity > 0.4) return 'bg-blue-400'
    if (intensity > 0.2) return 'bg-blue-300'
    return 'bg-blue-200'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resources - Time Spent per Window</CardTitle>
        <CardDescription>
          Heatmap showing time spent by selected resources across different applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header row */}
          <div className="grid grid-cols-4 gap-2">
            <div className="font-medium text-sm">Resource</div>
            {preselectedWindows.map(window => (
              <div key={window} className="font-medium text-sm text-center">
                {window}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {heatmapData.map(({ resource, windows }) => (
            <div key={resource} className="grid grid-cols-4 gap-2">
              <div className="font-medium text-sm truncate" title={resource}>
                {resource}
              </div>
              {windows.map(({ window, duration, count }) => (
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
              <div className="w-4 h-4 bg-blue-200 rounded"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>High</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
