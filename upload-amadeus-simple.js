const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://tjcstfigqpbswblykomp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqY3N0ZmlncXBic3dibHlrb21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNTYxMTksImV4cCI6MjA3MTczMjExOX0.hm0D6dHaXBbZk4Hd7wcXMTP_UTZFjqvb_nMCihZjJIc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadAmadeusData() {
  const results = [];
  
  console.log('📖 Reading Amadeus CSV file...');
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('amadeus-demo-full-no-fields.csv')
      .pipe(csv())
      .on('data', (data) => {
        // Transform the data to match our Amadeus database schema
        const transformedData = {
          identifier_name: data.identifier_name || '',
          "Case_ID": data.Case_ID || '',
          original_case_identifier: data.original_case_identifier || '',
          case_identifier_source_window_id: data.case_identifier_source_window_id || '',
          project_id: data.project_id || '',
          team_name: data.team_name || '',
          agent_profile_id: data.agent_profile_id || '',
          upn: data.upn || '',
          machine_name: data.machine_name || '',
          visit_id: data.visit_id || '',
          window_fragment_id: data.window_fragment_id || '',
          duration_seconds: parseFloat(data.duration_seconds) || 0,
          process_name: data.process_name || '',
          title: data.title || '',
          url: data.url || '',
          "Window": data.Window || '',
          "Activity": data.Activity || '',
          original_activity: data.original_activity || '',
          activity_source_window_id: data.activity_source_window_id || '',
          "Step": data.Step || '',
          "Window_Element": data.Window_Element || '',
          mouse_click_count: parseInt(data.mouse_click_count) || 0,
          keypress_count: parseInt(data.keypress_count) || 0,
          copy_count: parseInt(data.copy_count) || 0,
          paste_count: parseInt(data.paste_count) || 0,
          "Screenshot": data.Screenshot || '',
          "Start_Time": data.Start_Time ? new Date(data.Start_Time).toISOString() : null,
          "End_Time": data.End_Time ? new Date(data.End_Time).toISOString() : null
        };
        results.push(transformedData);
      })
      .on('end', async () => {
        console.log(`✅ Processed ${results.length} Amadeus records`);
        
        try {
          // Clear existing Amadeus data
          console.log('🗑️  Clearing existing Amadeus data...');
          const { error: deleteError } = await supabase
            .from('amadeus_data')
            .delete()
            .neq('id', 0); // Delete all records
          
          if (deleteError) {
            console.error('❌ Error clearing Amadeus data:', deleteError);
            reject(deleteError);
            return;
          }
          
          console.log('✅ Existing data cleared');
          
          // Upload data in batches
          const batchSize = 1000;
          for (let i = 0; i < results.length; i += batchSize) {
            const batch = results.slice(i, i + batchSize);
            const batchNumber = Math.floor(i / batchSize) + 1;
            const totalBatches = Math.ceil(results.length / batchSize);
            
            console.log(`📤 Uploading batch ${batchNumber}/${totalBatches} (${batch.length} records)...`);
            
            const { error } = await supabase
              .from('amadeus_data')
              .insert(batch);
            
            if (error) {
              console.error(`❌ Error uploading batch ${batchNumber}:`, error);
              reject(error);
              return;
            }
            
            console.log(`✅ Batch ${batchNumber} uploaded successfully`);
          }
          
          console.log('🎉 Amadeus data upload completed successfully!');
          console.log(`📊 Total records uploaded: ${results.length}`);
          
          // Verify the upload
          const { count, error: countError } = await supabase
            .from('amadeus_data')
            .select('*', { count: 'exact', head: true });
          
          if (countError) {
            console.warn('⚠️  Could not verify record count:', countError.message);
          } else {
            console.log(`🔍 Verification: ${count} records found in database`);
          }
          
          resolve();
        } catch (error) {
          console.error('❌ Error during Amadeus upload:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('❌ Error reading CSV file:', error);
        reject(error);
      });
  });
}

// Run the upload
console.log('🚀 Starting Amadeus data upload...');
uploadAmadeusData()
  .then(() => {
    console.log('✅ Upload process completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Upload process failed:', error);
    process.exit(1);
  });
