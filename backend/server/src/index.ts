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

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';

    res.json({ 
      success: true, 
      data: {
        response: aiResponse,
        model: "gpt-4o-mini",
        usage: completion.usage
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
    // First check if the table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('amadeus_case_stats')
      .select('*')
      .limit(1);
    
    if (tableError) {
      if (tableError.code === '42P01') { // Table doesn't exist
        return res.status(404).json({ 
          success: false, 
          error: 'Amadeus case stats table not found. Database schema may not be set up yet.',
          code: 'TABLE_NOT_FOUND',
          suggestion: 'Run the database setup scripts to create required tables and views.'
        });
      }
      throw tableError;
    }
    
    // If table exists, fetch the data
    const { data, error } = await supabase
      .from('amadeus_case_stats')
      .select('*');
    
    if (error) throw error;
    
    res.json({ success: true, data: data || [] });
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
    // First check if the table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('amadeus_agent_stats')
      .select('*')
      .limit(1);
    
    if (tableError) {
      if (tableError.code === '42P01') { // Table doesn't exist
        return res.status(404).json({ 
          success: false, 
          error: 'Amadeus agent stats table not found. Database schema may not be set up yet.',
          code: 'TABLE_NOT_FOUND',
          suggestion: 'Run the database setup scripts to create required tables and views.'
        });
      }
      throw tableError;
    }
    
    // If table exists, fetch the data
    const { data, error } = await supabase
      .from('amadeus_agent_stats')
      .select('*');
    
    if (error) throw error;
    
    res.json({ success: true, data: data || [] });
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
    // First check if the table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('amadeus_window_stats')
      .select('*')
      .limit(1);
    
    if (tableError) {
      if (tableError.code === '42P01') { // Table doesn't exist
        return res.status(404).json({ 
          success: false, 
          error: 'Amadeus window stats table not found. Database schema may not be set up yet.',
          code: 'TABLE_NOT_FOUND',
          suggestion: 'Run the database setup scripts to create required tables and views.'
        });
      }
      throw tableError;
    }
    
    // If table exists, fetch the data
    const { data, error } = await supabase
      .from('amadeus_window_stats')
      .select('*');
    
    if (error) throw error;
    
    res.json({ success: true, data: data || [] });
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
    // First check if the table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('amadeus_activity_stats')
      .select('*')
      .limit(1);
    
    if (tableError) {
      if (tableError.code === '42P01') { // Table doesn't exist
        return res.status(404).json({ 
          success: false, 
          error: 'Amadeus activity stats table not found. Database schema may not be set up yet.',
          code: 'TABLE_NOT_FOUND',
          suggestion: 'Run the database setup scripts to create required tables and views.'
        });
      }
      throw tableError;
    }
    
    // If table exists, fetch the data
    const { data, error } = await supabase
      .from('amadeus_activity_stats')
      .select('*');
    
    if (error) throw error;
    
    res.json({ success: true, data: data || [] });
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
  console.log(`🤖 AI Chat endpoint available at http://localhost:${PORT}/api/ai/chat`);
});

export default app;
