import { createClient } from '@supabase/supabase-js'

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:8080'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Data types
export interface AmadeusData {
  identifier_name: string
  Case_ID: string
  original_case_identifier: string
  case_identifier_source_window_id: string
  project_id: string
  team_name: string
  agent_profile_id: string
  upn: string
  machine_name: string
  visit_id: string
  window_fragment_id: string
  duration_seconds: number
  process_name: string
  title: string
  url: string
  Window: string
  Activity: string
  original_activity: string
  activity_source_window_id: string
  Step: string
  Window_Element: string
  mouse_click_count: number
  keypress_count: number
  copy_count: number
  paste_count: number
  Screenshot: string
  Start_Time: string
  End_Time: string
  Resource?: string
  Team?: string
}

export interface SalesforceData {
  Team: string
  Resource: string
  Case_ID: string
  Status: string
  Priority: string
  Created_Date: string
  Closed_Date: string
  Duration_Hours: number
  Window_Start: string
  Window_End: string
  Activity_Type: string
  Record_Count: number
  duration_seconds?: number
  mouse_click_count?: number
  keypress_count?: number
  Window?: string
  Activity?: string
  Step?: string
}

export interface AmadeusCaseStats {
  Case_ID: string
  total_duration: number
  total_activities: number
  case_duration: string
}

export interface AmadeusAgentStats {
  agent_profile_id: string
  upn: string
  total_cases: number
  total_work_time: number
  avg_activity_duration: number
}

export interface AmadeusWindowStats {
  Window: string
  total_usage_time: number
  unique_cases: number
  total_activities: number
}

export interface AmadeusActivityStats {
  Activity: string
  total_occurrences: number
  unique_cases: number
  total_time_spent: number
}

// API functions that call the backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export const getSalesforceData = async (): Promise<SalesforceData[]> => {
  try {
    const response = await fetch(`${API_BASE}/salesforce/data`)
    const result = await response.json()
    return result.success ? result.data || [] : []
  } catch (error) {
    console.error('Error fetching Salesforce data:', error)
    return []
  }
}

export const getTeams = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE}/salesforce/teams`)
    const result = await response.json()
    return result.success ? result.data || [] : []
  } catch (error) {
    console.error('Error fetching teams:', error)
    return []
  }
}

export const getResources = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE}/salesforce/resources`)
    const result = await response.json()
    return result.success ? result.data || [] : []
  } catch (error) {
    console.error('Error fetching resources:', error)
    return []
  }
}

export const getFilteredData = async (teamFilter?: string[], resourceFilter?: string[]): Promise<SalesforceData[]> => {
  try {
    const params = new URLSearchParams()
    if (teamFilter && teamFilter.length > 0) {
      params.append('teams', teamFilter.join(','))
    }
    if (resourceFilter && resourceFilter.length > 0) {
      params.append('resources', resourceFilter.join(','))
    }
    
    const response = await fetch(`${API_BASE}/salesforce/filtered?${params}`)
    const result = await response.json()
    return result.success ? result.data || [] : []
  } catch (error) {
    console.error('Error fetching filtered data:', error)
    return []
  }
}

export const getAmadeusData = async (): Promise<AmadeusData[]> => {
  try {
    const response = await fetch(`${API_BASE}/amadeus/data`)
    const result = await response.json()
    return result.success ? result.data || [] : []
  } catch (error) {
    console.error('Error fetching Amadeus data:', error)
    return []
  }
}

export const getAmadeusCaseStats = async (): Promise<AmadeusCaseStats[]> => {
  try {
    const response = await fetch(`${API_BASE}/amadeus/case-stats`)
    const result = await response.json()
    return result.success ? result.data || [] : []
  } catch (error) {
    console.error('Error fetching Amadeus case stats:', error)
    return []
  }
}

export const getAmadeusAgentStats = async (): Promise<AmadeusAgentStats[]> => {
  try {
    const response = await fetch(`${API_BASE}/amadeus/agent-stats`)
    const result = await response.json()
    return result.success ? result.data || [] : []
  } catch (error) {
    console.error('Error fetching Amadeus agent stats:', error)
    return []
  }
}

export const getAmadeusWindowStats = async (): Promise<AmadeusWindowStats[]> => {
  try {
    const response = await fetch(`${API_BASE}/amadeus/window-stats`)
    const result = await response.json()
    return result.success ? result.data || [] : []
  } catch (error) {
    console.error('Error fetching Amadeus window stats:', error)
    return []
  }
}

export const getAmadeusActivityStats = async (): Promise<AmadeusActivityStats[]> => {
  try {
    const response = await fetch(`${API_BASE}/amadeus/activity-stats`)
    const result = await response.json()
    return result.success ? result.data || [] : []
  } catch (error) {
    console.error('Error fetching Amadeus activity stats:', error)
    return []
  }
}

export const getAmadeusProcessFlow = async (caseId?: string): Promise<any[]> => {
  try {
    const params = caseId ? `?caseId=${caseId}` : ''
    const response = await fetch(`${API_BASE}/amadeus/process-flow${params}`)
    const result = await response.json()
    return result.success ? result.data || [] : []
  } catch (error) {
    console.error('Error fetching Amadeus process flow:', error)
    return []
  }
}
