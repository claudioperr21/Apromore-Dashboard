# Supabase Integration Setup Guide

## 🚀 **Quick Setup**

Your Next.js frontend is now connected to Supabase! Here's how to complete the setup:

### 1. **Database Setup**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project: `tjcstfigqpbswblykomp`
3. Go to **SQL Editor**
4. Copy and paste the contents of `scripts/setup-database.sql`
5. Run the SQL script to create the database table and views

### 2. **Upload Your Data**

Run the data upload script:

```bash
node scripts/upload-to-supabase.js
```

This will:
- Read your `SalesforceOffice_with_Teams.csv` file
- Transform the data to match the database schema
- Upload all records to Supabase in batches
- Clear any existing data first

### 3. **Start the Development Server**

```bash
npm run dev
# or
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your dashboard with real Supabase data!

## 📊 **What's Now Available**

### ✅ **Real-time Data**
- Live data from your Supabase database
- Automatic filtering by Team and Resource
- Real-time updates when data changes

### ✅ **Enhanced Analytics**
- Team performance metrics
- Resource utilization analysis
- Window and activity statistics
- Input load analysis (clicks, keypresses)

### ✅ **Interactive Features**
- Dynamic team and resource filters
- Loading states and error handling
- Responsive design for all devices

## 🔧 **Database Schema**

The `salesforce_data` table includes:

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key |
| `Case_ID` | TEXT | Case identifier |
| `Resource` | TEXT | User/agent identifier |
| `Team` | TEXT | Team assignment |
| `Window` | TEXT | Application/software |
| `Activity` | TEXT | Process step/status |
| `duration_seconds` | INTEGER | Time duration |
| `mouse_click_count` | INTEGER | Mouse clicks |
| `keypress_count` | INTEGER | Keyboard presses |
| `Start_Time` | TEXT | Activity start time |
| `EndTime` | TEXT | Activity end time |

## 📈 **Database Views**

The setup creates three optimized views:

### `team_stats`
- Team performance metrics
- Average duration per team
- Total clicks and keypresses
- Unique resources and cases

### `resource_stats`
- Individual resource metrics
- Performance analysis per user
- Case handling statistics

### `window_stats`
- Application usage analysis
- Time spent per application
- Input metrics per window

## 🎯 **Features**

### **Teams Overview Canvas**
- Real team data from Supabase
- Dynamic team filtering
- Performance metrics by team

### **Task Level Analysis**
- Live window usage data
- Real-time activity analysis
- Duration-based insights

### **Resources Canvas**
- Individual resource performance
- Team-based resource analysis
- Case handling efficiency

## 🔒 **Security**

- Row Level Security (RLS) enabled
- Anonymous read access for public dashboard
- Authenticated user full access
- Environment variables for secure configuration

## 🚀 **Deployment Ready**

Your dashboard is now ready for deployment to:
- **Vercel** (recommended)
- **Netlify**
- **Railway**
- Any other hosting platform

## 📝 **Environment Variables**

Make sure these are set in your deployment environment:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tjcstfigqpbswblykomp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🛠 **Troubleshooting**

### **Data Not Loading**
1. Check Supabase connection in browser console
2. Verify environment variables are set
3. Ensure database table exists
4. Check RLS policies

### **Upload Script Issues**
1. Verify CSV file exists: `SalesforceOffice_with_Teams.csv`
2. Check Supabase credentials in `.env.local`
3. Ensure database table is created first

### **Performance Issues**
1. Database indexes are automatically created
2. Data is loaded in batches of 1000
3. Views are optimized for common queries

## 📞 **Support**

If you encounter any issues:
1. Check the browser console for errors
2. Verify Supabase dashboard for data
3. Test the connection with the provided scripts

Your dashboard is now fully connected to Supabase with real-time data! 🎉
