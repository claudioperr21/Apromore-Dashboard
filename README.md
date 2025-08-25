# Apromore Dashboard - Salesforce Task Mining Analysis

## Overview
This repository contains an enhanced Salesforce task mining dashboard template designed for process analysis and team performance monitoring. The dashboard provides comprehensive insights into user activities, team performance, and process optimization opportunities.

## Features

### 🎯 **Teams Overview**
- **Team Performance Metrics**: Activity frequency, case duration, and resource utilization by team
- **Team Color Mapping**: Consistent visual identification for 8 main teams
- **Team-based Analysis**: Focus on team performance rather than individual users

### 📊 **Enhanced Analytics**
- **Global Filters**: Team and Resource filtering capabilities
- **Input Load Normalization**: Hour-normalized metrics for mouse clicks and key presses
- **Duration-based Analysis**: Time spent per application and status
- **Heatmap Visualizations**: Steps × Team and Resource × Window analysis

### 🏢 **Team Structure**
The dashboard supports analysis for the following teams:
- Sales - Enterprise
- Sales - SMB  
- Sales - Inside Sales
- Account Managers - Enterprise
- Account Managers - SMB
- Analytics Team
- Customer Support
- Operations & Admins

## Files

### Dashboard Templates
- `Task_Mining_Template_v11.json` - **Latest version** with Teams functionality
- `Task_Mining_Template_v9.json` - Base template
- `Task_Mining_Template_v8.json` - Previous version
- `Task_Mining_Template_v7.json` - Previous version

### Data Sources
- `SalesforceOffice_with_Teams.xlsx` - **Primary data source** with Team attributes
- `SalesforceOffice_synthetic_varied_100users_V1.csv` - Synthetic data for testing
- `SalesforceOffice_100users.csv` - Additional test data

### KPI Templates
- `Task_Mining_Template_KPI_metrics_v5.json` - KPI-focused template
- `Task_Mining_Template_KPI_v4.json` - KPI template version 4
- `Task_Mining_Template_KPI_v3.json` - KPI template version 3

## Canvas Structure

### 1. Teams Overview (NEW)
- **Tiles**: Team count, average activity instances, average case duration
- **Charts**: Team activity frequency, average case duration by team
- **Analysis**: Steps × Team heatmap

### 2. Task Level Analysis
- **Time Analysis**: Time spent per app and status
- **Input Metrics**: Mouse clicks and key presses per application
- **Heatmaps**: Resource × Window and Status × Window analysis

### 3. Resources
- **Resource Metrics**: Case frequency, activity instances, case duration
- **Team Integration**: Teams time spent per window, Min/Max case duration by team
- **Analysis**: Steps × Team and Steps × Resource heatmaps

### 4. Process Metrics
- **Overview Metrics**: Cases, case variants, activity instances
- **Performance Indicators**: Average case duration, throughput analysis

## Setup Instructions

### 1. Load Dashboard Template
```bash
# Use the latest template with Teams functionality
Task_Mining_Template_v11.json
```

### 2. Connect Data Source
- **Primary**: `SalesforceOffice_with_Teams.xlsx`
- **Series Name**: `SalesforcenOfficenCasenHandlingRISOR`
- **Log ID**: 20412

### 3. Configure Filters
- **Team Filter**: Global multi-select filter (default: All teams)
- **Resource Filter**: Secondary filter for individual user analysis

## Key Improvements in v11

### ✅ **Teams Integration**
- Added Team attribute support throughout all canvases
- Implemented team-based color mapping
- Created dedicated Teams Overview canvas

### ✅ **Enhanced Analytics**
- Hour-normalized input load metrics
- Duration-based window usage analysis
- Improved chart titles and units

### ✅ **Dashboard Compatibility**
- Maintained original series name for compatibility
- Preserved existing chart structures
- Added new functionality without breaking changes

## Usage

### For Team Managers
- Monitor team performance metrics
- Identify bottlenecks and optimization opportunities
- Track case duration trends by team

### For Process Analysts
- Analyze user interaction patterns
- Identify process inefficiencies
- Monitor input load and resource utilization

### For Operations
- Track case handling efficiency
- Monitor application usage patterns
- Identify training opportunities

## Technical Details

### Data Schema
- **Team**: Categorical attribute for team identification
- **Resource**: User identifier
- **Window**: Application/software being used
- **Activity**: Process step or status
- **Step**: Detailed process step
- **Duration**: Time-based metrics
- **Input Metrics**: Mouse clicks, key presses

### Chart Types
- **Column Charts**: Frequency and duration analysis
- **Heatmaps**: Multi-dimensional analysis
- **Pie Charts**: Distribution analysis
- **Tiles**: Key performance indicators

## Contributing
This dashboard template is designed for Salesforce task mining analysis. For improvements or customizations, please ensure compatibility with the existing data schema and dashboard structure.

## License
This project is part of the Apromore In-company project for ESADE Masters in Business Analytics.
