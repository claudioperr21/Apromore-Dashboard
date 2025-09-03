import { createClient } from '@supabase/supabase-js'

// Frontend Supabase client (read-only access)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tjcstfigqpbswblykomp.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqY3N0ZmlncXBic3dibHlrb21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNTYxMTksImV4cCI6MjA3MTczMjExOX0.hm0D6dHaXBbZk4Hd7wcXMTP_UTZFjqvb_nMCihZjJIc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Backend API configuration
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://server-holy-haze-7308.fly.dev'

// API endpoints
export const API_ENDPOINTS = {
  // Salesforce data
  salesforce: {
    teams: `${BACKEND_URL}/api/salesforce/teams`,
    resources: `${BACKEND_URL}/api/salesforce/resources`,
    teamStats: `${BACKEND_URL}/api/salesforce/team-stats`,
    resourceStats: `${BACKEND_URL}/api/salesforce/resource-stats`,
    windowStats: `${BACKEND_URL}/api/salesforce/window-stats`,
  },
  // Amadeus data
  amadeus: {
    caseStats: `${BACKEND_URL}/api/amadeus/case-stats`,
    agentStats: `${BACKEND_URL}/api/amadeus/agent-stats`,
    windowStats: `${BACKEND_URL}/api/amadeus/window-stats`,
    activityStats: `${BACKEND_URL}/api/amadeus/activity-stats`,
  },
  // Dashboard metrics
  dashboard: {
    metrics: `${BACKEND_URL}/api/dashboard/metrics`,
  },
  // AI chat
  ai: {
    chat: `${BACKEND_URL}/api/ai/chat`,
  },
  // Health
  health: {
    status: `${BACKEND_URL}/health`,
    api: `${BACKEND_URL}/api/health`,
  },
} as const

// Helper function to make API calls
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    
    if (result.success) {
      return { data: result.data, error: null }
    } else {
      return { data: null, error: result.error || 'API call failed' }
    }
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Legacy function wrappers for backward compatibility
export const getSalesforceData = async () => {
  const { data, error } = await apiCall(API_ENDPOINTS.dashboard.metrics)
  if (error) throw new Error(error)
  return data?.salesforce?.teamStats || []
}

export const getTeams = async () => {
  const { data, error } = await apiCall(API_ENDPOINTS.salesforce.teams)
  if (error) throw new Error(error)
  return data || []
}

export const getResources = async () => {
  const { data, error } = await apiCall(API_ENDPOINTS.salesforce.resources)
  if (error) throw new Error(error)
  return data || []
}

export const getTeamStats = async () => {
  const { data, error } = await apiCall(API_ENDPOINTS.salesforce.teamStats)
  if (error) throw new Error(error)
  return data || []
}

export const getResourceStats = async () => {
  const { data, error } = await apiCall(API_ENDPOINTS.salesforce.resourceStats)
  if (error) throw new Error(error)
  return data || []
}

export const getWindowStats = async () => {
  const { data, error } = await apiCall(API_ENDPOINTS.salesforce.windowStats)
  if (error) throw new Error(error)
  return data || []
}

export const getAmadeusData = async () => {
  const { data, error } = await apiCall(API_ENDPOINTS.dashboard.metrics)
  if (error) throw new Error(error)
  return data?.amadeus?.caseStats || []
}

export const getAmadeusCaseStats = async () => {
  const { data, error } = await apiCall(API_ENDPOINTS.amadeus.caseStats)
  if (error) throw new Error(error)
  return data || []
}

export const getAmadeusAgentStats = async () => {
  const { data, error } = await apiCall(API_ENDPOINTS.amadeus.agentStats)
  if (error) throw new Error(error)
  return data || []
}

export const getAmadeusWindowStats = async () => {
  const { data, error } = await apiCall(API_ENDPOINTS.amadeus.windowStats)
  if (error) throw new Error(error)
  return data || []
}

export const getAmadeusActivityStats = async () => {
  const { data, error } = await apiCall(API_ENDPOINTS.amadeus.activityStats)
  if (error) throw new Error(error)
  return data || []
}
