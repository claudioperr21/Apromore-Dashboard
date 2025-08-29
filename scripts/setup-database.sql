-- Create the salesforce_data table
CREATE TABLE IF NOT EXISTS salesforce_data (
  id BIGSERIAL PRIMARY KEY,
  Case_ID TEXT,
  agent_profile_id TEXT,
  Resource TEXT,
  machine_name TEXT,
  duration_seconds INTEGER,
  Process_Name TEXT,
  Window_Title TEXT,
  URL TEXT,
  Window TEXT,
  Activity TEXT,
  Step TEXT,
  Window_Element TEXT,
  mouse_click_count INTEGER,
  keypress_count INTEGER,
  copy_count INTEGER,
  paste_count INTEGER,
  Start_Time TEXT,
  EndTime TEXT,
  Team TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_salesforce_data_team ON salesforce_data(Team);
CREATE INDEX IF NOT EXISTS idx_salesforce_data_resource ON salesforce_data(Resource);
CREATE INDEX IF NOT EXISTS idx_salesforce_data_window ON salesforce_data(Window);
CREATE INDEX IF NOT EXISTS idx_salesforce_data_activity ON salesforce_data(Activity);
CREATE INDEX IF NOT EXISTS idx_salesforce_data_case_id ON salesforce_data(Case_ID);

-- Enable Row Level Security (RLS)
ALTER TABLE salesforce_data ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
-- You can modify this based on your security requirements
CREATE POLICY "Allow all operations for authenticated users" ON salesforce_data
  FOR ALL USING (true);

-- Create a policy that allows read access for anonymous users (for public dashboard)
CREATE POLICY "Allow read access for anonymous users" ON salesforce_data
  FOR SELECT USING (true);

-- Create a view for team statistics
CREATE OR REPLACE VIEW team_stats AS
SELECT 
  Team,
  COUNT(*) as total_records,
  AVG(duration_seconds) as avg_duration,
  SUM(mouse_click_count) as total_clicks,
  SUM(keypress_count) as total_keypresses,
  COUNT(DISTINCT Resource) as unique_resources,
  COUNT(DISTINCT Case_ID) as unique_cases
FROM salesforce_data
WHERE Team IS NOT NULL
GROUP BY Team;

-- Create a view for resource statistics
CREATE OR REPLACE VIEW resource_stats AS
SELECT 
  Resource,
  COUNT(*) as total_records,
  AVG(duration_seconds) as avg_duration,
  SUM(mouse_click_count) as total_clicks,
  SUM(keypress_count) as total_keypresses,
  COUNT(DISTINCT Case_ID) as unique_cases
FROM salesforce_data
WHERE Resource IS NOT NULL
GROUP BY Resource;

-- Create a view for window statistics
CREATE OR REPLACE VIEW window_stats AS
SELECT 
  Window,
  COUNT(*) as total_records,
  AVG(duration_seconds) as avg_duration,
  SUM(mouse_click_count) as total_clicks,
  SUM(keypress_count) as total_keypresses
FROM salesforce_data
WHERE Window IS NOT NULL
GROUP BY Window;
