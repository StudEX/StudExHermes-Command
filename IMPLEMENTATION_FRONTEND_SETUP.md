# 🚀 Frontend Implementation Setup

## Project Structure

```
africabiz-frontend/
├── mobile/                          # React Native (iOS/Android)
│   ├── App.tsx
│   ├── app.json
│   ├── package.json
│   ├── screens/
│   │   ├── DashboardScreen.tsx
│   │   ├── OpportunitiesScreen.tsx
│   │   ├── AgentChatScreen.tsx
│   │   ├── AnalyticsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── components/
│   │   ├── MetricCard.tsx
│   │   ├── OpportunityCard.tsx
│   │   ├── ChatMessage.tsx
│   │   └── NotificationBadge.tsx
│   ├── services/
│   │   ├── agentAPI.ts
│   │   ├── websocket.ts
│   │   └── pushNotifications.ts
│   ├── store/
│   │   ├── slices/
│   │   │   ├── opportunitiesSlice.ts
│   │   │   ├── agentSlice.ts
│   │   │   └── userSlice.ts
│   │   └── store.ts
│   └── styles/
│       └── theme.ts
│
├── web/                             # React (Desktop/Tablet)
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── index.tsx
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── PartnersPage.tsx
│   │   │   ├── ResourcesPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── components/
│   │   │   ├── Navigation/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── MobileMenu.tsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── MetricsGrid.tsx
│   │   │   │   ├── OpportunitiesChart.tsx
│   │   │   │   ├── OpportunitiesTable.tsx
│   │   │   │   └── PerformanceCard.tsx
│   │   │   ├── Cards/
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── OpportunityCard.tsx
│   │   │   │   └── PartnerCard.tsx
│   │   │   ├── Common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── Loading.tsx
│   │   │   └── Charts/
│   │   │       ├── LineChart.tsx
│   │   │       ├── BarChart.tsx
│   │   │       └── PieChart.tsx
│   │   ├── layouts/
│   │   │   ├── MainLayout.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── AuthLayout.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── agentService.ts
│   │   │   └── websocketService.ts
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── opportunitiesSlice.ts
│   │   │   │   ├── agentSlice.ts
│   │   │   │   ├── userSlice.ts
│   │   │   │   └── uiSlice.ts
│   │   │   └── store.ts
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   ├── variables.css
│   │   │   ├── typography.css
│   │   │   ├── responsive.css
│   │   │   └── theme.css
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── constants.ts
│   │   └── hooks/
│   │       ├── useAgent.ts
│   │       ├── useOpportunities.ts
│   │       ├── useNotifications.ts
│   │       └── useResponsive.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── api/                             # Backend API Gateway
│   ├── server.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── opportunities.ts
│   │   ├── agents.ts
│   │   ├── users.ts
│   │   └── analytics.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   ├── services/
│   │   ├── agentOrchestrator.ts
│   │   ├── opportunityEngine.ts
│   │   ├── notificationService.ts
│   │   └── obsidianSync.ts
│   ├── websocket/
│   │   ├── server.ts
│   │   ├── handlers.ts
│   │   └── events.ts
│   └── package.json
│
└── shared/                          # Shared Types & Utils
    ├── types/
    │   ├── opportunity.ts
    │   ├── agent.ts
    │   ├── user.ts
    │   ├── notification.ts
    │   └── api.ts
    └── utils/
        └── validators.ts
```

---

## Tech Stack

### Mobile (React Native)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-native": "^0.72.0",
    "react-navigation": "^6.1.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "@react-navigation/native-stack": "^6.9.0",
    "redux": "^4.2.0",
    "@reduxjs/toolkit": "^1.9.0",
    "react-redux": "^8.1.0",
    "axios": "^1.4.0",
    "socket.io-client": "^4.6.0",
    "@react-native-firebase/app": "^17.0.0",
    "@react-native-firebase/messaging": "^17.0.0",
    "react-native-paper": "^5.9.0",
    "react-native-svg": "^13.9.0",
    "react-native-reanimated": "^3.0.0",
    "watermelondb": "^0.25.0",
    "@types/react-native": "^0.72.0",
    "typescript": "^5.0.0"
  }
}
```

### Web (React + Vite)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.0",
    "redux": "^4.2.0",
    "@reduxjs/toolkit": "^1.9.0",
    "react-redux": "^8.1.0",
    "axios": "^1.4.0",
    "socket.io-client": "^4.6.0",
    "recharts": "^2.7.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^4.3.0",
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "typescript": "^5.0.0"
  }
}
```

