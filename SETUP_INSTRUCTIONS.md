# 🚀 **Amadeus Database Setup - Step by Step Guide**

## **Overview**
This guide will walk you through setting up the Amadeus process mining database tables and populating them with data for your dashboard.

## **Prerequisites**
- ✅ Supabase project access: `https://tjcstfigqpbswblykomp.supabase.co`
- ✅ Anon key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqY3N0ZmlncXBic3dibHlrb21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNTYxMTksImV4cCI6MjA3MTczMjExOX0.hm0D6dHaXBbZk4Hd7wcXMTP_UTZFjqvb_nMCihZjJIc`
- ✅ CSV data file: `amadeus-demo-full-no-fields.csv`

## **Step 1: Database Schema Setup**

### **Option A: Manual Setup (Recommended)**
1. **Go to Supabase Dashboard**
   - Visit: `https://tjcstfigqpbswblykomp.supabase.co`
   - Sign in with your credentials

2. **Navigate to SQL Editor**
   - Click on **SQL Editor** in the left sidebar
   - Click **New Query**

3. **Copy and Paste SQL Script**
   - Open the file: `AMADEUS_SETUP_COMPLETE.sql`
   - Copy the entire contents
   - Paste into the SQL Editor

4. **Execute the Script**
   - Click **Run** button
   - Wait for all statements to complete
   - You should see "Database setup completed successfully!"

### **Option B: Automated Setup**
```bash
cd backend/scripts
node setup-amadeus-database.js
```

## **Step 2: Data Upload**

### **Run the Upload Script**
```bash
node upload-amadeus-simple.js
```

This script will:
- ✅ Read the CSV file
- ✅ Transform data to match database schema
- ✅ Clear existing data
- ✅ Upload data in batches of 1000
- ✅ Verify the upload

## **Step 3: Verification**

### **Check Database Tables**
After setup, verify these exist:
- ✅ `amadeus_data` - Main data table
- ✅ `amadeus_case_stats` - Case analytics view
- ✅ `amadeus_agent_stats` - Agent performance view
- ✅ `amadeus_window_stats` - Application usage view
- ✅ `amadeus_activity_stats` - Activity metrics view

### **Test API Endpoints**
Once data is uploaded, test these endpoints:
- `GET /api/amadeus/case-stats`
- `GET /api/amadeus/agent-stats`
- `GET /api/amadeus/window-stats`
- `GET /api/amadeus/activity-stats`

## **Step 4: Frontend Integration**

### **Update Dashboard Components**
The frontend is already configured to:
- ✅ Display Amadeus data in the "Amadeus Process Mining" tab
- ✅ Show case statistics, agent performance, and application usage
- ✅ Handle data loading and error states gracefully

### **Test the Dashboard**
1. Visit your Vercel deployment
2. Navigate to "Amadeus Process Mining" tab
3. Verify data is displaying correctly

## **Troubleshooting**

### **Common Issues & Solutions**

#### **1. Database Schema Errors**
- **Error**: "relation does not exist"
- **Solution**: Run the SQL script in Supabase SQL Editor

#### **2. Data Upload Failures**
- **Error**: "permission denied"
- **Solution**: Ensure RLS policies are created correctly

#### **3. Frontend Not Loading Data**
- **Error**: 500 errors from API
- **Solution**: Check backend logs and verify database connectivity

### **Manual Verification Commands**
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE 'amadeus%';

-- Check views exist
SELECT table_name FROM information_schema.views 
WHERE table_schema = 'public' AND table_name LIKE 'amadeus%';

-- Check data count
SELECT COUNT(*) FROM amadeus_data;
```

## **Expected Results**

### **After Successful Setup**
- 🎯 **Dashboard loads instantly** (no more infinite loading)
- 📊 **Amadeus tab shows real data** instead of "No data available"
- 🔍 **All API endpoints return 200** instead of 500 errors
- 📈 **Charts and metrics populate** with actual process mining data

### **Data Metrics**
- **Cases**: Process instances being analyzed
- **Agents**: Users performing activities
- **Windows**: Applications and processes used
- **Activities**: Specific actions performed
- **Duration**: Time spent on each activity

## **Next Steps**

### **Immediate Actions**
1. **Set up database schema** using the SQL script
2. **Upload Amadeus data** using the upload script
3. **Test API endpoints** to verify connectivity
4. **Check dashboard** to confirm data display

### **Future Enhancements**
- Add more analytics views
- Implement real-time data updates
- Create custom dashboards
- Add data export functionality

## **Support**

### **If You Need Help**
1. **Check Supabase logs** for database errors
2. **Verify API responses** using browser dev tools
3. **Test database connectivity** using the verification endpoints
4. **Review the setup guide** for missed steps

---

## **Quick Start Commands**

```bash
# 1. Set up database schema (copy SQL to Supabase)
# 2. Upload data
node upload-amadeus-simple.js

# 3. Test backend
curl https://server-holy-haze-7308.fly.dev/api/amadeus/case-stats

# 4. Check dashboard
# Visit your Vercel deployment
```

**Your Amadeus dashboard will be fully functional after completing these steps! 🚀**
