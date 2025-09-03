# Amadeus Dataset Integration Setup Guide

## 🚀 **Quick Setup for Amadeus Process Mining Data**

This guide will help you set up the Amadeus dataset in your Supabase database and integrate it with your dashboard.

### 1. **Database Schema Setup**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project: `tjcstfigqpbswblykomp`
3. Go to **SQL Editor**
4. Copy and paste the contents of `scripts/setup-amadeus-database.sql`
5. Run the SQL script to create the database table and views

### 2. **Upload Amadeus Data**

Run the data upload script to populate your database:

```bash
node scripts/upload-amadeus-to-supabase.js
```

This will:
- Read your `amadeus-demo-full-no-fields.csv` file
- Transform the data to match the Amadeus database schema
- Upload all records to Supabase in batches
- Clear any existing Amadeus data first

### 3. **What's Available in the Amadeus Schema**

#### ✅ **Main Table: `amadeus_data`**
- **Case Management**: Case_ID, original_case_identifier, project_id
- **User Tracking**: agent_profile_id, upn, machine_name
- **Process Flow**: Window, Activity, Step, process_name
- **Time Tracking**: Start_Time, End_Time, duration_seconds
- **Interaction Metrics**: mouse_click_count, keypress_count, copy_count, paste_count
- **Context**: title, url, Window_Element, Screenshot

#### ✅ **Analytics Views**

##### **Case-Level Analysis**
- `amadeus_case_stats`: Total activities, duration, unique windows/activities per case
- `amadeus_process_flow`: Sequential activity flow with timing for each case

##### **Agent Performance**
- `amadeus_agent_stats`: Work time, case count, activity metrics per agent
- `amadeus_efficiency_metrics`: Input efficiency, time per activity analysis

##### **Application Usage**
- `amadeus_window_stats`: Time spent, usage patterns per application
- `amadeus_app_switching`: Application switching patterns between cases

##### **Process Analysis**
- `amadeus_activity_stats`: Activity frequency, duration, and interaction patterns
- `amadeus_time_analysis`: Hourly activity patterns and workload distribution

##### **Team Performance**
- `amadeus_team_stats`: Team-based metrics and performance analysis

## 📊 **Key Features of the Amadeus Dataset**

### **Process Mining Capabilities**
- **Case Lifecycle Tracking**: From New → In Progress → Escalated → Closed
- **Multi-Application Workflows**: Salesforce, Excel, Amadeus, Word integration
- **Activity Sequencing**: Detailed step-by-step process flow analysis
- **Time Analysis**: Precise timing for each activity and case

### **User Experience Analytics**
- **Input Efficiency**: Clicks, keypresses, copy/paste operations
- **Application Switching**: How users move between different software
- **Work Patterns**: Time distribution across different activities
- **Performance Metrics**: Duration analysis and efficiency indicators

### **Business Process Insights**
- **Case Resolution Time**: End-to-end case processing duration
- **Bottleneck Identification**: Long-duration activities and steps
- **Resource Utilization**: Agent workload and case distribution
- **Process Variability**: Different paths and patterns for similar cases

## 🔧 **Database Schema Details**

### **Data Types & Constraints**
- **Timestamps**: ISO format with timezone support
- **Numeric Fields**: Duration in seconds (3 decimal precision)
- **Text Fields**: Proper indexing for fast queries
- **UUIDs**: For tracking window fragments and activities

### **Performance Optimizations**
- **Strategic Indexing**: On frequently queried fields
- **Partitioning Ready**: Can be partitioned by date if needed
- **View Optimization**: Pre-computed aggregations for common queries

## 🎯 **Dashboard Integration**

### **Available Metrics for Charts**
1. **Case Duration Distribution**
2. **Activity Frequency Analysis**
3. **Agent Performance Comparison**
4. **Application Usage Heatmaps**
5. **Process Flow Visualization**
6. **Time-based Workload Analysis**

### **Filtering Capabilities**
- **By Case ID**: Specific case analysis
- **By Agent**: Individual performance review
- **By Application**: Software usage patterns
- **By Time Range**: Period-specific analysis
- **By Activity Type**: Process step analysis

## 🚀 **Next Steps for Dashboard**

### **1. Update Supabase Client**
Modify your `lib/supabase.ts` to include Amadeus data functions:

```typescript
// Add Amadeus data functions
export const getAmadeusData = async () => {
  const { data, error } = await supabase
    .from('amadeus_data')
    .select('*')
  
  if (error) {
    console.error('Error fetching Amadeus data:', error)
    return []
  }
  
  return data
}

export const getAmadeusCaseStats = async () => {
  const { data, error } = await supabase
    .from('amadeus_case_stats')
    .select('*')
  
  if (error) {
    console.error('Error fetching Amadeus case stats:', error)
    return []
  }
  
  return data
}
```

### **2. Create New Dashboard Components**
- **Amadeus Process Flow Canvas**
- **Case Duration Analysis Charts**
- **Agent Performance Metrics**
- **Application Usage Heatmaps**

### **3. Update Data Hooks**
Extend your `useSupabaseData` hook to include Amadeus data:

```typescript
const [amadeusData, setAmadeusData] = useState<AmadeusData[]>([])
const [amadeusCaseStats, setAmadeusCaseStats] = useState<AmadeusCaseStats[]>([])

// Load Amadeus data
useEffect(() => {
  const loadAmadeusData = async () => {
    const data = await getAmadeusData()
    const caseStats = await getAmadeusCaseStats()
    setAmadeusData(data)
    setAmadeusCaseStats(caseStats)
  }
  loadAmadeusData()
}, [])
```

## 📈 **Sample Queries for Analysis**

### **Case Duration Analysis**
```sql
SELECT 
  "Case_ID",
  total_duration,
  total_activities,
  avg_activity_duration
FROM amadeus_case_stats
ORDER BY total_duration DESC
LIMIT 10;
```

### **Agent Performance Ranking**
```sql
SELECT 
  upn,
  total_cases,
  total_work_time,
  avg_activity_duration
FROM amadeus_agent_stats
ORDER BY total_cases DESC;
```

### **Application Usage Patterns**
```sql
SELECT 
  "Window",
  total_usage_time,
  unique_cases,
  avg_session_duration
FROM amadeus_window_stats
ORDER BY total_usage_time DESC;
```

## 🛠 **Troubleshooting**

### **Data Upload Issues**
1. Verify CSV file exists: `amadeus-demo-full-no-fields.csv`
2. Check Supabase connection in the upload script
3. Ensure database table is created first

### **Performance Issues**
1. Database indexes are automatically created
2. Data is loaded in batches of 1000
3. Views are optimized for common queries

### **Data Quality**
1. Check for missing timestamps
2. Verify numeric field conversions
3. Ensure proper case ID formatting

## 🎉 **Ready to Go!**

Your Amadeus dataset is now ready for:
- **Process Mining Analysis**
- **Performance Dashboards**
- **Workflow Optimization**
- **User Experience Insights**
- **Business Process Intelligence**

The schema provides comprehensive coverage of the Amadeus workflow data with optimized views for fast analytics and dashboard integration!