### Backend (Node.js + Express)
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "socket.io": "^4.6.0",
    "jsonwebtoken": "^9.0.0",
    "axios": "^1.4.0",
    "dotenv": "^16.0.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "compression": "^1.7.4",
    "uuid": "^9.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

## Setup Instructions

### 1. Web Application Setup

```bash
# Create Vite React project
npm create vite@latest africabiz-web -- --template react-ts
cd africabiz-web

# Install dependencies
npm install

# Setup Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install additional dependencies
npm install react-router-dom redux @reduxjs/toolkit react-redux axios socket.io-client recharts
```

### 2. Mobile Application Setup

```bash
# Create React Native project with Expo
npx create-expo-app africabiz-mobile
cd africabiz-mobile

# Install dependencies
npx expo install react-navigation react-native-screens react-native-safe-area-context
npm install redux @reduxjs/toolkit react-redux axios socket.io-client
npm install @react-native-firebase/app @react-native-firebase/messaging

# For iOS
cd ios && pod install && cd ..

# Start development
npx expo start
```

### 3. Backend API Setup

```bash
# Create Node.js project
mkdir africabiz-api
cd africabiz-api

# Initialize and install
npm init -y
npm install express socket.io cors helmet compression dotenv jsonwebtoken axios
npm install -D typescript ts-node @types/node @types/express

# Setup TypeScript
npx tsc --init

# Create basic server
touch server.ts
```

---

## Core Components

### Mobile: MetricCard Component

```typescript
// mobile/components/MetricCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: 'up' | 'down';
  trendPercent?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  trend,
  trendPercent,
}) => {
  const theme = useTheme();
  const isDark = theme.dark;

  return (
    <View style={[
      styles.card,
      { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
    ]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[
        styles.label,
        { color: isDark ? '#9CA3AF' : '#6B7280' }
      ]}>
        {label}
      </Text>
      <Text style={[
        styles.value,
        { color: isDark ? '#F3F4F6' : '#111827' }
      ]}>
        {value}
      </Text>
      {trend && (
        <Text style={[
          styles.trend,
          { color: trend === 'up' ? '#10B981' : '#EF4444' }
        ]}>
          {trend === 'up' ? '↑' : '↓'} {trendPercent}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  trend: {
    fontSize: 14,
    fontWeight: '500',
  },
});
```

### Web: DashboardLayout Component

```typescript
// web/src/components/Dashboard/DashboardLayout.tsx
import React from 'react';
import { Navbar } from '../Navigation/Navbar';
import { Sidebar } from '../Navigation/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden lg:block w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navigation bar */}
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Mobile sidebar - Show when open */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50">
            <div className="absolute left-0 top-0 w-64 h-full bg-white dark:bg-gray-800">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="px-4 py-6 md:px-6 md:py-8 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
```

### Web: Responsive Navbar

```typescript
// web/src/components/Navigation/Navbar.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 py-4 md:px-6 md:py-5 max-w-full">
        <div className="flex justify-between items-center">
          {/* Logo + Hamburger */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              aria-label="Open menu"
            >
              <span className="text-2xl">☰</span>
            </button>
            
            <div
              onClick={() => navigate('/')}
              className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer"
            >
              AfricaBiz
            </div>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8 text-sm">
            <li><a href="/" className="hover:text-teal-600">Home</a></li>
            <li><a href="/partners" className="hover:text-teal-600">Partners</a></li>
            <li><a href="/dashboard" className="hover:text-teal-600">Dashboard</a></li>
            <li><a href="/resources" className="hover:text-teal-600">Resources</a></li>
          </ul>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <button className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg">
              🔔
            </button>
            
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg"
              >
                👤
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-50">
                  <a href="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    Profile
                  </a>
                  <a href="/settings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    Settings
                  </a>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
```

---

## API Integration

### Agent Service

