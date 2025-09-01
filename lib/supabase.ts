import { createClient } from '@supabase/supabase-js'

// Use hardcoded values for now to ensure deployment works
const supabaseUrl = 'https://tjcstfigqpbswblykomp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqY3N0ZmlncXBic3dibHlrb21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNTYxMTksImV4cCI6MjA3MTczMjExOX0.hm0D6dHaXBbZk4Hd7wcXMTP_UTZFjqvb_nMCihZjJIc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface SalesforceData {
  Case_ID: string
  agent_profile_id: string
  Resource: string
  machine_name: string
  duration_seconds: number
  Process_Name: string
  Window_Title: string
  URL: string
  Window: string
  Activity: string
  Step: string
  Window_Element: string
  mouse_click_count: number
  keypress_count: number
  copy_count: number
  paste_count: number
  Start_Time: string
  EndTime: string
  Team: string
}

// Amadeus data types
export interface AmadeusData {
  id: number
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
  created_at: string
}

// Amadeus analytics view types
export interface AmadeusCaseStats {
  Case_ID: string
  total_activities: number
  total_duration: number
  avg_activity_duration: number
  unique_windows: number
  unique_activities: number
  unique_agents: number
  total_clicks: number
  total_keypresses: number
  total_copies: number
  total_pastes: number
  first_activity: string
  last_activity: string
  case_duration: string
}

export interface AmadeusAgentStats {
  agent_profile_id: string
  upn: string
  total_activities: number
  total_cases: number
  total_work_time: number
  avg_activity_duration: number
  unique_windows: number
  unique_activities: number
  total_clicks: number
  total_keypresses: number
  total_copies: number
  total_pastes: number
}

export interface AmadeusWindowStats {
  Window: string
  total_activities: number
  unique_cases: number
  unique_agents: number
  total_usage_time: number
  avg_session_duration: number
  total_clicks: number
  total_keypresses: number
  total_copies: number
  total_pastes: number
}

export interface AmadeusActivityStats {
  Activity: string
  total_occurrences: number
  unique_cases: number
  unique_agents: number
  total_time_spent: number
  avg_duration: number
  total_clicks: number
  total_keypresses: number
  total_copies: number
  total_pastes: number
}

// Helper functions for Salesforce data operations
export const getSalesforceData = async () => {
  const { data, error } = await supabase
    .from('salesforce_data')
    .select('*')
  
  if (error) {
    console.error('Error fetching data:', error)
    return []
  }
  
  return data as SalesforceData[]
}

export const getTeams = async () => {
  const { data, error } = await supabase
    .from('salesforce_data')
    .select('"Team"')
    .not('"Team"', 'is', null)
  
  if (error) {
    console.error('Error fetching teams:', error)
    return []
  }
  
  const uniqueTeams = [...new Set(data.map(item => item.Team))]
  return uniqueTeams
}

export const getResources = async () => {
  const { data, error } = await supabase
    .from('salesforce_data')
    .select('"Resource"')
    .not('"Resource"', 'is', null)
  
  if (error) {
    console.error('Error fetching resources:', error)
    return []
  }
  
  const uniqueResources = [...new Set(data.map(item => item.Resource))]
  return uniqueResources
}

export const getFilteredData = async (teamFilter?: string[], resourceFilter?: string[]) => {
  let query = supabase.from('salesforce_data').select('*')
  
  if (teamFilter && teamFilter.length > 0) {
    query = query.in('"Team"', teamFilter)
  }
  
  if (resourceFilter && resourceFilter.length > 0) {
    query = query.in('"Resource"', resourceFilter)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching filtered data:', error)
    return []
  }
  
  return data as SalesforceData[]
}

// Helper functions for Amadeus data operations
export const getAmadeusData = async () => {
  const { data, error } = await supabase
    .from('amadeus_data')
    .select('*')
  
  if (error) {
    console.error('Error fetching Amadeus data:', error)
    return []
  }
  
  return data as AmadeusData[]
}

export const getAmadeusCaseStats = async () => {
  const { data, error } = await supabase
    .from('amadeus_case_stats')
    .select('*')
  
  if (error) {
    console.error('Error fetching Amadeus case stats:', error)
    return []
  }
  
  return data as AmadeusCaseStats[]
}

export const getAmadeusAgentStats = async () => {
  const { data, error } = await supabase
    .from('amadeus_agent_stats')
    .select('*')
  
  if (error) {
    console.error('Error fetching Amadeus agent stats:', error)
    return []
  }
  
  return data as AmadeusAgentStats[]
}

export const getAmadeusWindowStats = async () => {
  const { data, error } = await supabase
    .from('amadeus_window_stats')
    .select('*')
  
  if (error) {
    console.error('Error fetching Amadeus window stats:', error)
    return []
  }
  
  return data as AmadeusWindowStats[]
}

export const getAmadeusActivityStats = async () => {
  const { data, error } = await supabase
    .from('amadeus_activity_stats')
    .select('*')
  
  if (error) {
    console.error('Error fetching Amadeus activity stats:', error)
    return []
  }
  
  return data as AmadeusActivityStats[]
}

export const getAmadeusProcessFlow = async (caseId?: string) => {
  let query = supabase.from('amadeus_process_flow').select('*')
  
  if (caseId) {
    query = query.eq('Case_ID', caseId)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching Amadeus process flow:', error)
    return []
  }
  
  return data
}
