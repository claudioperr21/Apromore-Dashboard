const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Hardcode the values for the upload script
const supabaseUrl = 'https://tjcstfigqpbswblykomp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqY3N0ZmlncXBic3dibHlrb21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNTYxMTksImV4cCI6MjA3MTczMjExOX0.hm0D6dHaXBbZk4Hd7wcXMTP_UTZFjqvb_nMCihZjJIc';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadData() {
  const results = [];
  
  console.log('Reading CSV file...');
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('SalesforceOffice_with_Teams.csv')
      .pipe(csv())
      .on('data', (data) => {
                 // Transform the data to match our database schema
         const transformedData = {
           "Case_ID": data.Case_ID,
           agent_profile_id: data.agent_profile_id,
           "Resource": data.Resource,
           machine_name: data.machine_name,
           duration_seconds: parseInt(data.duration_seconds) || 0,
           "Process_Name": data['Process Name'],
           "Window_Title": data['Window Title'],
           "URL": data.URL,
           "Window": data.Window,
           "Activity": data.Activity,
           "Step": data.Step,
           "Window_Element": data['Window Element'],
           mouse_click_count: parseInt(data.mouse_click_count) || 0,
           keypress_count: parseInt(data.keypress_count) || 0,
           copy_count: parseInt(data.copy_count) || 0,
           paste_count: parseInt(data.paste_count) || 0,
           "Start_Time": data['Start Time'],
           "EndTime": data.EndTime,
           "Team": data.Team
         };
        results.push(transformedData);
      })
      .on('end', async () => {
        console.log(`Processed ${results.length} records`);
        
        try {
          // Clear existing data
          console.log('Clearing existing data...');
          const { error: deleteError } = await supabase
            .from('salesforce_data')
            .delete()
            .neq('id', 0); // Delete all records
          
          if (deleteError) {
            console.error('Error clearing data:', deleteError);
            reject(deleteError);
            return;
          }
          
          // Upload data in batches
          const batchSize = 1000;
          for (let i = 0; i < results.length; i += batchSize) {
            const batch = results.slice(i, i + batchSize);
            console.log(`Uploading batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(results.length / batchSize)}...`);
            
            const { error } = await supabase
              .from('salesforce_data')
              .insert(batch);
            
            if (error) {
              console.error('Error uploading batch:', error);
              reject(error);
              return;
            }
          }
          
          console.log('Data upload completed successfully!');
          resolve();
        } catch (error) {
          console.error('Error during upload:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        reject(error);
      });
  });
}

// Run the upload
uploadData()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
