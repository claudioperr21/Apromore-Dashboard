import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

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

// Helper functions for data operations
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
    .select('Team')
    .not('Team', 'is', null)
  
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
    .select('Resource')
    .not('Resource', 'is', null)
  
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
    query = query.in('Team', teamFilter)
  }
  
  if (resourceFilter && resourceFilter.length > 0) {
    query = query.in('Resource', resourceFilter)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching filtered data:', error)
    return []
  }
  
  return data as SalesforceData[]
}
