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
  'https://apromore-dashboard-jt9rz0mb8-claudper-7214s-projects.vercel.app'  // ✅ Latest deployment
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
const supabaseUrl = process.env.SUPABASE_URL || 'https://tjcstfigqpbswblykomp.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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',
});

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
  console.log(`🤖 AI Chat endpoint available at http://localhost:${PORT}/api/ai/chat`);
});

export default app;