```typescript
// web/src/services/agentService.ts
import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// REST API client
export const agentAPI = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
agentAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// WebSocket connection
export const socket = io(API_BASE, {
  auth: {
    token: localStorage.getItem('auth_token'),
  },
});

// API endpoints
export const agentService = {
  // Get daily briefing
  getBriefing: () => agentAPI.get('/api/v1/agent/briefing'),

  // Get opportunities
  getOpportunities: (params?: any) => 
    agentAPI.get('/api/v1/opportunities', { params }),

  // Record user action
  recordAction: (opportunityId: string, action: string) =>
    agentAPI.post(`/api/v1/opportunities/${opportunityId}/action`, { action }),

  // Get agent messages
  getMessages: (agentId: string) =>
    agentAPI.get(`/api/v1/agent/messages/${agentId}`),

  // Send message to agent
  sendMessage: (agentId: string, message: string) =>
    agentAPI.post(`/api/v1/agent/messages/${agentId}`, { message }),

  // Get metrics
  getMetrics: () => agentAPI.get('/api/v1/user/metrics'),
};

// WebSocket events
socket.on('opportunity:new', (data) => {
  console.log('New opportunity:', data);
  // Dispatch Redux action to update state
});

socket.on('message:new', (data) => {
  console.log('New message:', data);
});

socket.on('sync:trigger', () => {
  console.log('Daily sync triggered');
});
```

### Redux Store Setup

```typescript
// web/src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import opportunitiesReducer from './slices/opportunitiesSlice';
import agentReducer from './slices/agentSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    opportunities: opportunitiesReducer,
    agent: agentReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// web/src/store/slices/opportunitiesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { agentService } from '../../services/agentService';

export interface Opportunity {
  id: string;
  partner: string;
  region: string;
  description: string;
  value: number;
  status: 'new' | 'interested' | 'discussion' | 'closed';
  confidence: number;
  agent_id: string;
}

interface OpportunitiesState {
  items: Opportunity[];
  loading: boolean;
  error: string | null;
}

const initialState: OpportunitiesState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk
export const fetchOpportunities = createAsyncThunk(
  'opportunities/fetchAll',
  async (params?: any) => {
    const response = await agentService.getOpportunities(params);
    return response.data;
  }
);

const opportunitiesSlice = createSlice({
  name: 'opportunities',
  initialState,
  reducers: {
    markInterested: (state, action) => {
      const opp = state.items.find(o => o.id === action.payload);
      if (opp) opp.status = 'interested';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpportunities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOpportunities.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchOpportunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch opportunities';
      });
  },
});

export const { markInterested } = opportunitiesSlice.actions;
export default opportunitiesSlice.reducer;
```

---

## Build & Deployment

### Web Build

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Deploy to Vercel (if using)
npm install -g vercel
vercel
```

### Mobile Build

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android

# Local development
npx expo start
# Scan QR code with Expo Go app
```

### Backend Deployment

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Docker
docker build -t africabiz-api .
docker run -p 3000:3000 africabiz-api
```

---

## Environment Configuration

### .env.local (Web & Mobile)

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_WS_URL=ws://localhost:3000
REACT_APP_FIREBASE_API_KEY=xxx
REACT_APP_FIREBASE_PROJECT_ID=xxx
```

### .env (Backend)

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
FIREBASE_PROJECT_ID=xxx
FIREBASE_PRIVATE_KEY=xxx
OBSIDIAN_BRAIN_URL=http://localhost:8080
AGENT_PLATFORM_API_KEY=xxx
```

---

## Next Steps

1. **Week 1 (Aug 1-7):** Clone repos, setup development environment, create base components
2. **Week 2 (Aug 8-15):** Integrate with agent API, implement WebSocket sync, add push notifications
3. **Week 3 (Aug 16-22):** Performance optimization, testing, responsive design validation
4. **Week 4 (Aug 23-31):** QA, bug fixes, deploy to production

---

## Testing Strategy

### Unit Tests

```bash
# Web
npm run test

# Mobile
npm test
```

### E2E Tests

```bash
# Setup Cypress
npm install -D cypress
npx cypress open
```

### Performance Testing

```bash
# Lighthouse
npm install -g lighthouse
lighthouse http://localhost:3000
```

---

## Key Implementation Notes

1. **Offline-First:** LocalStorage caching for opportunities
2. **Real-time Updates:** WebSocket for agent notifications
3. **State Management:** Redux for predictable state
4. **Responsive:** Mobile-first CSS approach with Tailwind
5. **Authentication:** JWT tokens with refresh mechanism
6. **Error Handling:** Centralized error boundaries and handlers
7. **Analytics:** Track user interactions and conversion funnels
8. **Accessibility:** WCAG AA compliance across all screens
