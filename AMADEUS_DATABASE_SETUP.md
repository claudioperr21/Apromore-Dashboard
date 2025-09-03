# 🚀 Amadeus Database Setup Guide

## Overview
This guide will help you set up the Amadeus process mining database tables and populate them with data for the dashboard.

## Prerequisites
- Access to Supabase project: `https://tjcstfigqpbswblykomp.supabase.co`
- Service role key (for database operations)
- Anon key (for data uploads)

## Step 1: Database Schema Setup

### Option A: Manual Setup (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `backend/schemas/setup-amadeus-database.sql`
4. Paste and execute the SQL script
5. Verify that all tables and views are created

### Option B: Automated Setup
```bash
cd backend/scripts
node setup-amadeus-database.js
```

## Step 2: Data Upload
```bash
cd backend/scripts
node upload-amadeus-to-supabase.js
```

## Step 3: Verification
Check that the following are created:
- ✅ `amadeus_data` table
- ✅ `amadeus_case_stats` view
- ✅ `amadeus_agent_stats` view
- ✅ `amadeus_window_stats` view
- ✅ `amadeus_activity_stats` view

## Database Structure

### Main Table: `amadeus_data`
- **Case_ID**: Unique case identifier
- **agent_profile_id**: Agent performing the activity
- **Window**: Application/process name
- **Activity**: Specific action performed
- **duration_seconds**: Time spent on activity
- **Start_Time/End_Time**: Activity timestamps
- **mouse_click_count/keypress_count**: User interaction metrics

### Views for Analytics
- **amadeus_case_stats**: Case-level performance metrics
- **amadeus_agent_stats**: Agent productivity analysis
- **amadeus_window_stats**: Application usage patterns
- **amadeus_activity_stats**: Activity frequency and duration

## Troubleshooting

### Common Issues:
1. **Permission Denied**: Ensure you're using the service role key
2. **Table Already Exists**: Drop existing tables first if needed
3. **Data Upload Fails**: Check CSV format and column names

### Manual SQL Commands:
```sql
-- Drop existing tables (if needed)
DROP TABLE IF EXISTS amadeus_data CASCADE;

-- Check table existence
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE 'amadeus%';

-- Check view existence
SELECT table_name FROM information_schema.views 
WHERE table_schema = 'public' AND table_name LIKE 'amadeus%';
```

## Next Steps
After setup:
1. Test the backend API endpoints
2. Verify frontend data display
3. Check dashboard performance metrics

## Support
If you encounter issues:
1. Check Supabase logs
2. Verify API endpoint responses
3. Test database connectivity
