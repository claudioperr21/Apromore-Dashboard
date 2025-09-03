// Re-export from backend services
export { supabase } from '@/backend/supabase/config'

// Re-export types from backend
export type {
  SalesforceData,
  AmadeusData,
  AmadeusCaseStats,
  AmadeusAgentStats,
  AmadeusWindowStats,
  AmadeusActivityStats
} from '@/backend/supabase/types'

// Re-export helper functions from backend services
export { 
  SalesforceService,
  AmadeusService,
  AnalyticsService
} from '@/backend/supabase/services'

// Legacy function wrappers for backward compatibility
export const getSalesforceData = async () => {
  const result = await SalesforceService.getAllData()
  return result.data || []
}

export const getTeams = async () => {
  const result = await SalesforceService.getTeams()
  return result.data || []
}

export const getResources = async () => {
  const result = await SalesforceService.getResources()
  return result.data || []
}

export const getFilteredData = async (teamFilter?: string[], resourceFilter?: string[]) => {
  const filters = {
    teams: teamFilter,
    resources: resourceFilter
  }
  const result = await SalesforceService.getFilteredData(filters)
  return result.data || []
}

export const getAmadeusData = async () => {
  const result = await AmadeusService.getAllData()
  return result.data || []
}

export const getAmadeusCaseStats = async () => {
  const result = await AmadeusService.getCaseStats()
  return result.data || []
}

export const getAmadeusAgentStats = async () => {
  const result = await AmadeusService.getAgentStats()
  return result.data || []
}

export const getAmadeusWindowStats = async () => {
  const result = await AmadeusService.getWindowStats()
  return result.data || []
}

export const getAmadeusActivityStats = async () => {
  const result = await AmadeusService.getActivityStats()
  return result.data || []
}

export const getAmadeusProcessFlow = async (caseId?: string) => {
  const result = await AmadeusService.getProcessFlow(caseId)
  return result.data || []
}
