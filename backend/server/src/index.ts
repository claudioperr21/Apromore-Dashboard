import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://tjcstfigqpbswblykomp.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Dashboard Backend API is running!' });
});

// Salesforce data endpoints
app.get('/api/salesforce/teams', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('salesforce_data')
      .select('Team')
      .not('Team', 'is', null);
    
    if (error) throw error;
    
    const uniqueTeams = [...new Set(data.map(item => item.Team))];
    res.json({ success: true, data: uniqueTeams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.get('/api/salesforce/resources', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('salesforce_data')
      .select('Resource')
      .not('Resource', 'is', null);
    
    if (error) throw error;
    
    const uniqueResources = [...new Set(data.map(item => item.Resource))];
    res.json({ success: true, data: uniqueResources });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.get('/api/salesforce/team-stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('team_stats')
      .select('*');
    
    if (error) throw error;
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching team stats:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.get('/api/salesforce/resource-stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('resource_stats')
      .select('*');
    
    if (error) throw error;
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching resource stats:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.get('/api/salesforce/window-stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('window_stats')
      .select('*');
    
    if (error) throw error;
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching window stats:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Amadeus data endpoints
app.get('/api/amadeus/case-stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('amadeus_case_stats')
      .select('*');
    
    if (error) throw error;
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Amadeus case stats:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.get('/api/amadeus/agent-stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('amadeus_agent_stats')
      .select('*');
    
    if (error) throw error;
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Amadeus agent stats:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.get('/api/amadeus/window-stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('amadeus_window_stats')
      .select('*');
    
    if (error) throw error;
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Amadeus window stats:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.get('/api/amadeus/activity-stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('amadeus_activity_stats')
      .select('*');
    
    if (error) throw error;
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Amadeus activity stats:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Dashboard metrics endpoint
app.get('/api/dashboard/metrics', async (req, res) => {
  try {
    const [
      teamStats,
      resourceStats,
      windowStats,
      amadeusCaseStats,
      amadeusAgentStats
    ] = await Promise.all([
      supabase.from('team_stats').select('*'),
      supabase.from('resource_stats').select('*'),
      supabase.from('window_stats').select('*'),
      supabase.from('amadeus_case_stats').select('*'),
      supabase.from('amadeus_agent_stats').select('*')
    ]);

    res.json({
      success: true,
      data: {
        salesforce: {
          teamStats: teamStats.data || [],
          resourceStats: resourceStats.data || [],
          windowStats: windowStats.data || []
        },
        amadeus: {
          caseStats: amadeusCaseStats.data || [],
          agentStats: amadeusAgentStats.data || []
        }
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Dashboard Backend Server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
});

export default app;
