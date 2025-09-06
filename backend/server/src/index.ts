import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// CORS configuration - allow both localhost and Vercel domains
const allowedOrigins = [
  'http://localhost:3000',
  'https://apromore-dashboard-new.vercel.app',
  'https://apromore-dashboard-r3jdlj3bd-claudper-7214s-projects.vercel.app',
  'https://apromore-dashboard-9itazk7oa-claudper-7214s-projects.vercel.app',
  'https://apromore-dashboard-20nuga8n5-claudper-7214s-projects.vercel.app',
  'https://apromore-dashboard-jt9rz0mb8-claudper-7214s-projects.vercel.app',
  'https://apromore-dashboard-q50cp8vh1-claudper-7214s-projects.vercel.app'  // ✅ Latest deployment
];

// Middleware
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Supabase client - enforce service role
const must = (k: string) => {
  const v = process.env[k];
  if (!v) throw new Error(`Missing required env: ${k}`);
  return v;
};

const supabaseUrl = must('SUPABASE_URL');                 // project URL
const supabaseServiceKey = must('SUPABASE_SERVICE_KEY');  // service role only

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

// OpenAI client (optional)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Database schema check endpoint
app.get('/api/db/schema', async (req, res) => {
  try {
    // Check what tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) throw tablesError;
    
    // Check what views exist
    const { data: views, error: viewsError } = await supabase
      .from('information_schema.views')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (viewsError) throw viewsError;
    
    res.json({
      success: true,
      data: {
        tables: tables?.map(t => t.table_name) || [],
        views: views?.map(v => v.table_name) || []
      }
    });
  } catch (error) {
    console.error('Error checking database schema:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Database data check endpoint
app.get('/api/db/data-check', async (req, res) => {
  try {
    // Check if amadeus_data table has data
    const { count: amadeusCount, error: amadeusError } = await supabase
      .from('amadeus_data')
      .select('*', { count: 'exact', head: true });
    
    if (amadeusError) {
      res.json({
        success: true,
        data: {
          amadeus_data: { exists: false, count: 0, error: amadeusError.message }
        }
      });
      return;
    }
    
    // Check if salesforce tables have data
    const { count: teamCount, error: teamError } = await supabase
      .from('team_stats')
      .select('*', { count: 'exact', head: true });
    
    res.json({
      success: true,
      data: {
        amadeus_data: { exists: true, count: amadeusCount || 0 },
        team_stats: { exists: !teamError, count: teamCount || 0 }
      }
    });
  } catch (error) {
    console.error('Error checking database data:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Database setup instructions endpoint
app.get('/api/db/setup-instructions', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Database schema setup required',
      steps: [
        '1. Run the Amadeus database schema script: backend/schemas/setup-amadeus-database.sql',
        '2. Upload Amadeus data using: backend/scripts/upload-amadeus-to-supabase.js',
        '3. Ensure Supabase service key has proper permissions',
        '4. Check that all required tables and views are created'
      ],
      files: [
        'backend/schemas/setup-amadeus-database.sql',
        'backend/scripts/upload-amadeus-to-supabase.js'
      ],
      note: 'The backend will return 404 errors until the database schema is properly set up.'
    }
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Dashboard Backend API is running!' });
});

// Database diagnostic endpoint
app.get('/api/db/diagnose', async (req, res) => {
  try {
    console.log('🔍 Running database diagnostics...');
    
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      supabase_url: supabaseUrl,
      connection_test: null,
      table_check: null,
      view_check: null,
      data_check: null
    };
    
    // Test 1: Basic connection - try to access a simple table
    try {
      const { data: connectionTest, error: connectionError } = await supabase
        .from('amadeus_data')
        .select('id')
        .limit(1);
      
      if (connectionError) {
        diagnostics.connection_test = { success: false, error: connectionError.message };
      } else {
        diagnostics.connection_test = { success: true, tables_found: 1 };
      }
    } catch (error: any) {
      diagnostics.connection_test = { success: false, error: error.message };
    }
    
    // Test 2: Check for amadeus_data table
    try {
      const { count: tableCount, error: tableError } = await supabase
        .from('amadeus_data')
        .select('*', { count: 'exact', head: true });
      
      if (tableError) {
        diagnostics.table_check = { success: false, error: tableError.message };
      } else {
        diagnostics.table_check = { 
          success: true, 
          table_exists: true,
          table_name: 'amadeus_data'
        };
      }
    } catch (error: any) {
      diagnostics.table_check = { success: false, error: error.message };
    }
    
    // Test 3: Check for views
    try {
      const { data: viewCheck, error: viewError } = await supabase
        .from('amadeus_case_stats')
        .select('*')
        .limit(1);
      
      if (viewError) {
        diagnostics.view_check = { success: false, error: viewError.message };
      } else {
        diagnostics.view_check = { 
          success: true, 
          views_found: 1,
          view_names: ['amadeus_case_stats']
        };
      }
    } catch (error: any) {
      diagnostics.view_check = { success: false, error: error.message };
    }
    
    // Test 4: Try to access amadeus_data directly
    try {
      const { count, error: dataError } = await supabase
        .from('amadeus_data')
        .select('*', { count: 'exact', head: true });
      
      if (dataError) {
        diagnostics.data_check = { success: false, error: dataError.message };
      } else {
        diagnostics.data_check = { success: true, record_count: count || 0 };
      }
    } catch (error: any) {
      diagnostics.data_check = { success: false, error: error.message };
    }
    
    console.log('✅ Diagnostics completed');
    res.json({ success: true, data: diagnostics });
    
  } catch (error: any) {
    console.error('❌ Error running diagnostics:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Unknown error' 
    });
  }
});


// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    // Get relevant data context from Supabase
    let dataContext = '';
    try {
      const [teamStats, resourceStats, amadeusStats] = await Promise.all([
        supabase.from('team_stats').select('*').limit(3),
        supabase.from('resource_stats').select('*').limit(3),
        supabase.from('amadeus_case_stats').select('*').limit(3)
      ]);

      dataContext = `
        Current Dashboard Data Context:
        - Top Teams: ${teamStats.data?.map(t => `${t.Team} (${t.total_records} records)`).join(', ') || 'No data'}
        - Top Resources: ${resourceStats.data?.map(r => `${r.Resource} (${r.total_records} records)`).join(', ') || 'No data'}
        - Top Cases: ${amadeusStats.data?.map(c => `Case ${c.Case_ID} (${c.total_activities} activities)`).join(', ') || 'No data'}
      `;
    } catch (error) {
      console.warn('Could not fetch data context:', error);
      dataContext = 'Dashboard data context unavailable.';
    }

    // Create system prompt for the AI
    const systemPrompt = `You are a Task Mining Assistant, an AI expert in process mining and workflow analysis. You help users understand their business processes, identify bottlenecks, and optimize workflows.

${dataContext}

Your role is to:
1. Analyze process mining data and provide insights
2. Help identify performance bottlenecks and optimization opportunities
3. Explain complex workflow patterns in simple terms
4. Suggest process improvements based on data analysis
5. Answer questions about team performance, resource utilization, and process efficiency

Keep responses concise, actionable, and focused on business value. Use the data context when available to provide specific insights.`;

    // Call OpenAI API (if available)
    let aiResponse = 'I apologize, but the AI assistant is not available at the moment.';
    
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          max_tokens: 500,
          temperature: 0.7,
        });

        aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';
      } catch (error) {
        console.error('OpenAI API error:', error);
        aiResponse = 'I apologize, but there was an error processing your request.';
      }
    }

    res.json({ 
      success: true, 
      data: {
        response: aiResponse,
        model: openai ? "gpt-4o-mini" : "unavailable",
        usage: null
      }
    });

  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error in AI processing' 
    });
  }
});

