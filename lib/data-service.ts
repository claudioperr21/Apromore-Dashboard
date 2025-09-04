import Papa from 'papaparse';

export interface AmadeusData {
  identifier_name: string;
  Case_ID: string;
  original_case_identifier: string;
  case_identifier_source_window_id: string;
  project_id: string;
  team_name: string;
  agent_profile_id: string;
  upn: string;
  machine_name: string;
  visit_id: string;
  window_fragment_id: string;
  duration_seconds: number;
  process_name: string;
  title: string;
  url: string;
  Window: string;
  Activity: string;
  original_activity: string;
  activity_source_window_id: string;
  Step: string;
  Window_Element: string;
  mouse_click_count: number;
  keypress_count: number;
  copy_count: number;
  paste_count: number;
  Screenshot: string;
  Start_Time: string;
  End_Time: string;
}

export interface SalesforceData {
  Team: string;
  Resource: string;
  Case_ID: string;
  Status: string;
  Priority: string;
  Created_Date: string;
  Closed_Date: string;
  Duration_Hours: number;
  Window_Start: string;
  Window_End: string;
  Activity_Type: string;
  Record_Count: number;
}

export interface ProcessMiningData {
  amadeus: AmadeusData[];
  salesforce: SalesforceData[];
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

class DataService {
  private data: ProcessMiningData = {
    amadeus: [],
    salesforce: [],
    loaded: false,
    loading: false,
    error: null
  };

  private listeners: ((data: ProcessMiningData) => void)[] = [];

  // Load all data from CSV files
  async loadAllData(): Promise<void> {
    if (this.data.loading) return;
    
    this.data.loading = true;
    this.data.error = null;
    this.notifyListeners();

    try {
      // Load Amadeus data
      const amadeusData = await this.loadAmadeusData();
      
      // Load Salesforce data
      const salesforceData = await this.loadSalesforceData();

      this.data.amadeus = amadeusData;
      this.data.salesforce = salesforceData;
      this.data.loaded = true;
      this.data.error = null;

      console.log(`✅ Data loaded successfully:`, {
        amadeus: amadeusData.length,
        salesforce: salesforceData.length
      });

    } catch (error) {
      this.data.error = error instanceof Error ? error.message : 'Unknown error loading data';
      console.error('❌ Error loading data:', error);
    } finally {
      this.data.loading = false;
      this.notifyListeners();
    }
  }

  // Load Amadeus data from CSV
  private async loadAmadeusData(): Promise<AmadeusData[]> {
    try {
      const response = await fetch('/amadeus-demo-full-no-fields.csv');
      const csvText = await response.text();
      
      const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transform: (value, field) => {
          // Convert numeric fields
          if (field === 'duration_seconds' || field === 'mouse_click_count' || 
              field === 'keypress_count' || field === 'copy_count' || field === 'paste_count') {
            return parseFloat(value) || 0;
          }
          return value;
        }
      });

      if (result.errors.length > 0) {
        console.warn('⚠️ CSV parsing warnings:', result.errors);
      }

