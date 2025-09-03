# Dashboard Backend Server

A Node.js/Express API server for the Task Mining Dashboard, designed to run on Fly.io.

## Features

- **RESTful API** for dashboard data
- **Supabase Integration** with secure service key access
- **CORS Support** for frontend communication
- **Health Checks** for monitoring
- **Error Handling** with structured responses
- **Security** with Helmet middleware

## API Endpoints

### Health & Status
- `GET /health` - Server health check
- `GET /api/health` - API status

### Salesforce Data
- `GET /api/salesforce/teams` - Get unique teams
- `GET /api/salesforce/resources` - Get unique resources
- `GET /api/salesforce/team-stats` - Get team statistics
- `GET /api/salesforce/resource-stats` - Get resource statistics
- `GET /api/salesforce/window-stats` - Get window usage statistics

### Amadeus Data
- `GET /api/amadeus/case-stats` - Get case statistics
- `GET /api/amadeus/agent-stats` - Get agent performance
- `GET /api/amadeus/window-stats` - Get application usage
- `GET /api/amadeus/activity-stats` - Get activity metrics

### Dashboard
- `GET /api/dashboard/metrics` - Get combined dashboard metrics

## Environment Variables

Copy `env.example` to `.env` and configure:

```bash
# Server Configuration
PORT=8080
NODE_ENV=production

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment to Fly.io

```bash
# Login to Fly.io
flyctl auth login

# Create new app
flyctl apps create dashboard-backend

# Set secrets
flyctl secrets set SUPABASE_URL="https://your-project.supabase.co"
flyctl secrets set SUPABASE_SERVICE_KEY="your-service-role-key"
flyctl secrets set FRONTEND_URL="https://your-frontend-domain.com"

# Deploy
flyctl deploy

# Check status
flyctl status
```

## Docker

The server includes a Dockerfile for containerized deployment:

```bash
# Build image
docker build -t dashboard-backend .

# Run container
docker run -p 8080:8080 dashboard-backend
```

## Security

- **Helmet** for security headers
- **CORS** configuration for frontend access
- **Environment variables** for sensitive data
- **Service role key** for Supabase (not exposed to frontend)

## Monitoring

- Health check endpoint at `/health`
- Structured error logging
- Uptime tracking
- Fly.io built-in monitoring

## Scaling

The Fly.io configuration includes:
- Auto-scaling based on demand
- Shared CPU resources
- 512MB memory allocation
- Health check-based restart