// Salesforce data endpoints
app.get('/api/salesforce/data', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('amadeus_data')
      .select('*');
    
    if (error) throw error;
    
    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error fetching Salesforce data:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.get('/api/salesforce/teams', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('amadeus_data')
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
      .from('amadeus_data')
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

app.get('/api/salesforce/filtered', async (req, res) => {
  try {
    const { teams, resources } = req.query;
    
    let query = supabase.from('amadeus_data').select('*');
    
    if (teams) {
      const teamArray = Array.isArray(teams) ? teams : (typeof teams === 'string' ? teams.split(',') : []);
      query = query.in('Team', teamArray);
    }
    
    if (resources) {
      const resourceArray = Array.isArray(resources) ? resources : (typeof resources === 'string' ? resources.split(',') : []);
      query = query.in('Resource', resourceArray);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error fetching filtered data:', error);
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
app.get('/api/amadeus/data', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('amadeus_data')
      .select('*');
    
    if (error) throw error;
    
    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error fetching Amadeus data:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.get('/api/amadeus/case-stats', async (req, res) => {
  try {
    // Query amadeus_data table directly and aggregate case statistics
    const { data, error } = await supabase
      .from('amadeus_data')
      .select('Case_ID, duration_seconds, Activity');
    
    if (error) throw error;
    
    // Aggregate case statistics
    const caseStats = data.reduce((acc: any, row) => {
      const caseId = row.Case_ID;
      if (!acc[caseId]) {
        acc[caseId] = {
          Case_ID: caseId,
          total_duration: 0,
          total_activities: 0,
          case_duration: '0m'
        };
      }
      acc[caseId].total_duration += row.duration_seconds || 0;
      acc[caseId].total_activities += 1;
      return acc;
    }, {});
    
    // Convert to array and format duration
    const result = Object.values(caseStats).map((case_: any) => ({
      ...case_,
      case_duration: `${Math.round(case_.total_duration / 60 * 100) / 100}m`
    }));
    
    res.json({ success: true, data: result });
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
    // Query amadeus_data table directly and aggregate agent statistics
    const { data, error } = await supabase
      .from('amadeus_data')
      .select('agent_profile_id, upn, Case_ID, duration_seconds');
    
    if (error) throw error;
    
    // Aggregate agent statistics
    const agentStats = data.reduce((acc: any, row) => {
      const agentId = row.agent_profile_id;
      if (!acc[agentId]) {
        acc[agentId] = {
          agent_profile_id: agentId,
          upn: row.upn,
          total_cases: new Set(),
          total_work_time: 0,
          avg_activity_duration: 0
        };
      }
      acc[agentId].total_cases.add(row.Case_ID);
      acc[agentId].total_work_time += row.duration_seconds || 0;
      return acc;
    }, {});
    
    // Convert to array and calculate averages
    const result = Object.values(agentStats).map((agent: any) => ({
      agent_profile_id: agent.agent_profile_id,
      upn: agent.upn,
      total_cases: agent.total_cases.size,
      total_work_time: agent.total_work_time,
      avg_activity_duration: agent.total_work_time / data.filter(d => d.agent_profile_id === agent.agent_profile_id).length
    }));
    
    res.json({ success: true, data: result });
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
    // Query amadeus_data table directly and aggregate window statistics
    const { data, error } = await supabase
      .from('amadeus_data')
      .select('Window, duration_seconds, Case_ID, Activity');
    
    if (error) throw error;
    
    // Aggregate window statistics
    const windowStats = data.reduce((acc: any, row) => {
      const window = row.Window;
      if (!acc[window]) {
        acc[window] = {
          Window: window,
          total_usage_time: 0,
          unique_cases: new Set(),
          total_activities: 0
        };
      }
      acc[window].total_usage_time += row.duration_seconds || 0;
      acc[window].unique_cases.add(row.Case_ID);
      acc[window].total_activities += 1;
      return acc;
    }, {});
    
    // Convert to array
    const result = Object.values(windowStats).map((window: any) => ({
      Window: window.Window,
      total_usage_time: window.total_usage_time,
      unique_cases: window.unique_cases.size,
      total_activities: window.total_activities
    }));
    
    res.json({ success: true, data: result });
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
    // Query amadeus_data table directly and aggregate activity statistics
    const { data, error } = await supabase
      .from('amadeus_data')
      .select('Activity, duration_seconds, Case_ID');
    
    if (error) throw error;
    
    // Aggregate activity statistics
    const activityStats = data.reduce((acc: any, row) => {
      const activity = row.Activity;
      if (!acc[activity]) {
        acc[activity] = {
          Activity: activity,
          total_occurrences: 0,
          unique_cases: new Set(),
          total_time_spent: 0
        };
      }
      acc[activity].total_occurrences += 1;
      acc[activity].unique_cases.add(row.Case_ID);
      acc[activity].total_time_spent += row.duration_seconds || 0;
      return acc;
    }, {});
    
    // Convert to array
    const result = Object.values(activityStats).map((activity: any) => ({
      Activity: activity.Activity,
      total_occurrences: activity.total_occurrences,
      unique_cases: activity.unique_cases.size,
      total_time_spent: activity.total_time_spent
    }));
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching Amadeus activity stats:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Temporary confirmation endpoint for Amadeus data
app.get('/api/amadeus/_confirm', async (_req, res) => {
  try {
    const { count } = await supabase
      .from('amadeus_data')
      .select('*', { count: 'exact', head: true });

    const { data: sample, error } = await supabase
      .from('amadeus_data')
      .select('Case_ID, Window, Activity, duration_seconds')
      .limit(3);

    if (error) throw error;
    res.json({
      source: 'supabase',
      table: 'amadeus_data',
      rowCount: count ?? 0,
      sample,
    });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || 'unknown' });
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
  console.log(`🤖 AI Chat endpoint available at http://localhost:${PORT}/api/ai/chat`);
});

export default app;
