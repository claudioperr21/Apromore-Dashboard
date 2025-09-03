# 🎯 Task Mining Dashboard Frontend

A modern, AI-powered frontend for the Task Mining Dashboard built with Next.js 15, React 19, and TypeScript.

## 🚀 **Features**

- **📊 Real-time Dashboard** - Live data visualization and analytics
- **🤖 AI Assistant** - GPT-4 powered insights and recommendations
- **📱 Responsive Design** - Mobile-first approach with Tailwind CSS
- **🔒 Secure API** - Backend integration with Fly.io
- **⚡ Performance** - Optimized with Next.js 15 features

## 🛠️ **Tech Stack**

- **Framework:** Next.js 15.2.4
- **React:** 19.0.0
- **Language:** TypeScript 5.3.0
- **Styling:** Tailwind CSS 4.1.9
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Charts:** Recharts
- **Icons:** Lucide React
- **State Management:** React Hooks
- **API Integration:** Backend server (Fly.io)

## 📁 **Project Structure**

```
frontend/
├── app/                    # Next.js 15 app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   ├── charts/            # Chart components
│   ├── canvases/          # Dashboard canvases
│   ├── dashboard-header.tsx
│   ├── dashboard-filters.tsx
│   └── dashboard-canvases.tsx
├── hooks/                  # Custom React hooks
│   └── use-supabase-data.ts
├── lib/                    # Utility functions
│   ├── supabase.ts        # API configuration
│   └── utils.ts           # Helper functions
├── types/                  # TypeScript type definitions
│   └── dashboard.ts       # Dashboard data types
├── styles/                 # Additional styles
├── package.json            # Dependencies
├── next.config.mjs        # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or pnpm

### **Installation**

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_BACKEND_URL=https://dashboard-backend-2024.fly.dev
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 **Development**

### **Available Scripts**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### **Code Organization**

- **Components:** Reusable UI components in `components/ui/`
- **Pages:** Main dashboard views in `components/canvases/`
- **Hooks:** Custom React hooks in `hooks/`
- **Types:** TypeScript interfaces in `types/`
- **Utils:** Helper functions in `lib/`

### **Adding New Components**

1. Create component file in appropriate folder
2. Export component as default
3. Import and use in parent components
4. Add to TypeScript types if needed

## 🌐 **API Integration**

### **Backend Endpoints**

The frontend connects to the backend server at:
- **Base URL:** `https://dashboard-backend-2024.fly.dev`
- **Health Check:** `/health`
- **API Status:** `/api/health`

### **Data Sources**

- **Salesforce Data:** Team performance, resource utilization
- **Amadeus Data:** Process mining, case analysis
- **AI Insights:** GPT-4 powered recommendations

### **API Calls**

All API calls go through the backend server for:
- Better security (no exposed service keys)
- Centralized data processing
- Rate limiting and caching
- AI integration

## 🎨 **Styling & Design**

### **Tailwind CSS**

- **Utility-first** approach
- **Responsive design** with mobile-first breakpoints
- **Custom color scheme** with CSS variables
- **Component variants** using class-variance-authority

### **Design System**

- **Consistent spacing** using Tailwind's scale
- **Typography** with Geist font family
- **Color palette** with semantic naming
- **Component library** based on shadcn/ui

## 📱 **Responsive Design**

- **Mobile-first** approach
- **Breakpoints:** sm, md, lg, xl, 2xl
- **Flexible layouts** that adapt to screen size
- **Touch-friendly** interactions for mobile devices

## 🔒 **Security**

- **Environment variables** for sensitive data
- **API key protection** through backend
- **CORS configuration** for secure communication
- **HTTPS enforcement** in production

## 🚀 **Deployment**

### **Vercel (Recommended)**

1. **Connect repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on git push

### **Environment Variables**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BACKEND_URL=https://dashboard-backend-2024.fly.dev
```

## 📊 **Performance**

- **Next.js 15** optimizations
- **Image optimization** with next/image
- **Code splitting** and lazy loading
- **Bundle analysis** and optimization
- **Caching strategies** for static assets

## 🧪 **Testing**

- **Component testing** with React Testing Library
- **E2E testing** with Playwright (planned)
- **Type safety** with TypeScript
- **Linting** with ESLint

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

- **Documentation:** Check this README and inline code comments
- **Issues:** Create GitHub issues for bugs or feature requests
- **Discussions:** Use GitHub Discussions for questions

---

**🎉 Happy coding!** Your AI-powered Task Mining Dashboard is ready to provide intelligent insights into your business processes.
