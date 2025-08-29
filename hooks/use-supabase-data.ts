import { useState, useEffect } from 'react'
import { getSalesforceData, getTeams, getResources, getFilteredData, SalesforceData } from '@/lib/supabase'

export const useSupabaseData = () => {
  const [data, setData] = useState<SalesforceData[]>([])
  const [teams, setTeams] = useState<string[]>([])
  const [resources, setResources] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [selectedResources, setSelectedResources] = useState<string[]>([])

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [salesforceData, teamsData, resourcesData] = await Promise.all([
          getSalesforceData(),
          getTeams(),
          getResources()
        ])
        
        setData(salesforceData)
        setTeams(teamsData)
        setResources(resourcesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Load filtered data when filters change
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

  // Helper functions for data analysis
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

  return {
    data,
    teams,
    resources,
    loading,
    error,
    selectedTeams,
    selectedResources,
    setSelectedTeams,
    setSelectedResources,
    getTeamStats,
    getResourceStats,
    getWindowStats,
    getActivityStats
  }
}
