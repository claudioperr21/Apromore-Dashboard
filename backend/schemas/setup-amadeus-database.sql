-- Create the amadeus_data table for the Amadeus process mining dataset
CREATE TABLE IF NOT EXISTS amadeus_data (
  id BIGSERIAL PRIMARY KEY,
  identifier_name TEXT,
  "Case_ID" TEXT,
  original_case_identifier TEXT,
  case_identifier_source_window_id TEXT,
  project_id TEXT,
  team_name TEXT,
  agent_profile_id TEXT,
  upn TEXT,
  machine_name TEXT,
  visit_id TEXT,
  window_fragment_id TEXT,
  duration_seconds NUMERIC(10,3),
  process_name TEXT,
  title TEXT,
  url TEXT,
  "Window" TEXT,
  "Activity" TEXT,
  original_activity TEXT,
  activity_source_window_id TEXT,
  "Step" TEXT,
  "Window_Element" TEXT,
  mouse_click_count INTEGER,
  keypress_count INTEGER,
  copy_count INTEGER,
  paste_count INTEGER,
  "Screenshot" TEXT,
  "Start_Time" TIMESTAMP WITH TIME ZONE,
  "End_Time" TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_amadeus_data_case_id ON amadeus_data("Case_ID");
CREATE INDEX IF NOT EXISTS idx_amadeus_data_agent_profile_id ON amadeus_data(agent_profile_id);
CREATE INDEX IF NOT EXISTS idx_amadeus_data_window ON amadeus_data("Window");
CREATE INDEX IF NOT EXISTS idx_amadeus_data_activity ON amadeus_data("Activity");
CREATE INDEX IF NOT EXISTS idx_amadeus_data_process_name ON amadeus_data(process_name);
CREATE INDEX IF NOT EXISTS idx_amadeus_data_start_time ON amadeus_data("Start_Time");
CREATE INDEX IF NOT EXISTS idx_amadeus_data_end_time ON amadeus_data("End_Time");
CREATE INDEX IF NOT EXISTS idx_amadeus_data_duration ON amadeus_data(duration_seconds);
CREATE INDEX IF NOT EXISTS idx_amadeus_data_team_name ON amadeus_data(team_name);
CREATE INDEX IF NOT EXISTS idx_amadeus_data_upn ON amadeus_data(upn);

-- Enable Row Level Security (RLS)
ALTER TABLE amadeus_data ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON amadeus_data
  FOR ALL USING (true);

-- Create a policy that allows read access for anonymous users (for public dashboard)
CREATE POLICY "Allow read access for anonymous users" ON amadeus_data
  FOR SELECT USING (true);

-- Create a view for case-level statistics
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
GROUP BY "Case_ID";

-- Create a view for agent performance statistics
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
GROUP BY agent_profile_id, upn;

-- Create a view for window/application usage statistics
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
GROUP BY "Window";

-- Create a view for activity/step statistics
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
GROUP BY "Activity";

-- Create a view for process flow analysis
CREATE OR REPLACE VIEW amadeus_process_flow AS
SELECT 
  "Case_ID",
  "Activity",
  "Step",
  "Window",
  duration_seconds,
  mouse_click_count,
  keypress_count,
  "Start_Time",
  "End_Time",
  ROW_NUMBER() OVER (PARTITION BY "Case_ID" ORDER BY "Start_Time") as activity_sequence
FROM amadeus_data
WHERE "Case_ID" IS NOT NULL AND "Case_ID" != ''
ORDER BY "Case_ID", "Start_Time";

-- Create a view for time-based analysis
CREATE OR REPLACE VIEW amadeus_time_analysis AS
SELECT 
  DATE_TRUNC('hour', "Start_Time") as hour_bucket,
  COUNT(*) as total_activities,
  COUNT(DISTINCT "Case_ID") as unique_cases,
  COUNT(DISTINCT agent_profile_id) as unique_agents,
  SUM(duration_seconds) as total_work_time,
  AVG(duration_seconds) as avg_activity_duration
FROM amadeus_data
WHERE "Start_Time" IS NOT NULL
GROUP BY DATE_TRUNC('hour', "Start_Time")
ORDER BY hour_bucket;

-- Create a view for team performance (if team_name is populated)
CREATE OR REPLACE VIEW amadeus_team_stats AS
SELECT 
  COALESCE(team_name, 'Unassigned') as team_name,
  COUNT(*) as total_activities,
  COUNT(DISTINCT "Case_ID") as unique_cases,
  COUNT(DISTINCT agent_profile_id) as unique_agents,
  SUM(duration_seconds) as total_work_time,
  AVG(duration_seconds) as avg_activity_duration,
  SUM(mouse_click_count) as total_clicks,
  SUM(keypress_count) as total_keypresses
FROM amadeus_data
GROUP BY COALESCE(team_name, 'Unassigned');

-- Create a view for efficiency metrics
CREATE OR REPLACE VIEW amadeus_efficiency_metrics AS
SELECT 
  agent_profile_id,
  upn,
  "Case_ID",
  COUNT(*) as total_activities,
  SUM(duration_seconds) as total_time,
  SUM(mouse_click_count + keypress_count) as total_inputs,
  CASE 
    WHEN SUM(duration_seconds) > 0 THEN 
      SUM(mouse_click_count + keypress_count) / SUM(duration_seconds) * 60
    ELSE 0 
  END as inputs_per_minute,
  CASE 
    WHEN COUNT(*) > 0 THEN 
      SUM(duration_seconds) / COUNT(*)
    ELSE 0 
  END as avg_time_per_activity
FROM amadeus_data
WHERE "Case_ID" IS NOT NULL AND "Case_ID" != ''
GROUP BY agent_profile_id, upn, "Case_ID";

-- Create a view for application switching patterns
CREATE OR REPLACE VIEW amadeus_app_switching AS
SELECT 
  "Case_ID",
  agent_profile_id,
  "Window" as current_app,
  LAG("Window") OVER (PARTITION BY "Case_ID" ORDER BY "Start_Time") as previous_app,
  "Start_Time",
  duration_seconds
FROM amadeus_data
WHERE "Case_ID" IS NOT NULL AND "Case_ID" != ''
ORDER BY "Case_ID", "Start_Time";
