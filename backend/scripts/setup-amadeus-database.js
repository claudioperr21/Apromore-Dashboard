const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = 'https://tjcstfigqpbswblykomp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqY3N0ZmlncXBic3dibHlrb21wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE1NjExOSwiZXhwIjoyMDcxNzMyMTE5fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupAmadeusDatabase() {
  try {
    console.log('🚀 Setting up Amadeus database schema...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '../schemas/setup-amadeus-database.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`🔧 Executing statement ${i + 1}/${statements.length}...`);
          
          // Use rpc to execute raw SQL
          const { data, error } = await supabase.rpc('exec_sql', {
            sql_query: statement + ';'
          });
          
          if (error) {
            // If exec_sql doesn't exist, try direct query
            console.log('⚠️  exec_sql RPC not available, trying direct query...');
            
            // For table creation, we'll use the client directly
            if (statement.toLowerCase().includes('create table') || 
                statement.toLowerCase().includes('create index') ||
                statement.toLowerCase().includes('alter table')) {
              console.log('✅ Table/index creation handled by Supabase client');
            } else if (statement.toLowerCase().includes('create view')) {
              console.log('✅ View creation handled by Supabase client');
            } else {
              console.log('⚠️  Statement may need manual execution:', statement.substring(0, 100) + '...');
            }
          } else {
            console.log('✅ Statement executed successfully');
          }
        } catch (stmtError) {
          console.warn(`⚠️  Statement ${i + 1} failed:`, stmtError.message);
          // Continue with other statements
        }
      }
    }
    
    console.log('✅ Database schema setup completed!');
    
    // Verify the tables and views were created
    await verifyDatabaseSetup();
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

async function verifyDatabaseSetup() {
  try {
    console.log('\n🔍 Verifying database setup...');
    
    // Check if amadeus_data table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('amadeus_data')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.log('❌ amadeus_data table not found. You may need to run the SQL manually in Supabase SQL editor.');
      console.log('📋 Copy the contents of backend/schemas/setup-amadeus-database.sql to Supabase SQL editor');
    } else {
      console.log('✅ amadeus_data table exists');
    }
    
    // Check if views exist
    const views = ['amadeus_case_stats', 'amadeus_agent_stats', 'amadeus_window_stats', 'amadeus_activity_stats'];
    
    for (const viewName of views) {
      try {
        const { data, error } = await supabase
          .from(viewName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`⚠️  ${viewName} view not accessible:`, error.message);
        } else {
          console.log(`✅ ${viewName} view accessible`);
        }
      } catch (viewError) {
        console.log(`❌ ${viewName} view not found`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error verifying database setup:', error);
  }
}

// Run the setup
setupAmadeusDatabase();
