// Dashboard Data Types
export interface SalesforceData {
  id: number
  Team: string
  Resource: string
  Window: string
  Duration: number
  Clicks: number
  Keypresses: number
  Timestamp: string
}

export interface AmadeusData {
  id: number
  Case_ID: string
  Activity: string
  Agent: string
  Timestamp: string
  Duration: number
  Window: string
}

export interface TeamStats {
  team: string
  count: number
  avgDuration: number
  totalClicks: number
  totalKeypresses: number
}

export interface ResourceStats {
  resource: string
  count: number
  avgDuration: number
  totalClicks: number
  totalKeypresses: number
}

export interface WindowStats {
  window: string
  count: number
  totalDuration: number
  totalClicks: number
  avgDuration: number
}

export interface ActivityStats {
  activity: string
  count: number
  totalDuration: number
  avgDuration: number
}

// Amadeus Analytics Views
export interface AmadeusCaseStats {
  Case_ID: string
  total_activities: number
  total_duration: number
  avg_duration: number
  unique_agents: number
  unique_windows: number
}

export interface AmadeusAgentStats {
  Agent: string
  total_cases: number
  total_activities: number
  total_duration: number
  avg_duration: number
  efficiency_score: number
}

export interface AmadeusWindowStats {
  Window: string
  total_usage: number
  total_duration: number
  avg_session_duration: number
  unique_users: number
}

export interface AmadeusActivityStats {
  Activity: string
  total_occurrences: number
  total_duration: number
  avg_duration: number
  frequency_rank: number
}

// Database Result Types
export interface DatabaseResult<T> {
  data: T[] | null
  error: any
  count: number | null
}

// Filter and Pagination Types
export interface FilterOptions {
  team?: string
  resource?: string
  window?: string
  dateRange?: {
    start: string
    end: string
  }
}

export interface PaginationOptions {
  page: number
  limit: number
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// AI Chat Types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface AiChatRequest {
  message: string
  context?: {
    hasSalesforceData: boolean
    hasAmadeusData: boolean
    teamCount: number
    resourceCount: number
  }
}

export interface AiChatResponse {
  response: string
  model: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}