      return result.data as AmadeusData[];
    } catch (error) {
      console.error('Error loading Amadeus data:', error);
      throw new Error('Failed to load Amadeus data');
    }
  }

  // Load Salesforce data from CSV
  private async loadSalesforceData(): Promise<SalesforceData[]> {
    try {
      const response = await fetch('/SalesforceOffice_synthetic_varied_100users_V1.csv');
      const csvText = await response.text();
      
      const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transform: (value, field) => {
          // Convert numeric fields
          if (field === 'Duration_Hours' || field === 'Record_Count') {
            return parseFloat(value) || 0;
          }
          return value;
        }
      });

      if (result.errors.length > 0) {
        console.warn('⚠️ CSV parsing warnings:', result.errors);
      }

      return result.data as SalesforceData[];
    } catch (error) {
      console.error('Error loading Salesforce data:', error);
      throw new Error('Failed to load Salesforce data');
    }
  }

  // Get current data state
  getData(): ProcessMiningData {
    return { ...this.data };
  }

  // Get Amadeus data
  getAmadeusData(): AmadeusData[] {
    return [...this.data.amadeus];
  }

  // Get Salesforce data
  getSalesforceData(): SalesforceData[] {
    return [...this.data.salesforce];
  }

  // Get aggregated statistics
  getStatistics() {
    const amadeus = this.data.amadeus;
    const salesforce = this.data.salesforce;

    return {
      amadeus: {
        totalRecords: amadeus.length,
        totalCases: new Set(amadeus.map(r => r.Case_ID)).size,
        totalAgents: new Set(amadeus.map(r => r.upn)).size,
        totalDuration: amadeus.reduce((sum, r) => sum + (r.duration_seconds || 0), 0),
        applications: [...new Set(amadeus.map(r => r.process_name))],
        activities: [...new Set(amadeus.map(r => r.Activity))],
        windows: [...new Set(amadeus.map(r => r.Window))]
      },
      salesforce: {
        totalRecords: salesforce.length,
        totalTeams: new Set(salesforce.map(r => r.Team)).size,
        totalResources: new Set(salesforce.map(r => r.Resource)).size,
        totalCases: new Set(salesforce.map(r => r.Case_ID)).size,
        statuses: [...new Set(salesforce.map(r => r.Status))],
        priorities: [...new Set(salesforce.map(r => r.Priority))],
        totalDuration: salesforce.reduce((sum, r) => sum + (r.Duration_Hours || 0), 0)
      }
    };
  }

  // Get data for specific case
  getCaseData(caseId: string) {
    const amadeusCase = this.data.amadeus.filter(r => r.Case_ID === caseId);
    const salesforceCase = this.data.salesforce.filter(r => r.Case_ID === caseId);

    return {
      caseId,
      amadeus: amadeusCase,
      salesforce: salesforceCase,
      totalActivities: amadeusCase.length,
      totalDuration: amadeusCase.reduce((sum, r) => sum + (r.duration_seconds || 0), 0),
      applications: [...new Set(amadeusCase.map(r => r.process_name))],
      activities: [...new Set(amadeusCase.map(r => r.Activity))]
    };
  }

  // Get team performance data
  getTeamPerformance() {
    const teamStats = new Map<string, { 
      team: string; 
      totalCases: number; 
      totalDuration: number; 
      avgDuration: number;
      resources: Set<string>;
      statuses: Map<string, number>;
    }>();

    this.data.salesforce.forEach(record => {
      const team = record.Team || 'Unknown';
      const duration = record.Duration_Hours || 0;
      
      if (!teamStats.has(team)) {
        teamStats.set(team, {
          team,
          totalCases: 0,
          totalDuration: 0,
          avgDuration: 0,
          resources: new Set(),
          statuses: new Map()
        });
      }

      const stats = teamStats.get(team)!;
      stats.totalCases++;
      stats.totalDuration += duration;
      stats.resources.add(record.Resource || 'Unknown');
      
      const status = record.Status || 'Unknown';
      stats.statuses.set(status, (stats.statuses.get(status) || 0) + 1);
    });

    // Calculate averages
    teamStats.forEach(stats => {
      stats.avgDuration = stats.totalCases > 0 ? stats.totalDuration / stats.totalCases : 0;
    });

    return Array.from(teamStats.values()).map(stats => ({
      ...stats,
      resources: Array.from(stats.resources),
      statuses: Object.fromEntries(stats.statuses)
    }));
  }

  // Get resource performance data
  getResourcePerformance() {
    const resourceStats = new Map<string, { 
      resource: string; 
      totalCases: number; 
      totalDuration: number; 
      avgDuration: number;
      teams: Set<string>;
      activities: Map<string, number>;
    }>();

    this.data.salesforce.forEach(record => {
      const resource = record.Resource || 'Unknown';
      const duration = record.Duration_Hours || 0;
      
      if (!resourceStats.has(resource)) {
        resourceStats.set(resource, {
          resource,
          totalCases: 0,
          totalDuration: 0,
          avgDuration: 0,
          teams: new Set(),
          activities: new Map()
        });
      }

      const stats = resourceStats.get(resource)!;
      stats.totalCases++;
      stats.totalDuration += duration;
      stats.teams.add(record.Team || 'Unknown');
      
      const activity = record.Activity_Type || 'Unknown';
      stats.activities.set(activity, (stats.activities.get(activity) || 0) + 1);
    });

    // Calculate averages
    resourceStats.forEach(stats => {
      stats.avgDuration = stats.totalCases > 0 ? stats.totalDuration / stats.totalCases : 0;
    });

    return Array.from(resourceStats.values()).map(stats => ({
      ...stats,
      teams: Array.from(stats.teams),
      activities: Object.fromEntries(stats.activities)
    }));
  }

  // Get window/activity patterns
  getWindowPatterns() {
    const windowStats = new Map<string, { 
      window: string; 
      totalActivities: number; 
      totalDuration: number; 
      avgDuration: number;
      cases: Set<string>;
      resources: Set<string>;
    }>();

    this.data.salesforce.forEach(record => {
      const window = record.Window_Start ? 
        new Date(record.Window_Start).getHours().toString() : 'Unknown';
      const duration = record.Duration_Hours || 0;
      
      if (!windowStats.has(window)) {
        windowStats.set(window, {
          window,
          totalActivities: 0,
          totalDuration: 0,
          avgDuration: 0,
          cases: new Set(),
          resources: new Set()
        });
      }

      const stats = windowStats.get(window)!;
      stats.totalActivities++;
      stats.totalDuration += duration;
      stats.cases.add(record.Case_ID || 'Unknown');
      stats.resources.add(record.Resource || 'Unknown');
    });

    // Calculate averages
    windowStats.forEach(stats => {
      stats.avgDuration = stats.totalActivities > 0 ? stats.totalDuration / stats.totalActivities : 0;
    });

    return Array.from(windowStats.values()).map(stats => ({
      ...stats,
      cases: Array.from(stats.cases),
      resources: Array.from(stats.resources)
    }));
  }

  // Subscribe to data changes
  subscribe(listener: (data: ProcessMiningData) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getData()));
  }

  // Check if data is loaded
  isLoaded(): boolean {
    return this.data.loaded;
  }

  // Check if data is loading
  isLoading(): boolean {
    return this.data.loading;
  }

  // Get any error
  getError(): string | null {
    return this.data.error;
  }

  // Reload data
  async reload(): Promise<void> {
    this.data.loaded = false;
    await this.loadAllData();
  }
}

// Create singleton instance
export const dataService = new DataService();

// Auto-load data when service is imported
if (typeof window !== 'undefined') {
  dataService.loadAllData();
}
