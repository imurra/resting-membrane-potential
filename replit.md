# Membrane Potential Simulator

## Overview

This is a React-based web application that simulates cellular membrane potential dynamics, specifically demonstrating the effects of Na+/K+ pumps and K+ leak channels in neuronal electrophysiology. The application is built using a full-stack architecture with Express.js backend and React frontend, featuring interactive visualizations and real-time simulation controls.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: React hooks with useRef for performance-critical data
- **UI Library**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds
- **Query Management**: TanStack Query for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based sessions with connect-pg-simple
- **Development**: Hot reload with tsx

### Build and Deployment
- **Development**: Vite dev server with Express backend
- **Production**: Static build with esbuild for server bundling
- **Environment**: Configured for Replit deployment

## Key Components

### Core Simulation Engine
- **Location**: `client/src/pages/home.tsx`
- **Purpose**: Main membrane potential simulator with real-time calculations
- **Features**:
  - Interactive controls for pump and leak channel states
  - Real-time visualization of ion concentrations
  - Membrane potential calculations using Goldman-Hodgkin-Katz equation
  - Canvas-based graphing for potential history

### UI Components
- **Location**: `client/src/components/ui/`
- **Framework**: Radix UI primitives with custom styling
- **Key Components**: Button, Slider, Card, Toast notifications
- **Styling**: Tailwind CSS with design system variables

### Database Schema
- **Location**: `shared/schema.ts`
- **ORM**: Drizzle with PostgreSQL
- **Tables**: Users table with authentication fields
- **Validation**: Zod schemas for type safety

### API Layer
- **Location**: `server/routes.ts`
- **Pattern**: RESTful API with Express routing
- **Middleware**: JSON parsing, request logging, error handling
- **Storage**: Abstract storage interface with in-memory implementation

## Data Flow

### Simulation Data Flow
1. **User Interaction**: Controls modify simulation parameters (pump state, leak channels)
2. **Real-time Calculation**: React hooks calculate ion concentrations and membrane potential
3. **Visualization**: Canvas API renders real-time graphs of potential changes
4. **State Management**: useRef maintains performance-critical simulation history

### Application Data Flow
1. **Client Requests**: Frontend makes API calls using fetch with credential handling
2. **Server Processing**: Express middleware processes requests and routes to handlers
3. **Database Operations**: Drizzle ORM handles PostgreSQL interactions
4. **Response Handling**: TanStack Query manages server state and caching

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **UI Components**: Radix UI ecosystem for accessible primitives
- **Styling**: Tailwind CSS for utility-first styling
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns for date manipulation

### Development Dependencies
- **Build Tools**: Vite, esbuild, TypeScript
- **Database Tools**: Drizzle Kit for migrations
- **Development**: tsx for TypeScript execution
- **Replit Integration**: Cartographer and runtime error overlay

### Educational Content
- **License**: Creative Commons Attribution-NonCommercial-ShareAlike 4.0
- **Copyright**: Ian Victor Joseph Murray (imurray@yahoo.com)
- **Purpose**: Educational tool for understanding cellular electrophysiology

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reload**: Automatic refresh for both frontend and backend changes
- **Database**: Neon Database connection via DATABASE_URL environment variable

### Production Deployment
- **Build Process**: 
  1. Vite builds frontend to `dist/public`
  2. esbuild bundles server code to `dist/index.js`
- **Serving**: Express serves static files and API routes
- **Database**: PostgreSQL with Drizzle migrations
- **Environment**: Replit-optimized with banner integration

### Configuration Management
- **Environment Variables**: DATABASE_URL for database connection
- **TypeScript**: Strict type checking with path aliases
- **Linting**: ESLint and Prettier for code quality
- **Database Migrations**: Drizzle Kit for schema management

The application is designed as an educational tool with a focus on interactive learning, real-time simulation, and accessibility through modern web technologies.