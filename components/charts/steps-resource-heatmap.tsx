"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabaseData } from "@/hooks/use-supabase-data"

export function StepsResourceHeatmap() {
  const { data } = useSupabaseData()

  // Get unique steps and resources from data
  const uniqueSteps = [...new Set(data.map(item => item.Step).filter(Boolean))]
  const uniqueResources = [...new Set(data.map(item => item.Resource).filter(Boolean))]

  // Create heatmap data structure for steps x resources
  const heatmapData = uniqueSteps.map(step => {
    const stepData = data.filter(item => item.Step === step)
    const resourceTotals = uniqueResources.map(resource => {
      const resourceData = stepData.filter(item => item.Resource === resource)
      const frequency = resourceData.length
      return {
        resource,
        frequency,
        totalDuration: resourceData.reduce((sum, item) => sum + (item.duration_seconds || 0), 0)
      }
    })

    return {
      step,
      resources: resourceTotals
    }
  })

  // Calculate max frequency for color scaling
  const maxFrequency = Math.max(...heatmapData.flatMap(s => s.resources.map(r => r.frequency)))

  const getColorIntensity = (frequency: number) => {
    if (maxFrequency === 0) return 'bg-gray-100'
    const intensity = frequency / maxFrequency
    if (intensity > 0.8) return 'bg-purple-600'
    if (intensity > 0.6) return 'bg-purple-500'
    if (intensity > 0.4) return 'bg-purple-400'
    if (intensity > 0.2) return 'bg-purple-300'
    return 'bg-purple-200'
  }

  // Limit display to top 10 steps and resources for readability
  const topSteps = uniqueSteps.slice(0, 10)
  const topResources = uniqueResources.slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Steps × Resource Analysis</CardTitle>
        <CardDescription>
          Heatmap showing frequency of steps by resources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header row */}
          <div className="grid grid-cols-11 gap-2">
            <div className="font-medium text-sm">Step</div>
            {topResources.map(resource => (
              <div key={resource} className="font-medium text-sm text-center truncate" title={resource}>
                {resource.split('@')[0]}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {heatmapData
            .filter(item => topSteps.includes(item.step))
            .map(({ step, resources }) => (
            <div key={step} className="grid grid-cols-11 gap-2">
              <div className="font-medium text-sm truncate" title={step}>
                {step}
              </div>
              {resources
                .filter(r => topResources.includes(r.resource))
                .map(({ resource, frequency, totalDuration }) => (
                <div
                  key={resource}
                  className={`${getColorIntensity(frequency)} text-white text-center p-2 rounded text-sm`}
                  title={`${frequency} occurrences (${Math.round(totalDuration / 60)}m total)`}
                >
                  {frequency > 0 ? frequency : '-'}
                </div>
              ))}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Frequency:</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-purple-200 rounded"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-purple-400 rounded"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-purple-600 rounded"></div>
              <span>High</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
