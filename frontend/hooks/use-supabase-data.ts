import { useState, useEffect } from 'react'
import {
  getSalesforceData,
  getTeams,
  getResources,
  getTeamStats,
  getResourceStats,
  getWindowStats,
  getAmadeusData,
  getAmadeusCaseStats,
  getAmadeusAgentStats,
  getAmadeusWindowStats,
  getAmadeusActivityStats,
} from '@/lib/supabase'
import type {
  SalesforceData,
  AmadeusData,
  TeamStats,
  ResourceStats,
  WindowStats,
  ActivityStats,
  AmadeusCaseStats,
  AmadeusAgentStats,
  AmadeusWindowStats,
  AmadeusActivityStats,
} from '@/types/dashboard'

export function useSupabaseData() {
  const [data, setData] = useState<SalesforceData[]>([])
  const [amadeusData, setAmadeusData] = useState<AmadeusData[]>([])
  const [teamStats, setTeamStats] = useState<TeamStats[]>([])
  const [resourceStats, setResourceStats] = useState<ResourceStats[]>([])
  const [windowStats, setWindowStats] = useState<WindowStats[]>([])
  const [activityStats, setActivityStats] = useState<ActivityStats[]>([])
  const [amadeusCaseStats, setAmadeusCaseStats] = useState<AmadeusCaseStats[]>([])
  const [amadeusAgentStats, setAmadeusAgentStats] = useState<AmadeusAgentStats[]>([])
  const [amadeusWindowStats, setAmadeusWindowStats] = useState<AmadeusWindowStats[]>([])
  const [amadeusActivityStats, setAmadeusActivityStats] = useState<AmadeusActivityStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch all data in parallel with individual error handling
        const results = await Promise.allSettled([
          getSalesforceData(),
          getAmadeusData(),
          getTeamStats(),
          getResourceStats(),
          getWindowStats(),
          getAmadeusCaseStats(), // Using this as activity stats for now
          getAmadeusCaseStats(),
          getAmadeusAgentStats(),
          getAmadeusWindowStats(),
          getAmadeusActivityStats(),
        ])

        // Extract data from successful calls, use empty arrays for failed calls
        const [
          salesforceData,
          amadeusDataResult,
          teamStatsResult,
          resourceStatsResult,
          windowStatsResult,
          activityStatsResult,
          amadeusCaseStatsResult,
          amadeusAgentStatsResult,
          amadeusWindowStatsResult,
          amadeusActivityStatsResult,
        ] = results.map((result, index) => {
          if (result.status === 'fulfilled') {
            return result.value
          } else {
            const apiNames = [
              'Salesforce Data', 'Amadeus Data', 'Team Stats', 'Resource Stats', 
              'Window Stats', 'Activity Stats', 'Amadeus Case Stats', 
              'Amadeus Agent Stats', 'Amadeus Window Stats', 'Amadeus Activity Stats'
            ]
            console.warn(`API call failed for ${apiNames[index]}:`, result.reason)
            return []
          }
        })

        setData(salesforceData)
        setAmadeusData(amadeusDataResult)
        setTeamStats(teamStatsResult)
        setResourceStats(resourceStatsResult)
        setWindowStats(windowStatsResult)
        setActivityStats(activityStatsResult)
        setAmadeusCaseStats(amadeusCaseStatsResult)
        setAmadeusAgentStats(amadeusAgentStatsResult)
        setAmadeusWindowStats(amadeusWindowStatsResult)
        setAmadeusActivityStats(amadeusActivityStatsResult)
      } catch (err) {
        // This should rarely happen now with Promise.allSettled, but keep for safety
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
        console.error('Unexpected error in data fetching:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper functions for getting filtered data
  const getTeamStats = () => teamStats
  const getResourceStats = () => resourceStats
  const getWindowStats = () => windowStats
  const getActivityStats = () => activityStats

  const getFilteredData = (filters: {
    team?: string
    resource?: string
    window?: string
  }) => {
    return data.filter(item => {
      if (filters.team && item.Team !== filters.team) return false
      if (filters.resource && item.Resource !== filters.resource) return false
      if (filters.window && item.Window !== filters.window) return false
      return true
    })
  }

  const getUniqueTeams = () => [...new Set(data.map(item => item.Team))]
  const getUniqueResources = () => [...new Set(data.map(item => item.Resource))]
  const getUniqueWindows = () => [...new Set(data.map(item => item.Window))]

  return {
    // Data
    data,
    amadeusData,
    teamStats,
    resourceStats,
    windowStats,
    activityStats,
    amadeusCaseStats,
    amadeusAgentStats,
    amadeusWindowStats,
    amadeusActivityStats,
    
    // State
    loading,
    error,
    
    // Helper functions
    getTeamStats,
    getResourceStats,
    getWindowStats,
    getActivityStats,
    getFilteredData,
    getUniqueTeams,
    getUniqueResources,
    getUniqueWindows,
  }
}
