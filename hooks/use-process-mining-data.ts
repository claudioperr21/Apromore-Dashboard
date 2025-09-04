import { useState, useEffect } from 'react';
import { dataService, ProcessMiningData, AmadeusData, SalesforceData } from '@/lib/data-service';

export function useProcessMiningData() {
  const [data, setData] = useState<ProcessMiningData>(dataService.getData());

  useEffect(() => {
    const unsubscribe = dataService.subscribe(setData);
    return unsubscribe;
  }, []);

  return {
    // Data state
    data: data.amadeus,
    salesforceData: data.salesforce,
    loaded: data.loaded,
    loading: data.loading,
    error: data.error,

    // Data access methods
    getAmadeusData: () => dataService.getAmadeusData(),
    getSalesforceData: () => dataService.getSalesforceData(),
    
    // Statistics
    getStatistics: () => dataService.getStatistics(),
    
    // Specific data queries
    getCaseData: (caseId: string) => dataService.getCaseData(caseId),
    getTeamPerformance: () => dataService.getTeamPerformance(),
    getResourcePerformance: () => dataService.getResourcePerformance(),
    getWindowPatterns: () => dataService.getWindowPatterns(),
    
    // Actions
    reload: () => dataService.reload(),
    
    // Utility methods
    isLoaded: () => dataService.isLoaded(),
    isLoading: () => dataService.isLoading(),
    getError: () => dataService.getError()
  };
}

// Hook for Amadeus-specific data
export function useAmadeusData() {
  const { data, loaded, loading, error } = useProcessMiningData();
  
  return {
    data,
    loaded,
    loading,
    error,
    
    // Amadeus-specific queries
    getCaseStats: () => {
      const caseStats = new Map<string, {
        caseId: string;
        totalActivities: number;
        totalDuration: number;
        applications: string[];
        activities: string[];
        agents: string[];
      }>();

      data.forEach(record => {
        const caseId = record.Case_ID;
        if (!caseStats.has(caseId)) {
          caseStats.set(caseId, {
            caseId,
            totalActivities: 0,
            totalDuration: 0,
            applications: [],
            activities: [],
            agents: []
          });
        }

        const stats = caseStats.get(caseId)!;
        stats.totalActivities++;
        stats.totalDuration += record.duration_seconds || 0;
        if (record.process_name && !stats.applications.includes(record.process_name)) {
          stats.applications.push(record.process_name);
        }
        if (record.Activity && !stats.activities.includes(record.Activity)) {
          stats.activities.push(record.Activity);
        }
        if (record.upn && !stats.agents.includes(record.upn)) {
          stats.agents.push(record.upn);
        }
      });

      return Array.from(caseStats.values());
    },

    getAgentStats: () => {
      const agentStats = new Map<string, {
        agent: string;
        totalActivities: number;
        totalDuration: number;
        cases: string[];
        applications: string[];
        avgDuration: number;
      }>();

      data.forEach(record => {
        const agent = record.upn;
        if (!agentStats.has(agent)) {
          agentStats.set(agent, {
            agent,
            totalActivities: 0,
            totalDuration: 0,
            cases: [],
            applications: [],
            avgDuration: 0
          });
        }

        const stats = agentStats.get(agent)!;
        stats.totalActivities++;
        stats.totalDuration += record.duration_seconds || 0;
        if (record.Case_ID && !stats.cases.includes(record.Case_ID)) {
          stats.cases.push(record.Case_ID);
        }
        if (record.process_name && !stats.applications.includes(record.process_name)) {
          stats.applications.push(record.process_name);
        }
      });

      // Calculate averages
      agentStats.forEach(stats => {
        stats.avgDuration = stats.totalActivities > 0 ? stats.totalDuration / stats.totalActivities : 0;
      });

      return Array.from(agentStats.values());
    },

    getApplicationStats: () => {
      const appStats = new Map<string, {
        application: string;
        totalActivities: number;
        totalDuration: number;
        cases: string[];
        agents: string[];
        avgDuration: number;
      }>();

      data.forEach(record => {
        const app = record.process_name;
        if (!appStats.has(app)) {
          appStats.set(app, {
            application: app,
            totalActivities: 0,
            totalDuration: 0,
            cases: [],
            agents: [],
            avgDuration: 0
          });
        }

        const stats = appStats.get(app)!;
        stats.totalActivities++;
        stats.totalDuration += record.duration_seconds || 0;
        if (record.Case_ID && !stats.cases.includes(record.Case_ID)) {
          stats.cases.push(record.Case_ID);
        }
        if (record.upn && !stats.agents.includes(record.upn)) {
          stats.agents.push(record.upn);
        }
      });

      // Calculate averages
      appStats.forEach(stats => {
        stats.avgDuration = stats.totalActivities > 0 ? stats.totalDuration / stats.totalActivities : 0;
      });

      return Array.from(appStats.values());
    }
  };
}

