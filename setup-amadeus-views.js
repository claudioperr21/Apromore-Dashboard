const { createClient } = require('@supabase/supabase-js');

// Supabase configuration - using anon key that we know works
const supabaseUrl = 'https://tjcstfigqpbswblykomp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqY3N0ZmlncXBic3dibHlrb21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNTYxMTksImV4cCI6MjA3MTczMjExOX0.hm0D6dHaXBbZk4Hd7wcXMTP_UTZFjqvb_nMCihZjJIc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupAmadeusViews() {
  try {
    console.log('🚀 Setting up Amadeus database views...');
    
    // First, verify the amadeus_data table exists and has data
    const { count, error: countError } = await supabase
      .from('amadeus_data')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error checking amadeus_data table:', countError);
      return;
    }
    
    console.log(`✅ amadeus_data table exists with ${count} records`);
    
    // Create the views that the backend expects
    const views = [
      {
        name: 'amadeus_case_stats',
        sql: `
          CREATE OR REPLACE VIEW amadeus_case_stats AS
          SELECT 
            "Case_ID",
            COUNT(*) as total_activities,
            SUM(duration_seconds) as total_duration,
            AVG(duration_seconds) as avg_activity_duration,
            COUNT(DISTINCT "Window") as unique_windows,
            COUNT(DISTINCT "Activity") as unique_activities,
            COUNT(DISTINCT agent_profile_id) as unique_agents,
            SUM(mouse_click_count) as total_clicks,
            SUM(keypress_count) as total_keypresses,
            SUM(copy_count) as total_copies,
            SUM(paste_count) as total_pastes,
            MIN("Start_Time") as first_activity,
            MAX("End_Time") as last_activity,
            (MAX("End_Time") - MIN("Start_Time")) as case_duration
          FROM amadeus_data
          WHERE "Case_ID" IS NOT NULL AND "Case_ID" != ''
          GROUP BY "Case_ID"
        `
      },
      {
        name: 'amadeus_agent_stats',
        sql: `
          CREATE OR REPLACE VIEW amadeus_agent_stats AS
          SELECT 
            agent_profile_id,
            upn,
            COUNT(*) as total_activities,
            COUNT(DISTINCT "Case_ID") as total_cases,
            SUM(duration_seconds) as total_work_time,
            AVG(duration_seconds) as avg_activity_duration,
            COUNT(DISTINCT "Window") as unique_windows,
            COUNT(DISTINCT "Activity") as unique_activities,
            SUM(mouse_click_count) as total_clicks,
            SUM(keypress_count) as total_keypresses,
            SUM(copy_count) as total_copies,
            SUM(paste_count) as total_pastes
          FROM amadeus_data
          WHERE agent_profile_id IS NOT NULL
          GROUP BY agent_profile_id, upn
        `
      },
      {
        name: 'amadeus_window_stats',
        sql: `
          CREATE OR REPLACE VIEW amadeus_window_stats AS
          SELECT 
            "Window",
            COUNT(*) as total_activities,
            COUNT(DISTINCT "Case_ID") as unique_cases,
            COUNT(DISTINCT agent_profile_id) as unique_agents,
            SUM(duration_seconds) as total_usage_time,
            AVG(duration_seconds) as avg_session_duration,
            SUM(mouse_click_count) as total_clicks,
            SUM(keypress_count) as total_keypresses,
            SUM(copy_count) as total_copies,
            SUM(paste_count) as total_pastes
          FROM amadeus_data
          WHERE "Window" IS NOT NULL
          GROUP BY "Window"
        `
      },
      {
        name: 'amadeus_activity_stats',
        sql: `
          CREATE OR REPLACE VIEW amadeus_activity_stats AS
          SELECT 
            "Activity",
            COUNT(*) as total_occurrences,
            COUNT(DISTINCT "Case_ID") as unique_cases,
            COUNT(DISTINCT agent_profile_id) as unique_agents,
            SUM(duration_seconds) as total_time_spent,
            AVG(duration_seconds) as avg_duration,
            SUM(mouse_click_count) as total_clicks,
            SUM(keypress_count) as total_keypresses,
            SUM(copy_count) as total_copies,
            SUM(paste_count) as total_pastes
          FROM amadeus_data
          WHERE "Activity" IS NOT NULL
          GROUP BY "Activity"
        `
      }
    ];
    
    console.log(`📝 Creating ${views.length} views...`);
    
    for (const view of views) {
      try {
        console.log(`🔧 Creating view: ${view.name}`);
        
        // Try to create the view using RPC if available
        const { error: rpcError } = await supabase.rpc('exec_sql', {
          sql_query: view.sql
        });
        
        if (rpcError) {
          console.log(`⚠️  RPC exec_sql not available for ${view.name}, view may need manual creation`);
          console.log(`📋 SQL for manual execution:`);
          console.log(view.sql);
        } else {
          console.log(`✅ View ${view.name} created successfully`);
        }
      } catch (error) {
        console.warn(`⚠️  Could not create view ${view.name}:`, error.message);
        console.log(`📋 SQL for manual execution:`);
        console.log(view.sql);
      }
    }
    
    console.log('\n🔍 Verifying views...');
    
    // Test if the views are accessible
    for (const view of views) {
      try {
        const { data, error } = await supabase
          .from(view.name)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ View ${view.name} not accessible:`, error.message);
        } else {
          console.log(`✅ View ${view.name} is accessible`);
        }
      } catch (viewError) {
        console.log(`❌ View ${view.name} not found`);
      }
    }
    
    console.log('\n📋 Next steps:');
    console.log('1. If views were not created automatically, copy the SQL statements above to Supabase SQL Editor');
    console.log('2. Test the backend API endpoints');
    console.log('3. Check the dashboard to see if data loads');
    
  } catch (error) {
    console.error('❌ Error setting up views:', error);
  }
}

// Run the setup
console.log('🚀 Starting Amadeus views setup...');
setupAmadeusViews()
  .then(() => {
    console.log('✅ Views setup process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Views setup failed:', error);
    process.exit(1);
  });
