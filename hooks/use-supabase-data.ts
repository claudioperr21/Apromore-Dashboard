import { useState, useEffect } from 'react'
import { 
  getSalesforceData, 
  getTeams, 
  getResources, 
  getFilteredData, 
  SalesforceData,
  getAmadeusData,
  getAmadeusCaseStats,
  getAmadeusAgentStats,
  getAmadeusWindowStats,
  getAmadeusActivityStats,
  AmadeusData,
  AmadeusCaseStats,
  AmadeusAgentStats,
  AmadeusWindowStats,
  AmadeusActivityStats
} from '@/lib/supabase'

export const useSupabaseData = () => {
  // Salesforce data state
  const [data, setData] = useState<SalesforceData[]>([])
  const [teams, setTeams] = useState<string[]>([])
  const [resources, setResources] = useState<string[]>([])
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [selectedResources, setSelectedResources] = useState<string[]>([])

  // Amadeus data state
  const [amadeusData, setAmadeusData] = useState<AmadeusData[]>([])
  const [amadeusCaseStats, setAmadeusCaseStats] = useState<AmadeusCaseStats[]>([])
  const [amadeusAgentStats, setAmadeusAgentStats] = useState<AmadeusAgentStats[]>([])
  const [amadeusWindowStats, setAmadeusWindowStats] = useState<AmadeusWindowStats[]>([])
  const [amadeusActivityStats, setAmadeusActivityStats] = useState<AmadeusActivityStats[]>([])

  // Common state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [
          salesforceData, 
          teamsData, 
          resourcesData,
          amadeusDataResult,
          amadeusCaseStatsResult,
          amadeusAgentStatsResult,
          amadeusWindowStatsResult,
          amadeusActivityStatsResult
        ] = await Promise.all([
          getSalesforceData(),
          getTeams(),
          getResources(),
          getAmadeusData(),
          getAmadeusCaseStats(),
          getAmadeusAgentStats(),
          getAmadeusWindowStats(),
          getAmadeusActivityStats()
        ])
        
        setData(salesforceData)
        setTeams(teamsData)
        setResources(resourcesData)
        setAmadeusData(amadeusDataResult)
        setAmadeusCaseStats(amadeusCaseStatsResult)
        setAmadeusAgentStats(amadeusAgentStatsResult)
        setAmadeusWindowStats(amadeusWindowStatsResult)
        setAmadeusActivityStats(amadeusActivityStatsResult)
      } catch (err) {
        console.error('Error loading data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
        // Set empty arrays as fallback
        setData([])
        setTeams([])
        setResources([])
        setAmadeusData([])
        setAmadeusCaseStats([])
        setAmadeusAgentStats([])
        setAmadeusWindowStats([])
        setAmadeusActivityStats([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Load filtered Salesforce data when filters change
  useEffect(() => {
    const loadFilteredData = async () => {
      if (selectedTeams.length === 0 && selectedResources.length === 0) {
        // If no filters, use all data
        const allData = await getSalesforceData()
        setData(allData)
        return
      }

      try {
        setLoading(true)
        const filteredData = await getFilteredData(selectedTeams, selectedResources)
        setData(filteredData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load filtered data')
      } finally {
        setLoading(false)
      }
    }

    loadFilteredData()
  }, [selectedTeams, selectedResources])

  // Helper functions for Salesforce data analysis
  const getTeamStats = () => {
    const teamStats = teams.map(team => {
      const teamData = data.filter(item => item.Team === team)
      const totalDuration = teamData.reduce((sum, item) => sum + item.duration_seconds, 0)
      const avgDuration = teamData.length > 0 ? totalDuration / teamData.length : 0
      const totalClicks = teamData.reduce((sum, item) => sum + item.mouse_click_count, 0)
      const totalKeypresses = teamData.reduce((sum, item) => sum + item.keypress_count, 0)

      return {
        team,
        count: teamData.length,
        avgDuration,
        totalClicks,
        totalKeypresses
      }
    })

    return teamStats
  }

  const getResourceStats = () => {
    const resourceStats = resources.map(resource => {
      const resourceData = data.filter(item => item.Resource === resource)
      const totalDuration = resourceData.reduce((sum, item) => sum + item.duration_seconds, 0)
      const avgDuration = resourceData.length > 0 ? totalDuration / resourceData.length : 0

      return {
        resource,
        count: resourceData.length,
        avgDuration
      }
    })

    return resourceStats
  }

  const getWindowStats = () => {
    const windowStats = data.reduce((acc, item) => {
      const window = item.Window
      if (!acc[window]) {
        acc[window] = {
          window,
          count: 0,
          totalDuration: 0,
          totalClicks: 0
        }
      }
      acc[window].count++
      acc[window].totalDuration += item.duration_seconds
      acc[window].totalClicks += item.mouse_click_count
      return acc
    }, {} as Record<string, { window: string; count: number; totalDuration: number; totalClicks: number }>)

    return Object.values(windowStats)
  }

  const getActivityStats = () => {
    const activityStats = data.reduce((acc, item) => {
      const activity = item.Activity
      if (!acc[activity]) {
        acc[activity] = {
          activity,
          count: 0,
          totalDuration: 0
        }
      }
      acc[activity].count++
      acc[activity].totalDuration += item.duration_seconds
      return acc
    }, {} as Record<string, { activity: string; count: number; totalDuration: number }>)

    return Object.values(activityStats)
  }

  // Helper functions for Amadeus data analysis
  const getAmadeusTopCases = (limit: number = 10) => {
    return amadeusCaseStats
      .sort((a, b) => b.total_duration - a.total_duration)
      .slice(0, limit)
  }

  const getAmadeusTopAgents = (limit: number = 10) => {
    return amadeusAgentStats
      .sort((a, b) => b.total_cases - a.total_cases)
      .slice(0, limit)
  }

  const getAmadeusTopApplications = (limit: number = 10) => {
    return amadeusWindowStats
      .sort((a, b) => b.total_usage_time - a.total_usage_time)
      .slice(0, limit)
  }

  const getAmadeusTopActivities = (limit: number = 10) => {
    return amadeusActivityStats
      .sort((a, b) => b.total_occurrences - a.total_occurrences)
      .slice(0, limit)
  }

  return {
    // Salesforce data
    data,
    teams,
    resources,
    selectedTeams,
    selectedResources,
    setSelectedTeams,
    setSelectedResources,
    getTeamStats,
    getResourceStats,
    getWindowStats,
    getActivityStats,
    
    // Amadeus data
    amadeusData,
    amadeusCaseStats,
    amadeusAgentStats,
    amadeusWindowStats,
    amadeusActivityStats,
    getAmadeusTopCases,
    getAmadeusTopAgents,
    getAmadeusTopApplications,
    getAmadeusTopActivities,
    
    // Common state
    loading,
    error
  }
}
