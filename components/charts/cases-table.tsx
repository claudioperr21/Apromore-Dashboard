import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSupabaseData } from "@/hooks/use-supabase-data"

export function CasesTable() {
  const { data } = useSupabaseData()

  // Calculate case statistics with first-touch stats
  const caseStats = data.reduce((acc, item) => {
    const caseId = item.Case_ID || 'Unknown'
    if (!acc[caseId]) {
      acc[caseId] = {
        caseId,
        caseCount: 0,
        variantCount: 0,
        durations: [],
        activities: new Set(),
        resources: new Set(),
        windows: new Set()
      }
    }
    
    acc[caseId].caseCount++
    acc[caseId].durations.push(item.duration_seconds || 0)
    acc[caseId].activities.add(item.Activity || '')
    acc[caseId].resources.add(item.Resource || '')
    acc[caseId].windows.add(item.Window || '')
    
    return acc
  }, {} as Record<string, {
    caseId: string
    caseCount: number
    variantCount: number
    durations: number[]
    activities: Set<string>
    resources: Set<string>
    windows: Set<string>
  }>)

  // Process case data for display
  const processedCases = Object.values(caseStats).map(case_ => {
    const sortedDurations = case_.durations.sort((a, b) => a - b)
    const minDuration = sortedDurations[0] || 0
    const maxDuration = sortedDurations[sortedDurations.length - 1] || 0
    const avgDuration = case_.durations.reduce((sum, d) => sum + d, 0) / case_.durations.length
    const medianDuration = sortedDurations.length % 2 === 0 
      ? (sortedDurations[sortedDurations.length / 2 - 1] + sortedDurations[sortedDurations.length / 2]) / 2
      : sortedDurations[Math.floor(sortedDurations.length / 2)]

    // Calculate variability ratio (standard deviation / mean)
    const variance = case_.durations.reduce((sum, d) => sum + Math.pow(d - avgDuration, 2), 0) / case_.durations.length
    const stdDev = Math.sqrt(variance)
    const variabilityRatio = avgDuration > 0 ? stdDev / avgDuration : 0

    return {
      caseId: case_.caseId,
      caseCount: case_.caseCount,
      variantCount: case_.activities.size,
      variabilityRatio: Math.round(variabilityRatio * 100) / 100,
      minDuration: Math.round((minDuration / 60) * 100) / 100,
      medianDuration: Math.round((medianDuration / 60) * 100) / 100,
      avgDuration: Math.round((avgDuration / 60) * 100) / 100,
      maxDuration: Math.round((maxDuration / 60) * 100) / 100,
      activities: case_.activities.size,
      resources: case_.resources.size
    }
  }).sort((a, b) => b.caseCount - a.caseCount).slice(0, 20) // Top 20 cases

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Case ID</TableHead>
            <TableHead>Case Count</TableHead>
            <TableHead>Variant Count</TableHead>
            <TableHead>Variability Ratio</TableHead>
            <TableHead>Min Duration (min)</TableHead>
            <TableHead>Median Duration (min)</TableHead>
            <TableHead>Avg Duration (min)</TableHead>
            <TableHead>Max Duration (min)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processedCases.map((case_) => (
            <TableRow key={case_.caseId}>
              <TableCell className="font-medium">{case_.caseId}</TableCell>
              <TableCell>{case_.caseCount}</TableCell>
              <TableCell>{case_.variantCount}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  case_.variabilityRatio > 1 ? 'bg-red-100 text-red-800' :
                  case_.variabilityRatio > 0.5 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {case_.variabilityRatio}
                </span>
              </TableCell>
              <TableCell>{case_.minDuration}</TableCell>
              <TableCell>{case_.medianDuration}</TableCell>
              <TableCell>{case_.avgDuration}</TableCell>
              <TableCell>{case_.maxDuration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