// Hook for Salesforce-specific data
export function useSalesforceData() {
  const { salesforceData, loaded, loading, error } = useProcessMiningData();
  
  return {
    data: salesforceData,
    loaded,
    loading,
    error,
    
    // Salesforce-specific queries
    getTeamStats: () => {
      const teamStats = new Map<string, {
        team: string;
        totalCases: number;
        totalDuration: number;
        avgDuration: number;
        resources: string[];
        statuses: Record<string, number>;
        priorities: Record<string, number>;
      }>();

      salesforceData.forEach(record => {
        const team = record.Team || 'Unknown';
        if (!teamStats.has(team)) {
          teamStats.set(team, {
            team,
            totalCases: 0,
            totalDuration: 0,
            avgDuration: 0,
            resources: [],
            statuses: {},
            priorities: {}
          });
        }

        const stats = teamStats.get(team)!;
        stats.totalCases++;
        stats.totalDuration += record.Duration_Hours || 0;
        
        if (record.Resource && !stats.resources.includes(record.Resource)) {
          stats.resources.push(record.Resource);
        }
        
        const status = record.Status || 'Unknown';
        stats.statuses[status] = (stats.statuses[status] || 0) + 1;
        
        const priority = record.Priority || 'Unknown';
        stats.priorities[priority] = (stats.priorities[priority] || 0) + 1;
      });

      // Calculate averages
      teamStats.forEach(stats => {
        stats.avgDuration = stats.totalCases > 0 ? stats.totalDuration / stats.totalCases : 0;
      });

      return Array.from(teamStats.values());
    },

    getResourceStats: () => {
      const resourceStats = new Map<string, {
        resource: string;
        totalCases: number;
        totalDuration: number;
        avgDuration: number;
        teams: string[];
        activities: Record<string, number>;
      }>();

      salesforceData.forEach(record => {
        const resource = record.Resource || 'Unknown';
        if (!resourceStats.has(resource)) {
          resourceStats.set(resource, {
            resource,
            totalCases: 0,
            totalDuration: 0,
            avgDuration: 0,
            teams: [],
            activities: {}
          });
        }

        const stats = resourceStats.get(resource)!;
        stats.totalCases++;
        stats.totalDuration += record.Duration_Hours || 0;
        
        if (record.Team && !stats.teams.includes(record.Team)) {
          stats.teams.push(record.Team);
        }
        
        const activity = record.Activity_Type || 'Unknown';
        stats.activities[activity] = (stats.activities[activity] || 0) + 1;
      });

      // Calculate averages
      resourceStats.forEach(stats => {
        stats.avgDuration = stats.totalCases > 0 ? stats.totalDuration / stats.totalCases : 0;
      });

      return Array.from(resourceStats.values());
    },

    getStatusDistribution: () => {
      const statusCounts: Record<string, number> = {};
      
      salesforceData.forEach(record => {
        const status = record.Status || 'Unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      return Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
        percentage: (count / salesforceData.length) * 100
      }));
    },

    getPriorityDistribution: () => {
      const priorityCounts: Record<string, number> = {};
      
      salesforceData.forEach(record => {
        const priority = record.Priority || 'Unknown';
        priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
      });

      return Object.entries(priorityCounts).map(([priority, count]) => ({
        priority,
        count,
        percentage: (count / salesforceData.length) * 100
      }));
    }
  };
}
